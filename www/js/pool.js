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

        this.responseQueue = {
            finished: [],
            remaining: [],
            reset: [],
            seed: []
        };

        for(let i = 0; i < this.threads; i++) {
            const worker = this.initializeWorker(i);
            worker.addEventListener("message", ev => {
                for(const listener of this.responseQueue[ev.data[0]]) {
                    listener(ev, worker, i);
                }
                if(i === this.threads - 1) this.responseQueue[ev.data[0]] = [];
            });
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
     * @typedef {object} WorkerData
     * @property {workerCallback} cb Called in each worker
     * @property {Number} waitTime Time to wait for timeout
     */

    /**
     * @param {any} msg Message passed to all workers
     * @param {String} type Message Type (why am i not using enums? idk)
     * @param {WorkerData=} obj
     * @returns {Promise<void>}
     */
    comunicate(msg, type, { cb = () => {}, timewait = 200 * 1000 } = {}) {
        return new Promise((res, rej) => {
            const confirms = this.workers.map(() => false);
            let count = 0;

            let timeout = setTimeout(() => {
                this.checkWorkers(confirms);
                rej("Timeout");
            }, timewait); //Timeout if it takes more than 200s to respond

            this.responseQueue[type].push((ev, worker, id) => {
                confirms[id] = true;
                cb(ev, worker, id);
                if(++count === confirms.length) {
                    clearTimeout(timeout);
                    res();
                }
            });

            this.workers.forEach(worker => worker.postMessage(msg));
        });
    }

    /**
     * Gets you the remaining seeds
     * @returns {Promise<Number>}
     */
    remainingSeeds() {
        let remaining = 0;
        return this.comunicate(["remaining"], "remaining", {
            cb: ev => {
                remaining += ev.data[1];
            }
        }).then(() => remaining);
    }

    /**
     * Resets all worker's vectors
     * @return {Promise<void>}
     */
    reset() {
        return this.comunicate(["reset"], "reset", { waitTime: 5 * 1000 });
    }

    /**
     * Start cracking the seed
     * @param {Number[3]} info 
     * @param {Number[3]} secondInfo
     * @returns {Promise<void>}
     */
    firstInput(info, secondInfo) {
        return this.comunicate([...info, ...secondInfo], "finished");
    }

    /**
     * Continue cracking the seed
     * @param {Number[3]} info 
     * @returns {Promise<void>}
     */
    input(info) {
        return this.comunicate([...info], "finished");
    }
}
