module.exports = {
    preset: 'jest-preset-angular',
    roots: ['src'],
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest',
    },
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/app/$1',
        '@components/(.*)': '<rootDir>/src/app/components/$1',
        '@enums/(.*)': '<rootDir>/src/app/enums/$1',
        '@guards/(.*)': '<rootDir>/src/app/guards/$1',
        '@handlers/(.*)': '<rootDir>/src/app/handlers/$1',
        '@models/(.*)': '<rootDir>/src/app/models/$1',
        '@modules/(.*)': '<rootDir>/src/app/modules/$1',
        '@resolvers/(.*)': '<rootDir>/src/app/resolvers/$1',
        '@service/(.*)': '<rootDir>/src/app/services/$1',
        '@store/(.*)': '<rootDir>/src/app/store/$1',
        '@assets/(.*)': '<rootDir>/src/assets/$1',
        '@env': '<rootDir>/src/environments/environment',
    },
    transformIgnorePatterns: ['node_modules/(?!(jest-test))']
};