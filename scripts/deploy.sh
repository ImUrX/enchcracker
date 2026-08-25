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
rustup toolchain install nightly-2026-08-20
rustup run nightly-2026-08-20 \
    rustup component add rust-src
RUSTFLAGS='-C target-feature=+atomics,+bulk-memory
    -Clink-arg=--shared-memory -Clink-arg=--max-memory=1073741824 -Clink-arg=--import-memory
    -Clink-arg=--export=__wasm_init_tls -Clink-arg=--export=__tls_size
    -Clink-arg=--export=__tls_align -Clink-arg=--export=__tls_base' \
    rustup run nightly-2026-08-20 \
    wasm-pack build --release -t web -d pkg-threads \
	-- --features threads -Z build-std=panic_abort,std

rm pkg*/.gitignore
rm -rf ../www/pkg/ ../www/pkg-threads/
mv pkg ../www/
mv pkg-threads ../www/
ls ../www/
