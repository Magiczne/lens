module.exports = {
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,ts}'
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
