#!/usr/bin/env bash

dir="$(dirname "${BASH_SOURCE[0]}")/.."
# Copy ES6 source file
cp $dir/src/ImageResize.js $dir/index.js
# Copy the template
cp $dir/src/es5-wrapper.js $dir/image-resize.min.js
# Compile to ES5
node $dir/node_modules/babel-cli/bin/babel.js $dir/src/ImageResize.js --presets=es2015 | $dir/node_modules/uglify-js/bin/uglifyjs -m > tmp.js
# Wrap
sed -i '' -e '/MINIFIED_JS/r tmp.js' -e '/MINIFIED_JS/d' $dir/image-resize.min.js
rm tmp.js