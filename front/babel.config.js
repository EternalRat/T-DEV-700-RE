module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		'react-native-reanimated/plugin',
		[
			'module:react-native-dotenv',
			{
				moduleName: '@env',
				path: '.env',
			},
		],
	],
	env: {
		production: {
			plugins: [
				'transform-remove-console',
				'minify-dead-code-elimination',
				'transform-minify-booleans',
				'transform-node-env-inline',
				'lodash',
				['import', { libraryName: 'antd' }, 'antd'],
				['import', { libraryName: 'lodash' }, 'lodash'],
			],
		},
		test: {
			plugins: [
				['@babel/plugin-proposal-private-methods', { loose: true }],
			],
		},
	},
};
