# Automated AWS Deployment PowerShell Script for FinOptimizer AI
# Deploys 8 AWS Services: ECS Fargate, RDS PostgreSQL, S3, CloudFront, Lambda, EventBridge, SNS, CloudWatch

Param(
    [string]$Region = "us-east-1",
    [string]$StackName = "finoptimizer-retail-production",
    [string]$DbPassword = "RetailFinance2026!Sec",
    [string]$ExecutiveAlertEmail = "Ym9060@srmist.edu.in",
    [string]$AccessKeyId = "",
    [string]$SecretAccessKey = ""
)

$env:Path += ";C:\Program Files\Amazon\AWSCLIV2"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " FinOptimizer AI - Production AWS Deployment (8 Services)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Check AWS CLI
$awsCli = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsCli) {
    Write-Host "Error: AWS CLI is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Configure credentials if supplied
if (-not [string]::IsNullOrWhiteSpace($AccessKeyId) -and -not [string]::IsNullOrWhiteSpace($SecretAccessKey)) {
    Write-Host "Configuring provided AWS Access Keys..." -ForegroundColor Yellow
    aws configure set aws_access_key_id $AccessKeyId
    aws configure set aws_secret_access_key $SecretAccessKey
    aws configure set default.region $Region
}

# 2. Check AWS Credentials
Write-Host "`n[1/4] Verifying AWS Identity..." -ForegroundColor Green
$identity = aws sts get-caller-identity 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: AWS CLI credentials not configured or expired." -ForegroundColor Red
    Write-Host "AWS does not permit CLI/automated deployments with web console username/password alone." -ForegroundColor Yellow
    Write-Host "Please provide your AWS Access Key ID (starts with AKIA...) and Secret Access Key." -ForegroundColor Yellow
    exit 1
}
Write-Host "AWS Caller Identity verified: $identity" -ForegroundColor Gray

# 3. Deploy CloudFormation Stack
$templatePath = "./aws/cloudformation/finoptimizer-complete-stack.yaml"
if (-not (Test-Path $templatePath)) {
    $templatePath = "./aws-cloudformation.json"
}

Write-Host "`n[2/4] Deploying CloudFormation Stack '$StackName' in region '$Region'..." -ForegroundColor Green
Write-Host "Template: $templatePath" -ForegroundColor Gray

aws cloudformation deploy `
    --template-file $templatePath `
    --stack-name $StackName `
    --capabilities CAPABILITY_IAM `
    --region $Region `
    --parameter-overrides `
        Environment=production `
        DbPassword=$DbPassword `
        ExecutiveAlertEmail=$ExecutiveAlertEmail

if ($LASTEXITCODE -ne 0) {
    Write-Host "CloudFormation deployment encountered an issue." -ForegroundColor Red
    exit 1
}

# 4. Fetch Outputs
Write-Host "`n[3/4] Fetching Stack Outputs..." -ForegroundColor Green
$outputs = aws cloudformation describe-stacks --stack-name $StackName --region $Region --query "Stacks[0].Outputs" --output json | ConvertFrom-Json

foreach ($out in $outputs) {
    Write-Host "  - $($out.OutputKey): $($out.OutputValue)" -ForegroundColor Yellow
}

Write-Host "`n[4/4] 8 AWS Services Deployed Successfully!" -ForegroundColor Green
Write-Host "CloudFront URL, ALB DNS, RDS Endpoint, S3 Bucket & SNS Topic are live." -ForegroundColor Cyan
