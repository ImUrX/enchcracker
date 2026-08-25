/* @ts-self-types="./libenchcrack.d.ts" */

export class Cracker {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CrackerFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cracker_free(ptr, 0);
    }
    /**
     * @param {EnchantmentTableInfo} info
     */
    addInput(info) {
        _assertClass(info, EnchantmentTableInfo);
        var ptr0 = info.__destroy_into_raw();
        wasm.cracker_addInput(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {number} x
     * @returns {boolean}
     */
    contains(x) {
        const ret = wasm.cracker_contains(this.__wbg_ptr, x);
        return ret !== 0;
    }
    /**
     * @param {EnchantmentTableInfo} info
     * @param {EnchantmentTableInfo} info2
     */
    firstInput(info, info2) {
        _assertClass(info, EnchantmentTableInfo);
        var ptr0 = info.__destroy_into_raw();
        _assertClass(info2, EnchantmentTableInfo);
        var ptr1 = info2.__destroy_into_raw();
        wasm.cracker_firstInput(this.__wbg_ptr, ptr0, ptr1);
    }
    /**
     * @param {number} thread_id
     * @param {number} threads
     */
    constructor(thread_id, threads) {
        const ret = wasm.cracker_new(thread_id, threads);
        this.__wbg_ptr = ret;
        CrackerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number}
     */
    get possibleSeeds() {
        const ret = wasm.cracker_possible_seeds(this.__wbg_ptr);
        return ret >>> 0;
    }
    reset() {
        wasm.cracker_reset(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    get seed() {
        const ret = wasm.cracker_seed(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) Cracker.prototype[Symbol.dispose] = Cracker.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41}
 */
export const Enchantment = Object.freeze({
    Protection: 0, "0": "Protection",
    FireProtection: 1, "1": "FireProtection",
    FeatherFalling: 2, "2": "FeatherFalling",
    BlastProtection: 3, "3": "BlastProtection",
    ProjectileProtection: 4, "4": "ProjectileProtection",
    Respiration: 5, "5": "Respiration",
    AquaAffinity: 6, "6": "AquaAffinity",
    Thorns: 7, "7": "Thorns",
    DepthStrider: 8, "8": "DepthStrider",
    Sharpness: 9, "9": "Sharpness",
    Smite: 10, "10": "Smite",
    BaneOfArthropods: 11, "11": "BaneOfArthropods",
    Knockback: 12, "12": "Knockback",
    FireAspect: 13, "13": "FireAspect",
    Looting: 14, "14": "Looting",
    Efficiency: 15, "15": "Efficiency",
    SilkTouch: 16, "16": "SilkTouch",
    Unbreaking: 17, "17": "Unbreaking",
    Fortune: 18, "18": "Fortune",
    Power: 19, "19": "Power",
    Punch: 20, "20": "Punch",
    Flame: 21, "21": "Flame",
    Infinity: 22, "22": "Infinity",
    LuckOfTheSea: 23, "23": "LuckOfTheSea",
    Lure: 24, "24": "Lure",
    FrostWalker: 25, "25": "FrostWalker",
    Mending: 26, "26": "Mending",
    BindingCurse: 27, "27": "BindingCurse",
    VanishingCurse: 28, "28": "VanishingCurse",
    Sweeping: 29, "29": "Sweeping",
    Loyalty: 30, "30": "Loyalty",
    Impaling: 31, "31": "Impaling",
    Riptide: 32, "32": "Riptide",
    Channeling: 33, "33": "Channeling",
    Multishot: 34, "34": "Multishot",
    QuickCharge: 35, "35": "QuickCharge",
    Piercing: 36, "36": "Piercing",
    SoulSpeed: 37, "37": "SoulSpeed",
    Density: 38, "38": "Density",
    Breach: 39, "39": "Breach",
    WindBurst: 40, "40": "WindBurst",
    Lunge: 41, "41": "Lunge",
});

export class EnchantmentInstance {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EnchantmentInstanceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_enchantmentinstance_free(ptr, 0);
    }
    /**
     * @param {Enchantment} enchantment
     * @param {number} level
     */
    constructor(enchantment, level) {
        const ret = wasm.enchantmentinstance_new(enchantment, level);
        this.__wbg_ptr = ret;
        EnchantmentInstanceFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Enchantment}
     */
    get enchantment() {
        const ret = wasm.__wbg_get_enchantmentinstance_enchantment(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get level() {
        const ret = wasm.__wbg_get_enchantmentinstance_level(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Enchantment} arg0
     */
    set enchantment(arg0) {
        wasm.__wbg_set_enchantmentinstance_enchantment(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set level(arg0) {
        wasm.__wbg_set_enchantmentinstance_level(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) EnchantmentInstance.prototype[Symbol.dispose] = EnchantmentInstance.prototype.free;

export class EnchantmentTableInfo {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EnchantmentTableInfoFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_enchantmenttableinfo_free(ptr, 0);
    }
    /**
     * @param {number} shelves
     * @param {number} slot1
     * @param {number} slot2
     * @param {number} slot3
     */
    constructor(shelves, slot1, slot2, slot3) {
        const ret = wasm.enchantmenttableinfo_new(shelves, slot1, slot2, slot3);
        this.__wbg_ptr = ret;
        EnchantmentTableInfoFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) EnchantmentTableInfo.prototype[Symbol.dispose] = EnchantmentTableInfo.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83}
 */
export const Item = Object.freeze({
    LeatherHelmet: 0, "0": "LeatherHelmet",
    LeatherChestplate: 1, "1": "LeatherChestplate",
    LeatherLeggings: 2, "2": "LeatherLeggings",
    LeatherBoots: 3, "3": "LeatherBoots",
    IronHelmet: 4, "4": "IronHelmet",
    IronChestplate: 5, "5": "IronChestplate",
    IronLeggings: 6, "6": "IronLeggings",
    IronBoots: 7, "7": "IronBoots",
    ChainmailHelmet: 8, "8": "ChainmailHelmet",
    ChainmailChestplate: 9, "9": "ChainmailChestplate",
    ChainmailLeggings: 10, "10": "ChainmailLeggings",
    ChainmailBoots: 11, "11": "ChainmailBoots",
    GoldenHelmet: 12, "12": "GoldenHelmet",
    GoldenChestplate: 13, "13": "GoldenChestplate",
    GoldenLeggings: 14, "14": "GoldenLeggings",
    GoldenBoots: 15, "15": "GoldenBoots",
    DiamondHelmet: 16, "16": "DiamondHelmet",
    DiamondChestplate: 17, "17": "DiamondChestplate",
    DiamondLeggings: 18, "18": "DiamondLeggings",
    DiamondBoots: 19, "19": "DiamondBoots",
    WoodenSword: 20, "20": "WoodenSword",
    StoneSword: 21, "21": "StoneSword",
    IronSword: 22, "22": "IronSword",
    GoldenSword: 23, "23": "GoldenSword",
    DiamondSword: 24, "24": "DiamondSword",
    WoodenPickaxe: 25, "25": "WoodenPickaxe",
    StonePickaxe: 26, "26": "StonePickaxe",
    IronPickaxe: 27, "27": "IronPickaxe",
    GoldenPickaxe: 28, "28": "GoldenPickaxe",
    DiamondPickaxe: 29, "29": "DiamondPickaxe",
    WoodenAxe: 30, "30": "WoodenAxe",
    StoneAxe: 31, "31": "StoneAxe",
    IronAxe: 32, "32": "IronAxe",
    GoldenAxe: 33, "33": "GoldenAxe",
    DiamondAxe: 34, "34": "DiamondAxe",
    WoodenShovel: 35, "35": "WoodenShovel",
    StoneShovel: 36, "36": "StoneShovel",
    IronShovel: 37, "37": "IronShovel",
    GoldenShovel: 38, "38": "GoldenShovel",
    DiamondShovel: 39, "39": "DiamondShovel",
    WoodenHoe: 40, "40": "WoodenHoe",
    StoneHoe: 41, "41": "StoneHoe",
    IronHoe: 42, "42": "IronHoe",
    GoldenHoe: 43, "43": "GoldenHoe",
    DiamondHoe: 44, "44": "DiamondHoe",
    CarrotOnAStick: 45, "45": "CarrotOnAStick",
    FishingRod: 46, "46": "FishingRod",
    FlintAndSteel: 47, "47": "FlintAndSteel",
    Shears: 48, "48": "Shears",
    Bow: 49, "49": "Bow",
    Book: 50, "50": "Book",
    Pumpkin: 51, "51": "Pumpkin",
    Skull: 52, "52": "Skull",
    Elytra: 53, "53": "Elytra",
    Shield: 54, "54": "Shield",
    Trident: 55, "55": "Trident",
    TurtleHelmet: 56, "56": "TurtleHelmet",
    Crossbow: 57, "57": "Crossbow",
    NetheriteHelmet: 58, "58": "NetheriteHelmet",
    NetheriteChestplate: 59, "59": "NetheriteChestplate",
    NetheriteLeggings: 60, "60": "NetheriteLeggings",
    NetheriteBoots: 61, "61": "NetheriteBoots",
    NetheriteSword: 62, "62": "NetheriteSword",
    NetheritePickaxe: 63, "63": "NetheritePickaxe",
    NetheriteAxe: 64, "64": "NetheriteAxe",
    NetheriteShovel: 65, "65": "NetheriteShovel",
    NetheriteHoe: 66, "66": "NetheriteHoe",
    Mace: 67, "67": "Mace",
    CopperHelmet: 68, "68": "CopperHelmet",
    CopperChestplate: 69, "69": "CopperChestplate",
    CopperLeggings: 70, "70": "CopperLeggings",
    CopperBoots: 71, "71": "CopperBoots",
    CopperSword: 72, "72": "CopperSword",
    CopperPickaxe: 73, "73": "CopperPickaxe",
    CopperAxe: 74, "74": "CopperAxe",
    CopperShovel: 75, "75": "CopperShovel",
    CopperHoe: 76, "76": "CopperHoe",
    NetheriteSpear: 77, "77": "NetheriteSpear",
    DiamondSpear: 78, "78": "DiamondSpear",
    GoldenSpear: 79, "79": "GoldenSpear",
    IronSpear: 80, "80": "IronSpear",
    CopperSpear: 81, "81": "CopperSpear",
    StoneSpear: 82, "82": "StoneSpear",
    WoodenSpear: 83, "83": "WoodenSpear",
});

export class Manipulator {
    static __wrap(ptr) {
        const obj = Object.create(Manipulator.prototype);
        obj.__wbg_ptr = ptr;
        ManipulatorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ManipulatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_manipulator_free(ptr, 0);
    }
    /**
     * @param {number} seed1
     * @param {number} seed2
     * @returns {boolean}
     */
    changeSeed(seed1, seed2) {
        const ret = wasm.manipulator_changeSeed(this.__wbg_ptr, seed1, seed2);
        return ret !== 0;
    }
    /**
     * @param {number} seed1
     * @param {number} seed2
     * @returns {Manipulator | undefined}
     */
    static new(seed1, seed2) {
        const ret = wasm.manipulator_new(seed1, seed2);
        return ret === 0 ? undefined : Manipulator.__wrap(ret);
    }
    /**
     * @returns {Uint8Array}
     */
    get playerSeed() {
        const ret = wasm.manipulator_player_seed(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Item} item
     */
    reset(item) {
        wasm.manipulator_reset(this.__wbg_ptr, item);
    }
    /**
     * @param {Item} item
     * @param {number} max_shelves
     * @param {number} player_level
     * @param {Version} version
     * @returns {Int32Array | undefined}
     */
    simulate(item, max_shelves, player_level, version) {
        const ret = wasm.manipulator_simulate(this.__wbg_ptr, item, max_shelves, player_level, version);
        return ret;
    }
    /**
     * @param {Item} item
     * @param {EnchantmentInstance} ench
     */
    updateItem(item, ench) {
        _assertClass(ench, EnchantmentInstance);
        wasm.manipulator_updateItem(this.__wbg_ptr, item, ench.__wbg_ptr);
    }
    /**
     * @param {number} times_needed
     * @param {number} chosen_slot
     * @param {number} player_level
     * @returns {number}
     */
    updateSeed(times_needed, chosen_slot, player_level) {
        const ret = wasm.manipulator_updateSeed(this.__wbg_ptr, times_needed, chosen_slot, player_level);
        return ret;
    }
}
if (Symbol.dispose) Manipulator.prototype[Symbol.dispose] = Manipulator.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11}
 */
export const Material = Object.freeze({
    Netherite: 0, "0": "Netherite",
    Diamond: 1, "1": "Diamond",
    Golden: 2, "2": "Golden",
    Iron: 3, "3": "Iron",
    Chainmail: 4, "4": "Chainmail",
    Fire: 5, "5": "Fire",
    Turtle: 6, "6": "Turtle",
    Leather: 7, "7": "Leather",
    Stone: 8, "8": "Stone",
    Wooden: 9, "9": "Wooden",
    Copper: 10, "10": "Copper",
    Book: 11, "11": "Book",
});

export class Utilities {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UtilitiesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utilities_free(ptr, 0);
    }
    /**
     * @param {Enchantment} ench1
     * @param {Enchantment} ench2
     * @param {Version} version
     * @returns {boolean}
     */
    static areEnchantmentsCompatible(ench1, ench2, version) {
        const ret = wasm.utilities_areEnchantmentsCompatible(ench1, ench2, version);
        return ret !== 0;
    }
    /**
     * @param {Enchantment} ench
     * @returns {Version}
     */
    static enchantmentIntroducedVersion(ench) {
        const ret = wasm.utilities_enchantmentIntroducedVersion(ench);
        return ret;
    }
    /**
     * @param {Item} item
     * @returns {Uint8Array}
     */
    static getEnchantments(item) {
        const ret = wasm.utilities_getEnchantments(item);
        return ret;
    }
    /**
     * @param {Material} material
     * @returns {Uint8Array}
     */
    static getItems(material) {
        const ret = wasm.utilities_getItems(material);
        return ret;
    }
    /**
     * @param {Enchantment} ench
     * @param {Item} item
     * @returns {number}
     */
    static getMaxLevelInTable(ench, item) {
        const ret = wasm.utilities_getMaxLevelInTable(ench, item);
        return ret;
    }
    /**
     * @param {Enchantment} ench
     * @returns {boolean}
     */
    static isTreasure(ench) {
        const ret = wasm.utilities_isTreasure(ench);
        return ret !== 0;
    }
    /**
     * @param {Item} item
     * @returns {Version}
     */
    static itemIntroducedVersion(item) {
        const ret = wasm.utilities_itemIntroducedVersion(item);
        return ret;
    }
    /**
     * @param {Material} mat
     * @returns {Version}
     */
    static materialIntroducedVersion(mat) {
        const ret = wasm.utilities_materialIntroducedVersion(mat);
        return ret;
    }
}
if (Symbol.dispose) Utilities.prototype[Symbol.dispose] = Utilities.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}
 */
export const Version = Object.freeze({
    V1_8: 0, "0": "V1_8",
    V1_9: 1, "1": "V1_9",
    V1_11: 2, "2": "V1_11",
    V1_11_1: 3, "3": "V1_11_1",
    V1_13: 4, "4": "V1_13",
    V1_14: 5, "5": "V1_14",
    V1_14_3: 6, "6": "V1_14_3",
    V1_16: 7, "7": "V1_16",
    V1_21: 8, "8": "V1_21",
    V1_21_9: 9, "9": "V1_21_9",
    V1_21_11: 10, "10": "V1_21_11",
});
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_bb96b2010945f0bc: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_length_36bd29c6848c2144: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_new_with_length_3ffc1c56427c525c: function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return ret;
        },
        __wbg_new_with_length_c06762a91328d9e9: function(arg0) {
            const ret = new Int32Array(arg0 >>> 0);
            return ret;
        },
        __wbg_set_index_5cfbf01ee533592b: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_set_index_c8cd2906d1551f71: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./libenchcrack_bg.js": import0,
    };
}

const CrackerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cracker_free(ptr, 1));
const EnchantmentInstanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_enchantmentinstance_free(ptr, 1));
const EnchantmentTableInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_enchantmenttableinfo_free(ptr, 1));
const ManipulatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_manipulator_free(ptr, 1));
const UtilitiesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utilities_free(ptr, 1));

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('libenchcrack_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
