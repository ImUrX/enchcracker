/* global wasm_bindgen:readonly */
import { WorkerPool } from "./Pool.js";
const modulePromise = wasm_bindgen("../wasm/libenchcrack_bg.wasm");
/**
 * @typedef wasm_bindgen
 * @property {typeof import("../wasm/libenchcrack").Manipulator} Manipulator
 * @property {typeof import("../wasm/libenchcrack").EnchantmentInstance} EnchantmentInstance
 * @property {typeof import("../wasm/libenchcrack").Enchantment} Enchantment
 * @property {typeof import("../wasm/libenchcrack").Item} Item
 * @property {typeof import("../wasm/libenchcrack").Material} Material
 * @property {typeof import("../wasm/libenchcrack").Version} Version
 * @property {typeof import("../wasm/libenchcrack").Utilities} Utilities
 * @property {typeof import("../wasm/libenchcrack").EnchantmentTableInfo} EnchantmentTableInfo
 */

/**
 * Import wasm module, kind of?
 * It looks like a require!
 * @type {wasm_bindgen}
 */
const { Manipulator, Item, Version, Enchantment, EnchantmentInstance, Material, Utilities } = wasm_bindgen;

window.onload = async () => {
    await modulePromise;
    const pool = new WorkerPool("../worker.js", wasm_bindgen.__wbindgen_wasm_module);
    const manipulator = new Manipulator(0, 0);
    let seedExists = false;

    //Crack player seed
    {
        const calc = document.querySelector("#calc-seed");
        const submit = document.querySelector("#calc-seed input[type=\"submit\"]");
        calc.addEventListener("submit", ev => {
            ev.preventDefault();
            submit.classList.remove("invalid");
            const formData = new FormData(calc);
            const seeds = [...formData.values()].map(seed => parseInt(seed, 16));

            seedExists = manipulator.changeSeed(...seeds);
            if(seedExists) {
                return submit.value = [...manipulator.playerSeed.reverse()].map(x => x.toString(16).toUpperCase().padStart(2, "0")).join("");
            }

            submit.classList.add("invalid");
            submit.value = "Not found!";
        });
    }

    // cool progress bar for brute-force
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

    // brute-force enchant seed
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

    const mats = [];
    {
        for(const id of [Material.Netherite, Material.Diamond, Material.Golden, Material.Iron, Material.Fire, Material.Stone, Material.Leather]) {
            mats.push([Material[id].toLowerCase(), id]);
        }
        let index = 0;
        const materialOption = document.querySelector("#material-option");

        materialOption.addEventListener("click", () => {
            materialOption.classList.replace(`mat-${mats[index][0]}`, `mat-${mats[++index == mats.length ? index = 0 : index][0]}`);
            const items = Utilities.getItems(mats[index][1]);
            document.querySelectorAll(".material-based").forEach((el, index) => {
                let curItem = items[index];
                el.classList.replace(`item-${Item[el.dataset.value].toLowerCase()}`, `item-${Item[curItem].toLowerCase()}`);
                el.dataset.value = curItem;
            });
        });
        materialOption.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            materialOption.classList.replace(`mat-${mats[index][0]}`, `mat-${mats[--index == -1 ? index = mats.length - 1 : index][0]}`);
            const items = Utilities.getItems(mats[index][1]);
            document.querySelectorAll(".material-based").forEach((el, index) => {
                let curItem = items[index];
                el.classList.replace(`item-${Item[el.dataset.value].toLowerCase()}`, `item-${Item[curItem].toLowerCase()}`);
                el.dataset.value = curItem;
            });
        });

        materialOption.classList.add(`mat-${mats[index][0]}`);
        {
            const items = Utilities.getItems(mats[index][1]);
            document.querySelectorAll(".material-based").forEach((el, index) => {
                let curItem = items[index];
                el.classList.add(`item-${Item[curItem].toLowerCase()}`);
                el.dataset.value = curItem;
            });
        }

        for(const item of [Item.Bow, Item.FishingRod, Item.Crossbow, Item.Trident, Item.Book]) {
            document.querySelector(`.item-${Item[item].toLowerCase()}`).dataset.value = item;
        }
    }

    {
        const select = document.querySelector("#current-version");
        for(const [string, i] of Object.entries(Version).filter(([,x]) => !isNaN(x))) {
            select.appendChild(new Option(string, i));
        }
        select.lastChild.selected = true;
    }

    {
        const enchantments = document.querySelector("#enchantments");
        for(const [string, id] of Object.entries(Enchantment)
            .filter((([str,x]) => !isNaN(x) && isNaN(str) && !Utilities.isTreasure(x)))
            .map(val => { val.toString = () => val[0]; return val; }).sort()) {
            const name = document.createElement("div");
            name.innerHTML = string;
            name.dataset.value = id;
            name.style.display = "none";
            enchantments.children[0].appendChild(name);
            const radioList = document.createElement("div");
            radioList.classList.add("flex");
            for(let i = -1; i < 6; i++) {
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = string;
                radio.value = i;
                radioList.appendChild(radio);
            }
            radioList.children[1].setAttribute("checked", "");
            radioList.dataset.value = id;
            radioList.style.display = "none";
            enchantments.children[1].appendChild(radioList);
        }
    }

    document.querySelector("#item-list").childNodes.forEach(el => {
        el.addEventListener("click", () => {
            document.querySelector("#enchantments-form").reset();
            let active = document.querySelector(".item-slot.active");
            if(active) active.classList.remove("active");
            // imagine a world with document.querySelector(".item-slot.active")?.classList.remove("active");
            // it exists but yeah im not gonna break support xD
            el.classList.add("active");
            const validEnchs = Utilities.getEnchantments(el.dataset.value);
            document.querySelectorAll("#enchantments > div > div").forEach(ench => ench.style.display = "none");
            document.querySelectorAll([...validEnchs].map(x => `#enchantments > div > div[data-value="${x}"]`).join(",")).forEach(ench => {
                ench.style.display = "";
                if(ench.classList.contains("flex")) {
                    const maxLevel = Utilities.getMaxLevelInTable(ench.dataset.value, el.dataset.value);
                    for(let i = 2; i < ench.children.length; i++) {
                        if(i < maxLevel + 2) {
                            ench.children[i].style.display = "";
                        } else {
                            ench.children[i].style.display = "none";
                        }
                    }
                    if(maxLevel === 1) {
                        ench.children[2].classList.add("only-one");
                    } else {
                        ench.children[2].classList.remove("only-one");
                    }
                }
            });
        });
    });

    {
        const enchForm = document.querySelector("#enchantments-form");
        const totalBookshelves = document.querySelector("#total-bookshelves");
        const playerLevel = document.querySelector("#player-level");
        const currentVersion = document.querySelector("#current-version");
        const resultItemsNeeded = document.querySelector("#result-items-needed > span");
        const resultSlot = document.querySelector("#result-slot > span");
        const resultBookshelves = document.querySelector("#result-bookshelves > span");
        const doneButton = document.querySelector("#update-seed");
        doneButton.setAttribute("disabled", "");
        const calcSeedButton = document.querySelector("#calc-seed input[type=\"submit\"]");
        let lastRes = null;
        enchForm.addEventListener("submit", async ev => {
            ev.preventDefault();
            if(!seedExists) {
                alert("There is no player seed!");
                return;
            }
            if(!playerLevel.validity.valid) {
                return alert("Player level is invalid!");
            } 
            if(!totalBookshelves.validity.valid) {
                return alert("Total bookshelves is invalid");
            }
            const item = document.querySelector(".item-slot.active");
            if(!item) {
                return alert("Select an item at least :/");
            }
            const formData = new FormData(enchForm);
            const validEnchs = Utilities.getEnchantments(item.dataset.value);
            manipulator.reset(item.dataset.value);
            for(const ench of validEnchs) {
                if(parseInt(formData.get(Enchantment[ench])) == 0) continue;
                manipulator.updateItem(parseInt(item.dataset.value), new EnchantmentInstance(ench, parseInt(formData.get(Enchantment[ench])) ));
            }
            lastRes = manipulator.simulate(parseInt(item.dataset.value), parseInt(totalBookshelves.value), parseInt(playerLevel.value), parseInt(currentVersion[currentVersion.selectedIndex].value));

            const [timesNeeded, slot, bookshelvesNeeded] = lastRes;
            if(timesNeeded === -2) {
                resultItemsNeeded.innerHTML = "Impossible";
                return;
            }
            resultBookshelves.innerHTML = bookshelvesNeeded;
            resultSlot.innerHTML = slot;
            if(timesNeeded === -1) {
                resultItemsNeeded.innerHTML = "Do it!";
                return;
            } else if(timesNeeded > 63) {
                resultItemsNeeded.innerHTML = `${Math.floor(timesNeeded/64)}s${timesNeeded % 64 > 0 ? ` + ${timesNeeded % 64}` : ""}`;
            } else {
                resultItemsNeeded.innerHTML = timesNeeded;
            }
            doneButton.removeAttribute("disabled");
        });

        doneButton.addEventListener("click", () => {
            doneButton.setAttribute("disabled", "");
            const newLevel = manipulator.updateSeed(lastRes);
            playerLevel.value = parseInt(playerLevel.value) + newLevel;
            calcSeedButton.value = [...manipulator.playerSeed.reverse()].map(x => x.toString(16).toUpperCase().padStart(2, "0")).join("");
        });
    }

    window.pool = pool;
    window.manipulator = manipulator;
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
