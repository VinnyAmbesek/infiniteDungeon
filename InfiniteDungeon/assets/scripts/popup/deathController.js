const PopupController = require("popupController");

cc.Class({
    extends: cc.Component,

    properties: {
        popupController: PopupController,
        deathPopup: cc.Node,
        hp: cc.Label
    },

    iDied: function(){
        window.analytics.Level_Fail("Floor " + window.gameSession.level, "Dungeon Scene");
        // back to level
        window.gameSession.level = window.gameSession.levelMin;

        // restore hp
        window.gameSession.hp = window.gameSession.hpMax;

        // mark death
        window.gameSession.death = true;
        window.gameSession.job = 0;

        // reset inventory
        window.gameSession.inventory.fire = Math.min(window.gameSession.inventory.fireMin, window.gameSession.inventory.fireMax);
        window.gameSession.inventory.ice = Math.min(window.gameSession.inventory.iceMin, window.gameSession.inventory.iceMax);
        window.gameSession.inventory.acid = Math.min(window.gameSession.inventory.acidMin, window.gameSession.inventory.acidMax);
        window.gameSession.inventory.electricity = Math.min(window.gameSession.inventory.electricityMin, window.gameSession.inventory.electricityMax);
        window.gameSession.inventory.spikes = Math.min(window.gameSession.inventory.spikesMin, window.gameSession.inventory.spikesMax);
        window.gameSession.inventory.poison = Math.min(window.gameSession.inventory.poisonMin, window.gameSession.inventory.poisonMax);
        window.gameSession.inventory.potion = Math.min(window.gameSession.inventory.potionMin, window.gameSession.inventory.potionMax);

        // restart scene
        cc.director.loadScene("gameScene");
    },

    iAmBack: function(){
        if (window.gameSession.currency < 100) return;
        window.gameSession.currency -= 100;
        window.analytics.Design_event("event:ressurrection", window.gameSession.currency);
        window.gameSession.hp = window.gameSession.hpMax;
        this.hp.string = window.gameSession.hp;

        this.saveGame();
        this.popupController.closePopupByName("death");
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});
