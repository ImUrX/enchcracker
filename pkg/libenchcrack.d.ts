/* tslint:disable */
/* eslint-disable */

export class Cracker {
    free(): void;
    [Symbol.dispose](): void;
    addInput(info: EnchantmentTableInfo): void;
    contains(x: number): boolean;
    firstInput(info: EnchantmentTableInfo, info2: EnchantmentTableInfo): void;
    constructor(thread_id: number, threads: number);
    reset(): void;
    readonly possibleSeeds: number;
    readonly seed: number;
}

export enum Enchantment {
    Protection = 0,
    FireProtection = 1,
    FeatherFalling = 2,
    BlastProtection = 3,
    ProjectileProtection = 4,
    Respiration = 5,
    AquaAffinity = 6,
    Thorns = 7,
    DepthStrider = 8,
    Sharpness = 9,
    Smite = 10,
    BaneOfArthropods = 11,
    Knockback = 12,
    FireAspect = 13,
    Looting = 14,
    Efficiency = 15,
    SilkTouch = 16,
    Unbreaking = 17,
    Fortune = 18,
    Power = 19,
    Punch = 20,
    Flame = 21,
    Infinity = 22,
    LuckOfTheSea = 23,
    Lure = 24,
    FrostWalker = 25,
    Mending = 26,
    BindingCurse = 27,
    VanishingCurse = 28,
    Sweeping = 29,
    Loyalty = 30,
    Impaling = 31,
    Riptide = 32,
    Channeling = 33,
    Multishot = 34,
    QuickCharge = 35,
    Piercing = 36,
    SoulSpeed = 37,
    Density = 38,
    Breach = 39,
    WindBurst = 40,
    Lunge = 41,
}

export class EnchantmentInstance {
    free(): void;
    [Symbol.dispose](): void;
    constructor(enchantment: Enchantment, level: number);
    enchantment: Enchantment;
    level: number;
}

export class EnchantmentTableInfo {
    free(): void;
    [Symbol.dispose](): void;
    constructor(shelves: number, slot1: number, slot2: number, slot3: number);
}

export enum Item {
    LeatherHelmet = 0,
    LeatherChestplate = 1,
    LeatherLeggings = 2,
    LeatherBoots = 3,
    IronHelmet = 4,
    IronChestplate = 5,
    IronLeggings = 6,
    IronBoots = 7,
    ChainmailHelmet = 8,
    ChainmailChestplate = 9,
    ChainmailLeggings = 10,
    ChainmailBoots = 11,
    GoldenHelmet = 12,
    GoldenChestplate = 13,
    GoldenLeggings = 14,
    GoldenBoots = 15,
    DiamondHelmet = 16,
    DiamondChestplate = 17,
    DiamondLeggings = 18,
    DiamondBoots = 19,
    WoodenSword = 20,
    StoneSword = 21,
    IronSword = 22,
    GoldenSword = 23,
    DiamondSword = 24,
    WoodenPickaxe = 25,
    StonePickaxe = 26,
    IronPickaxe = 27,
    GoldenPickaxe = 28,
    DiamondPickaxe = 29,
    WoodenAxe = 30,
    StoneAxe = 31,
    IronAxe = 32,
    GoldenAxe = 33,
    DiamondAxe = 34,
    WoodenShovel = 35,
    StoneShovel = 36,
    IronShovel = 37,
    GoldenShovel = 38,
    DiamondShovel = 39,
    WoodenHoe = 40,
    StoneHoe = 41,
    IronHoe = 42,
    GoldenHoe = 43,
    DiamondHoe = 44,
    CarrotOnAStick = 45,
    FishingRod = 46,
    FlintAndSteel = 47,
    Shears = 48,
    Bow = 49,
    Book = 50,
    Pumpkin = 51,
    Skull = 52,
    Elytra = 53,
    Shield = 54,
    Trident = 55,
    TurtleHelmet = 56,
    Crossbow = 57,
    NetheriteHelmet = 58,
    NetheriteChestplate = 59,
    NetheriteLeggings = 60,
    NetheriteBoots = 61,
    NetheriteSword = 62,
    NetheritePickaxe = 63,
    NetheriteAxe = 64,
    NetheriteShovel = 65,
    NetheriteHoe = 66,
    Mace = 67,
    CopperHelmet = 68,
    CopperChestplate = 69,
    CopperLeggings = 70,
    CopperBoots = 71,
    CopperSword = 72,
    CopperPickaxe = 73,
    CopperAxe = 74,
    CopperShovel = 75,
    CopperHoe = 76,
    NetheriteSpear = 77,
    DiamondSpear = 78,
    GoldenSpear = 79,
    IronSpear = 80,
    CopperSpear = 81,
    StoneSpear = 82,
    WoodenSpear = 83,
}

