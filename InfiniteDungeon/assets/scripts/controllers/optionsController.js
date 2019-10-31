const PopupController = require("popupController");
const HudController = require("hudController");

cc.Class({
    extends: cc.Component,

    properties: {
        popupController: PopupController,
        hudController: HudController,
        startLevel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.startLevel.string = "Starting Level: " + window.gameSession.levelMin;
    },

    levelDecrease (event, qtd){
        window.gameSession.levelMin-= parseInt(qtd);
        if (window.gameSession.levelMin<1) window.gameSession.levelMin = 1;
        this.startLevel.string = "Starting Level: " + window.gameSession.levelMin;
    },

    levelIncrease (event, qtd){
        window.gameSession.levelMin+= parseInt(qtd);
        if (window.gameSession.levelMin>window.gameSession.levelPassage) window.gameSession.levelMin = window.gameSession.levelPassage;
        this.startLevel.string = "Starting Level: " + window.gameSession.levelMin;
    },

    // update (dt) {},
});