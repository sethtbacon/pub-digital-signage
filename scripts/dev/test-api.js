/**
 * Simple API Test Script for Pub Digital Signage
 * 
 * This script tests the core API endpoints to verify they're working correctly.
 * Run with: node scripts/dev/test-api.js
 * 
 * It will test:
 * - Server connection
 * - API root endpoint
 * - System info endpoint
 * - Drinks endpoint
 * - Games endpoint
 * - Visitor endpoint
 */

const http = require('http');
const { URL } = require('url');

// Configuration
const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3000;
const BASE_URL = `http://${HOST}:${PORT}`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to make a GET request
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    console.log(`${colors.blue}Testing endpoint:${colors.reset} ${url.toString()}`);
    
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const responseData = data ? JSON.parse(data) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(new Error(`Request error: ${err.message}`));
    });
    
    req.end();
  });
}

// Test function for a specific endpoint
async function testEndpoint(path, expectedStatus = 200) {
  try {
    const response = await makeRequest(path);
    
    if (response.statusCode === expectedStatus) {
      console.log(`${colors.green}✓ ${path} - Status: ${response.statusCode}${colors.reset}`);
      console.log(`${colors.cyan}Response:${colors.reset}`, JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log(`${colors.red}✗ ${path} - Expected status ${expectedStatus} but got ${response.statusCode}${colors.reset}`);
      console.log(`${colors.yellow}Response:${colors.reset}`, JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (err) {
    console.log(`${colors.red}✗ ${path} - Error: ${err.message}${colors.reset}`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log(`${colors.magenta}Starting API Tests${colors.reset}`);
  console.log(`${colors.magenta}====================${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}\n`);
  
  let passed = 0;
  let failed = 0;
  
  // Test server root
  if (await testEndpoint('/')) passed++; else failed++;
  
  // Test API root
  if (await testEndpoint('/api')) passed++; else failed++;
  
  // Test system information endpoint
  if (await testEndpoint('/api/system/info')) passed++; else failed++;
  
  // Test drinks endpoint
  if (await testEndpoint('/api/drinks')) passed++; else failed++;
  
  // Test games endpoint
  if (await testEndpoint('/api/games')) passed++; else failed++;
  
  // Test visitors endpoint
  if (await testEndpoint('/api/visitors')) passed++; else failed++;
  
  console.log(`\n${colors.magenta}Test Results${colors.reset}`);
  console.log(`${colors.magenta}=============${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`${colors.magenta}Total: ${passed + failed}${colors.reset}`);
  
  if (failed === 0) {
    console.log(`\n${colors.green}All tests passed! The API is working correctly.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}Some tests failed. Please check the API server.${colors.reset}`);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(err => {
  console.error(`${colors.red}Error running tests:${colors.reset}`, err);
  process.exit(1);
});