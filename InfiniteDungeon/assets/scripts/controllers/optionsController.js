const PopupController = require("popupController");
const HudController = require("hudController");

cc.Class({
    extends: cc.Component,

    properties: {
        popupController: PopupController,
        hudController: HudController,
        startLevel: cc.Label,
        autoupgrade: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.startLevel.string = "Starting Level: " + window.gameSession.levelMin;
        this.autoupgrade.isChecked = window.gameSession.options.autoupgrade;
    },

    levelDecrease (event, qtd){
        window.gameSession.levelMin-= parseInt(qtd);
        if (window.gameSession.levelMin<1) window.gameSession.levelMin = 1;
        this.startLevel.string = "Starting Level: " + window.gameSession.levelMin;
        this.saveGame();
    },

    levelIncrease (event, qtd){
        window.gameSession.levelMin+= parseInt(qtd);
        if (window.gameSession.levelMin>window.gameSession.levelPassage) window.gameSession.levelMin = window.gameSession.levelPassage;
        this.startLevel.string = "Starting Level: " + window.gameSession.levelMin;
        this.saveGame();
    },

    toggleAutoUpgrade(){
        window.gameSession.options.autoupgrade = this.autoupgrade.isChecked;
        this.saveGame();
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});
