require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/retail_financial_db',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_key_retail_planning_2026',
  jwtExpiresIn: '24h',
  mlServerUrl: process.env.ML_SERVER_URL || 'http://localhost:8000',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  s3BucketName: process.env.S3_BUCKET_NAME || 'ai-retail-financial-planning-artifacts'
};
