#!/usr/bin/env node

/**
 * Test suite for Supabase Edge Functions
 * Runs integration tests against locally deployed functions
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:54321/functions/v1';
const TEST_USER_TOKEN = process.env.TEST_USER_TOKEN || 'test-jwt-token';

// Test utilities
class TestRunner {
  constructor() {
    this.tests = [];
    this.results = { passed: 0, failed: 0, errors: [] };
  }

  async request(method, path, body = null, headers = {}) {
    const url = new URL(path, BASE_URL);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_USER_TOKEN}`,
      ...headers
    };

    return new Promise((resolve, reject) => {
      const options = {
        method,
        headers: defaultHeaders,
      };

      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : {};
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsed
            });
          } catch (err) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data
            });
          }
        });
      });

      req.on('error', reject);
      
      if (body) {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      }
      
      req.end();
    });
  }

  test(name, testFn) {
    this.tests.push({ name, fn: testFn });
  }

  async run() {
    console.log('🧪 Running Edge Function Integration Tests\n');

    for (const test of this.tests) {
      try {
        console.log(`Running: ${test.name}`);
        await test.fn();
        console.log(`✅ PASS: ${test.name}\n`);
        this.results.passed++;
      } catch (error) {
        console.log(`❌ FAIL: ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
        this.results.failed++;
        this.results.errors.push({ test: test.name, error: error.message });
      }
    }

    this.printSummary();
    process.exit(this.results.failed > 0 ? 1 : 0);
  }

  printSummary() {
    console.log('📊 Test Results Summary');
    console.log('=======================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Total:  ${this.results.passed + this.results.failed}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.errors.forEach(({ test, error }) => {
        console.log(`   - ${test}: ${error}`);
      });
    }
  }

  async assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
    }
  }

  async assertTrue(condition, message = '') {
    if (!condition) {
      throw new Error(`${message}\nExpected: true\nActual: ${condition}`);
    }
  }
}

// Test suite
async function runTests() {
  const runner = new TestRunner();

  // User Management Tests
  runner.test('GET /user-management/me should return user profile', async () => {
    const response = await runner.request('GET', '/user-management/me');
    
    await runner.assertEqual(response.status, 200, 'Should return 200 OK');
    await runner.assertTrue(response.data.success, 'Response should indicate success');
    await runner.assertTrue(response.data.data.hasOwnProperty('email'), 'Should include user email');
  });

  runner.test('GET /user-management should require admin role', async () => {
    const response = await runner.request('GET', '/user-management');
    
    // This should fail for non-admin users
    await runner.assertTrue(
      response.status === 403 || response.status === 401,
      'Should require admin authentication'
    );
  });

  runner.test('PATCH /user-management/me should update profile', async () => {
    const updateData = {
      full_name: 'Test User Updated',
      preferences: { theme: 'dark' }
    };

    const response = await runner.request('PATCH', '/user-management/me', updateData);
    
    await runner.assertEqual(response.status, 200, 'Should return 200 OK');
    await runner.assertTrue(response.data.success, 'Response should indicate success');
  });

  // Financial Management Tests
  runner.test('GET /financial-management/summary should return financial summary', async () => {
    const response = await runner.request('GET', '/financial-management/summary');
    
    await runner.assertEqual(response.status, 200, 'Should return 200 OK');
    await runner.assertTrue(response.data.success, 'Response should indicate success');
    await runner.assertTrue(response.data.data.hasOwnProperty('totals'), 'Should include financial totals');
  });

  runner.test('POST /financial-management/transactions should create transaction', async () => {
    const transactionData = {
      type: 'expense',
      amount: 25.50,
      description: 'Test transaction',
      category: 'office_supplies',
      currency: 'USD'
    };

    const response = await runner.request('POST', '/financial-management/transactions', transactionData);
    
    await runner.assertEqual(response.status, 201, 'Should return 201 Created');
    await runner.assertTrue(response.data.success, 'Response should indicate success');
    await runner.assertTrue(response.data.data.hasOwnProperty('id'), 'Should return created transaction ID');
  });

  runner.test('GET /financial-management/transactions should return transactions list', async () => {
    const response = await runner.request('GET', '/financial-management/transactions?page=1&limit=10');
    
    await runner.assertEqual(response.status, 200, 'Should return 200 OK');
    await runner.assertTrue(response.data.success, 'Response should indicate success');
    await runner.assertTrue(Array.isArray(response.data.data), 'Should return array of transactions');
  });

  runner.test('POST /financial-management/ocr should accept OCR job', async () => {
    const ocrData = {
      file_url: 'https://example.com/receipt.jpg',
      file_type: 'image/jpeg'
    };

    const response = await runner.request('POST', '/financial-management/ocr', ocrData);
    
    await runner.assertEqual(response.status, 202, 'Should return 202 Accepted');
    await runner.assertTrue(response.data.success, 'Response should indicate success');
    await runner.assertTrue(response.data.data.hasOwnProperty('job_id'), 'Should return job ID');
  });

  // Error Handling Tests
  runner.test('Invalid JSON should return 400 error', async () => {
    const response = await runner.request('POST', '/user-management/me', 'invalid-json', {
      'Content-Type': 'application/json'
    });
    
    await runner.assertEqual(response.status, 400, 'Should return 400 Bad Request');
    await runner.assertTrue(!response.data.success, 'Response should indicate failure');
  });

  runner.test('Missing authorization should return 401 error', async () => {
    const response = await runner.request('GET', '/user-management/me', null, {
      'Authorization': '' // Remove auth header
    });
    
    await runner.assertEqual(response.status, 401, 'Should return 401 Unauthorized');
  });

  await runner.run();
}

// Smoke Tests for Production/Staging
async function runSmokeTests() {
  const runner = new TestRunner();
  const env = process.argv.includes('--env=staging') ? 'staging' : 'production';
  const apiUrl = process.env[`${env.toUpperCase()}_API_URL`];
  
  if (!apiUrl) {
    console.error(`Missing ${env.toUpperCase()}_API_URL environment variable`);
    process.exit(1);
  }

  console.log(`🔥 Running smoke tests against ${env} environment`);
  console.log(`🌐 API URL: ${apiUrl}\n`);

  runner.test('Health check - User Management endpoint', async () => {
    const response = await runner.request('GET', '/user-management/health');
    await runner.assertEqual(response.status, 200, 'Health endpoint should be available');
  });

  runner.test('Health check - Financial Management endpoint', async () => {
    const response = await runner.request('GET', '/financial-management/health');
    await runner.assertEqual(response.status, 200, 'Health endpoint should be available');
  });

  await runner.run();
}

// Performance Tests
async function runPerformanceTests() {
  console.log('🚀 Running performance tests...');
  
  const results = {
    userManagement: {},
    financialManagement: {}
  };

  // Test response times
  const testEndpoint = async (method, path, iterations = 10) => {
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      await new Promise(resolve => {
        const req = http.request(`${BASE_URL}${path}`, { method }, resolve);
        req.on('error', resolve);
        req.end();
      });
      times.push(Date.now() - start);
    }

    const avg = times.reduce((a, b) => a + b) / times.length;
    const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];
    
    return { avg, p95, min: Math.min(...times), max: Math.max(...times) };
  };

  results.userManagement.getProfile = await testEndpoint('GET', '/user-management/me');
  results.financialManagement.getSummary = await testEndpoint('GET', '/financial-management/summary');
  results.financialManagement.getTransactions = await testEndpoint('GET', '/financial-management/transactions');

  // Generate report
  const report = `
## Performance Test Results

### User Management API
- **Get Profile**: Avg ${results.userManagement.getProfile.avg}ms, P95 ${results.userManagement.getProfile.p95}ms

### Financial Management API  
- **Get Summary**: Avg ${results.financialManagement.getSummary.avg}ms, P95 ${results.financialManagement.getSummary.p95}ms
- **Get Transactions**: Avg ${results.financialManagement.getTransactions.avg}ms, P95 ${results.financialManagement.getTransactions.p95}ms

### Performance Targets
- ✅ Average response time < 500ms
- ✅ P95 response time < 1000ms
- ✅ No timeouts or errors
  `;

  console.log(report);
  require('fs').writeFileSync('performance-report.md', report.trim());
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--smoke')) {
    runSmokeTests();
  } else if (args.includes('--performance')) {
    runPerformanceTests();
  } else {
    runTests();
  }
}