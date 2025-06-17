const { createGlobPatternsForDependencies } = require('@nx/jest');

module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@domain/(.*)$': '<rootDir>/src/app/domain/$1',
    '^@entities/(.*)$': '<rootDir>/src/app/domain/entities/$1',
    '^@services/(.*)$': '<rootDir>/src/app/domain/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/app/domain/repositories/$1',
    '^@exceptions/(.*)$': '<rootDir>/src/app/domain/exceptions/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/app/infrastructure/$1',
    '^@adapters/(.*)$': '<rootDir>/src/app/infrastructure/adapters/$1',
    '^@persistence/(.*)$':
      '<rootDir>/src/app/infrastructure/adapters/persistence/$1',
    '^@mongodb/(.*)$':
      '<rootDir>/src/app/infrastructure/adapters/persistence/mongodb/$1',
    '^@web/(.*)$': '<rootDir>/src/app/infrastructure/adapters/web/$1',
    '^@controllers/(.*)$':
      '<rootDir>/src/app/infrastructure/adapters/web/controllers/$1',
    '^@dto/(.*)$': '<rootDir>/src/app/infrastructure/adapters/web/dto/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@gym/(.*)$': '<rootDir>/src/gym/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!src/**/index.ts',
  ],
  globalSetup: undefined,
  globalTeardown: undefined,
  setupFilesAfterEnv: [],
  testTimeout: 10000,
};
