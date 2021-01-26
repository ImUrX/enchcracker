#!/bin/bash -e
mkdir -p temp && cd temp
git clone https://github.com/ImUrX/libenchcrack.git 2> /dev/null || ( cd libenchcrack && git pull && cd .. )

if ! command -v cargo &> /dev/null 
then
    echo "cargo doesn't exist. Install rust"
    exit 1
fi

if ! command -v jq &> /dev/null 
then
    echo "jq doesn't exist. Install jq"
    exit 1
fi
if ! command -v wasm-opt &> /dev/null 
then
    echo "wasm-opt doesn't exist. Install binaryen"
    exit 1
fi

pwd
exit 1
cd libenchcrack
#get bindgen version
BINDGENVER=$(cargo metadata --format-version 1 --filter-platform wasm32-unknown-unknown | jq '((.packages[] | select(.name == "libenchcrack")).dependencies[] | select(.name == "wasm-bindgen")).req')
BINDGENVER="${BINDGENVER:1:-1}"
#install bindgen cli
cargo install --version $BINDGENVER wasm-bindgen-cli
#compile
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
#optimize
wasm-opt -Os target/wasm32-unknown-unknown/release/libenchcrack.wasm -o ../libenchcrack.wasm
#wasm bindgen
cd ..
rm -rf wasm
wasm-bindgen --target no-modules --out-dir wasm libenchcrack.wasm

rm -rf ../../www/wasm
mv wasm ../../www
