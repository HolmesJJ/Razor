/** @type {JestConfiguration} */
module.exports = {
  verbose: true,
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(j|t)sx?$",
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
    "vue"
  ],
  moduleNameMapper: {
    "rz/(.*)": "<rootDir>/src/$1",
    "pkg/(.*)": "<rootDir>/packages/$1",
    "doc/(.*)": "<rootDir>/doc/src/$1"
  },
  resolver: "./build/lib/resolver.js",
  transform: {
    "\\.jsx?$": "babel-jest",
    "\\.tsx?$": "ts-jest",
    "\\.vue$": "vue-jest"
  },
  // Allow modules in node_modules can be transformed
  transformIgnorePatterns: [],
  testURL: "http://localhost/"
}

// {
// 	testRegex: "/__tests__/(.*|(\\.|/)(test|spec))\\.(j|t)sx?$",
// 	moduleFileExtensions: [
// 		"js",
// 		"json",
// 		"ts",
// 		"vue"
// 	],
// 	moduleNameMapper: {
// 		"rz/(.*)": "./src/$1",
// 		"pkg/(.*)": "./packages/$1",
// 		"doc/(.*)": "./doc/src/$1"
// 	},
// 	resolver: "./resolver.js",
// 	transform: {
// 		"\\.jsx?$": "babel-jest",
// 		"\\.tsx?$": "ts-jest",
// 		"\\.vue$": "vue-jest"
// 	},
// 	testURL: "http://localhost/"
// };

/**
 * @typedef {Partial<{
 * 	all: boolean;
 * 	automock: boolean;
 * 	bail: number | boolean;
 * 	browser: boolean;
 * 	cache: boolean;
 * 	cacheDirectory: string;
 * 	changedFilesWithAncestor: boolean;
 * 	changedSince: string;
 * 	ci: boolean;
 * 	clearCache: boolean;
 * 	clearMocks: boolean;
 * 	collectCoverage: boolean;
 * 	collectCoverageFrom: string;
 * 	collectCoverageOnlyFrom: string[];
 * 	color: boolean;
 * 	colors: boolean;
 * 	config: string;
 * 	coverage: boolean;
 * 	coverageDirectory: string;
 * 	coveragePathIgnorePatterns: string[];
 * 	coverageReporters: string[];
 * 	coverageThreshold: string;
 * 	debug: boolean;
 * 	env: string;
 * 	expand: boolean;
 * 	findRelatedTests: boolean;
 * 	forceExit: boolean;
 * 	globals: string;
 * 	globalSetup: string | null | undefined;
 * 	globalTeardown: string | null | undefined;
 * 	haste: string;
 * 	init: boolean;
 * 	json: boolean;
 * 	lastCommit: boolean;
 * 	logHeapUsage: boolean;
 * 	maxWorkers: number;
 * 	moduleDirectories: string[];
 * 	moduleFileExtensions: string[];
 * 	moduleNameMapper: string;
 * 	modulePathIgnorePatterns: string[];
 * 	modulePaths: string[];
 * 	noStackTrace: boolean;
 * 	notify: boolean;
 * 	notifyMode: string;
 * 	onlyChanged: boolean;
 * 	outputFile: string;
 * 	preset: string | null | undefined;
 * 	projects: string[];
 * 	prettierPath: string | null | undefined;
 * 	resetMocks: boolean;
 * 	resetModules: boolean;
 * 	resolver: string | null | undefined;
 * 	restoreMocks: boolean;
 * 	rootDir: string;
 * 	roots: string[];
 * 	runInBand: boolean;
 * 	setupFiles: string[];
 * 	setupFilesAfterEnv: string[];
 * 	showConfig: boolean;
 * 	silent: boolean;
 * 	snapshotSerializers: string[];
 * 	testEnvironment: string;
 * 	testFailureExitCode: string | null | undefined;
 * 	testMatch: string[];
 * 	testNamePattern: string;
 * 	testPathIgnorePatterns: string[];
 * 	testPathPattern: string[];
 * 	testRegex: string | string[];
 * 	testResultsProcessor: string | null | undefined;
 * 	testRunner: string;
 * 	testSequencer: string;
 * 	testURL: string;
 * 	timers: string;
 * 	transform: string;
 * 	transformIgnorePatterns: string[];
 * 	unmockedModulePathPatterns: string[] | null | undefined;
 * 	updateSnapshot: boolean;
 * 	useStderr: boolean;
 * 	verbose: boolean | null | undefined;
 * 	version: boolean;
 * 	watch: boolean;
 * 	watchAll: boolean;
 * 	watchman: boolean;
 * 	watchPathIgnorePatterns: string[];
 * }>} JestConfiguration
 * @see {@link "jest-cli/build/index.d.ts"}
 */
