/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
const webpack = require("webpack");

const distPath = path.resolve(__dirname, 'dist');

class WhenDoneCopyToHiplotStaticDir {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('WhenDoneCopyToHiplotStaticDir', (
      stats /* stats is passed as argument when done hook is tapped.  */
    ) => {
      var pyBuilt = path.resolve(__dirname, 'hiplot', 'static', 'built');
      try {
          fs.mkdirSync(pyBuilt, {recursive: true});
      } catch (err) { /* `recursive` option is node >= 10.0. Otherwise will throw if the directory already exists */ }
      fs.copyFileSync(path.resolve(distPath, 'hiplot.bundle.js'), path.resolve(pyBuilt, 'hiplot.bundle.js'));
    });
  }
}


module.exports = {
    entry: {
      'hiplot': './src/hiplot.tsx',
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.svg', '.scss'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000000, // Convert images < 1MB to base64 strings
                        name: 'images/[hash]-[name].[ext]'
                    }
                }]
            },
            {
              test: /\.s(a|c)ss$/,
              exclude: /\.module.(s(a|c)ss)$/,
              loader: [
                'style-loader',
                'css-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true
                  }
                }
              ]
            },
            {
              test: /\.css$/i,
              use: [
                "style-loader",
                "@teamsupercell/typings-for-css-modules-loader",
                {
                  loader: "css-loader",
                  options: {
                    modules: {
                      localIdentName: '[local]__[hash:base64:5]',
                    }
                  }
                },
              ]
            },
            { parser: { amd: false } },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                query: {
                "compilerOptions": {
                    /* Basic Options */
                    // "incremental": true,                   /* Enable incremental compilation */
                    "target": "ES2018",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
                    "module": "es2015",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
                    // "lib": [],                             /* Specify library files to be included in the compilation. */
                    // "allowJs": true,                       /* Allow javascript files to be compiled. */
                    "checkJs": false,                       /* Report errors in .js files. */
                    "jsx": "react",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
                    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
                    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
                    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
                    // "outFile": "./",                       /* Concatenate and emit output to single file. */
                    "outDir": "./dist",        /* Redirect output structure to the directory. */
                    // "rootDir": "",                         /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
                    // "composite": true,                     /* Enable project compilation */
                    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
                    // "removeComments": true,                /* Do not emit comments to output. */
                    // "noEmit": true,                        /* Do not emit outputs. */
                    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
                    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
                    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

                    /* Strict Type-Checking Options */
                    "strict": false,                           /* Enable all strict type-checking options. */
                    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
                    // "strictNullChecks": true,              /* Enable strict null checks. */
                    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
                    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
                    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
                    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
                    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

                    /* Additional Checks */
                    // "noUnusedLocals": true,                /* Report errors on unused locals. */
                    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
                    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
                    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

                    /* Module Resolution Options */
                    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
                    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
                    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
                    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
                    // "typeRoots": [],                       /* List of folders to include type definitions from. */
                    // "types": [],                           /* Type declaration files to be included in compilation. */
                    "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
                    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
                    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
                    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

                    /* Source Map Options */
                    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
                    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
                    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
                    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

                    /* Experimental Options */
                    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
                    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

                    /* Advanced Options */
                    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
                  },
                }
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
              test: /\.worker\.js$/,
              use: { loader: 'worker-loader' }
            }
        ],
    },
    stats: {
        colors: true
    },
    plugins: [
      new LicenseWebpackPlugin(),
      new webpack.BannerPlugin(
" Copyright (c) Facebook, Inc. and its affiliates.\n\n\
 This source code is licensed under the MIT license found in the\n\
 LICENSE file in the root directory of this source tree."),
      new WhenDoneCopyToHiplotStaticDir()
    ],
    devtool: 'source-map'
};
