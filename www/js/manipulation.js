// What the hell have i ported

/**
 * @enum {string}
 */
const items = {
    LEATHER_HELMET: "leather_helmet",
    LEATHER_CHESTPLATE: "leather_chestplate",
    LEATHER_LEGGINGS: "leather_leggings",
    LEATHER_BOOTS: "leather_boots",
    IRON_HELMET: "iron_helmet",
    IRON_CHESTPLATE: "iron_chestplate",
    IRON_LEGGINGS: "iron_leggings",
    IRON_BOOTS: "iron_boots",
    CHAINMAIL_HELMET: "chainmail_helmet",
    CHAINMAIL_CHESTPLATE: "chainmail_chestplate",
    CHAINMAIL_LEGGINGS: "chainmail_leggings",
    CHAINMAIL_BOOTS: "chainmail_boots",
    GOLDEN_HELMET: "golden_helmet",
    GOLDEN_CHESTPLATE: "golden_chestplate",
    GOLDEN_LEGGINGS: "golden_leggings",
    GOLDEN_BOOTS: "golden_boots",
    DIAMOND_HELMET: "diamond_helmet",
    DIAMOND_CHESTPLATE: "diamond_chestplate",
    DIAMOND_LEGGINGS: "diamond_leggings",
    DIAMOND_BOOTS: "diamond_boots",
    WOODEN_SWORD: "wooden_sword",
    STONE_SWORD: "stone_sword",
    IRON_SWORD: "iron_sword",
    GOLDEN_SWORD: "golden_sword",
    DIAMOND_SWORD: "diamond_sword",
    WOODEN_PICKAXE: "wooden_pickaxe",
    STONE_PICKAXE: "stone_pickaxe",
    IRON_PICKAXE: "iron_pickaxe",
    GOLDEN_PICKAXE: "golden_pickaxe",
    DIAMOND_PICKAXE: "diamond_pickaxe",
    WOODEN_AXE: "wooden_axe",
    STONE_AXE: "stone_axe",
    IRON_AXE: "iron_axe",
    GOLDEN_AXE: "golden_axe",
    DIAMOND_AXE: "diamond_axe",
    WOODEN_SHOVEL: "wooden_shovel",
    STONE_SHOVEL: "stone_shovel",
    IRON_SHOVEL: "iron_shovel",
    GOLDEN_SHOVEL: "golden_shovel",
    DIAMOND_SHOVEL: "diamond_shovel",
    WOODEN_HOE: "wooden_hoe",
    STONE_HOE: "stone_hoe",
    IRON_HOE: "iron_hoe",
    GOLDEN_HOE: "golden_hoe",
    DIAMOND_HOE: "diamond_hoe",
    CARROT_ON_A_STICK: "carrot_on_a_stick",
    FISHING_ROD: "fishing_rod",
    FLINT_AND_STEEL: "flint_and_steel",
    SHEARS: "shears",
    BOW: "bow",
    BOOK: "book",
    PUMPKIN: "pumpkin",
    SKULL: "skull",
    // 1.9
    ELYTRA: "elytra",
    SHIELD: "shield",
    // 1.13
    TRIDENT: "trident",
    TURTLE_HELMET: "turtle_helmet",
    // 1.14
    CROSSBOW: "crossbow",
    // 1.16
    NETHERITE_HELMET: "netherite_helmet",
    NETHERITE_CHESTPLATE: "netherite_chestplate",
    NETHERITE_LEGGINGS: "netherite_leggings",
    NETHERITE_BOOTS: "netherite_boots",
    NETHERITE_SWORD: "netherite_sword",
    NETHERITE_PICKAXE: "netherite_pickaxe",
    NETHERITE_AXE: "netherite_axe",
    NETHERITE_SHOVEL: "netherite_shovel",
    NETHERITE_HOE: "netherite_hoe"
};

/**
 * @enum {number}
 */
const materials = {
    NETHERITE: 0,
    DIAMOND: 1,
    GOLD: 2,
    IRON: 3,
    FIRE: 4,
    STONE: 5,
    LEATHER: 6
};

/**
 * @typedef {object} EnumOrdinal
 * @property {number} ordinal
 * @property {string} name
 */

