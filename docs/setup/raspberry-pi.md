# Raspberry Pi Setup Guide

This guide provides detailed instructions for setting up your Pub Digital Signage application on a Raspberry Pi 4 for deployment in your home pub environment.

## Hardware Requirements

- **Raspberry Pi 4** (4GB or 8GB RAM recommended)
- **MicroSD Card** (32GB or larger recommended, Class 10 speed)
- **Power Supply** (Official Raspberry Pi USB-C power supply recommended)
- **Display/TV** with HDMI input
- **MicroHDMI to HDMI Cable** (for connecting to your display)
- **Keyboard and Mouse** (for initial setup, can be removed after)
- **Case with Cooling** (heatsinks and/or fan recommended)
- **Ethernet Cable** (optional, for wired network connection)

## Initial Setup

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

## Application Installation

### 1. Clone Repository

```bash
mkdir -p ~/apps
cd ~/apps
git clone https://github.com/yourusername/pub-digital-signage.git
cd pub-digital-signage
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Application

```bash
cp config/default.json config/production.json
```

Edit the production configuration:

```bash
nano config/production.json
```

Update these settings:

```json
{
  "server": {
    "port": 3000,
    "host": "0.0.0.0"  # Allow external connections
  },
  "database": {
    "path": "/home/pi/apps/pub-digital-signage/data/db/pubsignage.db"
  },
  "media": {
    "storagePath": "/home/pi/apps/pub-digital-signage/data/media"
  }
}
```

### 4. Initialize Database

```bash
mkdir -p data/db
node scripts/setup/init-db.js
```

### 5. Build Frontend

```bash
npm run build
```

### 6. Set Up Auto-Start Service

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/pubsignage.service
```

Add the following content:

```ini
[Unit]
Description=Pub Digital Signage
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/apps/pub-digital-signage
ExecStart=/home/pi/.nvm/versions/node/v18.x.x/bin/node /home/pi/apps/pub-digital-signage/src/backend/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=pubsignage
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Replace `v18.x.x` with your actual Node.js version (check with `node -v`).

Enable and start the service:

```bash
sudo systemctl enable pubsignage.service
sudo systemctl start pubsignage.service
```

## Kiosk Mode Setup

### 1. Install Chromium Browser (if not already installed)

```bash
sudo apt install -y chromium-browser
```

### 2. Create Kiosk Start Script

```bash
nano ~/start-kiosk.sh
```

Add the following content:

```bash
#!/bin/bash

# Wait for network and server to be up
sleep 15

# Disable screen blanking and screensaver
xset s off
xset s noblank
xset -dpms

# Hide cursor after 5 seconds of inactivity
unclutter -idle 5 &

# Start chromium in kiosk mode
chromium-browser --noerrdialogs --kiosk --disable-translate --no-first-run \
  --disable-infobars --disable-suggestions-service --disable-features=TranslateUI \
  --disk-cache-dir=/dev/null --aggressive-cache-discard \
  http://localhost:3000
```

Make the script executable:

```bash
chmod +x ~/start-kiosk.sh
```

### 3. Configure Auto-Start for Kiosk Mode

Edit the autostart configuration:

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/kiosk.desktop
```

Add the following:

```ini
[Desktop Entry]
Type=Application
Name=Pub Signage Kiosk
Exec=/home/pi/start-kiosk.sh
X-GNOME-Autostart-enabled=true
```

## Performance Optimization

### 1. GPU Memory Allocation

Edit the boot configuration:

```bash
sudo nano /boot/config.txt
```

Add or modify these lines:

```
# Increase GPU memory for better rendering
gpu_mem=128

# Enable hardware acceleration
dtoverlay=vc4-fkms-v3d
```

### 2. Overclock (Optional, only if needed)

In the same config.txt file, you can add mild overclocking for better performance:

```
# Mild overclock
over_voltage=2
arm_freq=1750
```

### 3. Disable Unnecessary Services

```bash
sudo systemctl disable bluetooth.service
sudo systemctl disable hciuart.service
```

### 4. Configure Browser Memory Usage

Edit the kiosk script to add memory management parameters:

```bash
nano ~/start-kiosk.sh
```

Update the chromium line:

```bash
chromium-browser --noerrdialogs --kiosk --disable-translate --no-first-run \
  --disable-infobars --disable-suggestions-service --disable-features=TranslateUI \
  --disk-cache-dir=/dev/null --aggressive-cache-discard \
  --disable-software-rasterizer --disable-dev-shm-usage \
  --js-flags="--max-old-space-size=460" \
  http://localhost:3000
```

## Network Configuration

### 1. Static IP Address (Recommended)

Edit the DHCP configuration:

```bash
sudo nano /etc/dhcpcd.conf
```

Add these lines (adjust according to your network):

```
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

### 2. Enable SSH for Remote Management

SSH should already be enabled if you used the Advanced Options in the Raspberry Pi Imager.

To verify SSH is enabled:

```bash
sudo systemctl status ssh
```

To enable it if not already enabled:

```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

## Maintenance and Monitoring

### 1. Create a Backup Script

