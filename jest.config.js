module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    testMatch: ['**/tests/**/*.test.ts'], // <--- change from __tests__ to tests
  };
  
 