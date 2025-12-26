#!/bin/bash

# setup_nginx.sh
# Usage: sudo ./setup_nginx.sh yourdomain.com

DOMAIN=$1
APP_PORT=4000

if [ -z "$DOMAIN" ]; then
    echo "Error: Please provide your domain name."
    echo "Usage: sudo ./setup_nginx.sh example.com"
    exit 1
fi

echo "Setting up Nginx for domain: $DOMAIN on port $APP_PORT..."

# Detect OS and install Nginx
if command -v apt-get &> /dev/null; then
    echo "Detected Debian/Ubuntu system."
    apt-get update
    apt-get install -y nginx
elif command -v yum &> /dev/null; then
    echo "Detected RHEL/CentOS/Amazon Linux system."
    yum update -y
    yum install -y nginx
else
    echo "Error: Unsupported package manager. Please install Nginx manually."
    exit 1
fi

# Create Nginx Configuration
CONFIG_CONTENT="server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}"

# Write config to available sites (Debian/Ubuntu style) or conf.d (RHEL/Amazon Linux style)
if [ -d "/etc/nginx/sites-available" ]; then
    echo "$CONFIG_CONTENT" > /etc/nginx/sites-available/$DOMAIN
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
elif [ -d "/etc/nginx/conf.d" ]; then
    echo "$CONFIG_CONTENT" > /etc/nginx/conf.d/$DOMAIN.conf
else
    echo "Error: Could not find Nginx configuration directory."
    exit 1
fi

# Test and Restart Nginx
nginx -t
if [ $? -eq 0 ]; then
    echo "Nginx configuration valid. Restarting Nginx..."
    if command -v systemctl &> /dev/null; then
        systemctl restart nginx
        systemctl enable nginx
    else
        service nginx restart
    fi
    echo "✅ Success! Nginx is now proxying $DOMAIN to port $APP_PORT."
else
    echo "❌ Error: Nginx configuration test failed."
    exit 1
fi
