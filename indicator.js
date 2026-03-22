import Gio from "gi://Gio";
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
      this._settings = extensionObject.getSettings();
      this._indicator.visible = false;
      this._indicator.gicon = Gio.icon_new_for_string(
        extensionObject.path + "/icons/protonvpn-symbolic.svg"
      );

      this._toggle = new ProtonVPNToggle(extensionObject);
      this._toggle.connect("clicked", () => this._toggleApp());
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

    setStatus(isConnected, subtitle) {
      this._indicator.visible = isConnected;
      this._toggle.set({ checked: isConnected, subtitle });
    }

    checkStatusAndUpdate() {
      const vpnToggle =
        Main.panel.statusArea.quickSettings?._network?._vpnToggle;
      const isConnected = vpnToggle?.checked ?? false;
      const subtitle = vpnToggle?.subtitle ?? "";
      const isProton = subtitle.includes("ProtonVPN");

      if (isConnected && isProton)
        this.setStatus(true, subtitle.replace("ProtonVPN ", ""));
      else
        this.setStatus(false, "Disconnected");
    }

    destroy() {
      this._settings = null;
      this._indicator.destroy();
      super.destroy();
    }
  }
);
