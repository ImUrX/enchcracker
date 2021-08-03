const defaultLang = "en";
const availableLangs = new Map([
    ["en", "English"],
    ["de", "Deutsche"],
    ["fr", "Française"],
    ["pl", "Polski"],
    ["ru", "Pусский"],
    ["zh_tw", "繁體中文"],
    ["zh", "簡體中文"]
]);
export default class Language {
    /**
     * @param {HTMLSelectElement} select
     * @param {Config} config
     * @param {Function} handler
     */
    constructor(select, config, handler) {
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
        this.handlers = [handler.bind(this)];
        let tempLang;
        if((tempLang = understandLang(navigator.language)) !== null) {
            this.lang = tempLang;
        } else {
            for(const navLang of navigator.languages || []) {
                if((tempLang = understandLang(navLang)) !== null) {
                    this.lang = tempLang;
                    break;
                }
            }
        }
        this.lang = config.addSelect(select, availableLangs, this.handleConfig.bind(this), "lang", this.lang);
    }

    async handleConfig(value) {
        this.lang = value;
        const json = await fetch(`./lang/${this.lang}.json`).then(res => res.json());
        this.langObj = this.mutLangObject(json);
        this.handlers.forEach(val => val());
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
        if(availableLang.startsWith(lang)) return availableLang;
    }
    return null;
}
