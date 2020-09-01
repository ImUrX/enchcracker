import { WorkerPool } from "./pool.js";
const pool = new WorkerPool("../worker.js");
// eslint-disable-next-line no-undef
if(globalThis) globalThis.pool = pool;

window.onload = async () => {
    //Crack seed
    {
        const calc = document.querySelector("#calc-seed");
        calc.addEventListener("submit", ev => {
            ev.preventDefault();
            const formData = new FormData(calc);
            console.log(...formData.values());
        });
    }

    const bar = document.querySelector("#crack-progress span");
    const progress = document.querySelector("#crack-progress");
    let interval;
    {
        const progressPerWorker = parseFloat((100 / pool.threads).toFixed(2));
        let original;
        pool.setFinishListener(() => {
            if(interval) {
                clearInterval(interval);
                interval = null;
                const curAmount = parseFloat(bar.style.width.slice(0, -1));
                original = `${Math.floor(curAmount / progressPerWorker) * progressPerWorker}%`;
                return;
            }
            const amount = parseFloat(original || bar.style.width.slice(0, -1)) + progressPerWorker;
            if(original) original = null;
            const realAmount = amount > 100 ? "100%" : `${amount.toFixed(2)}%`;
            bar.style.width = realAmount;
            progress.dataset.value = `Remaining: ${realAmount}`;
        });
    }

    const resetButton = document.querySelector("#reset-seed");
    const button = document.querySelector("#seed-check");
    let firstTry = true;
    {
        const crack = document.querySelector("#crack-seed");
        const books = document.querySelector("#bookshelves > input");
        const firstSeed = document.querySelector("#seed1");
        const secondSeed = document.querySelector("#seed2");
        let firstArray = [];
        crack.addEventListener("submit", async ev => {
            ev.preventDefault();
            const formData = new FormData(crack);
            crack.reset();

            if(firstTry) {
                firstTry = false;
                firstArray = [...formData.values()];
                button.value = "Send another one!";
                books.focus();
                return;
            }

            progress.style.display = "";
            progress.dataset.value = "Remaining: 0%";
            bar.style.width = "0%";
            interval = setInterval(() => {
                bar.style.width = `${parseInt(bar.style.width.slice(0, -1)) + 1}%`;
                progress.dataset.value = `Remaining: ${bar.style.width}`;
            }, 2000);

            if(firstArray.length > 0) {
                const input = pool.firstInput(firstArray, formData.values());
                firstArray = [];
                await input;
            } else {
                const input = pool.input(formData.values());
                await input;
            }

            const remaining = await pool.remainingSeeds();
            progress.style.display = "none";
            if(remaining === 1) {
                const seed = (await pool.getSeed() >>> 0).toString(16).toUpperCase();
                if(!firstSeed.value) {
                    firstSeed.value = seed;
                } else if(!secondSeed.value) {
                    secondSeed.value = seed;
                }
                resetButton.click();
            } else {
                button.value = `Remaining seeds: ${compact(remaining)}`;
                books.focus();
            }
        });
    }

    resetButton.addEventListener("click", async () => {
        clearInterval(interval);
        progress.style.display = "none";
        button.value = "Wait a moment!";
        button.setAttribute("disabled", "");
        firstTry = true;
        await pool.reset().catch(reason => { if(reason !== "Timeout") throw reason; });
        button.value = "Check";
        button.removeAttribute("disabled");
    });
};

// This doesnt look good enough, im gonna try this on webgl later
const book = new Image();
book.onload = () => {
    /**
     * @type {HTMLCanvasElement}
     */
    const canvas = document.querySelector("#magic-book");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const scale = 5,
        leftCover = [0, 0, 7, 10],
        rightCover = [15, 0, 7, 10],
        binding = [14, 0, 1, 10],
        leftPage = [13, 11, 5, 8];
    let start = [0, 0];

    ctx.setTransform(1, .2, 0, 1, 0, 0);
    ctx.drawImage(book, ...leftCover, ...start, ...getScaledSize(leftCover, scale));
    ctx.drawImage(book, ...leftPage, start[0] + (scale * 2), start[1] + scale, ...getScaledSize(leftPage, scale));
    start[0] += getScaledSize(leftCover, scale)[0];
    start[1] += -3 + getScaledSize(leftCover, scale)[1] * .2;
    ctx.resetTransform();
    ctx.drawImage(book, ...binding, ...start, ...getScaledSize(binding, scale));
    start[0] += getScaledSize(binding, scale)[0];
    start[1] += 8;
    ctx.setTransform(1, -.2, 0, 1, 0, 0);
    ctx.drawImage(book, ...rightCover, ...start, ...getScaledSize(rightCover, scale));

};
book.src = "../img/enchanting_table_book.png";


let compact;
{
    if(new Intl.NumberFormat("ja-JP", { notation: "compact" }).format(10000) === "1万") {
        const numFormat = new Intl.NumberFormat(navigator.languages, { notation: "compact" });
        compact = number => {
            return numFormat.format(number);
        };
    } else {
        compact = number => {
            const num = number.toString();
            if(num.length > 6) {
                return `${num.slice(0, -6)}M`;
            } else if(num.length > 3) {
                return `${num.slice(0, -3)}.${num.slice(-3, -1)}K`;
            }
            return num;
        };
    }
}

function getScaledSize(sprite, scale) {
    return sprite.slice(2).map(val => val * scale);
}
