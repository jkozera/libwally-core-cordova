echo no | android create avd --force -n test -t android-21 --abi default/armeabi-v7a
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y python-software-properties
sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
sudo apt-get update
sudo apt-get install -y nodejs gcc-5 g++-5 netcat-traditional
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-5 80 --slave /usr/bin/g++ g++ /usr/bin/g++-5
sudo update-alternatives --set gcc /usr/bin/gcc-5
sudo npm i -g cordova
curl -O http://dl.google.com/android/repository/android-ndk-r13b-linux-x86_64.zip
unzip -qq ./android-ndk-r13b-linux-x86_64.zip
export ANDROID_NDK=`pwd`/android-ndk-r13b

./libwally-core/src/swig_js/cordovaplugin/plugin_add.sh armeabi-v7a

cd plugins/cordova-plugin-wally
mkdir -p jniLibs/arm64-v8a && touch jniLibs/arm64-v8a/libwallycore.so
mkdir -p jniLibs/armeabi && touch jniLibs/armeabi/libwallycore.so
mkdir -p jniLibs/mips && touch jniLibs/mips/libwallycore.so
mkdir -p jniLibs/mips64 && touch jniLibs/mips64/libwallycore.so
mkdir -p jniLibs/x86 && touch jniLibs/x86/libwallycore.so
mkdir -p jniLibs/x86_64 && touch jniLibs/x86_64/libwallycore.so
cd ../..
sudo npm i -g browserify
npm i stringify base64-js tape
browserify -t stringify -r ./plugins/cordova-plugin-wally/wally.js:../wally -r ./libwally-core/src/swig_js/test/test_hash.js:./test_hash -r ./libwally-core/src/swig_js/test/test_base58.js:./test_base58 -r ./libwally-core/src/swig_js/test/test_aes.js:./test_aes -r ./libwally-core/src/swig_js/test/test_scrypt.js:./test_scrypt  -r ./libwally-core/src/swig_js/test/test_bip38.js:./test_bip38 www/js/index.js -r ./libwally-core/src/swig_js/test/test_bip32.js:./test_bip32 --im > www/js/index_built.js
cordova prepare android
git clone https://github.com/novnc/websockify.git;
