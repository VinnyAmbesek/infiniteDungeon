const PopupController = require("popupController");
const HudController = require("hudController");
const FeedbackController = require("feedbackController");
const AchievementController = require("achievementController");

var deathController = cc.Class({
    extends: cc.Component,

    properties: {
        popupController: PopupController,
        hudController: HudController,
        feedbackController: FeedbackController,
        achievementController: AchievementController,
        deathPopup: cc.Node,
        deathMessage: cc.Label,
    },

    iDied: function(){
        this.achievementController.updateStat(null, "row", -window.gameSession.stats.row);
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
        this.achievementController.updateStat(null, "row", -window.gameSession.stats.row);
        window.gameSession.currency -= 100;
        window.analytics.Design_event("event:ressurrection", window.gameSession.currency);
        window.gameSession.hp = window.gameSession.hpMax;
        this.hudController.updateLabel("hp", window.gameSession.hp);

        this.saveGame();
        this.popupController.closePopupByName("death");
    },

    kill: function(){
        window.gameSession.hp = -1;
        this.hudController.updateLabel("hp", window.gameSession.hp);
        this.popupController.openPermanentPopup("death");
    },

    isDead(){
        return window.gameSession.hp <1;
    },

    isTrulyDead(){
        return window.gameSession.hp <9;
    },

    isAlmostDead(){
        return window.gameSession.hp == 1;
    },

    hasDamage(){
        return (window.gameSession.hp < window.gameSession.hpMax);
    },

    heal(qtd){
        window.gameSession.hp +=qtd;
        if (window.gameSession.hp > window.gameSession.hpMax) window.gameSession.hp = window.gameSession.hpMax;
        this.hudController.updateLabel("hp", window.gameSession.hp);
        this.feedbackController.showFeedback("+" + qtd + "HP", new cc.Color(0,255,0), "hp", false);
    },

    hurt(qtd){
        window.gameSession.hp -=qtd;
        this.hudController.updateLabel("hp", window.gameSession.hp);
        if (this.isDead()) this.popupController.openPermanentPopup("death");
        this.feedbackController.showFeedback("-" + qtd + "HP", new cc.Color(255,0,0), "hp", false);

        this.saveGame();
    },

    setMessage(msg){
        this.deathMessage.string = "You died!\n" + msg;
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

module.exports = deathController;