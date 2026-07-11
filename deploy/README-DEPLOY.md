# CryptoAgentsADP.xyz — Deployment Guide

## Prerequisites

- Hostinger VPS (Ubuntu 22.04 LTS recommended, min 1GB RAM)
- Domain `cryptoagentsadp.xyz` pointed to VPS IP
- Local machine with SSH access to VPS

---

## 1. Hostinger VPS Setup

1. Purchase a VPS from Hostinger (KVM 1GB or higher)
2. Deploy with **Ubuntu 22.04 LTS**
3. Note the **root password** and **IP address** from Hostinger hPanel
4. (Optional) Add your SSH public key:

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@<VPS_IP>
```

## 2. DNS Configuration

In your domain registrar (or Hostinger DNS zone), create these **A records**:

| Type | Name               | Value     |
|------|--------------------|-----------|
| A    | `@`                | `<VPS_IP>` |
| A    | `www`              | `<VPS_IP>` |

TTL: 300 seconds (5 minutes). Propagation takes 5–30 minutes.

## 3. Initial VPS Provisioning

SSH into your VPS:

```bash
ssh root@<VPS_IP>
```

### Set hostname

```bash
hostnamectl set-hostname cryptoagentsadp
```

### Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v   # v20.x.x
npm -v
```

### Install PM2

```bash
npm install -g pm2
pm2 startup systemd
```

### Install Nginx

```bash
apt-get install -y nginx
nginx -v
```

### Create required directories

```bash
mkdir -p /var/www/cryptoagentsadp
mkdir -p /var/log/pm2
mkdir -p /var/log/nginx
```

## 4. Configure Nginx

Copy `deploy/nginx.conf` to the VPS:

```bash
scp deploy/nginx.conf root@<VPS_IP>:/etc/nginx/sites-available/cryptoagentsadp
ln -s /etc/nginx/sites-available/cryptoagentsadp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 5. Deploy the Application

On your **local machine**, from the project root:

```bash
# Make the script executable
chmod +x deploy/deploy.sh

# Deploy (replace VPS_IP if needed)
DEPLOY_USER=root \
  DEPLOY_HOST=<VPS_IP> \
  DEPLOY_PATH=/var/www/cryptoagentsadp \
  ./deploy/deploy.sh
```

Or manually:
```bash
# Build frontend
cd frontend && npm install && npm run build && cd ..

# Copy dist to backend/public
rm -rf backend/public && cp -r frontend/dist backend/public

# Rsync to server
rsync -avz --delete \
  -e "ssh -o StrictHostKeyChecking=no" \
  --exclude 'node_modules' \
  --exclude '.env' \
  backend/ root@<VPS_IP>:/var/www/cryptoagentsadp/

# SSH in and start
ssh root@<VPS_IP>
cd /var/www/cryptoagentsadp
echo 'PORT=5000' > .env
npm install --omit=dev
pm2 start deploy/ecosystem.config.js --env production
pm2 save
```

## 6. SSL Certificate (Let's Encrypt)

```bash
# SSH into VPS
ssh root@<VPS_IP>

# Install certbot
apt-get install -y certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d cryptoagentsadp.xyz -d www.cryptoagentsadp.xyz

# Verify auto-renewal
certbot renew --dry-run
```

Certs auto-renew. Certbot adds a systemd timer — verify with:
```bash
systemctl list-timers | grep certbot
```

## 7. Verify Deployment

| Check                 | URL / Command                              |
|-----------------------|--------------------------------------------|
| Frontend              | https://cryptoagentsadp.xyz                 |
| Health API            | https://cryptoagentsadp.xyz/api/health      |
| PM2 status            | `pm2 status`                               |
| Nginx status          | `nginx -t && systemctl status nginx`        |
| Application logs      | `pm2 logs cryptoagentsadp --lines 50`       |

---

## 8. PM2 Auto-Start on Reboot

PM2 auto-start was set up in step 3. Confirm:

```bash
pm2 startup   # Should say "already set"
pm2 save      # Save current process list
```

If not set:

```bash
pm2 startup systemd -u root --hp /root
pm2 save
```

---

## 9. Updating the Application

```bash
# From local machine
./deploy/deploy.sh
```

Or step-by-step:

```bash
# Pull latest code
ssh root@<VPS_IP> "cd /var/www/cryptoagentsadp && git pull"

# Build frontend
cd frontend && npm run build && cd ..

# Deploy
rsync -avz --delete --exclude node_modules --exclude .env backend/ root@<VPS_IP>:/var/www/cryptoagentsadp/

# Restart
ssh root@<VPS_IP> "cd /var/www/cryptoagentsadp && npm install --omit=dev && pm2 restart cryptoagentsadp"
```

---

## 10. Troubleshooting

### Nginx fails to start
```bash
nginx -t                    # Test config
systemctl status nginx      # Check service
journalctl -u nginx --no-pager -n 50
```

### Can't connect to backend (502 Bad Gateway)
```bash
# Check backend is running
pm2 status
pm2 logs cryptoagentsadp --lines 20

# Check port
ss -tlnp | grep 5000

# Reload nginx
systemctl reload nginx
```

### Frontend shows blank page
```bash
# Check static files exist
ls -la /var/www/cryptoagentsadp/public/

# Check nginx error log
tail -50 /var/log/nginx/cryptoagentsadp-error.log
```

### SSL certificate issues
```bash
certbot certificates                          # Check expiry
certbot renew --dry-run                       # Test renewal
openssl x509 -enddate -noout -in /etc/letsencrypt/live/cryptoagentsadp.xyz/fullchain.pem
```

### PM2 process not found after reboot
```bash
pm2 resurrect          # Restore saved processes
pm2 save               # Save current list again
pm2 startup            # Re-run startup setup
```

### High memory usage
```bash
pm2 restart cryptoagentsadp --max-memory-restart 512M
free -m
df -h
```

### Port 80/443 already in use
```bash
ss -tlnp | grep -E ':(80|443)\b'
systemctl stop apache2  # If Apache is running
```

---

## 11. Useful Commands Reference

```bash
# Logs
pm2 logs cryptoagentsadp
tail -f /var/log/nginx/cryptoagentsadp-access.log
journalctl -u nginx -f

# Monitoring
pm2 monit
htop

# Restart all
pm2 restart cryptoagentsadp && systemctl reload nginx
```