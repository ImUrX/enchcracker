export class WorkerPool {
    constructor(workerPath) {
        /**
         * Worker pool
         * @type {Worker[]}
         */
        this.workers = [];
        /**
         * Amount of threads that navigator told at start
         * @type {Number}
         */
        this.threads = navigator.hardwareConcurrency;
        /**
         * Path to the worker.js file
         * @type {String}
         */
        this.workerPath = workerPath;

        for(let i = 0; i < this.threads; i++) {
            const worker = this.initializeWorker(i);
            this.workers.push(worker);
        }
    }

    /**
     * Initializes a new worker
     * @param {Number} id Worker id
     * @returns {Worker}
     */
    initializeWorker(id) {
        const worker = new Worker(this.workerPath);
        worker.postMessage([id, this.threads]);
        return worker;
    }

    /**
     * Checks the array so it can reinitialize workers
     * @param  {...Boolean[]} broken
     */
    checkWorkers(...broken) {
        broken.forEach((answered, i) => {
            if(!answered) {
                this.workers[i].terminate();
                this.workers[i] = this.initializeWorker(i);
            }
        });
    }

    /**
     * @callback workerCallback
     * @param {MessageEvent} event
     * @param {Worker} worker
     * @param {Number} id
     */

    /**
     * @param {any} msg Message passed to all workers
     * @param {workerCallback} cb Called in each worker
     * @returns {Promise<void>}
     */
    comunicate(msg, cb = () => {}) {
        return new Promise((res, rej) => {
            const confirms = this.workers.map(() => false);

            let timeout = setTimeout(() => {
                this.checkWorkers(confirms);
                rej("Timeout");
            }, 200 * 1000); //Timeout if it takes more than 200s to respond

            this.workers.forEach((worker, i) => {
                worker.addEventListener("message", e => {
                    confirms[i] = true;
                    cb(e, worker, i);
                    if(confirms.length == this.workers) {
                        clearTimeout(timeout);
                        res();
                    }
                }, { once: true });
                worker.postMessage(msg);
            });
        });
    }

    /**
     * Gets you the remaining seeds
     * @returns {Promise<Number>}
     */
    remainingSeeds() {
        let remaining = 0;
        return this.comunicate(["remaining"], e => {
            remaining += e.data;
        }).then(() => remaining);
    }

    /**
     * Resets all worker's vectors
     * @return {Promise<void>}
     */
    reset() {
        return this.comunicate(["reset"]);
    }

    /**
     * Start cracking the seed
     * @param {Number[3]} info 
     * @param {Number[3]} secondInfo
     * @returns {Promise<void>}
     */
    firstInput(info, secondInfo) {
        return this.comunicate([...info, ...secondInfo]);
    }

    /**
     * Continue cracking the seed
     * @param {Number[3]} info 
     * @returns {Promise<void>}
     */
    input(info) {
        return this.comunicate([...info]);
    }
}
