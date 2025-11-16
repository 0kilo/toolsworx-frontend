#!/bin/bash

echo "🔧 Converting Internal Load Balancer to Internet-Facing"
echo "====================================================="

# Variables
LB_ARN="arn:aws:elasticloadbalancing:us-east-2:784327326356:loadbalancer/app/awseb--AWSEB-iFmkw4WGwwVE/b79d2832750dbf3a"
TG_ARN="arn:aws:elasticloadbalancing:us-east-2:784327326356:targetgroup/tg-toolsworx/a6393e0d7c1a3531"
VPC_ID="vpc-035fae9ac739baec8"
REGION="us-east-2"

echo "📋 Getting public subnets in VPC..."
PUBLIC_SUBNETS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=map-public-ip-on-launch,Values=true" \
  --region $REGION \
  --query 'Subnets[].SubnetId' \
  --output text)

echo "Found public subnets: $PUBLIC_SUBNETS"

if [ -z "$PUBLIC_SUBNETS" ]; then
  echo "❌ No public subnets found. Cannot create internet-facing load balancer."
  exit 1
fi

# Convert to array
SUBNET_ARRAY=($PUBLIC_SUBNETS)

echo ""
echo "🔧 Creating new internet-facing load balancer..."

# Create new internet-facing load balancer
NEW_LB_ARN=$(aws elbv2 create-load-balancer \
  --name "toolsworx-public-lb" \
  --subnets ${SUBNET_ARRAY[@]} \
  --security-groups "sg-0f1f1cfa7c54ef230" \
  --scheme "internet-facing" \
  --type "application" \
  --ip-address-type "ipv4" \
  --region $REGION \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

if [ $? -eq 0 ]; then
  echo "✅ Created new load balancer: $NEW_LB_ARN"
  
  # Get the DNS name
  NEW_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $NEW_LB_ARN \
    --region $REGION \
    --query 'LoadBalancers[0].DNSName' \
    --output text)
  
  echo "🌐 New DNS: $NEW_DNS"
  
  # Create listener
  echo "🔧 Creating HTTP listener..."
  aws elbv2 create-listener \
    --load-balancer-arn $NEW_LB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$TG_ARN \
    --region $REGION
  
  if [ $? -eq 0 ]; then
    echo "✅ Listener created successfully"
    
    # Update .env.local
    echo "🔄 Updating .env.local..."
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$NEW_DNS|" .env.local
    echo "✅ Updated NEXT_PUBLIC_API_URL=http://$NEW_DNS"
    
    echo ""
    echo "🎉 SUCCESS! Your new internet-facing load balancer is ready:"
    echo "   DNS: $NEW_DNS"
    echo "   URL: http://$NEW_DNS"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test the connection: curl http://$NEW_DNS/health"
    echo "2. Update Amplify environment variable: NEXT_PUBLIC_API_URL=http://$NEW_DNS"
    echo "3. Configure backend CORS for your Amplify domain"
    echo "4. Delete the old internal load balancer when ready"
    
  else
    echo "❌ Failed to create listener"
    exit 1
  fi
  
else
  echo "❌ Failed to create load balancer"
  exit 1
fi