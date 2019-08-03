cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        tutorial: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start () {
        this.index = 0;
        let saveVersion = {major: 0, minor: 2, fix: 0};
        this.initSession(saveVersion);
    },

    verifyUpdate: function(saved){
        if (saved.major == 0 && saved.minor == 1) this.updateV2();
        if (saved.major == 0 && saved.minor == 2) this.updateV3();
    },

    initSession: function(saveVersion){
        this.loadGame();
        window.gameGlobals = {};

        // verify if have gamesave or if it needs to be upgraded
        if (window.gameSession != null) {
            if (! window.gameSession.saveVersion)  window.gameSession.saveVersion = {major: 0, minor: 1, fix: 0};
            // if is old saveVersion update save
            this.verifyUpdate(window.gameSession.saveVersion);

            return
        }
        //if no save data, create save data

        window.gameSession = {};

        window.gameSession.xp = 0;

        window.gameSession.hp = 3;
        window.gameSession.hpMax = 3;

        // progress data
        window.gameSession.level = 1;
        window.gameSession.levelMin = 1;
        window.gameSession.treasureHunter = false;
        window.gameSession.trapFinder = false;
        window.gameSession.tracker = false;

        // inventory
        window.gameSession.inventory = {};

        window.gameSession.inventory.fire = 0;
        window.gameSession.inventory.fireMin = 0;
        window.gameSession.inventory.fireMax = 3;

        window.gameSession.inventory.ice = 0;
        window.gameSession.inventory.iceMin = 0;
        window.gameSession.inventory.iceMax = 3;

        window.gameSession.inventory.acid = 0;
        window.gameSession.inventory.acidMin = 0;
        window.gameSession.inventory.acidMax = 3;

        window.gameSession.inventory.electricity = 0;
        window.gameSession.inventory.electricityMin = 0;
        window.gameSession.inventory.electricityMax = 3;

        window.gameSession.inventory.spikes = 0;
        window.gameSession.inventory.spikesMin = 0;
        window.gameSession.inventory.spikesMax = 3;

        window.gameSession.inventory.poison = 0;
        window.gameSession.inventory.poisonMin = 0;
        window.gameSession.inventory.poisonMax = 3;

        window.gameSession.inventory.potion = 0;
        window.gameSession.inventory.potionMin = 0;
        window.gameSession.inventory.potionMax = 3;

        window.gameSession.inventory.melee = 1;
        window.gameSession.inventory.ranged = 1;
        window.gameSession.inventory.magic = 1;

        // upgrades
        window.gameSession.upgrades = {};

        window.gameSession.upgrades.fireMin = 1000;
        window.gameSession.upgrades.fireMax = 1000;
        window.gameSession.upgrades.iceMin = 1000;
        window.gameSession.upgrades.iceMax = 1000;
        window.gameSession.upgrades.acidMin = 1000;
        window.gameSession.upgrades.acidMax = 1000;
        window.gameSession.upgrades.electricityMin = 1000;
        window.gameSession.upgrades.electricityMax = 1000;
        window.gameSession.upgrades.spikesMin = 1000;
        window.gameSession.upgrades.spikesMax = 1000;
        window.gameSession.upgrades.poisonMin = 1000;
        window.gameSession.upgrades.poisonMax = 1000;

        window.gameSession.upgrades.potionMin = 1000;
        window.gameSession.upgrades.potionMax = 1000;

        window.gameSession.upgrades.hpMax = 1000;

        window.gameSession.upgrades.levelMin = 1000;
        window.gameSession.upgrades.info = 1000;

        window.gameSession.upgrades.melee = 1000;
        window.gameSession.upgrades.ranged = 1000;
        window.gameSession.upgrades.magic = 1000;

        //stats
        window.gameSession.stats = {};

        window.gameSession.stats.death = {};
        window.gameSession.stats.death.total = 0;
        window.gameSession.stats.death.fire = 0;
        window.gameSession.stats.death.ice = 0;
        window.gameSession.stats.death.acid = 0;
        window.gameSession.stats.death.electricity = 0;
        window.gameSession.stats.death.spikes = 0;
        window.gameSession.stats.death.poison = 0;
        window.gameSession.stats.death.melee = 0;
        window.gameSession.stats.death.ranged = 0;
        window.gameSession.stats.death.magic = 0;

        window.gameSession.stats.damage = {};
        window.gameSession.stats.damage.total = 0;
        window.gameSession.stats.damage.fire = 0;
        window.gameSession.stats.damage.ice = 0;
        window.gameSession.stats.damage.acid = 0;
        window.gameSession.stats.damage.electricity = 0;
        window.gameSession.stats.damage.spikes = 0;
        window.gameSession.stats.damage.poison = 0;
        window.gameSession.stats.damage.melee = 0;
        window.gameSession.stats.damage.ranged = 0;
        window.gameSession.stats.damage.magic = 0;

        window.gameSession.stats.items = {};
        window.gameSession.stats.items.chests = 0;
        window.gameSession.stats.items.total = 0;
        window.gameSession.stats.items.fire = 0;
        window.gameSession.stats.items.ice = 0;
        window.gameSession.stats.items.acid = 0;
        window.gameSession.stats.items.electricity = 0;
        window.gameSession.stats.items.spikes = 0;
        window.gameSession.stats.items.poison = 0;
        window.gameSession.stats.items.potion = 0;

        window.gameSession.stats.kills = {};
        window.gameSession.stats.kills.total = 0;
        window.gameSession.stats.kills.melee = 0;
        window.gameSession.stats.kills.ranged = 0;
        window.gameSession.stats.kills.magic = 0;

        window.gameSession.stats.traps = {};
        window.gameSession.stats.traps.total = 0;
        window.gameSession.stats.traps.fire = 0;
        window.gameSession.stats.traps.ice = 0;
        window.gameSession.stats.traps.acid = 0;
        window.gameSession.stats.traps.electricity = 0;
        window.gameSession.stats.traps.spikes = 0;
        window.gameSession.stats.traps.poison = 0;

        window.gameSession.stats.levelMax = 0;
        window.gameSession.stats.xp = 0;
        window.gameSession.stats.tiles = 0;

        //achievements
        window.gameSession.achievements = {};

        window.gameSession.achievements.death = {};
        window.gameSession.achievements.death.total = 0;
        window.gameSession.achievements.death.fire = 0;
        window.gameSession.achievements.death.ice = 0;
        window.gameSession.achievements.death.acid = 0;
        window.gameSession.achievements.death.electricity = 0;
        window.gameSession.achievements.death.spikes = 0;
        window.gameSession.achievements.death.poison = 0;
        window.gameSession.achievements.death.melee = 0;
        window.gameSession.achievements.death.ranged = 0;
        window.gameSession.achievements.death.magic = 0;

        window.gameSession.achievements.damage = {};
        window.gameSession.achievements.damage.total = 0;
        window.gameSession.achievements.damage.fire = 0;
        window.gameSession.achievements.damage.ice = 0;
        window.gameSession.achievements.damage.acid = 0;
        window.gameSession.achievements.damage.electricity = 0;
        window.gameSession.achievements.damage.spikes = 0;
        window.gameSession.achievements.damage.poison = 0;
        window.gameSession.achievements.damage.melee = 0;
        window.gameSession.achievements.damage.ranged = 0;
        window.gameSession.achievements.damage.magic = 0;

        window.gameSession.achievements.items = {};
        window.gameSession.achievements.items.chests = 0;
        window.gameSession.achievements.items.total = 0;
        window.gameSession.achievements.items.fire = 0;
        window.gameSession.achievements.items.ice = 0;
        window.gameSession.achievements.items.acid = 0;
        window.gameSession.achievements.items.electricity = 0;
        window.gameSession.achievements.items.spikes = 0;
        window.gameSession.achievements.items.poison = 0;
        window.gameSession.achievements.items.potion = 0;

        window.gameSession.achievements.kills = {};
        window.gameSession.achievements.kills.total = 0;
        window.gameSession.achievements.kills.melee = 0;
        window.gameSession.achievements.kills.ranged = 0;
        window.gameSession.achievements.kills.magic = 0;

        window.gameSession.achievements.traps = {};
        window.gameSession.achievements.traps.total = 0;
        window.gameSession.achievements.traps.fire = 0;
        window.gameSession.achievements.traps.ice = 0;
        window.gameSession.achievements.traps.acid = 0;
        window.gameSession.achievements.traps.electricity = 0;
        window.gameSession.achievements.traps.spikes = 0;
        window.gameSession.achievements.traps.poison = 0;

        window.gameSession.achievements.levelMax = 0;
        window.gameSession.achievements.xp = 0;
        window.gameSession.achievements.tiles = 0;

        //save version
        window.gameSession.saveVersion = saveVersion;
    },

    loadGame: function(){
        window.gameSession = JSON.parse(cc.sys.localStorage.getItem('gameSession'));
    },

    next: function(){
        this.index++;
        if (this.index >= this.tutorial.length) {
            this.skip();
        } else {
            this.sprite.spriteFrame = this.tutorial[this.index]
        }
    },

    skip: function(){
        cc.director.loadScene("gameScene");
    },

    updateV2: function(){
        window.gameSession.treasures = 0;
        window.gameSession.traps = 0;
        window.gameSession.treasureHunter = false;
        window.gameSession.trapFinder = false;
        
        window.gameSession.saveVersion = {major: 0, minor: 2, fix: 0};
    },

    updateV3: function(){
        window.gameSession.tracker = false;

        window.gameSession.inventory.melee = 1;
        window.gameSession.inventory.ranged = 1;
        window.gameSession.inventory.magic = 1;

        window.gameSession.upgrades.melee = 1000;
        window.gameSession.upgrades.ranged = 1000;
        window.gameSession.upgrades.magic = 1000;

        //stats
        window.gameSession.stats = {};

        window.gameSession.stats.death = {};
        window.gameSession.stats.death.total = 0;
        window.gameSession.stats.death.fire = 0;
        window.gameSession.stats.death.ice = 0;
        window.gameSession.stats.death.acid = 0;
        window.gameSession.stats.death.electricity = 0;
        window.gameSession.stats.death.spikes = 0;
        window.gameSession.stats.death.poison = 0;
        window.gameSession.stats.death.melee = 0;
        window.gameSession.stats.death.ranged = 0;
        window.gameSession.stats.death.magic = 0;

        window.gameSession.stats.damage = {};
        window.gameSession.stats.damage.total = 0;
        window.gameSession.stats.damage.fire = 0;
        window.gameSession.stats.damage.ice = 0;
        window.gameSession.stats.damage.acid = 0;
        window.gameSession.stats.damage.electricity = 0;
        window.gameSession.stats.damage.spikes = 0;
        window.gameSession.stats.damage.poison = 0;
        window.gameSession.stats.damage.melee = 0;
        window.gameSession.stats.damage.ranged = 0;
        window.gameSession.stats.damage.magic = 0;

        window.gameSession.stats.items = {};
        window.gameSession.stats.items.chests = window.gameSession.treasures;
        window.gameSession.stats.items.total = 0;
        window.gameSession.stats.items.fire = 0;
        window.gameSession.stats.items.ice = 0;
        window.gameSession.stats.items.acid = 0;
        window.gameSession.stats.items.electricity = 0;
        window.gameSession.stats.items.spikes = 0;
        window.gameSession.stats.items.poison = 0;
        window.gameSession.stats.items.potion = 0;

        window.gameSession.stats.kills = {};
        window.gameSession.stats.kills.total = 0;
        window.gameSession.stats.kills.melee = 0;
        window.gameSession.stats.kills.ranged = 0;
        window.gameSession.stats.kills.magic = 0;

        window.gameSession.stats.traps = {};
        window.gameSession.stats.traps.total = window.gameSession.traps;
        window.gameSession.stats.traps.fire = 0;
        window.gameSession.stats.traps.ice = 0;
        window.gameSession.stats.traps.acid = 0;
        window.gameSession.stats.traps.electricity = 0;
        window.gameSession.stats.traps.spikes = 0;
        window.gameSession.stats.traps.poison = 0;

        window.gameSession.stats.levelMax = window.gameSession.levelMax;
        window.gameSession.stats.xp = 0;
        window.gameSession.stats.tiles = 0;

        //achievements
        window.gameSession.achievements = {};

        window.gameSession.achievements.death = {};
        window.gameSession.achievements.death.total = 0;
        window.gameSession.achievements.death.fire = 0;
        window.gameSession.achievements.death.ice = 0;
        window.gameSession.achievements.death.acid = 0;
        window.gameSession.achievements.death.electricity = 0;
        window.gameSession.achievements.death.spikes = 0;
        window.gameSession.achievements.death.poison = 0;
        window.gameSession.achievements.death.melee = 0;
        window.gameSession.achievements.death.ranged = 0;
        window.gameSession.achievements.death.magic = 0;

        window.gameSession.achievements.damage = {};
        window.gameSession.achievements.damage.total = 0;
        window.gameSession.achievements.damage.fire = 0;
        window.gameSession.achievements.damage.ice = 0;
        window.gameSession.achievements.damage.acid = 0;
        window.gameSession.achievements.damage.electricity = 0;
        window.gameSession.achievements.damage.spikes = 0;
        window.gameSession.achievements.damage.poison = 0;
        window.gameSession.achievements.damage.melee = 0;
        window.gameSession.achievements.damage.ranged = 0;
        window.gameSession.achievements.damage.magic = 0;

        window.gameSession.achievements.items = {};
        window.gameSession.achievements.items.chests = 0;
        window.gameSession.achievements.items.total = 0;
        window.gameSession.achievements.items.fire = 0;
        window.gameSession.achievements.items.ice = 0;
        window.gameSession.achievements.items.acid = 0;
        window.gameSession.achievements.items.electricity = 0;
        window.gameSession.achievements.items.spikes = 0;
        window.gameSession.achievements.items.poison = 0;
        window.gameSession.achievements.items.potion = 0;

        window.gameSession.achievements.kills = {};
        window.gameSession.achievements.kills.total = 0;
        window.gameSession.achievements.kills.melee = 0;
        window.gameSession.achievements.kills.ranged = 0;
        window.gameSession.achievements.kills.magic = 0;

        window.gameSession.achievements.traps = {};
        window.gameSession.achievements.traps.total = 0;
        window.gameSession.achievements.traps.fire = 0;
        window.gameSession.achievements.traps.ice = 0;
        window.gameSession.achievements.traps.acid = 0;
        window.gameSession.achievements.traps.electricity = 0;
        window.gameSession.achievements.traps.spikes = 0;
        window.gameSession.achievements.traps.poison = 0;

        window.gameSession.achievements.levelMax = 0;
        window.gameSession.achievements.xp = 0;
        window.gameSession.achievements.tiles = 0;
        
        window.gameSession.saveVersion = {major: 0, minor: 3, fix: 0};
    }

    // update (dt) {},
});
