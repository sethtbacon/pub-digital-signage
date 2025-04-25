#!/bin/bash
# Restart services after deployment

echo "===================================="
echo "Restarting Pub Digital Signage services"
echo "===================================="

# Navigate to project directory
cd /home/$(whoami)/pub-digital-signage

# Install any new dependencies
echo "Installing dependencies..."
npm run install:all

# Run database migrations if needed
echo "Running database migrations..."
cd ./src/backend
npx knex migrate:latest

# Restart the backend service
echo "Restarting backend service..."
if [ -f "/etc/systemd/system/pub-digital-signage-backend.service" ]; then
  sudo systemctl restart pub-digital-signage-backend.service
else
  # If no service exists, just start the server in background
  npm start &
fi

# Restart the browser if it's running in kiosk mode
echo "Refreshing frontend display..."
if pgrep chromium > /dev/null; then
  # For Raspberry Pi with Chromium in kiosk mode, refresh the browser
  export DISPLAY=:0
  xdotool key F5
fi

echo "===================================="
echo "Deployment complete!"
echo "===================================="