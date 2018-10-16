import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import url from 'rollup-plugin-url'
import image from 'rollup-plugin-img'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
      
    }),
    resolve({ preferBuiltins: true }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType'],
        'node_modules/computed-async-mobx/built/src/index.js': ['asyncComputed'],
        'node_modules/aragon-datastore/dist/index.js': ['Datastore', 'providers']
      }
    }),
    json(),
    image({ limit: 20000 })
  ]
}
