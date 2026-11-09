# FinOptimizer AI – AWS Production Console Deployment Guide
## Complete Setup for 8 AWS Services in Your Own AWS Console

This guide walks you through deploying **FinOptimizer AI – Retail Financial Planning & Optimization** into your personal AWS Console. It leverages **8 core AWS services** for enterprise-grade scalability, security, and automated operations.

---

### Architecture Overview

```
                      [ Internet / User Browser ]
                                   │
                                   ▼
             [ Amazon CloudFront (Global CDN + SSL) ]
                    │                           │
          (Path: /*)│                           │(Path: /api/*)
                    ▼                           ▼
          [ Amazon S3 Bucket ]     [ Application Load Balancer (ALB) ]
       (React Vite Static App)                  │
                                                ▼
                              [ Amazon ECS (AWS Fargate) ]
                             (Node.js Application Server)
                                                │
                     ┌──────────────────────────┴─────────────────────────┐
                     ▼                                                    ▼
       [ Amazon RDS (PostgreSQL 15) ]                            [ Amazon CloudWatch ]
       (Multi-AZ Retail Database)                                (Metrics & 5xx Alarms)

                                   [ AUTOMATED AUDIT WORKFLOW ]
                                                │
                                   [ Amazon EventBridge ]
                                  (Nightly Cron: 01:00 UTC)
                                                │
                                                ▼
                                       [ AWS Lambda ]
                              (Retail Financial Risk Scanner)
                                                │
                                                ▼
                                      [ Amazon SNS Topic ]
                                (Executive Email & SMS Alerts)
```

---

## 8 AWS Services Configured

| # | AWS Service | Purpose in FinOptimizer AI |
|---|-------------|----------------------------|
| **1** | **Amazon ECS (AWS Fargate)** | Serverless container orchestration for the Node.js backend application server with auto-scaling. |
| **2** | **Amazon RDS (PostgreSQL)** | Managed relational database hosting retail sales, stores, expenses, financial plans, and variances. |
| **3** | **Amazon S3** | High-availability static storage for the React Vite frontend and generated PDF financial reports. |
| **4** | **Amazon CloudFront** | Low-latency CDN edge distribution with HTTPS, routing API traffic to the ALB and static assets to S3. |
| **5** | **AWS Lambda** | Serverless function running nightly automated audits for negative margin and markdown risk triggers. |
| **6** | **Amazon EventBridge** | Cloud scheduler invoking the Lambda risk scanner every night at 01:00 UTC (`cron(0 1 * * ? *)`). |
| **7** | **Amazon SNS** | Push notification topic publishing immediate crisis turnaround alerts via Email/SMS to executives. |
| **8** | **Amazon CloudWatch** | Real-time monitoring dashboard and alarms for HTTP 5xx errors, ECS CPU utilization, and database health. |

---

## Method 1: 1-Click AWS Console Deployment (CloudFormation)

### Step 1: Open CloudFormation in AWS Console
1. Log into your [AWS Management Console](https://console.aws.amazon.com/).
2. Select your preferred AWS Region (e.g. **Mumbai `ap-south-1`**, **N. Virginia `us-east-1`**, or **Frankfurt `eu-central-1`**).
3. Search for **CloudFormation** in the top search bar and click **Create stack** $\rightarrow$ **With new resources (standard)**.

### Step 2: Upload the Template
1. Choose **Upload a template file**.
2. Click **Choose file** and select:
   `AI Retail Financial planning/aws/cloudformation/finoptimizer-complete-stack.yaml`
3. Click **Next**.

### Step 3: Specify Stack Parameters
Fill in your parameters:
- **Stack name**: `finoptimizer-retail-production`
- **Environment**: `production`
- **DbUsername**: `retail_admin`
- **DbPassword**: (Choose a secure password, e.g. `RetailFinance2026!Sec`)
- **ExecutiveAlertEmail**: Enter your email address to receive real-time financial risk alerts.
- **JwtSecret**: Enter your secure JWT secret key.

### Step 4: Review and Launch
1. Click **Next** through Configure stack options.
2. Check the box: **"I acknowledge that AWS CloudFormation might create IAM resources."**
3. Click **Submit**.
4. CloudFormation will automatically provision all 8 services in approximately 8 to 12 minutes.
5. In the **Outputs** tab, you will find:
   - `CloudFrontEndpoint`: Your live web URL.
   - `ApplicationLoadBalancerDNS`: Your backend API endpoint.
   - `PostgreSQLHost`: Your database host address.
   - `FrontendS3Bucket`: S3 bucket name for uploading frontend assets.
   - `SNSTopicArn`: Amazon SNS topic ARN for alerts.

---

## Method 2: Deploying Code into the AWS Resources

### 1. Build and Push Backend Container to Amazon ECR
In your local terminal:
```bash
# 1. Login to Amazon ECR (replace with your AWS Account ID & Region)
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# 2. Build backend Docker image
cd "application-server"
docker build -t finoptimizer-app-server:latest .

# 3. Tag and push to ECR
docker tag finoptimizer-app-server:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/finoptimizer-app-server:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/finoptimizer-app-server:latest

# 4. Force ECS deployment to pull latest image
aws ecs update-service --cluster finoptimizer-cluster --service finoptimizer-service --force-new-deployment --region ap-south-1
```

### 2. Build and Upload Frontend to Amazon S3
```bash
cd "../frontend"
npm run build

# Sync build output to the S3 frontend bucket
aws s3 sync dist/ s3://finoptimizer-frontend-<AWS_ACCOUNT_ID>-ap-south-1/ --delete

# Invalidate CloudFront cache so changes reflect instantly
aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_DISTRIBUTION_ID> --paths "/*"
```

### 3. Initialize Database Migrations & Seeds on RDS
Connect your local terminal to the RDS database or run via ECS task:
```bash
export DATABASE_CLIENT=pg
export DATABASE_URL=postgres://retail_admin:RetailFinance2026!Sec@<POSTGRESQL_HOST>:5432/retail_financial_db

cd "../application-server"
npm run migrate
npm run import-data
```

---

## Verifying the 8 Services in AWS Console

1. **ECS Console**: Navigate to **Amazon ECS** $\rightarrow$ **Clusters** $\rightarrow$ `finoptimizer-cluster`. Verify that `finoptimizer-service` has 2 running Fargate tasks.
2. **RDS Console**: Navigate to **Amazon RDS** $\rightarrow$ **Databases** $\rightarrow$ `finoptimizer-retail-db`. Check status is **Available**.
3. **CloudFront Console**: Open **CloudFront Distributions** $\rightarrow$ click the distribution domain name. Your interactive FinOptimizer AI platform opens securely over HTTPS!
4. **Lambda & EventBridge**:
   - Go to **AWS Lambda** $\rightarrow$ `FinOptimizer-Daily-Risk-Scanner`.
   - Click **Test** to manually run an audit.
   - Check your inbox: you will receive the executive crisis notification email instantly via **Amazon SNS**!
5. **CloudWatch**: Open **CloudWatch** $\rightarrow$ **Alarms** to verify `FinOptimizer-High-5xx-Errors` is active and in `OK` state.

---

### Support & Maintenance
All CloudWatch logs for the application server are centrally aggregated in `/ecs/finoptimizer-app-server` with 30-day retention.
