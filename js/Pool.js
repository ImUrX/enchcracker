export class WorkerPool {
    constructor(workerPath, threads, module, spawn = true) {
        /**
         * Worker pool
         * @type {Worker[]}
         */
        this.workers = [];
        /**
         * Amount of threads that host told at start
         * @type {Number}
         */
        this.threads = threads;
        /**
         * Path to the worker.js file
         * @type {String}
         */
        this.workerPath = workerPath;
        /**
         * @type {WebAssembly.Module?}
         */
        this.module = module;
        this.spawn = spawn;

        this.responseQueue = {
            finished: [],
            remaining: [],
            reset: [],
            seed: []
        };
        this.responseQueueCounter = {};
        for(const key in this.responseQueue) {
            this.responseQueueCounter[key] = 0;
        }

        /**
         * Amount of threads that need to spawn
         * @type {number}
         */
        this.amount = this.spawn ? this.threads : 1;
        for(let i = 0; i < this.amount; i++) {
            const worker = this.initializeWorker(i);
            worker.addEventListener("message", ev => {
                const type = ev.data[0];
                for(const listener of this.responseQueue[type]) {
                    listener(ev, worker, i);
                }
                if(++this.responseQueueCounter[type] === this.amount) {
                    this.responseQueue[type] = [];
                    this.responseQueueCounter[type] = 0;
                }
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
        const worker = new Worker(this.workerPath, {
            type: "module",
            name: id
        });
        worker.postMessage([this.module, id, this.threads]);
        return worker;
    }

    /**
     * Checks the array so it can reinitialize workers
     * @param  {...Boolean} broken
     */
    checkWorkers(...broken) {
        for(const key in this.responseQueue) {
            this.responseQueue[key] = [];
            this.responseQueueCounter[key] = 0;
        }
        broken.forEach((answered, i) => {
            if(!answered) {
                this.workers[i].terminate();
                this.workers[i] = this.initializeWorker(i);
            }
        });
    }

    setFinishListener(func) {
        for(let i = 0; i < this.amount; i++) {
            const worker = this.workers[i];
            worker.addEventListener("message", ev => {
                if(ev.data[0] === "finished") func(i, worker);
            });
        }
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
    communicate(msg, type, { cb = () => {}, waitTime = 200 * 1000 } = {}) {
        return new Promise((res, rej) => {
            const confirms = this.workers.map(() => false);
            const ourFuncIndex = this.responseQueue[type].length;
            const ourFunc = (ev, worker, id) => {
                confirms[id] = true;
                cb(ev, worker, id);
                if(++count === confirms.length) {
                    clearTimeout(timeout);
                    res();
                }
            };
            let count = 0;

            let timeout = setTimeout(() => {
                if(this.responseQueue[type][ourFuncIndex] !== ourFunc) return;
                this.checkWorkers(...confirms);
                rej("Timeout");
            }, waitTime); //Timeout if it takes more than 200s to respond

            this.responseQueue[type].push(ourFunc);

            this.workers.forEach(worker => worker.postMessage(msg));
        });
    }

    /**
     * Gets you the remaining seeds
     * @returns {Promise<Number>}
     */
    remainingSeeds() {
        let remaining = 0;
        return this.communicate(["remaining"], "remaining", {
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
        return this.communicate(["reset"], "reset", { waitTime: 5 * 1000 });
    }

    /**
     * Start cracking the seed
     * @param {Number[3]} info 
     * @param {Number[3]} secondInfo
     * @returns {Promise<void>}
     */
    firstInput(info, secondInfo) {
        return this.communicate([...info, ...secondInfo], "finished");
    }

    /**
     * Continue cracking the seed
     * @param {Number[3]} info 
     * @returns {Promise<void>}
     */
    input(info) {
        return this.communicate([...info], "finished");
    }

    /**
     * @returns {Promise<Number>}
     */
    async getSeed() {
        let id = 0;
        await this.communicate(["remaining"], "remaining", {
            cb: (ev, worker, workerId) => {
                if(ev.data[1] === 1) id = workerId;
            }
        });
        return new Promise(res => {
            this.responseQueue.seed.push(ev => {
                res(ev.data[1]);
            });
            this.responseQueueCounter.seed = this.amount - 1;
            this.workers[id].postMessage(["seed"]);
        });
    }
}
