# Proton VPN Toggle

A GNOME Shell Quick Settings toggle for Proton VPN. Shows the connected server name in the system panel and Quick Settings menu.

> This extension is not affiliated, funded, or in any way associated with Proton AG.

## Features

- Quick Settings toggle to open/close the Proton VPN app
- Shows connection status and connected server name
- System tray indicator when connected
- Optional background status polling with configurable frequency

## Requirements

- GNOME Shell 45–49
- Proton VPN desktop app installed (native or Flatpak)
- `protonvpn-cli` in PATH

## Installation

### From GNOME Extensions

Visit the [GNOME Extensions page](https://extensions.gnome.org) and search for **Proton VPN Toggle**.

### Manual

```bash
git clone https://github.com/tecix/proton-vpn-toggle.git
cp -r proton-vpn-toggle ~/.local/share/gnome-shell/extensions/proton-vpn-toggle@citx
gnome-extensions enable proton-vpn-toggle@citx
```

Then restart GNOME Shell: press `Alt+F2`, type `r`, press `Enter` (X11), or log out and back in (Wayland).

## Preferences

Open the extension preferences via GNOME Extensions app or Settings → Extensions:

| Option | Description |
|--------|-------------|
| Background status checks | Periodically poll `protonvpn-cli status` to update the indicator |
| Status check frequency | How often to poll (1–3600 seconds, default 10s) |

## How It Works

The toggle reads VPN state from GNOME's built-in Quick Settings network panel. When the connected VPN name contains "ProtonVPN", the toggle reflects the active connection and shows the server name as a subtitle. Clicking the toggle opens or closes the Proton VPN application window.

## License

GPL-2.0
