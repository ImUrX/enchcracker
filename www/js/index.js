import { WorkerPool } from "./pool.js";
const pool = new WorkerPool("../worker.js");
window.pool = pool;

window.onload = async () => {
    //Crack seed
    const calc = document.querySelector("#calc-seed");
    calc.addEventListener("submit", ev => {
        ev.preventDefault();
        const formData = new FormData(calc);
        console.log(...formData.values());
    });

    const crack = document.querySelector("#crack-seed");
    crack.addEventListener("submit", ev => {
        ev.preventDefault();
        const formData = new FormData(crack);
        console.log(...formData.values());
    });
}

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