export class Manipulator {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    changeSeed(seed1: number, seed2: number): boolean;
    static new(seed1: number, seed2: number): Manipulator | undefined;
    reset(item: Item): void;
    simulate(item: Item, max_shelves: number, player_level: number, version: Version): Int32Array | undefined;
    updateItem(item: Item, ench: EnchantmentInstance): void;
    updateSeed(times_needed: number, chosen_slot: number, player_level: number): number;
    readonly playerSeed: Uint8Array;
}

export enum Material {
    Netherite = 0,
    Diamond = 1,
    Golden = 2,
    Iron = 3,
    Chainmail = 4,
    Fire = 5,
    Turtle = 6,
    Leather = 7,
    Stone = 8,
    Wooden = 9,
    Copper = 10,
    Book = 11,
}

export class Utilities {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static areEnchantmentsCompatible(ench1: Enchantment, ench2: Enchantment, version: Version): boolean;
    static enchantmentIntroducedVersion(ench: Enchantment): Version;
    static getEnchantments(item: Item): Uint8Array;
    static getItems(material: Material): Uint8Array;
    static getMaxLevelInTable(ench: Enchantment, item: Item): number;
    static isTreasure(ench: Enchantment): boolean;
    static itemIntroducedVersion(item: Item): Version;
    static materialIntroducedVersion(mat: Material): Version;
}

export enum Version {
    V1_8 = 0,
    V1_9 = 1,
    V1_11 = 2,
    V1_11_1 = 3,
    V1_13 = 4,
    V1_14 = 5,
    V1_14_3 = 6,
    V1_16 = 7,
    V1_21 = 8,
    V1_21_9 = 9,
    V1_21_11 = 10,
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_cracker_free: (a: number, b: number) => void;
    readonly __wbg_enchantmenttableinfo_free: (a: number, b: number) => void;
    readonly __wbg_manipulator_free: (a: number, b: number) => void;
    readonly __wbg_utilities_free: (a: number, b: number) => void;
    readonly cracker_addInput: (a: number, b: number) => void;
    readonly cracker_contains: (a: number, b: number) => number;
    readonly cracker_firstInput: (a: number, b: number, c: number) => void;
    readonly cracker_new: (a: number, b: number) => number;
    readonly cracker_possible_seeds: (a: number) => number;
    readonly cracker_reset: (a: number) => void;
    readonly cracker_seed: (a: number) => number;
    readonly enchantmenttableinfo_new: (a: number, b: number, c: number, d: number) => number;
    readonly manipulator_changeSeed: (a: number, b: number, c: number) => number;
    readonly manipulator_new: (a: number, b: number) => number;
    readonly manipulator_player_seed: (a: number) => any;
    readonly manipulator_reset: (a: number, b: number) => void;
    readonly manipulator_simulate: (a: number, b: number, c: number, d: number, e: number) => any;
    readonly manipulator_updateItem: (a: number, b: number, c: number) => void;
    readonly manipulator_updateSeed: (a: number, b: number, c: number, d: number) => number;
    readonly utilities_areEnchantmentsCompatible: (a: number, b: number, c: number) => number;
    readonly utilities_enchantmentIntroducedVersion: (a: number) => number;
    readonly utilities_getEnchantments: (a: number) => any;
    readonly utilities_getItems: (a: number) => any;
    readonly utilities_getMaxLevelInTable: (a: number, b: number) => number;
    readonly utilities_isTreasure: (a: number) => number;
    readonly utilities_itemIntroducedVersion: (a: number) => number;
    readonly utilities_materialIntroducedVersion: (a: number) => number;
    readonly __wbg_enchantmentinstance_free: (a: number, b: number) => void;
    readonly __wbg_get_enchantmentinstance_enchantment: (a: number) => number;
    readonly __wbg_get_enchantmentinstance_level: (a: number) => number;
    readonly __wbg_set_enchantmentinstance_enchantment: (a: number, b: number) => void;
    readonly __wbg_set_enchantmentinstance_level: (a: number, b: number) => void;
    readonly enchantmentinstance_new: (a: number, b: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
