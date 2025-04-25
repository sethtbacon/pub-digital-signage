# Raspberry Pi Setup Guide

This guide provides detailed instructions for setting up the Pub Digital Signage application on a Raspberry Pi 4.

## Hardware Preparation

### Required Hardware
- Raspberry Pi 4 (4GB RAM recommended)
- MicroSD card (32GB+ recommended)
- HDMI display/monitor
- HDMI cable
- Power supply for Raspberry Pi
- Keyboard and mouse (for initial setup)
- Internet connection (Wi-Fi or Ethernet)

### Optional Hardware
- Case for the Raspberry Pi
- Heat sinks or cooling fan
- Dedicated power switch
- IR remote (with LIRC support)

## Software Setup

### 1. Prepare the MicroSD Card

1. **Download Raspberry Pi Imager**:
   - Get it from [raspberrypi.org/software](https://www.raspberrypi.org/software/)
   - Install on your computer

2. **Flash the OS**:
   - Insert the MicroSD card into your computer
   - Open Raspberry Pi Imager
   - Click "CHOOSE OS" and select "Raspberry Pi OS (32-bit)" or "Raspberry Pi OS Lite (64-bit)"
   - Click "CHOOSE STORAGE" and select your MicroSD card
   - Click the settings icon (gear) before writing and configure:
     - Set hostname (e.g., `pub-signage`)
     - Enable SSH
     - Set username and password
     - Configure your WiFi (if not using Ethernet)
     - Set locale settings
   - Click "WRITE" and confirm

3. **Boot Raspberry Pi**:
   - Insert the MicroSD card into your Raspberry Pi
   - Connect display, keyboard, mouse, and power
   - Wait for first-time boot and setup process
   - Complete any first-boot configuration

### 2. Update System

After booting and logging in, update your Raspberry Pi:

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt install -y git curl wget unzip
```

### 3. Install Required Software

```bash
# Install Node.js (using nvm for better version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verify Node.js installation
node -v
npm -v

# Install SQLite
sudo apt install -y sqlite3

# Install other dependencies
sudo apt install -y build-essential libsqlite3-dev
```

### 4. Application Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pub-digital-signage.git
cd pub-digital-signage

# Quick setup (installs dependencies and initializes database)
npm run setup

# Create local configuration
cp config/default.json config/local.json
nano config/local.json  # Edit settings as needed

# Build the application
npm run build
```

### 5. Configure Autostart in Kiosk Mode

Create a systemd service to automatically start the application on boot:

```bash
sudo nano /etc/systemd/system/pub-signage.service
```

Add the following content:

```ini
[Unit]
Description=Pub Digital Signage
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/pub-digital-signage
ExecStart=/home/pi/.nvm/versions/node/v18.x.x/bin/node /home/pi/pub-digital-signage/src/backend/server.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable pub-signage
sudo systemctl start pub-signage
```

### 6. Configure Chromium Kiosk Mode

Create an autostart entry for Chromium in kiosk mode:

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/kiosk.desktop
```

Add the following content:

```ini
[Desktop Entry]
Type=Application
Name=Kiosk Mode
Exec=/usr/bin/chromium-browser --kiosk --app=http://localhost:3000 --start-fullscreen --disable-restore-session-state --noerrdialogs --disable-session-crashed-bubble
```

### 7. Configure Auto-login

Enable auto-login to the desktop environment:

```bash
sudo raspi-config
```

Navigate to:
1. System Options
2. Boot / Auto Login
3. Select "Desktop Autologin"

### 8. Power Management (Optional)

To prevent screen from going to sleep:

```bash
sudo nano /etc/lightdm/lightdm.conf
```

Find the `[SeatDefaults]` section and add or modify:

```
xserver-command=X -s 0 -dpms
```

### 9. Remote Management (Optional)

To enable easy remote management:

```bash
# Install VNC server
sudo apt install -y realvnc-vnc-server realvnc-vnc-viewer

# Enable VNC
sudo raspi-config
```

Navigate to:
1. Interface Options
2. VNC
3. Enable VNC

## Starting the Application

After completing the setup, restart your Raspberry Pi:

```bash
sudo reboot
```

The system should:
1. Boot directly to the desktop
2. Automatically launch Chromium in kiosk mode
3. Load the Pub Digital Signage application

## Updating the Application

To update the application when new versions are released:

```bash
cd pub-digital-signage
git pull
npm run setup  # Reinstalls dependencies and rebuilds
sudo systemctl restart pub-signage
```

## Troubleshooting

### Application Not Starting

Check the service status:
```bash
sudo systemctl status pub-signage
```

View application logs:
```bash
journalctl -u pub-signage
```

### Display Issues

If the screen is turning off or showing screensaver:

```bash
# Disable screensaver
sudo apt-get install xscreensaver
```

Then open the screensaver application from the desktop menu and set it to "Disable Screen Saver".

### Network Connection Issues

Test network connectivity:
```bash
ping -c 4 google.com
```

Reconfigure WiFi if needed:
```bash
sudo raspi-config
```

Navigate to System Options > Wireless LAN to reconfigure.

## Performance Optimization

For optimal performance on the Raspberry Pi:

1. **Overclock (for advanced users)**
   ```bash
   sudo raspi-config
   ```
   Navigate to Performance > Overclock

2. **Reduce Visual Effects**
   - Use a lightweight desktop theme
   - Disable animations in the application

3. **Memory Allocation**
   ```bash
   sudo raspi-config
   ```
   Navigate to Performance > GPU Memory and allocate at least 128MB to the GPU

## Additional Options

### Adding Touch Support

If using a touch display:

```bash
# Install touch drivers if needed (depends on your display)
sudo apt install -y xinput-calibrator

# Calibrate touch screen
xinput_calibrator
```

### Setting Up Sound

For displays with built-in speakers:

```bash
# Configure audio output
sudo raspi-config
```

Navigate to System Options > Audio to select the appropriate output.

### Adding a Shutdown Button

For physical power control:

```bash
sudo nano /boot/config.txt
```

Add at the end:
```
# GPIO shutdown button
dtoverlay=gpio-shutdown,gpio_pin=3
```

This configures GPIO pin 3 as a shutdown button.