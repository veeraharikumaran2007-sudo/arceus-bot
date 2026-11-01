#!/bin/bash
# ========================================================
# Arceus Bot — Oracle Cloud Always Free 1-Click Deployment
# ========================================================

echo "⚡ Starting Arceus Bot Deployment on Oracle Cloud..."

# 1. Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 & Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# 3. Install PM2 (Process Manager for 24/7 Zero-Downtime)
sudo npm install -g pm2

# 4. Install App Dependencies
npm install --omit=dev

# 5. Open Port 5000 in Ubuntu Firewall (iptables / ufw)
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5000 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || true

# 6. Start Bot with PM2 Auto-Restart
pm2 start server.js --name "arceus-bot"
pm2 save
pm2 startup

echo ""
echo "=========================================================="
echo "✅ ARCEUS BOT IS LIVE ON ORACLE CLOUD!"
echo "Public Access: http://$(curl -s ifconfig.me):5000"
echo "=========================================================="
