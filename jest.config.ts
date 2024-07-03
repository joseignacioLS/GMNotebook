/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import nextJest from "next/jest.js";

const config: Config = {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom"
};

const createJestConfig = nextJest({
  dir: "./",
})


export default createJestConfig(config);
