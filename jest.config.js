module.exports = {
    preset: 'jest-preset-angular',
    roots: ['src'],
    moduleNameMapper: {},
    transform: {'^.+.(ts|mjs|js|html)$': 'jest-preset-angular'},
    transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
};