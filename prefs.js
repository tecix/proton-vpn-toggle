import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class ProtonVPNTogglePreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings();
    const page = new Adw.PreferencesPage();
    window.add(page);

    const group = new Adw.PreferencesGroup();
    page.add(group);

    const statusCheckRow = new Adw.ActionRow({
      title: "Background status checks",
      subtitle: "Update indicator by running protonvpn-cli status periodically",
    });

    const statusCheckSwitch = new Gtk.Switch({
      active: window._settings.get_boolean("status-check"),
      valign: Gtk.Align.CENTER,
    });

    window._settings.bind(
      "status-check",
      statusCheckSwitch,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );

    statusCheckRow.add_suffix(statusCheckSwitch);
    statusCheckRow.activatable_widget = statusCheckSwitch;
    group.add(statusCheckRow);

    const statusCheckFreqRow = new Adw.ActionRow({
      title: "Status check frequency (seconds)",
      subtitle: "Too frequent checks may impact performance",
    });

    const statusCheckFreqField = new Gtk.SpinButton({
      adjustment: new Gtk.Adjustment({
        value: 10,
        lower: 1,
        upper: 3600,
        step_increment: 5,
      }),
    });

    window._settings.bind(
      "status-check-freq",
      statusCheckFreqField,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    );

    statusCheckFreqRow.add_suffix(statusCheckFreqField);
    statusCheckFreqRow.activatable_widget = statusCheckFreqField;
    group.add(statusCheckFreqRow);
  }
}