/**
 * @enum {EnumOrdinal}
 */
const versions = {
    V1_8: "1.8 - 1.8.9",
    V1_9: "1.9 - 1.10.2",
    V1_11: "1.11",
    V1_11_1: "1.11.1 - 1.12.2",
    V1_13: "1.13 - 1.13.2",
    V1_14: "1.14 - 1.14.2",
    V1_14_3: "1.14.3 - 1.15.2",
    V1_16: "1.16"
};

{
    let i = 0;
    for(const key in versions) {
        versions[key] = {
            name: versions[key],
            ordinal: i++,
            toString: () => versions[key]
        };
    }
}

/**
 * @enum {string}
 */
const enchantments = {
    PROTECTION: "protection",
    FIRE_PROTECTION: "fire_protection",
    FEATHER_FALLING: "feather_falling",
    BLAST_PROTECTION: "blast_protection",
    PROJECTILE_PROTECTION: "projectile_protection",
    RESPIRATION: "respiration",
    AQUA_AFFINITY: "aqua_affinity",
    THORNS: "thorns",
    DEPTH_STRIDER: "depth_strider",
    SHARPNESS: "sharpness",
    SMITE: "smite",
    BANE_OF_ARTHROPODS: "bane_of_arthropods",
    KNOCKBACK: "knockback",
    FIRE_ASPECT: "fire_aspect",
    LOOTING: "looting",
    EFFICIENCY: "efficiency",
    SILK_TOUCH: "silk_touch",
    UNBREAKING: "unbreaking",
    FORTUNE: "fortune",
    POWER: "power",
    PUNCH: "punch",
    FLAME: "flame",
    INFINITY: "infinity",
    LUCK_OF_THE_SEA: "luck_of_the_sea",
    LURE: "lure",
    // 1.9
    FROST_WALKER: "frost_walker",
    MENDING: "mending",
    // 1.11
    BINDING_CURSE: "binding_curse",
    VANISHING_CURSE: "vanishing_curse",
    // 1.11.1
    SWEEPING: "sweeping",
    // 1.13
    LOYALTY: "loyalty",
    IMPALING: "impaling",
    RIPTIDE: "riptide",
    CHANNELING: "channeling",
    // 1.14
    MULTISHOT: "multishot",
    QUICK_CHARGE: "quick_charge",
    PIERCING: "piercing"
};

class Version {
    static get versions() {
        return versions;
    }

    /**
     * @param {EnumOrdinal} first 
     * @param {EnumOrdinal} second
     * @returns {boolean}
     */
    static before(first, second) {
        return first.ordinal < second.ordinal;
    }

    /**
     * @param {EnumOrdinal} first 
     * @param {EnumOrdinal} second
     * @returns {boolean}
     */
    static after(first, second) {
        return first.ordinal > second.ordinal;
    }

    static latest() {
        const values = Object.values(versions);
        return values[values.length - 1];
    }
}

class Material {
    static get materials() {
        return materials;
    }

    /**
     * @param {number} material 
     * @returns {EnumOrdinal}
     */
    static getIntroducedVersion(material) {
        switch(material) {
        case this.materials.NETHERITE:
            return versions.V1_16;
        default:
            return versions.V1_8;
        }
    }
}

