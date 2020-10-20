const defaultLang = "en-US";
const availableLangs = new Map([
    ["en", "English"]
]);
export default class Language {
    /**
     * @param {HTMLSelectElement} select 
     */
    constructor(select) {
        this.lang = defaultLang;
        if(localStorage.getItem("lang")) {
            this.lang = localStorage.getItem("lang");
        } else if(understandLang(navigator.language)) {
            this.lang = navigator.language;
        } else {
            for(const navLang of navigator.languages) {
                if(understandLang(navLang)) this.lang = navLang;
            }
        }

        for(const [lang, name] of availableLangs) {
            select.appendChild(new Option(name, lang));
        }
        select.addEventListener("change", async ev => {
            this.lang = ev.target.value;
        });
    }

    loadLangObject(json) {
        for(const obj in json) {
            if(typeof obj === "object") {
                this.loadLangObject(json);
            } else {
                const regex = /{}/g;
            }
        }
    }
}

function understandLang(lang) {
    for(const availableLang of availableLangs.keys()) {
        if(availableLang.startsWith(lang)) return true;
    }
    return false;
}
