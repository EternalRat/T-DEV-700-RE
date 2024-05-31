module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort'],
	ignorePatterns: ['.*rc.js', '**/*.config.js'],
	env: {
		node: true,
		es2021: true,
		jest: true,
	},
	globals: {
		NodeJS: true,
	},
	rules: {
		'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
		'no-unused-vars': 'off',
		'no-prototype-builtins': 'off',
		'no-redeclare': 'off',
		indent: 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
			},
		],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
	},
};
