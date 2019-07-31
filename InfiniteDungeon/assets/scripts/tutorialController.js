// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        tutorial: [cc.SpriteFrame]
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
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
        window.gameSession.levelMax = 1;
        window.gameSession.treasures = 0;
        window.gameSession.treasureHunter = false;
        window.gameSession.traps = 0;
        window.gameSession.trapFinder = false;

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
        //
    }

    // update (dt) {},
});
