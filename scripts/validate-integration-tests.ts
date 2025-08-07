#!/usr/bin/env bun

/**
 * Integration Test Validation Script
 * Validates that the PropertyFinder JSON import integration tests are working correctly
 * 
 * This script:
 * - Verifies test environment setup
 * - Runs integration tests with sample data
 * - Validates test results and coverage
 * - Provides detailed reporting
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

interface TestValidationResult {
  success: boolean;
  testsPassed: number;
  testsFailed: number;
  testsSkipped: number;
  coverage?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  errors: string[];
  warnings: string[];
}

class IntegrationTestValidator {
  private results: TestValidationResult = {
    success: false,
    testsPassed: 0,
    testsFailed: 0,
    testsSkipped: 0,
    errors: [],
    warnings: []
  };

  /**
   * Main validation function
   */
  async validate(): Promise<TestValidationResult> {
    console.log('🧪 Starting PropertyFinder JSON Import Integration Test Validation...\n');

    try {
      // Step 1: Verify test environment
      await this.verifyTestEnvironment();

      // Step 2: Verify test files exist
      await this.verifyTestFiles();

      // Step 3: Run integration tests
      await this.runIntegrationTests();

      // Step 4: Validate test results
      await this.validateTestResults();

      // Step 5: Generate final report
      this.generateFinalReport();

      this.results.success = this.results.testsFailed === 0 && this.results.errors.length === 0;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Critical error during validation:', errorMessage);
      this.results.errors.push(`Critical validation error: ${errorMessage}`);
      this.results.success = false;
    }

    return this.results;
  }

  /**
   * Verify test environment setup
   */
  private async verifyTestEnvironment(): Promise<void> {
    console.log('🔍 Verifying test environment setup...');

    // Check Node.js version
    try {
      const nodeVersion = process.version;
      console.log(`✅ Node.js version: ${nodeVersion}`);
    } catch (error) {
      this.results.errors.push('Failed to get Node.js version');
    }

    // Check database connection
    try {
      const { db } = await import('../db/drizzle');
      await db.execute('SELECT 1');
      console.log('✅ Database connection verified');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.errors.push(`Database connection failed: ${errorMessage}`);
      this.results.warnings.push('Integration tests may fail without database connection');
    }

    // Check required environment variables
    const requiredEnvVars = ['DATABASE_URL'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        this.results.warnings.push(`Environment variable ${envVar} not set`);
      } else {
        console.log(`✅ Environment variable ${envVar} is set`);
      }
    }

    console.log('✅ Test environment verification completed\n');
  }

  /**
   * Verify all required test files exist
   */
  private async verifyTestFiles(): Promise<void> {
    console.log('📁 Verifying test files exist...');

    const requiredFiles = [
      'actions/__tests__/import-propertyfinder-json-integration.test.ts',
      'jest.integration.config.js',
      'jest.integration.setup.js',
      'jest.integration.globalSetup.js',
      'jest.integration.globalTeardown.js'
    ];

    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        console.log(`✅ Found: ${file}`);
      } catch (error) {
        this.results.errors.push(`Missing required test file: ${file}`);
      }
    }

    // Verify main import action exists
    try {
      await fs.access('actions/import-propertyfinder-json-action.ts');
      console.log('✅ Found: actions/import-propertyfinder-json-action.ts');
    } catch (error) {
      this.results.errors.push('Missing main import action file');
    }

    console.log('✅ Test file verification completed\n');
  }

  /**
   * Run integration tests
   */
  private async runIntegrationTests(): Promise<void> {
    console.log('🚀 Running integration tests...');

    try {
      // Run integration tests with detailed output
      const testCommand = 'npm run test:integration -- --verbose --detectOpenHandles';
      console.log(`Executing: ${testCommand}`);

      const output = execSync(testCommand, {
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 300000 // 5 minutes timeout
      });

      console.log('📊 Test output:');
      console.log(output);

      // Parse test results from output
      this.parseTestOutput(output);

    } catch (error: any) {
      const errorMessage = error.message || String(error);
      const output = error.stdout || error.stderr || '';
      
      console.error('❌ Integration tests failed:');
      console.error(output);

      // Try to parse results even from failed output
      if (output) {
        this.parseTestOutput(output);
      }

      this.results.errors.push(`Integration test execution failed: ${errorMessage}`);
    }

    console.log('✅ Integration test execution completed\n');
  }

  /**
   * Parse test output to extract results
   */
  private parseTestOutput(output: string): void {
    // Parse Jest output for test results
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    const skippedMatch = output.match(/(\d+) skipped/);

    if (passedMatch) {
      this.results.testsPassed = parseInt(passedMatch[1], 10);
    }

    if (failedMatch) {
      this.results.testsFailed = parseInt(failedMatch[1], 10);
    }

    if (skippedMatch) {
      this.results.testsSkipped = parseInt(skippedMatch[1], 10);
    }

    // Parse coverage information if available
    const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
    if (coverageMatch) {
      this.results.coverage = {
        statements: parseFloat(coverageMatch[1]),
        branches: parseFloat(coverageMatch[2]),
        functions: parseFloat(coverageMatch[3]),
        lines: parseFloat(coverageMatch[4])
      };
    }
  }

  /**
   * Validate test results
   */
  private async validateTestResults(): Promise<void> {
    console.log('🔍 Validating test results...');

    // Check if any tests ran
    const totalTests = this.results.testsPassed + this.results.testsFailed + this.results.testsSkipped;
    if (totalTests === 0) {
      this.results.errors.push('No tests were executed');
      return;
    }

    // Validate minimum test coverage
    const expectedTests = [
      'Complete Import Process with Sample JSON Data',
      'Database Record Creation Verification',
      'Luxury Property Image Processing',
      'Error Handling with Malformed Data',
      'Performance and Reliability'
    ];

    console.log(`✅ Total tests executed: ${totalTests}`);
    console.log(`✅ Tests passed: ${this.results.testsPassed}`);
    
    if (this.results.testsFailed > 0) {
      console.log(`❌ Tests failed: ${this.results.testsFailed}`);
    }
    
    if (this.results.testsSkipped > 0) {
      console.log(`⏭️ Tests skipped: ${this.results.testsSkipped}`);
    }

    // Validate coverage if available
    if (this.results.coverage) {
      console.log('📊 Test coverage:');
      console.log(`  Statements: ${this.results.coverage.statements}%`);
      console.log(`  Branches: ${this.results.coverage.branches}%`);
      console.log(`  Functions: ${this.results.coverage.functions}%`);
      console.log(`  Lines: ${this.results.coverage.lines}%`);

      if (this.results.coverage.statements < 70) {
        this.results.warnings.push('Statement coverage below 70%');
      }
    }

    console.log('✅ Test result validation completed\n');
  }

  /**
   * Generate final validation report
   */
  private generateFinalReport(): void {
    console.log('📋 INTEGRATION TEST VALIDATION REPORT');
    console.log('=====================================\n');

    // Overall status
    if (this.results.success) {
      console.log('✅ VALIDATION PASSED - Integration tests are working correctly\n');
    } else {
      console.log('❌ VALIDATION FAILED - Issues found with integration tests\n');
    }

    // Test statistics
    console.log('📊 Test Statistics:');
    console.log(`  Total Tests: ${this.results.testsPassed + this.results.testsFailed + this.results.testsSkipped}`);
    console.log(`  Passed: ${this.results.testsPassed}`);
    console.log(`  Failed: ${this.results.testsFailed}`);
    console.log(`  Skipped: ${this.results.testsSkipped}`);

    if (this.results.testsPassed > 0) {
      const successRate = (this.results.testsPassed / (this.results.testsPassed + this.results.testsFailed)) * 100;
      console.log(`  Success Rate: ${successRate.toFixed(1)}%`);
    }

    // Coverage information
    if (this.results.coverage) {
      console.log('\n📈 Coverage:');
      console.log(`  Statements: ${this.results.coverage.statements}%`);
      console.log(`  Branches: ${this.results.coverage.branches}%`);
      console.log(`  Functions: ${this.results.coverage.functions}%`);
      console.log(`  Lines: ${this.results.coverage.lines}%`);
    }

    // Errors
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    // Warnings
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.results.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (this.results.testsFailed > 0) {
      console.log('  - Review failed tests and fix underlying issues');
    }
    if (this.results.coverage && this.results.coverage.statements < 80) {
      console.log('  - Consider adding more test cases to improve coverage');
    }
    if (this.results.errors.length === 0 && this.results.testsFailed === 0) {
      console.log('  - Integration tests are working well!');
      console.log('  - Consider running tests regularly as part of CI/CD pipeline');
    }

    console.log('\n=====================================');
  }
}

// Main execution
async function main() {
  const validator = new IntegrationTestValidator();
  const results = await validator.validate();

  // Exit with appropriate code
  process.exit(results.success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

export { IntegrationTestValidator, type TestValidationResult };