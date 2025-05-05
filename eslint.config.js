/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['apps/client/tsconfig.json', 'apps/server/tsconfig.json'], // adjust if you have multiple tsconfigs
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'import'],
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    ignorePatterns: ['dist', 'build', 'node_modules'],
    rules: {
        // Customize here
        'react/react-in-jsx-scope': 'off', // Next.js or Vite doesn't need React import
        'react/prop-types': 'off',
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
        'eqeqeq': ['warn', 'always'],
        'import/prefer-default-export': 'off',
    },
};
