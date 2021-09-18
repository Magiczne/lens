module.exports = {
    collectCoverageFrom: [
        '**/*.{js,ts}',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/tests/**'
    ],
    coverageDirectory: '<rootDir>/coverage',
    moduleFileExtensions: [
        'ts', 'js'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    roots: [
        '<rootDir>/src'
    ],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    }
}
