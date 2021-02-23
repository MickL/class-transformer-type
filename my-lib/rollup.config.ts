import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import copy from 'rollup-plugin-copy';

const libraryName = 'my-lib';
const dist        = 'dist/';

const pkgMain    = libraryName + '.umd.js';
const pkhModule  = libraryName + '.es5.js';
const pkgTypings = 'types/index.d.ts';

export default {
  input:  `./src/index.ts`,
  output: [
    {file: dist + pkgMain, name: libraryName, format: 'umd', sourcemap: true},
    {file: dist + pkhModule, format: 'es', sourcemap: true},
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch:    {
    include: 'src/**',
  },
  plugins:  [
    // Compile TypeScript files
    typescript({useTsconfigDeclarationDir: true,}),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),

    // Create package.json
    generatePackageJson({
      baseContents: (pkg) => ({
        ...pkg,
        main:    pkgMain,
        module:  pkhModule,
        typings: pkgTypings,
      })
    }),

    // Copy other files into dist
    copy({
      targets: [
        {src: 'README.md', dest: dist},
      ],
    }),
  ],
};
