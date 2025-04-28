/**
 * Test script for checking frontend-backend connectivity
 * 
 * This script sends requests to the backend API endpoints
 * to verify that the connection is working properly.
 */

const axios = require('axios');
const chalk = require('chalk');

// Configuration
const API_URL = process.env.VITE_API_URL || 'http://localhost:8080';
const ENDPOINTS = [
  '/',                // Root endpoint
  '/api/drinks',      // Drinks endpoint
  '/api/games',       // Games endpoint
  '/api/visitors'     // Visitors endpoint
];

// Helper to print colored status messages
const printStatus = (endpoint, success, message) => {
  const status = success 
    ? chalk.green('✓ SUCCESS') 
    : chalk.red('✗ FAILED');
  
  console.log(`${status} - ${endpoint} - ${message}`);
};

// Test a single endpoint
const testEndpoint = async (endpoint) => {
  const url = `${API_URL}${endpoint}`;
  try {
    console.log(chalk.blue(`Testing endpoint: ${url}`));
    const startTime = Date.now();
    const response = await axios.get(url);
    const duration = Date.now() - startTime;
    
    printStatus(
      endpoint, 
      true, 
      `${duration}ms - Status: ${response.status} - ${JSON.stringify(response.data).substring(0, 50)}...`
    );
    return true;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      printStatus(
        endpoint,
        false,
        `Status: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      printStatus(endpoint, false, `No response received - ${error.message}`);
    } else {
      // Something happened in setting up the request
      printStatus(endpoint, false, error.message);
    }
    return false;
  }
};

// Main function to test all endpoints
const testConnectivity = async () => {
  console.log(chalk.yellow('=== TESTING FRONTEND-BACKEND CONNECTIVITY ==='));
  console.log(chalk.blue(`API URL: ${API_URL}`));
  console.log(chalk.yellow('============================================\n'));

  let allSuccess = true;
  
  for (const endpoint of ENDPOINTS) {
    const success = await testEndpoint(endpoint);
    if (!success) allSuccess = false;
    console.log(); // Add a blank line for readability
  }
  
  console.log(chalk.yellow('============== TEST SUMMARY ==============='));
  console.log(allSuccess 
    ? chalk.green('✅ All tests passed! Frontend can connect to backend successfully.') 
    : chalk.red('❌ Some tests failed. There might be connectivity issues.'));
  
  if (!allSuccess) {
    console.log(chalk.yellow('\nTROUBLESHOOTING TIPS:'));
    console.log('1. Make sure the backend server is running');
    console.log('2. Check that the VITE_API_URL is set correctly in your .env file');
    console.log('3. Verify network connectivity and firewall settings');
    console.log('4. Check for CORS configuration issues in the backend');
  }
};

// Run the tests
testConnectivity().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});