import dotenv from 'dotenv';
dotenv.config();

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
  },
  moduleNameMapper: {
    '^@src/(.*)': '<rootDir>/src/$1',
    '^@components/(.*)': '<rootDir>/src/components/$1',
    '^@core/(.*)': '<rootDir>/src/core/$1',
  },
};
