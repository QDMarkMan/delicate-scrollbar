/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [rollup base config].
 *-------------------------------------------------------------------------------------------- */
const path = require('path')
const buble = require('rollup-plugin-buble')
const typescript = require('rollup-plugin-typescript2')
const tslint = require('rollup-plugin-tslint')

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
      tslint({
        throwOnError: true, // lint 结果有错误将会抛出异常
        throwOnWarning: true,
        include: ['src/**/*.ts'],
        exclude: ['node_modules/**', 'lib/**', 'dist/**']
      }),
      typescript({
        tsconfig: "tsconfig.json"
      }),
      buble()
    ]
  }
]