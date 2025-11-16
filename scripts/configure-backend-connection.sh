#!/bin/bash

echo "🔧 TOOLS WORX Backend Connection Configuration"
echo "=============================================="

# Get load balancer details
echo "📋 Checking your load balancer configuration..."
aws elbv2 describe-load-balancers \
  --load-balancer-arns "arn:aws:elasticloadbalancing:us-east-2:784327326356:loadbalancer/app/awseb--AWSEB-iFmkw4WGwwVE/b79d2832750dbf3a" \
  --region us-east-2 \
  --query 'LoadBalancers[0].{DNSName:DNSName,Scheme:Scheme,State:State.Code}' \
  --output table

# Check if load balancer is internet-facing
SCHEME=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns "arn:aws:elasticloadbalancing:us-east-2:784327326356:loadbalancer/app/awseb--AWSEB-iFmkw4WGwwVE/b79d2832750dbf3a" \
  --region us-east-2 \
  --query 'LoadBalancers[0].Scheme' \
  --output text)

DNS_NAME=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns "arn:aws:elasticloadbalancing:us-east-2:784327326356:loadbalancer/app/awseb--AWSEB-iFmkw4WGwwVE/b79d2832750dbf3a" \
  --region us-east-2 \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo ""
echo "🔍 Load Balancer Analysis:"
echo "  Scheme: $SCHEME"
echo "  DNS Name: $DNS_NAME"

if [ "$SCHEME" = "internal" ]; then
  echo ""
  echo "❌ PROBLEM DETECTED:"
  echo "   Your load balancer is INTERNAL, which means it's not accessible from the internet."
  echo "   Your Amplify frontend cannot connect to an internal load balancer."
  echo ""
  echo "🔧 SOLUTIONS:"
  echo "   1. Create a new internet-facing load balancer"
  echo "   2. Use the EC2 instance's public IP directly (not recommended for production)"
  echo "   3. Set up a CloudFront distribution"
  echo ""
  
  # Get EC2 public IP as fallback
  echo "📍 Getting EC2 instance public IP as fallback..."
  PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids "i-07b69a7e4412f52c1" \
    --region us-east-2 \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)
  
  if [ "$PUBLIC_IP" != "None" ] && [ "$PUBLIC_IP" != "null" ]; then
    echo "   EC2 Public IP: $PUBLIC_IP"
    echo ""
    echo "⚠️  TEMPORARY SOLUTION (for testing only):"
    echo "   You can use: http://$PUBLIC_IP:3010"
    echo "   But you need to:"
    echo "   1. Update security group to allow port 3010 from 0.0.0.0/0"
    echo "   2. Configure backend CORS for your Amplify domain"
    
    # Update .env.local with EC2 IP
    echo ""
    echo "🔄 Updating .env.local with EC2 IP..."
    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$PUBLIC_IP:3010|" .env.local
    echo "   ✅ Updated NEXT_PUBLIC_API_URL=http://$PUBLIC_IP:3010"
  else
    echo "   ❌ No public IP found for EC2 instance"
  fi
  
else
  echo ""
  echo "✅ GOOD NEWS:"
  echo "   Your load balancer is internet-facing and accessible from the internet."
  echo "   Backend URL: http://$DNS_NAME"
  echo ""
  
  # Update .env.local with load balancer DNS
  echo "🔄 Updating .env.local with load balancer DNS..."
  sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$DNS_NAME|" .env.local
  echo "   ✅ Updated NEXT_PUBLIC_API_URL=http://$DNS_NAME"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "1. Get your Amplify app domain (e.g., https://main.d1234567890.amplifyapp.com)"
echo "2. Update backend CORS configuration:"
echo "   - SSH into your EC2 instance"
echo "   - Set environment variable: CORS_ORIGIN=https://your-amplify-domain.amplifyapp.com"
echo "   - Restart the backend service"
echo "3. Test the connection from your Amplify frontend"
echo ""
echo "🔧 Backend CORS Update Command:"
echo "   export CORS_ORIGIN=https://your-amplify-domain.amplifyapp.com"
echo "   # Then restart your backend service"
echo ""
echo "✅ Configuration complete!"