class Item {
    static get items() {
        return items;
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isArmor(item) {
        return this.isHelmet(item) || this.isChestplate(item)
            || this.isLeggings(item) || this.isBoots(item);
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isHelmet(item) {
        return item.endsWith("_helmet");
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isChestplate(item) {
        return item.endsWith("_chestplate");
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isLeggings(item) {
        return item.endsWith("_leggings");
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isBoots(item) {
        return item.endsWith("_boots");
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isSword(item) {
        return item.endsWith("_sword");
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isAxe(item) {
        return item.endsWith("_axe");
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static isTool(item) {
        return this.isAxe(item) || item.endsWith("_pickaxe")
            || item.endsWith("_shovel") || item.endsWith("_hoe");
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static hasDurability(item) {
        return this.isArmor(item) || this.isSword(item)
            || this.isTool(item) || [items.BOW, items.CARROT_ON_A_STICK,
            items.ELYTRA, items.FISHING_ROD, items.FLINT_AND_STEEL,
            items.SHEARS, items.SHIELD, items.TRIDENT, items.CROSSBOW].includes(item);
    }

    /**
     * @param {string} item 
     * @returns {number}
     */
    static getEnchantability(item) {
        if(this.isArmor(item)) {
            if(item.startsWith("leather_")) return 15;
            if(item.startsWith("iron_")) return 9;
            if(item.startsWith("chainmail_")) return 12;
            if(item.startsWith("golden_")) return 25;
            if(item.startsWith("diamond_")) return 10;
            if(item.startsWith("turtle_")) return 9;
            if(item.startsWith("netherite_")) return 15;
        } else if(this.isSword(item) || this.isTool(item)) {
            if(item.startsWith("wooden_")) return 15;
            if(item.startsWith("stone_")) return 5;
            if(item.startsWith("iron_")) return 14;
            if(item.startsWith("golden_")) return 22;
            if(item.startsWith("diamond_")) return 10;
            if(item.startsWith("netherite_")) return 15;
        } else {
            switch(item) {
            case items.BOW:
            case items.FISHING_ROD:
            case items.TRIDENT:
            case items.CROSSBOW:
            case items.BOOK:
                return 1;
            default:
                return 0;
            }
        }
    }

    /**
     * @param {string} item 
     * @returns {boolean}
     */
    static getIntroducedVersion(item) {
        switch(item) {
        case items.ELYTRA:
        case items.SHIELD:
            return versions.V1_9;
        case items.TRIDENT:
        case items.TURTLE_HELMET:
            return versions.V1_13;
        case items.CROSSBOW:
            return versions.V1_14;
        case items.NETHERITE_HELMET:
        case items.NETHERITE_CHESTPLATE:
        case items.NETHERITE_LEGGINGS:
        case items.NETHERITE_BOOTS:
        case items.NETHERITE_SWORD:
        case items.NETHERITE_PICKAXE:
        case items.NETHERITE_AXE:
        case items.NETHERITE_SHOVEL:
        case items.NETHERITE_HOE:
            return versions.V1_16;
        default:
            return versions.V1_8;
        }
    }
}

class Enchantment {
    static get enchantments() {
        return enchantments;
    }

    /**
     * @param {number} startLevel 
     * @param {number} numLevels 
     * @returns {number}
     */
    static levelsToXP(startLevel, numLevels) {
        let amt = 0;
        const endLevel = startLevel - numLevels;
        for (let level = startLevel; level > endLevel; level--) {
            if (level > 30) amt += (9 * (level-1)) - 158;
            else if (level > 15) amt += (5 * (level-1)) - 38;
            else amt += (2 * (level-1)) + 7;
        }
        return amt;
    }

    /**
     * @param {string} enchantment 
     * @param {string} item 
     * @param {boolean} primary 
     * @returns {boolean}
     */
    static canApply(enchantment, item, primary) {
        if(items.BOOK === item) return true;

        switch(enchantment) {
        case enchantments.PROTECTION:
        case enchantments.FIRE_PROTECTION:
        case enchantments.BLAST_PROTECTION:
        case enchantments.PROJECTILE_PROTECTION:
            return Item.isArmor(item);
        case enchantments.THORNS:
            return primary ? Item.isChestplate(item) : Item.isArmor(item);
        case enchantments.FEATHER_FALLING:
        case enchantments.DEPTH_STRIDER:
        case enchantments.FROST_WALKER:
            return Item.isBoots(item);
        case enchantments.RESPIRATION:
        case enchantments.AQUA_AFFINITY:
            return Item.isHelmet(item);
        case enchantments.BINDING_CURSE:
            return Item.isArmor(item) || Item.PUMPKIN.equals(item) 
            || Item.ELYTRA.equals(item) || Item.SKULL.equals(item);
        case enchantments.SHARPNESS:
        case enchantments.SMITE:
        case enchantments.BANE_OF_ARTHROPODS:
            return items.isSword(item) || !primary && items.isAxe(item);
        case enchantments.KNOCKBACK:
        case enchantments.FIRE_ASPECT:
        case enchantments.LOOTING:
        case enchantments.SWEEPING:
            return items.isSword(item);
        case enchantments.EFFICIENCY:
            return items.isTool(item) || !primary && items.SHEARS.equals(item);
        case enchantments.SILK_TOUCH:
        case enchantments.FORTUNE:
            return items.isTool(item);
        case enchantments.POWER:
        case enchantments.PUNCH:
        case enchantments.FLAME:
        case enchantments.INFINITY:
            return items.BOW.equals(item);
        case enchantments.LUCK_OF_THE_SEA:
        case enchantments.LURE:
            return items.FISHING_ROD.equals(item);
        case enchantments.UNBREAKING:
        case enchantments.MENDING:
            return items.hasDurability(item);
        case enchantments.VANISHING_CURSE:
            return items.hasDurability(item) || items.PUMPKIN.equals(item) || items.SKULL.equals(item);
        case enchantments.LOYALTY:
        case enchantments.IMPALING:
        case enchantments.RIPTIDE:
        case enchantments.CHANNELING:
            return items.TRIDENT.equals(item);
        case enchantments.MULTISHOT:
        case enchantments.QUICK_CHARGE:
        case enchantments.PIERCING:
            return items.CROSSBOW.equals(item);
        }
    }

    /**
     * @param {string} enchantment
     * @returns {boolean}
     */
    static isTreasure(enchantment) {
        return [enchantments.FROST_WALKER, enchantments.MENDING,
            enchantments.BINDING_CURSE, enchantments.VANISHING_CURSE].includes(enchantment);
    }

    /**
     * @param {string} enchantment
     * @returns {number}
     */
    static getMaxLevel(enchantment) {
        switch(enchantment) {
        case enchantments.SHARPNESS:
        case enchantments.SMITE:
        case enchantments.BANE_OF_ARTHROPODS:
        case enchantments.EFFICIENCY:
        case enchantments.POWER:
        case enchantments.IMPALING:
            return 5;
        case enchantments.PROTECTION:
        case enchantments.FIRE_PROTECTION:
        case enchantments.BLAST_PROTECTION:
        case enchantments.PROJECTILE_PROTECTION:
        case enchantments.FEATHER_FALLING:
        case enchantments.PIERCING:
            return 4;
        case enchantments.THORNS:
        case enchantments.DEPTH_STRIDER:
        case enchantments.RESPIRATION:
        case enchantments.LOOTING:
        case enchantments.SWEEPING:
        case enchantments.FORTUNE:
        case enchantments.LUCK_OF_THE_SEA:
        case enchantments.LURE:
        case enchantments.UNBREAKING:
        case enchantments.LOYALTY:
        case enchantments.RIPTIDE:
        case enchantments.QUICK_CHARGE:
            return 3;
        case enchantments.FROST_WALKER:
        case enchantments.KNOCKBACK:
        case enchantments.FIRE_ASPECT:
        case enchantments.PUNCH:
            return 2;
        case enchantments.AQUA_AFFINITY:
        case enchantments.BINDING_CURSE:
        case enchantments.SILK_TOUCH:
        case enchantments.FLAME:
        case enchantments.INFINITY:
        case enchantments.MENDING:
        case enchantments.VANISHING_CURSE:
        case enchantments.CHANNELING:
        case enchantments.MULTISHOT:
            return 1;
        }
    }

    /**
     * @param {string} enchantment 
     * @param {number} level 
     * @returns {number}
     */
    static getMinEnchantability(enchantment, level) {
        switch (enchantment) {
        case enchantments.PROTECTION:
            return 1 + (level - 1) * 11;
        case enchantments.FIRE_PROTECTION:
            return 10 + (level - 1) * 8;
        case enchantments.FEATHER_FALLING:
            return 5 + (level - 1) * 6;
        case enchantments.BLAST_PROTECTION:
            return 5 + (level - 1) * 8;
        case enchantments.PROJECTILE_PROTECTION:
            return 3 + (level - 1) * 6;
        case enchantments.RESPIRATION:
            return level * 10;
        case enchantments.AQUA_AFFINITY:
            return 1;
        case enchantments.THORNS:
            return 10 + (level - 1) * 20;
        case enchantments.DEPTH_STRIDER:
            return level * 10;
        case enchantments.FROST_WALKER:
            return level * 10;
        case enchantments.BINDING_CURSE:
            return 25;
        case enchantments.SHARPNESS:
            return 1 + (level - 1) * 11;
        case enchantments.SMITE:
            return 5 + (level - 1) * 8;
        case enchantments.BANE_OF_ARTHROPODS:
            return 5 + (level - 1) * 8;
        case enchantments.KNOCKBACK:
            return 5 + (level - 1) * 20;
        case enchantments.FIRE_ASPECT:
            return 10 + (level - 1) * 20;
        case enchantments.LOOTING:
            return 15 + (level - 1) * 9;
        case enchantments.SWEEPING:
            return 5 + (level - 1) * 9;
        case enchantments.EFFICIENCY:
            return 1 + (level - 1) * 10;
        case enchantments.SILK_TOUCH:
            return 15;
        case enchantments.UNBREAKING:
            return 5 + (level - 1) * 8;
        case enchantments.FORTUNE:
            return 15 + (level - 1) * 9;
        case enchantments.POWER:
            return 1 + (level - 1) * 10;
        case enchantments.PUNCH:
            return 12 + (level - 1) * 20;
        case enchantments.FLAME:
            return 20;
        case enchantments.INFINITY:
            return 20;
        case enchantments.LUCK_OF_THE_SEA:
            return 15 + (level - 1) * 9;
        case enchantments.LURE:
            return 15 + (level - 1) * 9;
        case enchantments.MENDING:
            return 25;
        case enchantments.VANISHING_CURSE:
            return 25;
        case enchantments.LOYALTY:
            return 5 + level * 7;
        case enchantments.IMPALING:
            return 1 + (level - 1) * 8;
        case enchantments.RIPTIDE:
            return 10 + level * 7;
        case enchantments.CHANNELING:
            return 25;
        case enchantments.MULTISHOT:
            return 20;
        case enchantments.QUICK_CHARGE:
            return 12 + (level - 1) * 20;
        case enchantments.PIERCING:
            return 1 + (level - 1) * 10;
        }
    }

    /**
     * @param {string} enchantment 
     * @param {number} level 
     * @returns {number}
     */
    static getMaxEnchantability(enchantment, level) {
        switch (enchantment) {
        case enchantments.PROTECTION:
            return 1 + level * 11;
        case enchantments.FIRE_PROTECTION:
            return 10 + level * 8;
        case enchantments.FEATHER_FALLING:
            return 5 + level * 6;
        case enchantments.BLAST_PROTECTION:
            return 5 + level * 8;
        case enchantments.PROJECTILE_PROTECTION:
            return 3 + level * 6;
        case enchantments.RESPIRATION:
            return 30 + level * 10;
        case enchantments.AQUA_AFFINITY:
            return 41;
        case enchantments.THORNS:
            return 40 + level * 20;
        case enchantments.DEPTH_STRIDER:
            return 15 + level * 10;
        case enchantments.FROST_WALKER:
            return 15 + level * 10;
        case enchantments.BINDING_CURSE:
            return 50;
        case enchantments.SHARPNESS:
            return 21 + (level - 1) * 11;
        case enchantments.SMITE:
            return 25 + (level - 1) * 8;
        case enchantments.BANE_OF_ARTHROPODS:
            return 25 + (level - 1) * 8;
        case enchantments.KNOCKBACK:
            return 55 + (level - 1) * 20;
        case enchantments.FIRE_ASPECT:
            return 40 + level * 20;
        case enchantments.LOOTING:
            return 65 + (level - 1) * 9;
        case enchantments.SWEEPING:
            return 20 + (level - 1) * 9;
        case enchantments.EFFICIENCY:
            return 50 + level * 10;
        case enchantments.SILK_TOUCH:
            return 65;
        case enchantments.UNBREAKING:
            return 55 + (level - 1) * 8;
        case enchantments.FORTUNE:
            return 65 + (level - 1) * 9;
        case enchantments.POWER:
            return 16 + (level - 1) * 10;
        case enchantments.PUNCH:
            return 37 + (level - 1) * 20;
        case enchantments.FLAME:
            return 50;
        case enchantments.INFINITY:
            return 50;
        case enchantments.LUCK_OF_THE_SEA:
            return 65 + (level - 1) * 9;
        case enchantments.LURE:
            return 65 + (level - 1) * 9;
        case enchantments.MENDING:
            return 75;
        case enchantments.VANISHING_CURSE:
            return 50;
        case enchantments.LOYALTY:
            return 50;
        case enchantments.IMPALING:
            return 21 + (level - 1) * 8;
        case enchantments.RIPTIDE:
            return 50;
        case enchantments.CHANNELING:
            return 50;
        case enchantments.MULTISHOT:
            return 50;
        case enchantments.QUICK_CHARGE:
            return 50;
        case enchantments.PIERCING:
            return 50;
        }
    }

    /**
     * @param {string} enchantment 
     * @param {EnumOrdinal} version 
     * @returns {number}
     */
    static getWeight(enchantment, version) {
        switch (enchantment) {
        case enchantments.PROTECTION:
        case enchantments.SHARPNESS:
        case enchantments.EFFICIENCY:
        case enchantments.POWER:
        case enchantments.PIERCING:
            return version == versions.V1_14 ? 30 : 10;
        case enchantments.FIRE_PROTECTION:
        case enchantments.FEATHER_FALLING:
        case enchantments.PROJECTILE_PROTECTION:
        case enchantments.SMITE:
        case enchantments.BANE_OF_ARTHROPODS:
        case enchantments.KNOCKBACK:
        case enchantments.UNBREAKING:
        case enchantments.LOYALTY:
        case enchantments.QUICK_CHARGE:
            return version == versions.V1_14 ? 10 : 5;
        case enchantments.BLAST_PROTECTION:
        case enchantments.RESPIRATION:
        case enchantments.AQUA_AFFINITY:
        case enchantments.DEPTH_STRIDER:
        case enchantments.FROST_WALKER:
        case enchantments.FIRE_ASPECT:
        case enchantments.LOOTING:
        case enchantments.SWEEPING:
        case enchantments.FORTUNE:
        case enchantments.PUNCH:
        case enchantments.FLAME:
        case enchantments.LUCK_OF_THE_SEA:
        case enchantments.LURE:
        case enchantments.MENDING:
        case enchantments.IMPALING:
        case enchantments.RIPTIDE:
        case enchantments.MULTISHOT:
            return version == versions.V1_14 ? 3 : 2;
        case enchantments.THORNS:
        case enchantments.BINDING_CURSE:
        case enchantments.SILK_TOUCH:
        case enchantments.INFINITY:
        case enchantments.VANISHING_CURSE:
        case enchantments.CHANNELING:
            return 1;
        }
    }

    /**
     * @param {string} enchantment
     * @returns {EnumOrdinal}
     */
    static getIntroducedVersion(enchantment) {
        switch (enchantment) {
        case enchantments.FROST_WALKER:
        case enchantments.MENDING:
            return versions.V1_9;
        case enchantments.BINDING_CURSE:
        case enchantments.VANISHING_CURSE:
            return versions.V1_11;
        case enchantments.SWEEPING:
            return versions.V1_11_1;
        case enchantments.LOYALTY:
        case enchantments.IMPALING:
        case enchantments.RIPTIDE:
        case enchantments.CHANNELING:
            return versions.V1_13;
        case enchantments.MULTISHOT:
        case enchantments.QUICK_CHARGE:
        case enchantments.PIERCING:
            return versions.V1_14;
        default:
            return versions.V1_8;
        }
    }

    /**
     * @param {string} enchantment 
     * @param {string} item
     * @returns {number}
     */
    static getMaxLevelInTable(enchantment, item) {
        const enchantability = Item.getEnchantability(item);
        if(enchantability === 0 || this.isTreasure(enchantment) || !this.canApply(enchantment, item, true)) return 0;
        let level = 30 + 1 + enchantability/4 + enchantability/4;
        level += Math.round(level * 0.15);
        for(let maxLevel = this.getMaxLevel(enchantment); maxLevel >= 1; maxLevel--) {
            if(level >= this.getMinEnchantability(enchantment, maxLevel)) return maxLevel;
        }
        return 0;
    }
}
