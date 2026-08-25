/* eslint-env worker */
import init, { Cracker, initThreadPool, EnchantmentTableInfo } from "./pkg-threads/libenchcrack.js";

let initiating = false;
self.onmessage = async event => {
    if(initiating) {
        return;
    } else {
        initiating = true;
    }

    await init();
    await initThreadPool(event.data[2]);
    const cracker = new Cracker();
    self.onmessage = ev => {
        if(ev.data.length === 4) {
            cracker.addInput(new EnchantmentTableInfo(...ev.data.map(x => parseInt(x))));
            postMessage(["finished"]);
        } else if (ev.data.length === 8) {
            const a = performance.now();
            cracker.firstInput(new EnchantmentTableInfo(...ev.data.slice(0, 4).map(x => parseInt(x))), new EnchantmentTableInfo(...ev.data.slice(4).map(x => parseInt(x))));
            console.log(`${event.data[1]}: ${performance.now() - a}ms`);
            postMessage(["finished"]);
        } else if(ev.data.length === 1) {
            switch (ev.data[0]) {
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