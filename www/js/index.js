import { WorkerPool } from "./pool.js";
const pool = new WorkerPool("../worker.js");
window.pool = pool;

const compact = navigator.userAgent.includes("Safari") 
    ? { format: number => {
        const num = number.toString();
        if(num.length > 6) {
            return `${num.slice(0, -6)}M`;
        } else if(num.length > 3) {
            return `${num.slice(0, -3)}K`;
        }
        return num;
    }}
    : new Intl.NumberFormat(navigator.languages, { notation: "compact" });

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
    {
        const progressPerWorker = parseFloat((100 / pool.threads).toFixed(2));
        pool.setFinishListener(() => {
            const amount = parseFloat(bar.style.width.slice(0, -1)) + progressPerWorker;
            const realAmount = amount > 100 ? "100%" : `${amount.toFixed(2)}%`;
            bar.style.width = realAmount;
            progress.dataset.value = `Remaining: ${realAmount}`;
        });
    }

    {
        const crack = document.querySelector("#crack-seed");
        const books = document.querySelector("#bookshelves > input");
        let firstTry = true;
        const firstArray = [];
        crack.addEventListener("submit", async ev => {
            ev.preventDefault();
            const formData = new FormData(crack);
            crack.reset();
            if(firstTry) {
                firstTry = false;
                firstArray.push(...formData.values());
                crack.setAttribute("value", "Send another one!");
                books.focus();
                return;
            }
            progress.style.display = "";
            progress.dataset.value = "Remaining: 0%";
            bar.style.width = "0%";
            if(firstArray.length > 0) {
                const input = pool.firstInput(firstArray, formData.values());
                await input;
            } else {
                const input = pool.input(formData.values());
                await input;
            }
            progress.style.display = "none";
            const remaining = await pool.remainingSeeds();
            if(remaining === 1) {
                //parse it and add it;
            } else {
                crack.setAttribute("value", `Remaining seeds ${compact.format(remaining)}`);
            }
        });
    }
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

function getScaledSize(sprite, scale) {
    return sprite.slice(2).map(val => val * scale);
}
