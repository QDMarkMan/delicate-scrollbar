/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [rollup base config].
 *-------------------------------------------------------------------------------------------- */
const path = require('path')
const buble = require('rollup-plugin-buble')
const typescript = require('rollup-plugin-typescript2')
const alias = require('@rollup/plugin-alias')

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

module.exports = [
  {
    input: resolveFile('src/index.ts'),
    output: {
      file: resolveFile('dist/index.js'),
      format: 'umd',
      sourceMap: process.env.NODE_ENV === 'development' ? 'inline' : false
    },
    plugins: [
       // 验证导入的文件
      // eslint({
      //   throwOnError: true, // lint 结果有错误将会抛出异常
      //   throwOnWarning: true,
      //   include: ['src/**/*.ts'],
      //   exclude: ['node_modules/**', 'lib/**', 'dist/**',,'*.js'],
			// }),
			alias({
				entries: [
					{ find: '@', replacement: '../src' },
					{ find: 'core', replacement: '../src/core' }
				]
			}),
      typescript({
        tsconfig: "tsconfig.json"
      }),
      buble()
    ]
  }
]
