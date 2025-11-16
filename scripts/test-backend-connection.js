#!/usr/bin/env node

const axios = require('axios');

async function testBackendConnection() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';
  
  console.log('🔧 Testing Backend Connection');
  console.log('==============================');
  console.log(`API URL: ${apiUrl}`);
  console.log('');

  try {
    // Test health endpoint
    console.log('📋 Testing health endpoint...');
    const healthResponse = await axios.get(`${apiUrl}/health`, { timeout: 10000 });
    
    console.log('✅ Health check passed!');
    console.log(`   Status: ${healthResponse.data.status}`);
    console.log(`   Service: ${healthResponse.data.service}`);
    console.log(`   Uptime: ${Math.round(healthResponse.data.uptime)}s`);
    console.log('');

    // Test ready endpoint
    console.log('📋 Testing ready endpoint...');
    const readyResponse = await axios.get(`${apiUrl}/ready`, { timeout: 5000 });
    
    console.log('✅ Ready check passed!');
    console.log(`   Ready: ${readyResponse.data.ready}`);
    console.log('');

    // Test CORS preflight
    console.log('📋 Testing CORS configuration...');
    try {
      const corsResponse = await axios.options(`${apiUrl}/api/convert`, {
        headers: {
          'Origin': 'https://example.amplifyapp.com',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        timeout: 5000
      });
      
      console.log('✅ CORS preflight passed!');
      console.log(`   Access-Control-Allow-Origin: ${corsResponse.headers['access-control-allow-origin'] || 'Not set'}`);
      console.log(`   Access-Control-Allow-Methods: ${corsResponse.headers['access-control-allow-methods'] || 'Not set'}`);
    } catch (corsError) {
      console.log('⚠️  CORS preflight failed - this might cause issues with Amplify frontend');
      console.log(`   Error: ${corsError.message}`);
    }
    console.log('');

    console.log('🎉 Backend connection test completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Update your Amplify environment variables');
    console.log('2. Configure backend CORS for your Amplify domain');
    console.log('3. Redeploy your Amplify app');

  } catch (error) {
    console.log('❌ Backend connection failed!');
    console.log(`   Error: ${error.message}`);
    console.log('');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔧 Troubleshooting:');
      console.log('1. Check if backend service is running');
      console.log('2. Verify the port number (default: 3010)');
      console.log('3. Check security group allows inbound traffic');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🔧 Troubleshooting:');
      console.log('1. Check if the hostname/IP is correct');
      console.log('2. Verify DNS resolution');
      console.log('3. Check if load balancer is internet-facing');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('🔧 Troubleshooting:');
      console.log('1. Check security group rules');
      console.log('2. Verify network connectivity');
      console.log('3. Check if service is responding');
    }
    
    process.exit(1);
  }
}

// Run the test
testBackendConnection().catch(console.error);