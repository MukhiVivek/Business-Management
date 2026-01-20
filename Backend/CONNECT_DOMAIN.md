# How to Connect Your Domain to AWS App

This guide assumes your app is running on **Port 4000** on an AWS EC2 instance, and you bought your domain on **GoDaddy**.

## Step 1: Point GoDaddy Domain to AWS

1.  **Find your AWS IP Address**:
    *   Go to AWS Console > EC2 > Instances.
    *   Select your instance.
    *   Copy the **Public IPv4 address** (e.g., `54.123.45.67`).

2.  **Configure GoDaddy DNS**:
    *   Log in to GoDaddy and go to your **DNS Management** page for your domain.
    *   Find the **A Record** with name `@`.
    *   Edit it and paste your **AWS Public IP** in the "Value" or "Points to" field.
    *   Set TTL to 600 seconds (or lowest possible) for faster propagation.
    *   Save changes.

## Step 2: Configure Server (AWS)

I have created a script `setup_nginx.sh` in your backend folder to automate the connection.

1.  **SSH into your AWS Server**:
    ```bash
    ssh -i your-key.pem ubuntu@your-aws-ip
    ```

2.  **Upload the script** (if you haven't already):
    You can copy-paste the content of `setup_nginx.sh` into a file on the server:
    ```bash
    nano setup_nginx.sh
    # Paste content, verify it looks correct, then save (Ctrl+O, Enter, Ctrl+X)
    ```

3.  **Run the script**:
    Replace `yourdomain.com` with your actual domain name.
    ```bash
    chmod +x setup_nginx.sh
    sudo ./setup_nginx.sh yourdomain.com
    ```

    **What this script does:**
    *   Installs Nginx (web server).
    *   Configures it to listen on Port 80 (standard HTTP).
    *   Forwards all traffic to your app on Port 4000.

## Step 3: Enable HTTPS (Optional but Recommended)

After your domain is working with HTTP (e.g., `http://yourdomain.com`), secure it with HTTPS:

1.  **Install Certbot**:
    *   **Ubuntu**:
        ```bash
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
        ```
    *   **Amazon Linux**:
        ```bash
        sudo yum install -y certbot python3-certbot-nginx
        ```

2.  **Run Certbot**:
    ```bash
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```
    Follow the prompts. It will automatically update your Nginx config for HTTPS.
