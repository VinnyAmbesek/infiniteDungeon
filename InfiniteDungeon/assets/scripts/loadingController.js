const Analytics = require("analytics");

cc.Class({
    extends: cc.Component,

    properties: {
        analytics: Analytics,
        sprite: cc.Sprite,
        tutorial: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start () {
        this.saveLoaded = false;
        this.timer = 0;
        this.index = 0;
        let saveVersion = {major: 0, minor: 5, fix: 0};
        this.initSession(saveVersion);
        this.saveLoaded = true;
    },

    initSession: function(saveVersion){
        this.loadGame();
        window.gameGlobals = {};

        // verify if have gamesave has all properties

        this.setDefault(window, "gameSession", {});

        this.setDefault(window.gameSession, "xp", 0);
        this.setDefault(window.gameSession, "currency", 0);

        this.setDefault(window.gameSession, "hp", 3);
        this.setDefault(window.gameSession, "hpMax", 3);

        // progress data
        this.setDefault(window.gameSession, "level", 1);
        this.setDefault(window.gameSession, "levelMin", 1);

        // inventory
        this.setDefault(window.gameSession, "inventory", {});

        this.setDefault(window.gameSession.inventory, "fire", 0);
        this.setDefault(window.gameSession.inventory, "fireMin", 0);
        this.setDefault(window.gameSession.inventory, "fireMax", 3);

        this.setDefault(window.gameSession.inventory, "ice", 0);
        this.setDefault(window.gameSession.inventory, "iceMin", 0);
        this.setDefault(window.gameSession.inventory, "iceMax", 3);

        this.setDefault(window.gameSession.inventory, "acid", 0);
        this.setDefault(window.gameSession.inventory, "acidMin", 0);
        this.setDefault(window.gameSession.inventory, "acidMax", 3);

        this.setDefault(window.gameSession.inventory, "electricity", 0);
        this.setDefault(window.gameSession.inventory, "electricityMin", 0);
        this.setDefault(window.gameSession.inventory, "electricityMax", 3);

        this.setDefault(window.gameSession.inventory, "spikes", 0);
        this.setDefault(window.gameSession.inventory, "spikesMin", 0);
        this.setDefault(window.gameSession.inventory, "spikesMax", 3);

        this.setDefault(window.gameSession.inventory, "poison", 0);
        this.setDefault(window.gameSession.inventory, "poisonMin", 0);
        this.setDefault(window.gameSession.inventory, "poisonMax", 3);

        this.setDefault(window.gameSession.inventory, "potion", 0);
        this.setDefault(window.gameSession.inventory, "potionMin", 0);
        this.setDefault(window.gameSession.inventory, "potionMax", 3);

        this.setDefault(window.gameSession.inventory, "melee", 1);
        this.setDefault(window.gameSession.inventory, "ranged", 1);
        this.setDefault(window.gameSession.inventory, "magic", 1);

        // upgrades
        this.setDefault(window.gameSession, "upgrades", {});

        this.setDefault(window.gameSession.upgrades, "fireMin", 1000);
        this.setDefault(window.gameSession.upgrades, "fireMax", 1000);
        this.setDefault(window.gameSession.upgrades, "iceMin", 1000);
        this.setDefault(window.gameSession.upgrades, "iceMax", 1000);
        this.setDefault(window.gameSession.upgrades, "acidMin", 1000);
        this.setDefault(window.gameSession.upgrades, "acidMax", 1000);
        this.setDefault(window.gameSession.upgrades, "electricityMin", 1000);
        this.setDefault(window.gameSession.upgrades, "electricityMax", 1000);
        this.setDefault(window.gameSession.upgrades, "spikesMin", 1000);
        this.setDefault(window.gameSession.upgrades, "spikesMax", 1000);
        this.setDefault(window.gameSession.upgrades, "poisonMin", 1000);
        this.setDefault(window.gameSession.upgrades, "poisonMax", 1000);

        this.setDefault(window.gameSession.upgrades, "potionMin", 1000);
        this.setDefault(window.gameSession.upgrades, "potionMax", 1000);

        this.setDefault(window.gameSession.upgrades, "hpMax", 1000);

        this.setDefault(window.gameSession.upgrades, "levelMin", 1000);
        this.setDefault(window.gameSession.upgrades, "info", 1000);

        this.setDefault(window.gameSession.upgrades, "melee", 1000);
        this.setDefault(window.gameSession.upgrades, "ranged", 1000);
        this.setDefault(window.gameSession.upgrades, "magic", 1000);

        //stats
        this.setDefault(window.gameSession, "stats", {});

        this.setDefault(window.gameSession.stats, "unique", {});

        this.setDefault(window.gameSession.stats, "death", {});
        this.setDefault(window.gameSession.stats.death, "total", 0);
        this.setDefault(window.gameSession.stats.death, "fire", 0);
        this.setDefault(window.gameSession.stats.death, "ice", 0);
        this.setDefault(window.gameSession.stats.death, "acid", 0);
        this.setDefault(window.gameSession.stats.death, "electricity", 0);
        this.setDefault(window.gameSession.stats.death, "spikes", 0);
        this.setDefault(window.gameSession.stats.death, "poison", 0);
        this.setDefault(window.gameSession.stats.death, "melee", 0);
        this.setDefault(window.gameSession.stats.death, "ranged", 0);
        this.setDefault(window.gameSession.stats.death, "magic", 0);

        this.setDefault(window.gameSession.stats, "damage", {});
        this.setDefault(window.gameSession.stats.damage, "total", 0);
        this.setDefault(window.gameSession.stats.damage, "fire", 0);
        this.setDefault(window.gameSession.stats.damage, "ice", 0);
        this.setDefault(window.gameSession.stats.damage, "acid", 0);
        this.setDefault(window.gameSession.stats.damage, "electricity", 0);
        this.setDefault(window.gameSession.stats.damage, "spikes", 0);
        this.setDefault(window.gameSession.stats.damage, "poison", 0);
        this.setDefault(window.gameSession.stats.damage, "melee", 0);
        this.setDefault(window.gameSession.stats.damage, "ranged", 0);
        this.setDefault(window.gameSession.stats.damage, "magic", 0);

        this.setDefault(window.gameSession.stats, "items", {});
        this.setDefault(window.gameSession.stats.items, "chests", 0);
        this.setDefault(window.gameSession.stats.items, "total", 0);
        this.setDefault(window.gameSession.stats.items, "fire", 0);
        this.setDefault(window.gameSession.stats.items, "ice", 0);
        this.setDefault(window.gameSession.stats.items, "acid", 0);
        this.setDefault(window.gameSession.stats.items, "electricity", 0);
        this.setDefault(window.gameSession.stats.items, "spikes", 0);
        this.setDefault(window.gameSession.stats.items, "poison", 0);
        this.setDefault(window.gameSession.stats.items, "potion", 0);

        this.setDefault(window.gameSession.stats, "kills", {});
        this.setDefault(window.gameSession.stats.kills, "total", 0);
        this.setDefault(window.gameSession.stats.kills, "melee", 0);
        this.setDefault(window.gameSession.stats.kills, "ranged", 0);
        this.setDefault(window.gameSession.stats.kills, "magic", 0);

        this.setDefault(window.gameSession.stats, "traps", {});
        this.setDefault(window.gameSession.stats.traps, "total", 0);
        this.setDefault(window.gameSession.stats.traps, "fire", 0);
        this.setDefault(window.gameSession.stats.traps, "ice", 0);
        this.setDefault(window.gameSession.stats.traps, "acid", 0);
        this.setDefault(window.gameSession.stats.traps, "electricity", 0);
        this.setDefault(window.gameSession.stats.traps, "spikes", 0);
        this.setDefault(window.gameSession.stats.traps, "poison", 0);

        this.setDefault(window.gameSession.stats, "levelMax", 0);
        this.setDefault(window.gameSession.stats, "xp", 0);
        this.setDefault(window.gameSession.stats, "tiles", 0);

        //achievements
        this.setDefault(window.gameSession, "achievements", {});

        this.setDefault(window.gameSession.achievements, "unique", {});

        this.setDefault(window.gameSession.achievements, "death", {});
        this.setDefault(window.gameSession.achievements.death, "total", 0);
        this.setDefault(window.gameSession.achievements.death, "fire", 0);
        this.setDefault(window.gameSession.achievements.death, "ice", 0);
        this.setDefault(window.gameSession.achievements.death, "acid", 0);
        this.setDefault(window.gameSession.achievements.death, "electricity", 0);
        this.setDefault(window.gameSession.achievements.death, "spikes", 0);
        this.setDefault(window.gameSession.achievements.death, "poison", 0);
        this.setDefault(window.gameSession.achievements.death, "melee", 0);
        this.setDefault(window.gameSession.achievements.death, "ranged", 0);
        this.setDefault(window.gameSession.achievements.death, "magic", 0);

        this.setDefault(window.gameSession.achievements, "damage", {});
        this.setDefault(window.gameSession.achievements.damage, "total", 0);
        this.setDefault(window.gameSession.achievements.damage, "fire", 0);
        this.setDefault(window.gameSession.achievements.damage, "ice", 0);
        this.setDefault(window.gameSession.achievements.damage, "acid", 0);
        this.setDefault(window.gameSession.achievements.damage, "electricity", 0);
        this.setDefault(window.gameSession.achievements.damage, "spikes", 0);
        this.setDefault(window.gameSession.achievements.damage, "poison", 0);
        this.setDefault(window.gameSession.achievements.damage, "melee", 0);
        this.setDefault(window.gameSession.achievements.damage, "ranged", 0);
        this.setDefault(window.gameSession.achievements.damage, "magic", 0);

        this.setDefault(window.gameSession.achievements, "items", {});
        this.setDefault(window.gameSession.achievements.items, "chests", 0);
        this.setDefault(window.gameSession.achievements.items, "total", 0);
        this.setDefault(window.gameSession.achievements.items, "fire", 0);
        this.setDefault(window.gameSession.achievements.items, "ice", 0);
        this.setDefault(window.gameSession.achievements.items, "acid", 0);
        this.setDefault(window.gameSession.achievements.items, "electricity", 0);
        this.setDefault(window.gameSession.achievements.items, "spikes", 0);
        this.setDefault(window.gameSession.achievements.items, "poison", 0);
        this.setDefault(window.gameSession.achievements.items, "potion", 0);

        this.setDefault(window.gameSession.achievements, "kills", {});
        this.setDefault(window.gameSession.achievements.kills, "total", 0);
        this.setDefault(window.gameSession.achievements.kills, "melee", 0);
        this.setDefault(window.gameSession.achievements.kills, "ranged", 0);
        this.setDefault(window.gameSession.achievements.kills, "magic", 0);

        this.setDefault(window.gameSession.achievements, "traps", {});
        this.setDefault(window.gameSession.achievements.traps, "total", 0);
        this.setDefault(window.gameSession.achievements.traps, "fire", 0);
        this.setDefault(window.gameSession.achievements.traps, "ice", 0);
        this.setDefault(window.gameSession.achievements.traps, "acid", 0);
        this.setDefault(window.gameSession.achievements.traps, "electricity", 0);
        this.setDefault(window.gameSession.achievements.traps, "spikes", 0);
        this.setDefault(window.gameSession.achievements.traps, "poison", 0);

        this.setDefault(window.gameSession.achievements, "levelMax", 0);
        this.setDefault(window.gameSession.achievements, "xp", 0);
        this.setDefault(window.gameSession.achievements, "tiles", 0);

        //tutorial
        this.setDefault(window.gameSession, "tutorial", {});

        this.setDefault(window.gameSession, "skills", {});
        this.transferSave(window.gameSession.skills, window.gameSession, "treasureHunter", false);
        this.setDefault(window.gameSession.skills, "fireShield", 0);
        this.setDefault(window.gameSession.skills, "iceShield", 0);
        this.setDefault(window.gameSession.skills, "acidShield", 0);
        this.setDefault(window.gameSession.skills, "electricityShield", 0);
        this.setDefault(window.gameSession.skills, "spikesShield", 0);
        this.setDefault(window.gameSession.skills, "poisonShield", 0);
        this.setDefault(window.gameSession.skills, "totalShield", 0);

        this.transferSave(window.gameSession.skills, window.gameSession, "trapFinder", false);
        this.setDefault(window.gameSession.skills, "fireFinder", false);
        this.setDefault(window.gameSession.skills, "iceFinder", false);
        this.setDefault(window.gameSession.skills, "acidFinder", false);
        this.setDefault(window.gameSession.skills, "electricityFinder", false);
        this.setDefault(window.gameSession.skills, "spikesFinder", false);
        this.setDefault(window.gameSession.skills, "poisonFinder", false);

        this.transferSave(window.gameSession.skills, window.gameSession, "tracker", false);
        this.setDefault(window.gameSession.skills, "meleeTracker", false);
        this.setDefault(window.gameSession.skills, "rangedTracker", false);
        this.setDefault(window.gameSession.skills, "magicTracker", false);

        this.setDefault(window.gameSession, "job", 0);

        let d = new Date(); 
        window.gameSession.date = {d: d.getDate(), m: d.getMonth(), y: d.getFullYear()};

        //save version
        window.gameSession.saveVersion =  saveVersion;
    },

    setDefault: function(object, field, value){
        if (! object.hasOwnProperty(field)){
            object[field] = value;
        }
    },

    transferSave: function(obj1, obj2, field, value){
        if (obj2.hasOwnProperty(field) && ! obj1.hasOwnProperty(field)){
            obj1[field] = obj2[field];
        } else {
            this.setDefault(obj1, field, value);
        }
    },

    loadGame: function(){
        window.gameSession = JSON.parse(cc.sys.localStorage.getItem('gameSession'));
    },

    next: function(){
        cc.director.loadScene("gameScene");
    },

    update (dt) {
        this.timer += dt;

        if (this.saveLoaded && this.analytics.Analytics_Ready()){
            this.saveLoaded = false;
            this.next();
        }

        if (this.timer > 30 && this.saveLoaded){
            this.saveLoaded = false;
            cc.log("Analytics is taking too long");
            this.next();
        }
    },
});
