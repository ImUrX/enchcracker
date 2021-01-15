const defaultLang = "en-US";
const availableLangs = new Map([
    ["en", "English"]
]);
export default class Language {
    /**
     * @param {HTMLSelectElement} select 
     */
    constructor(select) {
        /**
         * Current choosen lang
         * @type {string}
         */
        this.lang = defaultLang;
        /**
         * The select elemen that is being listened
         * @type {HTMLSelectElement}
         */
        this.select = select;
        /**
         * The language object where strings and more objects are in
         */
        this.langObj;
        if(localStorage.getItem("lang")) {
            this.lang = localStorage.getItem("lang");
        } else if(understandLang(navigator.language)) {
            this.lang = navigator.language;
        } else {
            for(const navLang of navigator.languages || []) {
                if(understandLang(navLang)) {
                    this.lang = navLang;
                    break;
                }
            }
        }

        for(const [lang, name] of availableLangs) {
            select.appendChild(new Option(name, lang));
        }
    }

    async addHandler(callback) {
        const json = await fetch(`../lang/${this.lang}.json`).then(res => res.json());
        this.select.value = this.lang;
        this.langObj = this.mutLangObject(json);
        console.log(this.langObj);
        callback();

        this.select.addEventListener("change", async ev => {
            this.lang = ev.target.value;
            localStorage.setItem("lang", this.lang);
            const json = await fetch(`../lang/${this.lang}.json`).then(res => res.json());
            this.langObj = this.mutLangObject(json);
            callback();
        });
    }

    mutLangObject(obj) {
        for(const prop in obj) {
            if(typeof obj[prop] === "object") {
                this.mutLangObject(obj[prop]);
            } else if(obj[prop].includes("{}")) {                
                obj[prop] = obj[prop].split("{}");
            }
        }
        return obj;
    }

    /**
     * Get lang string
     * @param {string} key 
     * @param  {...string} args
     */
    get(key, ...args) {
        let data = this.langObj;
        for(const prop of key.split(".")) {
            data = data[prop];
            if(data == null) return data;
        }
        if(Array.isArray(data)) {
            return data.reduce((prev, cur, i) => prev + args[i-1] + cur);
        }
        return data;
    }
}

function understandLang(lang) {
    for(const availableLang of availableLangs.keys()) {
        if(availableLang.startsWith(lang)) return true;
    }
    return false;
}
