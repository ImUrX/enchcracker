/* eslint-env worker */
/* global wasm_bindgen:readonly */
importScripts("./wasm/libenchcrack.js");

const { Cracker } = wasm_bindgen;

/**
 * @typedef {import("./wasm/libenchcrack.js").Cracker} Cracker
 */
self.onmessage = event => {
    /**
     * @type {Cracker}
     */
    let cracker = wasm_bindgen("./wasm/libenchcrack_bg.wasm").then(() => 
        new Cracker(...event.data)
    ).catch(err => {
        setTimeout(() => {
            throw err;
        });
        throw err;
    });

    self.onmessage = async event => {
        cracker = await Promise.resolve(cracker);

        if(event.data.length === 4) {
            cracker.addInput(...event.data);
            postMessage(["finished"]);
        } else if (event.data.length === 8) {
            cracker.firstInput(...event.data);
            postMessage(["finished"]);
        } else if(event.data.length === 1) {
            switch (event.data[0]) {
            case "remaining":
                postMessage(["remaining", cracker.possibleSeeds]);
                break;
            case "reset":
                cracker.reset();
                postMessage(["reset", true]);
                break;
            case "seed":
                postMessage(["seed", cracker.seed]);
            }
        }
    };
};