# AWS Deployment & Production Guide

## 1. Overview & Cloud Architecture Target

The application server (Server 1) and PostgreSQL database are designed to be deployed onto AWS infrastructure:

- **Server 1**: AWS EC2 Instance (`t3.medium` / `t3.large`, Ubuntu 22.04 LTS) running Nginx and Node.js (PM2).
- **Database**: Amazon RDS PostgreSQL (v15.x, Multi-AZ for high availability).
- **Storage**: AWS S3 Bucket (`ai-retail-financial-planning-artifacts`).
- **Monitoring**: AWS CloudWatch (Log groups & alarms).

---

## 2. Step 1: Provision Amazon RDS PostgreSQL

1. Open AWS RDS Console $\rightarrow$ **Create Database**.
2. Select Engine: **PostgreSQL (v15.x)**.
3. Templates: **Production (Multi-AZ DBInstance)**.
4. Settings:
   - DB instance identifier: `retail-financial-rds`
   - Master username: `postgres`
   - Master password: `<SecureGeneratedPassword>`
5. Network & VPC:
   - VPC: Select target private VPC (`10.0.0.0/16`).
   - Subnet Group: Select Private Subnet Group.
   - Publicly Accessible: **No**.
   - VPC Security Group: Create `rds-postgres-sg` allowing TCP 5432 ingress *only* from `ec2-server1-sg`.
6. Initial Database Name: `retail_financial_db`.

---

## 3. Step 2: Provision AWS S3 & IAM Roles

1. Open AWS S3 Console $\rightarrow$ **Create Bucket**:
   - Bucket Name: `ai-retail-financial-planning-artifacts-<random_suffix>`
   - Region: `us-east-1`
   - Block all public access: **Enabled**.
2. Open AWS IAM Console $\rightarrow$ **Create Role**:
   - Trusted Entity: **AWS Service $\rightarrow$ EC2**.
   - Permissions Policy: `AmazonS3FullAccess` (or scoped policy for target bucket).
   - Attach IAM Role to EC2 Instance Profile.

---

## 4. Step 3: Provision AWS EC2 Server 1

1. Open AWS EC2 Console $\rightarrow$ **Launch Instance**:
   - Name: `AWS EC2 — Server 1 (Application Server)`
   - AMI: **Ubuntu Server 22.04 LTS (HVM)**
   - Instance Type: `t3.medium`
   - Key Pair: Select SSH key pair.
   - Network: Select Public Subnet (`10.0.1.0/24`).
   - Auto-assign Public IP: **Enable**.
   - Security Group: Allow TCP 22 (SSH), TCP 80 (HTTP), TCP 443 (HTTPS), TCP 5000 (Node API).
2. Attach IAM Role created in Step 2.

---

## 5. Step 4: Server 1 Deployment Script

Run the following commands on the EC2 instance via SSH:

```bash
# Update system & install Node.js 20 & Nginx
sudo apt-get update -y
sudo apt-get install -y curl git nginx

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone & Setup Application Server
git clone <repository_url> /var/www/retail-financial-platform
cd /var/www/retail-financial-platform/application-server

# Install Production Dependencies
npm ci --only=production

# Configure Environment Variables
cp .env.example .env
nano .env
# Set DATABASE_URL=postgres://postgres:<password>@<rds_endpoint>:5432/retail_financial_db
# Set JWT_SECRET=<production_jwt_secret>

# Run Migrations & Import Kaggle Dataset
npm run migrate
npm run import-data

# Start Application with PM2 Process Manager
pm2 start src/app.js --name "retail-app-server"
pm2 save
pm2 startup
```

---

## 6. Step 5: Nginx Reverse Proxy Setup

Create `/etc/nginx/sites-available/retail-app`:

```nginx
server {
    listen 80;
    server_name api.retailfinancials.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site & reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/retail-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
