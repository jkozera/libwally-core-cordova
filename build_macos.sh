brew update > /dev/null
brew install socat
npm i -g cordova
./libwally-core/src/swig_js/cordovaplugin/plugin_add.sh
npm i stringify browserify base64-js tape
./node_modules/.bin/browserify -t stringify -r ./plugins/cordova-plugin-wally/wally.js:../wally -r ./libwally-core/src/swig_js/test/test_hash.js:./test_hash -r ./libwally-core/src/swig_js/test/test_base58.js:./test_base58 www/js/index.js -r ./libwally-core/src/swig_js/test/test_aes.js:./test_aes -r ./libwally-core/src/swig_js/test/test_scrypt.js:./test_scrypt -r ./libwally-core/src/swig_js/test/test_bip38.js:./test_bip38 -r ./libwally-core/src/swig_js/test/test_bip32.js:./test_bip32 --im > www/js/index_built.js
git clone https://github.com/novnc/websockify.git;
