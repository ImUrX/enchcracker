let wasm_bindgen;
(function() {
    const __exports = {};
    let wasm;

    const heap = new Array(32).fill(undefined);

    heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
*/
__exports.Version = Object.freeze({ V1_8:0,"0":"V1_8",V1_9:1,"1":"V1_9",V1_11:2,"2":"V1_11",V1_11_1:3,"3":"V1_11_1",V1_13:4,"4":"V1_13",V1_14:5,"5":"V1_14",V1_14_3:6,"6":"V1_14_3",V1_16:7,"7":"V1_16", });
/**
*/
__exports.Material = Object.freeze({ Netherite:0,"0":"Netherite",Diamond:1,"1":"Diamond",Golden:2,"2":"Golden",Iron:3,"3":"Iron",Chainmail:4,"4":"Chainmail",Fire:5,"5":"Fire",Turtle:6,"6":"Turtle",Leather:7,"7":"Leather",Stone:8,"8":"Stone",Wooden:9,"9":"Wooden", });
/**
*/
__exports.Item = Object.freeze({ LeatherHelmet:0,"0":"LeatherHelmet",LeatherChestplate:1,"1":"LeatherChestplate",LeatherLeggings:2,"2":"LeatherLeggings",LeatherBoots:3,"3":"LeatherBoots",IronHelmet:4,"4":"IronHelmet",IronChestplate:5,"5":"IronChestplate",IronLeggings:6,"6":"IronLeggings",IronBoots:7,"7":"IronBoots",ChainmailHelmet:8,"8":"ChainmailHelmet",ChainmailChestplate:9,"9":"ChainmailChestplate",ChainmailLeggings:10,"10":"ChainmailLeggings",ChainmailBoots:11,"11":"ChainmailBoots",GoldenHelmet:12,"12":"GoldenHelmet",GoldenChestplate:13,"13":"GoldenChestplate",GoldenLeggings:14,"14":"GoldenLeggings",GoldenBoots:15,"15":"GoldenBoots",DiamondHelmet:16,"16":"DiamondHelmet",DiamondChestplate:17,"17":"DiamondChestplate",DiamondLeggings:18,"18":"DiamondLeggings",DiamondBoots:19,"19":"DiamondBoots",WoodenSword:20,"20":"WoodenSword",StoneSword:21,"21":"StoneSword",IronSword:22,"22":"IronSword",GoldenSword:23,"23":"GoldenSword",DiamondSword:24,"24":"DiamondSword",WoodenPickaxe:25,"25":"WoodenPickaxe",StonePickaxe:26,"26":"StonePickaxe",IronPickaxe:27,"27":"IronPickaxe",GoldenPickaxe:28,"28":"GoldenPickaxe",DiamondPickaxe:29,"29":"DiamondPickaxe",WoodenAxe:30,"30":"WoodenAxe",StoneAxe:31,"31":"StoneAxe",IronAxe:32,"32":"IronAxe",GoldenAxe:33,"33":"GoldenAxe",DiamondAxe:34,"34":"DiamondAxe",WoodenShovel:35,"35":"WoodenShovel",StoneShovel:36,"36":"StoneShovel",IronShovel:37,"37":"IronShovel",GoldenShovel:38,"38":"GoldenShovel",DiamondShovel:39,"39":"DiamondShovel",WoodenHoe:40,"40":"WoodenHoe",StoneHoe:41,"41":"StoneHoe",IronHoe:42,"42":"IronHoe",GoldenHoe:43,"43":"GoldenHoe",DiamondHoe:44,"44":"DiamondHoe",CarrotOnAStick:45,"45":"CarrotOnAStick",FishingRod:46,"46":"FishingRod",FlintAndSteel:47,"47":"FlintAndSteel",Shears:48,"48":"Shears",Bow:49,"49":"Bow",Book:50,"50":"Book",Pumpkin:51,"51":"Pumpkin",Skull:52,"52":"Skull",Elytra:53,"53":"Elytra",Shield:54,"54":"Shield",Trident:55,"55":"Trident",TurtleHelmet:56,"56":"TurtleHelmet",Crossbow:57,"57":"Crossbow",NetheriteHelmet:58,"58":"NetheriteHelmet",NetheriteChestplate:59,"59":"NetheriteChestplate",NetheriteLeggings:60,"60":"NetheriteLeggings",NetheriteBoots:61,"61":"NetheriteBoots",NetheriteSword:62,"62":"NetheriteSword",NetheritePickaxe:63,"63":"NetheritePickaxe",NetheriteAxe:64,"64":"NetheriteAxe",NetheriteShovel:65,"65":"NetheriteShovel",NetheriteHoe:66,"66":"NetheriteHoe", });
/**
*/
__exports.Enchantment = Object.freeze({ Protection:0,"0":"Protection",FireProtection:1,"1":"FireProtection",FeatherFalling:2,"2":"FeatherFalling",BlastProtection:3,"3":"BlastProtection",ProjectileProtection:4,"4":"ProjectileProtection",Respiration:5,"5":"Respiration",AquaAffinity:6,"6":"AquaAffinity",Thorns:7,"7":"Thorns",DepthStrider:8,"8":"DepthStrider",Sharpness:9,"9":"Sharpness",Smite:10,"10":"Smite",BaneOfArthropods:11,"11":"BaneOfArthropods",Knockback:12,"12":"Knockback",FireAspect:13,"13":"FireAspect",Looting:14,"14":"Looting",Efficiency:15,"15":"Efficiency",SilkTouch:16,"16":"SilkTouch",Unbreaking:17,"17":"Unbreaking",Fortune:18,"18":"Fortune",Power:19,"19":"Power",Punch:20,"20":"Punch",Flame:21,"21":"Flame",Infinity:22,"22":"Infinity",LuckOfTheSea:23,"23":"LuckOfTheSea",Lure:24,"24":"Lure",FrostWalker:25,"25":"FrostWalker",Mending:26,"26":"Mending",BindingCurse:27,"27":"BindingCurse",VanishingCurse:28,"28":"VanishingCurse",Sweeping:29,"29":"Sweeping",Loyalty:30,"30":"Loyalty",Impaling:31,"31":"Impaling",Riptide:32,"32":"Riptide",Channeling:33,"33":"Channeling",Multishot:34,"34":"Multishot",QuickCharge:35,"35":"QuickCharge",Piercing:36,"36":"Piercing", });
/**
*/
class Cracker {

    static __wrap(ptr) {
        const obj = Object.create(Cracker.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_cracker_free(ptr);
    }
    /**
    * @param {number} thread_id
    * @param {number} threads
    */
    constructor(thread_id, threads) {
        var ret = wasm.cracker_new(thread_id, threads);
        return Cracker.__wrap(ret);
    }
    /**
    */
    reset() {
        wasm.cracker_reset(this.ptr);
    }
    /**
    * @returns {number}
    */
    get possibleSeeds() {
        var ret = wasm.cracker_possible_seeds(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get seed() {
        var ret = wasm.cracker_seed(this.ptr);
        return ret;
    }
    /**
    * @param {EnchantmentTableInfo} info
    * @param {EnchantmentTableInfo} info2
    */
    firstInput(info, info2) {
        _assertClass(info, EnchantmentTableInfo);
        var ptr0 = info.ptr;
        info.ptr = 0;
        _assertClass(info2, EnchantmentTableInfo);
        var ptr1 = info2.ptr;
        info2.ptr = 0;
        wasm.cracker_firstInput(this.ptr, ptr0, ptr1);
    }
    /**
    * @param {EnchantmentTableInfo} info
    */
    addInput(info) {
        _assertClass(info, EnchantmentTableInfo);
        var ptr0 = info.ptr;
        info.ptr = 0;
        wasm.cracker_addInput(this.ptr, ptr0);
    }
    /**
    * @param {number} x
    * @returns {boolean}
    */
    contains(x) {
        var ret = wasm.cracker_contains(this.ptr, x);
        return ret !== 0;
    }
}
__exports.Cracker = Cracker;
/**
*/
class EnchantmentInstance {

    static __wrap(ptr) {
        const obj = Object.create(EnchantmentInstance.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_enchantmentinstance_free(ptr);
    }
    /**
    * @returns {number}
    */
    get enchantment() {
        var ret = wasm.__wbg_get_enchantmentinstance_enchantment(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set enchantment(arg0) {
        wasm.__wbg_set_enchantmentinstance_enchantment(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get level() {
        var ret = wasm.__wbg_get_enchantmentinstance_level(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set level(arg0) {
        wasm.__wbg_set_enchantmentinstance_level(this.ptr, arg0);
    }
    /**
    * @param {number} enchantment
    * @param {number} level
    */
    constructor(enchantment, level) {
        var ret = wasm.enchantmentinstance_new(enchantment, level);
        return EnchantmentInstance.__wrap(ret);
    }
}
__exports.EnchantmentInstance = EnchantmentInstance;
/**
*/
class EnchantmentTableInfo {

    static __wrap(ptr) {
        const obj = Object.create(EnchantmentTableInfo.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_enchantmenttableinfo_free(ptr);
    }
    /**
    * @param {number} shelves
    * @param {number} slot1
    * @param {number} slot2
    * @param {number} slot3
    */
    constructor(shelves, slot1, slot2, slot3) {
        var ret = wasm.enchantmenttableinfo_new(shelves, slot1, slot2, slot3);
        return EnchantmentTableInfo.__wrap(ret);
    }
}
__exports.EnchantmentTableInfo = EnchantmentTableInfo;
/**
*/
class Manipulator {

    static __wrap(ptr) {
        const obj = Object.create(Manipulator.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_manipulator_free(ptr);
    }
    /**
    * @param {number} seed1
    * @param {number} seed2
    */
    constructor(seed1, seed2) {
        var ret = wasm.manipulator_new(seed1, seed2);
        return ret === 0 ? undefined : Manipulator.__wrap(ret);
    }
    /**
    * @param {number} seed1
    * @param {number} seed2
    * @returns {boolean}
    */
    changeSeed(seed1, seed2) {
        var ret = wasm.manipulator_changeSeed(this.ptr, seed1, seed2);
        return ret !== 0;
    }
    /**
    * @returns {Uint8Array}
    */
    get playerSeed() {
        var ret = wasm.manipulator_player_seed(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} item
    * @param {number} max_shelves
    * @param {number} player_level
    * @param {number} version
    * @returns {Int32Array | undefined}
    */
    simulate(item, max_shelves, player_level, version) {
        var ret = wasm.manipulator_simulate(this.ptr, item, max_shelves, player_level, version);
        return takeObject(ret);
    }
    /**
    * @param {number} times_needed
    * @param {number} chosen_slot
    * @param {number} player_level
    * @returns {number}
    */
    updateSeed(times_needed, chosen_slot, player_level) {
        var ret = wasm.manipulator_updateSeed(this.ptr, times_needed, chosen_slot, player_level);
        return ret;
    }
    /**
    * @param {number} item
    * @param {EnchantmentInstance} ench
    */
    updateItem(item, ench) {
        _assertClass(ench, EnchantmentInstance);
        wasm.manipulator_updateItem(this.ptr, item, ench.ptr);
    }
    /**
    * @param {number} item
    */
    reset(item) {
        wasm.manipulator_reset(this.ptr, item);
    }
}
__exports.Manipulator = Manipulator;
/**
*/
class Utilities {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_utilities_free(ptr);
    }
    /**
    * @param {number} mat
    * @returns {number}
    */
    static materialIntroducedVersion(mat) {
        var ret = wasm.utilities_materialIntroducedVersion(mat);
        return ret >>> 0;
    }
    /**
    * @param {number} item
    * @returns {number}
    */
    static itemIntroducedVersion(item) {
        var ret = wasm.utilities_itemIntroducedVersion(item);
        return ret >>> 0;
    }
    /**
    * @param {number} ench
    * @returns {number}
    */
    static enchantmentIntroducedVersion(ench) {
        var ret = wasm.utilities_enchantmentIntroducedVersion(ench);
        return ret >>> 0;
    }
    /**
    * @param {number} ench
    * @param {number} item
    * @returns {number}
    */
    static getMaxLevelInTable(ench, item) {
        var ret = wasm.utilities_getMaxLevelInTable(ench, item);
        return ret;
    }
    /**
    * @param {number} ench1
    * @param {number} ench2
    * @param {number} version
    * @returns {boolean}
    */
    static areEnchantmentsCompatible(ench1, ench2, version) {
        var ret = wasm.utilities_areEnchantmentsCompatible(ench1, ench2, version);
        return ret !== 0;
    }
    /**
    * @param {number} item
    * @returns {Uint8Array}
    */
    static getEnchantments(item) {
        var ret = wasm.utilities_getEnchantments(item);
        return takeObject(ret);
    }
    /**
    * @param {number} ench
    * @returns {boolean}
    */
    static isTreasure(ench) {
        var ret = wasm.utilities_isTreasure(ench);
        return ret !== 0;
    }
    /**
    * @param {number} material
    * @returns {Uint8Array}
    */
    static getItems(material) {
        var ret = wasm.utilities_getItems(material);
        return takeObject(ret);
    }
}
__exports.Utilities = Utilities;

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
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
}

async function init(input) {
    if (typeof input === 'undefined') {
        let src;
        if (typeof document === 'undefined') {
            src = location.href;
        } else {
            src = document.currentScript.src;
        }
        input = src.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_length_e9f6f145de2fede5 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_1223aa114a1f5fe7 = function(arg0) {
        var ret = new Int32Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setindex_255348590b4319fd = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_newwithlength_48451d71403bfede = function(arg0) {
        var ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setindex_1eb60b7379dcd66c = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

wasm_bindgen = Object.assign(init, __exports);

})();
