export default class Config {
    /**
     * @callback configCallback
     * @param {object} value
     * @param {Event} event
     * @param {Element} element
     */

    /**
     * 
     * @param {HTMLSelectElement} select 
     * @param {Map<string, string>} options 
     * @param {configCallback} cb
     * @param {string} id
     * @param {string} def
     * @returns {string}
     */
    addSelect(select, options, cb, id, def) {
        const saved = localStorage.getItem(id) || def;
        options.forEach((value, key) => select.appendChild(new Option(value, key, key === saved, key === saved)));
        select.addEventListener("change", ev => {
            const value = ev.target.value;
            localStorage.setItem(id, value);
            cb(value, ev, select);
        });
        return saved;
    }
    
    /**
     * 
     * @param {HTMLInputElement} range 
     * @param {number} min 
     * @param {number} max 
     * @param {configCallback} cb 
     * @param {string} id 
     * @param {string} def 
     */
    addRange(range, min, max, cb, id, def) {
        range.max = max;
        range.min = min;
        range.value = localStorage.getItem(id) || def;
        range.addEventListener("change", ev => {
            const value = ev.target.value;
            localStorage.setItem(id, value);
            cb(value, ev, range);
        });
        return range.value;
    }
}