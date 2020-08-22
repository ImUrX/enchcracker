import { WorkerPool } from "./pool.js";
const pool = new WorkerPool("../worker.js");
window.pool = pool;

window.onload = async () => {

    //Crack seed
    document.querySelector("#calc-seed").addEventListener("submit", ev => {
        ev.preventDefault();
        const seeds = [
            parseInt(document.querySelector("#seed1").value, 16),
            parseInt(document.querySelector("#seed2").value, 16)
        ];
        console.log(seeds);
    });
};
