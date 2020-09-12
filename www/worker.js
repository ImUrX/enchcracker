/* eslint-env worker */
/* global wasm_bindgen:readonly */
importScripts("./wasm/libenchcrack.js");

/**
 * @typedef wasm_bindgen
 * @property {typeof import("./wasm/libenchcrack").Cracker} Cracker
 * @property {typeof import("../wasm/libenchcrack").EnchantmentTableInfo} EnchantmentTableInfo
 */

/**
 * @type {wasm_bindgen}
 */
const { Cracker, EnchantmentTableInfo } = wasm_bindgen;

self.onmessage = event => {
    /**
     * @type {import("./wasm/libenchcrack").Cracker}
     */
    let cracker = wasm_bindgen(event.data[0]).then(() => 
        new Cracker(...event.data.slice(1))
    ).catch(err => {
        setTimeout(() => {
            throw err;
        });
        throw err;
    });

    self.onmessage = async event => {
        cracker = await Promise.resolve(cracker);

        if(event.data.length === 4) {
            cracker.addInput(new EnchantmentTableInfo(...event.data));
            postMessage(["finished"]);
        } else if (event.data.length === 8) {
            cracker.firstInput(new EnchantmentTableInfo(...event.data.slice(0, 4)), new EnchantmentTableInfo(...event.data.slice(4)));
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