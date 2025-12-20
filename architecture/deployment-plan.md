# Amazon Product Application - Deployment Plan

## Overview

This document outlines the complete deployment strategy for the Amazon Product Information application, including infrastructure setup, CI/CD pipeline, monitoring, and scaling strategies.

---

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Recommended Deployment Architecture](#recommended-deployment-architecture)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Containerization](#containerization)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Environment Configuration](#environment-configuration)
7. [Database Deployment](#database-deployment)
8. [Monitoring & Logging](#monitoring--logging)
9. [Scaling Strategy](#scaling-strategy)
10. [Security Hardening](#security-hardening)
11. [Backup & Disaster Recovery](#backup--disaster-recovery)
12. [Deployment Checklist](#deployment-checklist)

---

## Deployment Options

### Option 1: AWS Deployment (Recommended)

**Pros:**
- Comprehensive managed services (ECS, DocumentDB, ElastiCache)
- Auto-scaling capabilities
- MongoDB Atlas integration or DocumentDB
- Excellent monitoring with CloudWatch
- Cost-effective for production workloads

**Cons:**
- AWS-specific knowledge required
- Can be complex for beginners

### Option 2: Google Cloud Platform (GCP)

**Pros:**
- Google Kubernetes Engine (GKE) for containerized apps
- Cloud Run for serverless containers
- Firestore or MongoDB Atlas
- Strong AI/ML capabilities if needed later

**Cons:**
- Smaller ecosystem than AWS
- MongoDB not natively supported (need Atlas)

### Option 3: Microsoft Azure

**Pros:**
- Azure Kubernetes Service (AKS)
- Cosmos DB with MongoDB API
- Good integration with enterprise tools
- Azure Container Instances

**Cons:**
- Cosmos DB can be expensive
- Learning curve for Azure services

### Option 4: DigitalOcean (Simple & Cost-Effective)

**Pros:**
- Simple to use, great for startups
- Managed Kubernetes
- Managed MongoDB databases
- Very cost-effective
- Excellent documentation

**Cons:**
- Fewer advanced features than AWS/GCP
- Limited regions
- Smaller ecosystem

### Option 5: Heroku (Easiest)

**Pros:**
- Extremely easy deployment
- Great for MVPs and small apps
- Built-in CI/CD
- Add-ons for MongoDB (mLab)

**Cons:**
- More expensive at scale
- Less control over infrastructure
- Can be slow

---

## Recommended Deployment Architecture

We'll focus on **AWS deployment** as the recommended approach, with alternatives noted.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                      │
└────────────────────────────────┬──────────────────────────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │   Route 53      │
                        │   (DNS)         │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  CloudFront     │
                        │  (CDN)          │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  ACM            │
                        │  (SSL Cert)     │
                        └────────┬────────┘
                                 │
                  ┌──────────────▼──────────────┐
                  │   Application Load          │
                  │   Balancer (ALB)            │
                  └──────────────┬──────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼────────┐ ┌──────▼───────┐ ┌───────▼────────┐
     │   ECS Fargate   │ │ ECS Fargate  │ │  ECS Fargate   │
     │   (Frontend)    │ │ (Backend)    │ │  (Ingestion)   │
     │   Container 1   │ │ Container 1  │ │  Worker        │
     └─────────────────┘ └──────────────┘ └────────────────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
          ┌──────────────────────┼─────────────────────┐
          │                      │                     │
     ┌────▼──────┐      ┌────────▼────────┐   ┌───────▼────────┐
     │ ElastiCache│      │  MongoDB Atlas  │   │  S3 Bucket     │
     │  (Redis)   │      │  or DocumentDB  │   │  (Static/Logs) │
     └────────────┘      └─────────────────┘   └────────────────┘
          │                      │                     │
          └──────────────────────┼─────────────────────┘
                                 │
                        ┌────────▼────────┐
                        │  CloudWatch     │
                        │  (Monitoring)   │
                        └─────────────────┘
```

---

## Infrastructure Setup

### AWS Infrastructure Components

| Component | Service | Purpose |
|-----------|---------|---------|
| **Compute** | ECS Fargate | Serverless container hosting |
| **Load Balancer** | Application Load Balancer | Traffic distribution & SSL termination |
| **Database** | MongoDB Atlas / DocumentDB | Product data storage |
| **Cache** | ElastiCache (Redis) | Performance optimization |
| **Storage** | S3 | Static assets, logs, backups |
| **CDN** | CloudFront | Global content delivery |
| **DNS** | Route 53 | Domain management |
| **SSL/TLS** | ACM | Free SSL certificates |
| **Networking** | VPC, Subnets, Security Groups | Network isolation & security |
| **Secrets** | Secrets Manager / Parameter Store | Credential management |
| **Monitoring** | CloudWatch | Logs, metrics, alarms |
| **CI/CD** | CodePipeline / GitHub Actions | Automated deployment |

### Infrastructure as Code (IaC)

**Option 1: AWS CloudFormation**
```yaml
# cloudformation-template.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Amazon Product App Infrastructure'

Resources:
  # VPC
  AppVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: AmazonProductApp-VPC

  # ECS Cluster
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: amazon-product-cluster
      CapacityProviders:
        - FARGATE
        - FARGATE_SPOT

  # ... (additional resources)
```

**Option 2: Terraform (Recommended)**
```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "amazon-product-vpc"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "amazon-product-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ... (additional resources)
```

**Option 3: AWS CDK (TypeScript)**
```typescript
// lib/infrastructure-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'AmazonProductVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      containerInsights: true,
    });
  }
}
```

---

## Containerization

### Docker Setup

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build if using TypeScript
# RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "src/app.js"]
```

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "app.js"]
```

#### Ingestion Service Dockerfile
```dockerfile
# ingestion/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

CMD ["node", "src/worker.js"]
```

#### Docker Compose (Local Development)
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - BACKEND_API_URL=http://backend:4000
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/amazon_products
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis
    networks:
      - app-network

  ingestion:
    build:
      context: ./ingestion
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/amazon_products
      - AMAZON_ACCESS_KEY=${AMAZON_ACCESS_KEY}
      - AMAZON_SECRET_KEY=${AMAZON_SECRET_KEY}
    depends_on:
      - mongodb
    networks:
      - app-network

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  mongodb_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS ECS

on:
  push:
    branches:
      - main
      - staging
  pull_request:
    branches:
      - main

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY_BACKEND: amazon-product-backend
  ECR_REPOSITORY_FRONTEND: amazon-product-frontend
  ECS_CLUSTER: amazon-product-cluster
  ECS_SERVICE_BACKEND: backend-service
  ECS_SERVICE_FRONTEND: frontend-service

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Run linter
        run: |
          cd backend && npm run lint
          cd ../frontend && npm run lint

      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

      - name: Run security audit
        run: |
          cd backend && npm audit --production
          cd ../frontend && npm audit --production

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push backend image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG \
                     $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_BACKEND:latest

      - name: Build, tag, and push frontend image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd frontend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG \
                     $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_FRONTEND:latest

      - name: Update backend ECS service
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE_BACKEND \
            --force-new-deployment

      - name: Update frontend ECS service
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE_FRONTEND \
            --force-new-deployment

      - name: Wait for services to stabilize
        run: |
          aws ecs wait services-stable \
            --cluster $ECS_CLUSTER \
            --services $ECS_SERVICE_BACKEND $ECS_SERVICE_FRONTEND

      - name: Notify deployment success
        if: success()
        run: echo "Deployment successful!"

      - name: Notify deployment failure
        if: failure()
        run: echo "Deployment failed!"
```

### Alternative: GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  AWS_REGION: us-east-1
  DOCKER_DRIVER: overlay2

test:
  stage: test
  image: node:18
  script:
    - cd backend && npm ci && npm test
    - cd ../frontend && npm ci && npm test
  only:
    - branches

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - apk add --no-cache python3 py3-pip
    - pip3 install awscli
    - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
  script:
    - docker build -t $ECR_REGISTRY/backend:$CI_COMMIT_SHA ./backend
    - docker push $ECR_REGISTRY/backend:$CI_COMMIT_SHA
    - docker build -t $ECR_REGISTRY/frontend:$CI_COMMIT_SHA ./frontend
    - docker push $ECR_REGISTRY/frontend:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  image: amazon/aws-cli
  script:
    - aws ecs update-service --cluster $ECS_CLUSTER --service backend --force-new-deployment
    - aws ecs update-service --cluster $ECS_CLUSTER --service frontend --force-new-deployment
  only:
    - main
```

---

## Environment Configuration

### Development Environment
```env
# .env.development
NODE_ENV=development
PORT=4000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/amazon_products

# Redis
REDIS_URL=redis://localhost:6379

# Amazon API (use test credentials)
AMAZON_ACCESS_KEY=test_access_key
AMAZON_SECRET_KEY=test_secret_key
AMAZON_PARTNER_TAG=test_tag
AMAZON_REGION=us-east-1

# Logging
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Staging Environment
```env
# .env.staging
NODE_ENV=staging
PORT=4000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster-staging.mongodb.net/amazon_products

# Redis
REDIS_URL=redis://staging-cache.xxxxx.cache.amazonaws.com:6379

# Amazon API
AMAZON_ACCESS_KEY=${AWS_SECRETS_AMAZON_ACCESS_KEY}
AMAZON_SECRET_KEY=${AWS_SECRETS_AMAZON_SECRET_KEY}
AMAZON_PARTNER_TAG=staging_tag
AMAZON_REGION=us-east-1

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=https://staging.yourapp.com
```

### Production Environment
```env
# .env.production
NODE_ENV=production
PORT=4000

# MongoDB Atlas
MONGODB_URI=${AWS_SECRETS_MONGODB_URI}

# Redis
REDIS_URL=${AWS_SECRETS_REDIS_URL}

# Amazon API
AMAZON_ACCESS_KEY=${AWS_SECRETS_AMAZON_ACCESS_KEY}
AMAZON_SECRET_KEY=${AWS_SECRETS_AMAZON_SECRET_KEY}
AMAZON_PARTNER_TAG=prod_tag
AMAZON_REGION=us-east-1

# Logging
LOG_LEVEL=warn

# CORS
CORS_ORIGIN=https://yourapp.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache TTL
CACHE_SEARCH_TTL=300
CACHE_PRODUCT_TTL=3600
```

---

## Database Deployment

### Option 1: MongoDB Atlas (Recommended)

**Steps:**
1. Create MongoDB Atlas account
2. Create cluster (M10+ for production)
3. Configure network access (VPC peering or IP whitelist)
4. Create database user
5. Get connection string
6. Configure backup retention (7-30 days)
7. Set up monitoring alerts

**Cluster Configuration:**
```
Cluster Tier: M10 (Dedicated, 2GB RAM)
Region: Same as ECS (us-east-1)
Backup: Continuous (Point-in-time recovery)
Monitoring: CloudWatch integration
```

### Option 2: AWS DocumentDB

**CloudFormation:**
```yaml
DocumentDBCluster:
  Type: AWS::DocDB::DBCluster
  Properties:
    DBClusterIdentifier: amazon-product-docdb
    MasterUsername: !Ref DBUsername
    MasterUserPassword: !Ref DBPassword
    VpcSecurityGroupIds:
      - !Ref DocumentDBSecurityGroup
    DBSubnetGroupName: !Ref DBSubnetGroup
    StorageEncrypted: true
    BackupRetentionPeriod: 7

DocumentDBInstance:
  Type: AWS::DocDB::DBInstance
  Properties:
    DBClusterIdentifier: !Ref DocumentDBCluster
    DBInstanceClass: db.r5.large
    DBInstanceIdentifier: amazon-product-docdb-instance
```

### Database Indexing Script
```javascript
// scripts/setup-indexes.js
const mongoose = require('mongoose');

async function setupIndexes() {
  await mongoose.connect(process.env.MONGODB_URI);

  const Product = mongoose.model('Product');

  // Text index for search
  await Product.collection.createIndex({
    title: 'text',
    description: 'text',
    brand: 'text'
  }, {
    weights: {
      title: 10,
      brand: 5,
      description: 1
    },
    name: 'text_search_index'
  });

  // Compound indexes
  await Product.collection.createIndex({ category: 1, 'price.amount': 1 });
  await Product.collection.createIndex({ 'origin.marketplace': 1 });
  await Product.collection.createIndex({ updatedAt: -1 });

  console.log('Indexes created successfully');
  await mongoose.disconnect();
}

setupIndexes().catch(console.error);
```

---

## Monitoring & Logging

### CloudWatch Configuration

```javascript
// backend/src/config/logger.js
const winston = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'backend-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new CloudWatchTransport({
      logGroupName: '/aws/ecs/amazon-product-backend',
      logStreamName: `${process.env.HOSTNAME}-${new Date().toISOString().split('T')[0]}`,
      awsRegion: process.env.AWS_REGION,
      messageFormatter: ({ level, message, ...meta }) => {
        return JSON.stringify({ level, message, ...meta });
      }
    })
  ],
});

module.exports = logger;
```

### Monitoring Dashboards

**Metrics to Track:**
- Request rate (requests/min)
- Response time (p50, p95, p99)
- Error rate (%)
- CPU utilization (%)
- Memory utilization (%)
- Database connections
- Cache hit rate (%)
- API rate limit consumption

**CloudWatch Alarms:**
```yaml
HighErrorRateAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: HighErrorRate
    AlarmDescription: Alert when error rate exceeds 5%
    MetricName: 5XXError
    Namespace: AWS/ApplicationELB
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref SNSTopic

HighCPUAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: HighCPU
    MetricName: CPUUtilization
    Namespace: AWS/ECS
    Statistic: Average
    Period: 300
    EvaluationPeriods: 2
    Threshold: 80
    ComparisonOperator: GreaterThanThreshold
```

### Application Performance Monitoring (APM)

**Option 1: New Relic**
```javascript
// Add to app.js
require('newrelic');
```

**Option 2: Datadog**
```javascript
const tracer = require('dd-trace').init({
  service: 'amazon-product-backend',
  env: process.env.NODE_ENV
});
```

---

## Scaling Strategy

### Horizontal Scaling

**ECS Auto Scaling Policy:**
```yaml
AutoScalingTarget:
  Type: AWS::ApplicationAutoScaling::ScalableTarget
  Properties:
    MaxCapacity: 10
    MinCapacity: 2
    ResourceId: !Sub service/${ECSCluster}/${BackendService}
    RoleARN: !GetAtt AutoScalingRole.Arn
    ScalableDimension: ecs:service:DesiredCount
    ServiceNamespace: ecs

ScaleUpPolicy:
  Type: AWS::ApplicationAutoScaling::ScalingPolicy
  Properties:
    PolicyName: ScaleUp
    PolicyType: TargetTrackingScaling
    ScalingTargetId: !Ref AutoScalingTarget
    TargetTrackingScalingPolicyConfiguration:
      PredefinedMetricSpecification:
        PredefinedMetricType: ECSServiceAverageCPUUtilization
      TargetValue: 70
      ScaleInCooldown: 300
      ScaleOutCooldown: 60
```

### Database Scaling

**MongoDB Atlas:**
- Vertical scaling: Upgrade cluster tier (M10 → M20 → M30)
- Horizontal scaling: Enable sharding for collections
- Read replicas: Add read-only nodes

**Redis Scaling:**
- Cluster mode for horizontal scaling
- Read replicas for read-heavy workloads

---

## Security Hardening

### Security Checklist

- [ ] Enable HTTPS/TLS everywhere
- [ ] Use AWS WAF for DDoS protection
- [ ] Implement rate limiting
- [ ] Enable VPC security groups
- [ ] Use IAM roles (not access keys)
- [ ] Encrypt data at rest (MongoDB, S3)
- [ ] Encrypt data in transit (TLS 1.2+)
- [ ] Regular security audits (`npm audit`)
- [ ] Implement CSP headers
- [ ] Enable CloudTrail logging
- [ ] Use Secrets Manager for credentials
- [ ] Implement IP whitelisting where appropriate
- [ ] Regular dependency updates
- [ ] Container image scanning

### Security Groups Configuration

```yaml
BackendSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: Security group for backend containers
    VpcId: !Ref VPC
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 4000
        ToPort: 4000
        SourceSecurityGroupId: !Ref ALBSecurityGroup
    SecurityGroupEgress:
      - IpProtocol: -1
        CidrIp: 0.0.0.0/0

DatabaseSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: Security group for MongoDB
    VpcId: !Ref VPC
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 27017
        ToPort: 27017
        SourceSecurityGroupId: !Ref BackendSecurityGroup
```

---

## Backup & Disaster Recovery

### Backup Strategy

**MongoDB:**
- Automated daily backups
- Point-in-time recovery (last 7 days)
- Monthly snapshots retained for 1 year
- Cross-region replication for critical data

**Application Data:**
- S3 versioning enabled
- Lifecycle policies for old data
- Cross-region replication

### Disaster Recovery Plan

**RTO (Recovery Time Objective):** 1 hour
**RPO (Recovery Point Objective):** 15 minutes

**DR Steps:**
1. Detect outage via monitoring
2. Assess damage and data loss
3. Restore database from latest backup
4. Deploy application to DR region
5. Update DNS to point to DR region
6. Verify functionality
7. Monitor for issues

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security audit passed
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] SSL certificates valid
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Load testing completed
- [ ] Documentation updated

### Deployment

- [ ] Deploy to staging first
- [ ] Run smoke tests on staging
- [ ] Get stakeholder approval
- [ ] Schedule deployment window
- [ ] Deploy to production
- [ ] Run smoke tests on production
- [ ] Monitor for errors
- [ ] Verify all services healthy

### Post-Deployment

- [ ] Monitor CloudWatch metrics
- [ ] Check error logs
- [ ] Verify data sync working
- [ ] Test critical user flows
- [ ] Update status page
- [ ] Document any issues
- [ ] Plan rollback if needed

---

## Cost Optimization

### Estimated Monthly Costs (AWS)

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| ECS Fargate (2 tasks) | 0.5 vCPU, 1GB RAM | $30 |
| MongoDB Atlas M10 | 2GB RAM, 10GB storage | $57 |
| ElastiCache (Redis) | cache.t3.micro | $12 |
| ALB | With moderate traffic | $20 |
| CloudFront | 1TB transfer | $85 |
| S3 | 100GB storage | $2.30 |
| CloudWatch | Standard monitoring | $10 |
| **Total** | | **~$216/month** |

### Cost Reduction Tips

1. Use Fargate Spot for non-critical workloads (70% savings)
2. Enable S3 Intelligent-Tiering
3. Use CloudFront caching aggressively
4. Right-size ECS tasks (monitor CPU/RAM)
5. Delete old logs and snapshots
6. Use reserved instances for predictable workloads

---

## Deployment Commands

### Initial Setup
```bash
# Clone repository
git clone https://github.com/your-org/amazon-product-app.git
cd amazon-product-app

# Install dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Build Docker images
docker-compose build

# Run locally
docker-compose up
```

### Deploy to AWS
```bash
# Login to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push images
./scripts/deploy.sh production

# Apply infrastructure changes
cd infrastructure
terraform apply

# Deploy application
aws ecs update-service --cluster amazon-product-cluster --service backend-service --force-new-deployment
```

---

## Rollback Plan

### Automated Rollback

```bash
# Rollback to previous task definition
aws ecs update-service \
  --cluster amazon-product-cluster \
  --service backend-service \
  --task-definition backend-task:PREVIOUS_VERSION \
  --force-new-deployment
```

### Manual Rollback

1. Identify last known good version
2. Update ECS service to use previous task definition
3. Monitor CloudWatch for stability
4. Verify functionality
5. Investigate root cause of failure

---

## Summary

This deployment plan provides a production-ready strategy for deploying the Amazon Product application with:

- **Containerized deployment** using Docker and ECS Fargate
- **Automated CI/CD** with GitHub Actions
- **Infrastructure as Code** with Terraform/CloudFormation
- **Comprehensive monitoring** with CloudWatch
- **Auto-scaling** for high availability
- **Security hardening** following AWS best practices
- **Disaster recovery** with backup and rollback procedures
- **Cost optimization** strategies

The deployment is designed to be scalable, secure, and maintainable for a production environment.