```bash
nano ~/backup-pubsignage.sh
```

Add the following content:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_DIR="/home/pi/backups"
APP_DIR="/home/pi/apps/pub-digital-signage"

mkdir -p $BACKUP_DIR

# Backup the database
sqlite3 $APP_DIR/data/db/pubsignage.db ".backup '$BACKUP_DIR/pubsignage-$TIMESTAMP.db'"

# Backup configuration
cp $APP_DIR/config/production.json $BACKUP_DIR/production-$TIMESTAMP.json

# Backup user-generated media (optional - can be large)
# rsync -a $APP_DIR/data/media/ $BACKUP_DIR/media-$TIMESTAMP/

# Keep only the 5 most recent backups
ls -tp $BACKUP_DIR/pubsignage-*.db | grep -v '/$' | tail -n +6 | xargs -I {} rm -- {}
ls -tp $BACKUP_DIR/production-*.json | grep -v '/$' | tail -n +6 | xargs -I {} rm -- {}
```

Make the script executable and add to cron:

```bash
chmod +x ~/backup-pubsignage.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /home/pi/backup-pubsignage.sh") | crontab -
```

### 2. Set Up Auto-Restart (for recovery)

Create a watchdog script:

```bash
nano ~/watchdog.sh
```

Add content:

```bash
#!/bin/bash
if ! curl -s http://localhost:3000 > /dev/null; then
    sudo systemctl restart pubsignage.service
    echo "Restarted pubsignage service at $(date)" >> ~/watchdog.log
fi
```

Make executable and add to cron:

```bash
chmod +x ~/watchdog.sh
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/pi/watchdog.sh") | crontab -
```

## Power Management

### 1. Configure Display Power Management

To turn off the display during certain hours, create a script:

```bash
nano ~/display-control.sh
```

Add content:

```bash
#!/bin/bash
HOUR=$(date +%H)
# Turn off display between 2 AM and 8 AM
if [ $HOUR -ge 2 ] && [ $HOUR -lt 8 ]; then
    vcgencmd display_power 0
else
    vcgencmd display_power 1
fi
```

Add to cron to check every hour:

```bash
chmod +x ~/display-control.sh
(crontab -l 2>/dev/null; echo "0 * * * * /home/pi/display-control.sh") | crontab -
```

### 2. Auto-Reboot Schedule (Weekly)

Add to cron:

```bash
(crontab -l 2>/dev/null; echo "0 4 * * 1 sudo reboot") | crontab -
```

This will reboot the system every Monday at 4 AM.

## Troubleshooting

### Common Issues and Solutions

#### Application Not Starting

Check service status:
```bash
sudo systemctl status pubsignage.service
```

View logs:
```bash
journalctl -u pubsignage.service
```

#### Display Issues

Check if Chromium is running:
```bash
ps aux | grep chromium
```

Restart Kiosk mode:
```bash
killall chromium-browser
~/start-kiosk.sh
```

#### Overheating

Check temperature:
```bash
vcgencmd measure_temp
```

If consistently above 80°C, improve cooling.

#### Network Connectivity Issues

Test connectivity:
```bash
ping -c 4 google.com
```

Restart networking:
```bash
sudo systemctl restart networking
```

## Remote Management

### Setting Up VNC (Optional)

```bash
sudo apt install -y realvnc-vnc-server
sudo raspi-config
```

Go to Interface Options > VNC > Enable

Connect using VNC Viewer from another computer using the Raspberry Pi's IP address.

## Updating the Application

Create an update script:

```bash
nano ~/update-pubsignage.sh
```

Add content:

```bash
#!/bin/bash
APP_DIR="/home/pi/apps/pub-digital-signage"
LOG_FILE="$APP_DIR/update.log"

cd $APP_DIR
echo "Starting update at $(date)" >> $LOG_FILE

# Stop the service
sudo systemctl stop pubsignage.service

# Backup database
sqlite3 $APP_DIR/data/db/pubsignage.db ".backup '$APP_DIR/data/db/backup-before-update.db'"

# Pull latest code
git pull >> $LOG_FILE 2>&1

# Install dependencies
npm run install:all >> $LOG_FILE 2>&1

# Build frontend
npm run build >> $LOG_FILE 2>&1

# Restart service
sudo systemctl start pubsignage.service

echo "Update completed at $(date)" >> $LOG_FILE
```

Make executable:

```bash
chmod +x ~/update-pubsignage.sh
```

## Final Steps

1. **Reboot the Raspberry Pi**:
   ```bash
   sudo reboot
   ```

2. **Verify Application Starts**:
   - The system should boot into kiosk mode
   - The application should be visible on the display
   - Test navigation and content display

3. **Test Remote Access**:
   - SSH into the Raspberry Pi from another computer
   - Verify you can manage and update the application remotely

4. **Document Your Configuration**:
   - Note your Raspberry Pi's IP address
   - Document any custom configurations you've made
   - Store backup copies of important scripts and configurations

Your Pub Digital Signage should now be fully configured and running on your Raspberry Pi, ready to display content in your home pub environment.