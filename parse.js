/* eslint-env node */
const fs = require("fs/promises");
const path = require("path");
const poJ = require("properties-to-json");
const LOCATION = "./scripts/temp/lang";

const overwrite = {
    tab: {
        config: "Configuration"
    },
    config: {
        lang: "Language:",
        threads: "Threads:",
        method: {
            value: "Cracking method:",
            wasm: "WASM",
            webgl: "WebGL",
            wasmthread: "WASM threads with shared memory",
            js: "JS with BigInt"
        }
    }
};

function Object_assign (target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            const s_val = source[key];
            const t_val = target[key];
            target[key] = t_val && s_val && typeof t_val === "object" && typeof s_val === "object"
                ? Object_assign(t_val, s_val)
                : s_val;
        });
    });
    return target;
}

function snake_caseTocamelCase(string) {
    return string.replace(/_(\w)/g, (_match, p1) => p1.toUpperCase());
}

function set_key(obj, keys, value) {
    if(keys.length === 1) {
        return obj[keys[0]] = value;
    } else if(obj[keys[0]] == null){
        obj[keys[0]] = {};
    }
    return set_key(obj[keys[0]], keys.slice(1), value);
}

/*async function translate_object(obj, from, to) {
    const promises = [];
    for(const prop in obj) {
        if(typeof obj[prop] === "string") {
            promises.push(await translate(obj[prop], { from, to }).then(res => obj[prop] = res.text));
        } else {
            promises.push(await translate_object(obj[prop], from, to));
        }
    }
    await Promise.all(promises);
}*/

async function parseFile(filePath) {
    const [,lang] = path.basename(filePath).match(/_(\w+)\./) || [null, "en"];
    const properties = poJ(
        (await fs.readFile(filePath, "utf-8"))
            .replace(/\\\r?\n/g, "") //new lines are broken in this lib :/
            .replace(/<\/?html>/g, "") //replace html because im using html xD
            .replace(/%(?:s|\d+(?:\.\d+f%|x)?|d)/gi, "{}") //replace all complex properties stuff because i dont want to use a lib
    );

    const keys = Object.keys(properties);
    let json = {};
    delete properties[""]; //why
    for(const prop in properties) {
        let value = properties[prop].replace(/\\n/g, "\n");
        if(prop.endsWith(".tooltip")) value = value.replace(/<\/?\w+>/g, "");
        let newProp = snake_caseTocamelCase(prop);
        if(keys.some(key => key.includes(prop + "."))) newProp += ".value";
        set_key(json, newProp.split("."), value);
    }

    const copy = Object.assign({}, overwrite);
    Object_assign(json, copy);

    await fs.writeFile(`${path.dirname(filePath)}/${lang}.json`, JSON.stringify(json, null, 4), "utf8");
}

(async function(dirPath) {
    const files = (await fs.readdir(dirPath)).filter(filePath => path.extname(filePath) === ".properties");
    const promises = [];
    for(const file of files) {
        promises.push(await parseFile(dirPath + "/" + file));
    }
    await Promise.all(promises);
})(LOCATION);