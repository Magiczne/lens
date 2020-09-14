module.exports = {
    collectCoverageFrom: [
        "**/*.{js,ts}",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/tests/**"
    ],
    coverageDirectory: '<rootDir>/tests/coverage',
    moduleFileExtensions: [
        'ts', 'js'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    roots: [
        '<rootDir>/src',
        '<rootDir>/tests'
    ],
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    }
}
