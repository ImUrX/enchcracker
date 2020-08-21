const workers = [];
for(let i = 0; i < navigator.hardwareConcurrency; i++) {
    const worker = new Worker("./../worker.js");
    worker.postMessage([i, navigator.hardwareConcurrency]);
    workers.push(worker);
}