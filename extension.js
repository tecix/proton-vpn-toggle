import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { ProtonVPNIndicator } from "./indicator.js";

export default class ProtonVPNToggleExtension extends Extension {
  enable() {
    this._indicator = new ProtonVPNIndicator(this);
    this._indicator.quickSettingsItems.push(this._indicator._toggle);
    Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
  }

  disable() {
    this._indicator.quickSettingsItems.forEach((item) => item.destroy());
    this._indicator.destroy();
    this._indicator = null;
  }
}
