const VERSION = "v1.1";
import { WorkerPool } from "./Pool.js";
import Language from "./Language.js";
import Config from "./Config.js";
import { threads as checkThreads } from "https://unpkg.com/wasm-feature-detect?module";
import init, { Manipulator, Item, Version, Enchantment, EnchantmentInstance, Material, Utilities } from "../pkg/libenchcrack.js";

let compact;
let crackMethod = "rangedWorker";
let threads = navigator.hardwareConcurrency || 4;
const threadsExist = checkThreads();
let resInit = init();
window.Enchantment = Enchantment;
window.Utilities = Utilities;
window.Item = Item;

window.onload = async () => {
    resInit = await resInit;
    const manipulator = new Manipulator(0, 0);
    const config = new Config();
    const lang = new Language(document.querySelector("#lang-select"), config, changeHtmlLang);
    /**
     * @type {WorkerPool}
     */
    let pool;
    let seedExists = false;

    const setCracker = (value) => {
        if(pool) {
            pool.workers.forEach(worker => worker.terminate());
            pool = null;
        }
        crackMethod = value;
        console.log(`setting cracker to ${crackMethod} with ${threads} threads`);
        switch(value) {
        case "atomicWorker":
            pool = new WorkerPool("./atomicWorker.js", threads, undefined, false);
            break;
        case "rangedWorker":
            pool = new WorkerPool("./rangedWorker.js", threads, resInit.__wbindgen_wasm_module);
            break;
        }
    };

    await lang.handleConfig(lang.lang);

    threads = config.addRange(document.getElementById("thread-range"), 1, threads * 2, value => {
        threads = value;
        setCracker(crackMethod);
    }, "amountThreads", threads);
    {
        //cracking method config handler
        const options = new Map([
            ["rangedWorker", lang.get("config.method.wasm")]    
        ]);
        if(await threadsExist) options.set("atomicWorker", lang.get("config.method.wasmthread"));
        crackMethod = config.addSelect(document.getElementById("method-select"), options, setCracker, "crackmethod", crackMethod);
        setCracker(crackMethod);
    }

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
            submit.value = lang.get("enchCrack.notFound");
        });
    }

    //progress bar when each thread finishes
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
            const realAmount = amount >= 100 ? "100%" : `${amount.toFixed(2)}%`;
            bar.style.width = realAmount;
            progress.dataset.value = lang.get("enchCrack.progress", amount.toFixed(0));
        });
    }

    // brute-force enchant seed
    const resetButton = document.querySelector("#reset-seed");
    const button = document.querySelector("#seed-check");
    //add a setter to button.value so i know what im setting
    (function(valueProt) {
        Object.defineProperty(button, "value", {
            set: function (value) {
                if(value.length > 20) {
                    this.classList.add("toobig");
                } else {
                    this.classList.remove("toobig");
                }
                valueProt.set.call(this, value);
            }
        });
    }(Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")));
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
                button.value = lang.get("enchCrack.sendAnother");
                books.focus();
                return;
            }

            progress.style.display = "";
            progress.dataset.value = lang.get("enchCrack.progress", "0");
            bar.style.width = "0%";
            // cool fake progress bar for brute-force
            interval = setInterval(() => {
                bar.style.width = `${parseInt(bar.style.width.slice(0, -1)) + 1}%`;
                progress.dataset.value = lang.get("enchCrack.progress", bar.style.width.slice(0, -1));
            }, 2000);

            let input;
            if(firstArray.length > 0) {
                input = await pool.firstInput(firstArray, formData.values()).catch(e => {
                    if(e !== "Timeout") throw e;
                    return -1;
                });
                firstArray = [];
            } else {
                input = await pool.input(formData.values()).catch(e => {
                    if(e !== "Timeout") throw e;
                    return -1;
                });
            }
            if(input === -1) {
                resetButton.click();
            }

            const remaining = await pool.remainingSeeds();
            progress.style.display = "none";
            if(remaining === 1) {
                const seed = (await pool.getSeed() >>> 0).toString(16).toUpperCase();
                button.value = lang.get("enchCrack.result", seed);
                if(!firstSeed.value) {
                    firstSeed.value = seed;
                } else if(!secondSeed.value) {
                    secondSeed.value = seed;
                }
                resetButton.click();
            } else if(remaining < 1) {
                button.value = lang.get("enchCrack.impossible");
            } else {
                button.value = compact(remaining);
                books.focus();
            }
        });
    }

    //Reset seed
    resetButton.addEventListener("click", async () => {
        clearInterval(interval);
        progress.style.display = "none";
        button.value = lang.get("enchCrack.wait");
        button.setAttribute("disabled", "");
        firstTry = true;
        await pool.reset().catch(reason => { if(reason !== "Timeout") throw reason; });
        button.value = lang.get("enchCrack.check.value");
        button.removeAttribute("disabled");
    });

    let chosenVersion;
    const mats = [];
    {
        const select = document.querySelector("#current-version");
        for(const id of [Material.Netherite, Material.Diamond, Material.Golden, Material.Iron, Material.Fire, Material.Stone, Material.Leather]) {
            mats.push([Material[id].toLowerCase(), id]);
        }
        let index = 0;
        const materialOption = document.querySelector("#material-option");
        const findNext = (previous = false) => {
            for(previous ? index-- : index++; index <= mats.length; previous ? index-- : index++) {
                if(index === -1) {
                    index = mats.length - 1;
                } else if(index === mats.length) {
                    index = 0;
                }
                if(Utilities.materialIntroducedVersion(mats[index][1]) > parseInt(select.options[select.selectedIndex].value)) {
                    continue;
                }
                return mats[index];
            }
        };

        //Change material
        materialOption.addEventListener("click", () => {
            materialOption.classList.replace(`mat-${mats[index][0]}`, `mat-${findNext()[0]}`);
            const items = Utilities.getItems(mats[index][1]);
            document.querySelectorAll(".material-based").forEach((el, index) => {
                let curItem = items[index];
                el.classList.replace(`item-${Item[el.dataset.value].toLowerCase()}`, `item-${Item[curItem].toLowerCase()}`);
                el.dataset.value = curItem;
            });
        });
        //Change material backwards
        materialOption.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            materialOption.classList.replace(`mat-${mats[index][0]}`, `mat-${findNext(true)[0]}`);
            const items = Utilities.getItems(mats[index][1]);
            document.querySelectorAll(".material-based").forEach((el, index) => {
                let curItem = items[index];
                el.classList.replace(`item-${Item[el.dataset.value].toLowerCase()}`, `item-${Item[curItem].toLowerCase()}`);
                el.dataset.value = curItem;
            });
        });

        //fill list with each items from materials based on the variable mats
        materialOption.classList.add(`mat-${mats[index][0]}`);
        {
            const items = Utilities.getItems(mats[index][1]);
            document.querySelectorAll(".material-based").forEach((el, index) => {
                let curItem = items[index];
                el.classList.add(`item-${Item[curItem].toLowerCase()}`);
                el.dataset.value = curItem;
            });
        }

        //the items that are not mat-based
        for(const item of [Item.Bow, Item.FishingRod, Item.Crossbow, Item.Trident, Item.Book]) {
            document.querySelector(`.item-${Item[item].toLowerCase()}`).dataset.value = item;
        }

        const mapVersion = new Map([
            [Version.V1_8, "v1.8 - v1.8.9"],
            [Version.V1_9, "v1.9 - v1.10.2"],
            [Version.V1_11, "v1.11"],
            [Version.V1_11_1, "v1.11.1 - v1.12.2"],
            [Version.V1_13, "v1.13 - v1.13.2"],
            [Version.V1_14, "v1.14 - v1.14.2"],
            [Version.V1_14_3, "v1.14.3 - v1.15.2"],
            [Version.V1_16, "v1.16 - v1.17.1"]
        ]);
        //fill version select
        for(const i of Object.values(Version).filter(x => !isNaN(x))) {
            select.appendChild(new Option(mapVersion.get(i), i));
        }
        chosenVersion = parseInt(select.lastChild.value);
        select.lastChild.selected = true;

        // When version is changed
        select.addEventListener("change", () => {
            chosenVersion = parseInt(select.options[select.selectedIndex].value);
            if(Utilities.materialIntroducedVersion(mats[index][1]) > chosenVersion) {
                materialOption.click();
            }
            document.querySelectorAll("#item-list :not(.material-based)").forEach(item => {
                if(Utilities.itemIntroducedVersion(item.dataset.value) > chosenVersion) {
                    item.classList.add("disabled");
                    if(item.classList.contains("active")) {
                        document.querySelector("#item-list > div").click();
                    }
                } else {
                    item.classList.remove("disabled");
                }
            });
            document.querySelectorAll("#enchantments input").forEach(x => x.defaultChecked && (x.checked = true));
            Utilities.getEnchantments(document.querySelector(".item-slot.active").dataset.value).forEach(x =>
                document.querySelectorAll(`#enchantments div[data-value="${x}"]`).forEach(div => div.style.display = "")
            );
        });
    }

    {
        const enchantments = document.querySelector("#enchantments");
        for(const [string, id] of Object.entries(Enchantment)
            .filter((([str,x]) => !isNaN(x) && isNaN(str + "1") && !Utilities.isTreasure(x)))
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
                //listen for when enchantment level is changed
                radio.addEventListener("change", () => {
                    const activeEnchs = [...document.querySelectorAll("#enchantments input:checked")]
                        .filter(x => x.parentElement.style.display !== "none" && parseInt(x.value) > 0).map(x => parseInt(x.parentElement.dataset.value));
                    const notChosenEnchs = Utilities.getEnchantments(document.querySelector(".item-slot.active").dataset.value)
                        .filter(x => !activeEnchs.includes(x));
                    outerLoop: 
                    for(const ench of notChosenEnchs) {
                        for(const wantedEnch of activeEnchs) {
                            if(!Utilities.areEnchantmentsCompatible(wantedEnch, ench, chosenVersion)) {
                                enchantments.querySelectorAll(`div[data-value="${ench}"]`).forEach(div => div.style.display = "none");
                                continue outerLoop;
                            }
                        }
                        enchantments.querySelectorAll(`div[data-value="${ench}"]`).forEach(div => div.style.display = "");
                    }
                });
                radioList.appendChild(radio);
            }
            radioList.children[1].setAttribute("checked", "");
            radioList.dataset.value = id;
            radioList.style.display = "none";
            enchantments.children[1].appendChild(radioList);
        }
    }

    document.querySelector("#item-list").childNodes.forEach(el => {
        //update enchantment list to new selected item
        el.addEventListener("click", () => {
            if(el.classList.contains("disabled")) return;
            document.querySelector("#enchantments-form").reset();
            const active = document.querySelector(".item-slot.active");
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
        const resultNodes = [document.querySelector("#result-items-needed > span"), document.querySelector("#result-slot > span"), document.querySelector("#result-bookshelves > span")];
        const doneButton = document.querySelector("#update-seed");
        doneButton.setAttribute("disabled", "");
        const calcSeedButton = document.querySelector("#calc-seed input[type=\"submit\"]");
        let lastRes = null;
        //simulate manipulation
        enchForm.addEventListener("submit", async ev => {
            ev.preventDefault();
            if(!seedExists) {
                alert(lang.get("enchCalc.playerSeedNotFound"));
                return;
            }

            const item = document.querySelector(".item-slot.active");
            if(!item) {
                return alert(lang.get("enchCalc.selectItem"));
            }

            const formData = new FormData(enchForm);
            const validEnchs = Utilities.getEnchantments(item.dataset.value);
            manipulator.reset(item.dataset.value);
            for(const ench of validEnchs) {
                if(parseInt(formData.get(Enchantment[ench])) == 0) continue;
                manipulator.updateItem(item.dataset.value, new EnchantmentInstance(ench, formData.get(Enchantment[ench]) ));
            }
            lastRes = manipulator.simulate(item.dataset.value, totalBookshelves.value, playerLevel.value, currentVersion[currentVersion.selectedIndex].value);

            const res = [...lastRes];
            if(res[0] === -2) {
                resultNodes[0].innerHTML = lang.get("enchCalc.impossible");
                return;
            }
            
            if(res[0] === -1) {
                res[0] = lang.get("enchCalc.noDummy");
            } else if(res[0] > 63) {
                res[0] = lang.get("enchCalc.stackFormat", Math.floor(res[0]/64), res[0] % 64);
            }
            resultNodes.forEach((x, i) => x.innerHTML = res[i]);
            doneButton.removeAttribute("disabled");
        });

        //update seed after manipulation
        doneButton.addEventListener("click", () => {
            doneButton.setAttribute("disabled", "");
            resultNodes.forEach(x => x.innerHTML = "-");
            playerLevel.value = manipulator.updateSeed(lastRes[0], lastRes[1], parseInt(playerLevel.value));
            playerLevel.setAttribute("value", playerLevel.value);
            calcSeedButton.value = [...manipulator.playerSeed.reverse()].map(x => x.toString(16).toUpperCase().padStart(2, "0")).join("");
        });
    }

    // follow cursor with the compass
    {
        const partSize = 2 * Math.PI / 28;
        const compass = document.querySelector("#config label div");
        document.addEventListener("mousemove", ev => {
            const rect = compass.getBoundingClientRect();
            const compassX = Math.floor(rect.x + (rect.width / 2)), compassY = Math.floor(rect.y + (rect.height / 2));
            const rotation = Math.atan2(ev.pageY - compassY, ev.pageX - compassX);

            let point = (rotation / partSize) - 7;
            if(point < 0) point += 28;
            point = Math.round(point);
            if(point === 28) point = 0;
            compass.classList.value = `compass-${point}`;
        });
    }

    //Debug to your hearts content!
    window.pool = pool;
    window.manipulator = manipulator;
};



function changeHtmlLang() {
    document.title = this.get("program.name");
    document.documentElement.setAttribute("lang", this.lang);
    document.querySelectorAll("[data-lang]").forEach(el => {
        el.innerText = this.get(el.dataset.lang);
    });
    document.querySelectorAll("[data-langtip]").forEach(el => {
        el.title = this.get(el.dataset.langtip);
    });
    document.querySelectorAll("[data-langvalue]").forEach(el => {
        el.value = this.get(el.dataset.langvalue);
    });

    let about = this.get("program.about", VERSION);
    let match;
    while((match = /LINK (\S+) (.+)/.exec(about)) !== null) {
        about = about.replace(/LINK (\S+) (.+)/, `<a href="${match[1]}">${match[2]}</a>`);
    }
    about = about.replace(/\n/g, "<br>");
    document.querySelector("#about-content").innerHTML = about;

    document.querySelectorAll("#enchantment-names > div").forEach(enchEl => {
        const ench = Enchantment[enchEl.dataset.value];
        enchEl.innerText = this.get(`ench.${ench.charAt(0).toLowerCase() + ench.slice(1)}`);
    });

    //check if we are using intl for compact numbers or our own function
    if(new Intl.NumberFormat("ja-JP", { notation: "compact" }).format(10000) === "1万") {
        const numFormat = new Intl.NumberFormat(this.lang.replace(/_/g, "-"), { notation: "compact" });
        compact = number => {
            return this.get("enchCrack.remaining.value", numFormat.format(number));
        };
    } else {
        compact = number => {
            const num = number.toString();
            let get = "enchCrack.remaining.value";
            if(num.length > 9) {
                get = "enchCrack.remaining.billion";
            } else if(num.length > 6) {
                get = "enchCrack.remaining.million";
            } else if(num.length > 3) {
                get = "enchCrack.remaining.thousand";
            }
            return this.get(get, num);
        };
    }
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
book.src = "./img/enchanting_table_book.png";


function getScaledSize(sprite, scale) {
    return sprite.slice(2).map(val => val * scale);
}
