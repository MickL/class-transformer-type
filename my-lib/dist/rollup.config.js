"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const plugin_commonjs_1 = require("@rollup/plugin-commonjs");
const rollup_plugin_sourcemaps_1 = require("rollup-plugin-sourcemaps");
const rollup_plugin_typescript2_1 = require("rollup-plugin-typescript2");
const rollup_plugin_generate_package_json_1 = require("rollup-plugin-generate-package-json");
const rollup_plugin_copy_1 = require("rollup-plugin-copy");
const libraryName = 'my-lib';
const dist = 'dist/';
const pkgMain = libraryName + '.umd.js';
const pkhModule = libraryName + '.es5.js';
const pkgTypings = 'types/index.d.ts';
exports.default = {
    input: `./src/index.ts`,
    output: [
        { file: dist + pkgMain, name: libraryName, format: 'umd', sourcemap: true },
        { file: dist + pkhModule, format: 'es', sourcemap: true },
    ],
    external: [],
    watch: {
        include: 'src/**',
    },
    plugins: [
        rollup_plugin_typescript2_1.default({ useTsconfigDeclarationDir: true, }),
        plugin_commonjs_1.default(),
        plugin_node_resolve_1.default(),
        rollup_plugin_sourcemaps_1.default(),
        rollup_plugin_generate_package_json_1.default({
            baseContents: (pkg) => (Object.assign(Object.assign({}, pkg), { main: pkgMain, module: pkhModule, typings: pkgTypings }))
        }),
        rollup_plugin_copy_1.default({
            targets: [
                { src: 'README.md', dest: dist },
            ],
        }),
    ],
};
//# sourceMappingURL=rollup.config.js.map