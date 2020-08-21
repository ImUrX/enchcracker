/* eslint-env worker */
/* global wasm_bindgen:readonly */
importScripts("./wasm/libenchcrack.js");

const { Cracker } = wasm_bindgen;

self.onmessage = event => {
    let cracker = wasm_bindgen("./wasm/libenchcrack_bg.wasm").then(() => 
        new Cracker(...event.data)
    ).catch(err => {
        setTimeout(() => {
            throw err;
        });
        throw err;
    });

    self.onmessage = async event => {
        // This will queue further commands up until the module is fully initialised:
        cracker = await Promise.resolve(cracker);
        if(event.data.length === 4) {
            cracker.add_input(...event.data);
        } else if (event.data.length === 8) {
            cracker.first_input(...event.data);
        } else if(event.data.length === 1) {
            switch (event.data[0]) {
            case "remaining":
                postMessage(cracker.possible_seeds());
                break;
            case "reset":
                cracker.reset();
                postMessage(true);
            }
        }
    };
};