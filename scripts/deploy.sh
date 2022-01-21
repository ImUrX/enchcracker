#!/bin/bash -e
if ! command -v cargo &> /dev/null 
then
    echo "cargo doesn't exist. Install rust"
    exit 1
fi

if ! command -v wasm-pack &> /dev/null 
then
    echo "wasm-pack doesn't exist. Install wasm-pack"
    exit 1
fi

cd $(git rev-parse --show-toplevel)/libenchcrack
#compile

#workers
rustup target add wasm32-unknown-unknown
rustup component add rust-src
wasm-pack build --release -t web

#rayon
rustup toolchain install nightly-2021-07-29
rustup run nightly-2021-07-29 \
    rustup component add rust-src \
RUSTFLAGS='-C target-feature=+atomics,+bulk-memory,+mutable-globals' \
    rustup run nightly-2021-07-29 \
    wasm-pack build --release -t web -d pkg-threads \
	-- --features threads -Z build-std=panic_abort,std

rm pkg*/.gitignore
rm -rf ../www/pkg/ ../www/pkg-threads/
mv pkg ../www/
mv pkg-threads ../www/
ls ../www/
