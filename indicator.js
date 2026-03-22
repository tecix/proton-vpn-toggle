import Gio from "gi://Gio";
import GLib from "gi://GLib";
import GObject from "gi://GObject";
import Shell from "gi://Shell";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as QuickSettings from "resource:///org/gnome/shell/ui/quickSettings.js";

const APP_NAME = "proton.vpn.app.gtk.desktop";
const FLATPAK_APP_NAME = "com.protonvpn.www.desktop";

const ProtonVPNToggle = GObject.registerClass(
  class ProtonVPNToggle extends QuickSettings.QuickToggle {
    _init(extensionObject) {
      super._init({
        title: "Proton VPN",
        gicon: Gio.icon_new_for_string(
          extensionObject.path + "/icons/protonvpn-symbolic.svg"
        ),
      });
    }
  }
);

export var ProtonVPNIndicator = GObject.registerClass(
  class ProtonVPNIndicator extends QuickSettings.SystemIndicator {
    _init(extensionObject) {
      super._init();

      this._indicator = this._addIndicator();
      this._indicator.visible = false;
      this._indicator.gicon = Gio.icon_new_for_string(
        extensionObject.path + "/icons/protonvpn-symbolic.svg"
      );

      this._toggle = new ProtonVPNToggle(extensionObject);
      this._toggle.connect("clicked", () => this._toggleApp());

      this._timeout = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
        this._vpnToggle =
          Main.panel.statusArea.quickSettings?._network?._vpnToggle;

        this._updateState();
        this._vpnToggle?._client?.connectObject(
          "notify::active-connections",
          () => this._updateState(),
          this
        );

        this._timeout = null;
        return GLib.SOURCE_REMOVE;
      });
    }

    _getApp() {
      return (
        Shell.AppSystem.get_default().lookup_app(APP_NAME) ??
        Shell.AppSystem.get_default().lookup_app(FLATPAK_APP_NAME)
      );
    }

    _toggleApp() {
      const app = this._getApp();
      if (app?.get_n_windows() > 0)
        app.request_quit();
      else
        app?.activate();
    }

    _updateState() {
      const isConnected = this._vpnToggle?.checked ?? false;
      const subtitle = this._vpnToggle?.subtitle ?? "";
      const isProton = subtitle.includes("ProtonVPN");

      if (isConnected && isProton) {
        this._indicator.visible = true;
        this._toggle.set({ checked: true, subtitle: subtitle.replace("ProtonVPN ", "") });
      } else {
        this._indicator.visible = false;
        this._toggle.set({ checked: false, subtitle: "Disconnected" });
      }
    }

    destroy() {
      if (this._timeout) {
        GLib.Source.remove(this._timeout);
        this._timeout = null;
      }

      this._vpnToggle?._client?.disconnectObject(this);

      super.destroy();
    }
  }
);
