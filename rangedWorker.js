/* eslint-env worker */
import init, { Cracker, EnchantmentTableInfo } from "./pkg/libenchcrack.js";

self.onmessage = event => {
    let cracker = init(event.data[0]).then(() => 
        new Cracker(...event.data.slice(1))
    ).catch(err => {
        throw err;
    });

    self.onmessage = async ev => {
        cracker = await cracker;

        if(ev.data.length === 4) {
            cracker.addInput(new EnchantmentTableInfo(...ev.data));
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