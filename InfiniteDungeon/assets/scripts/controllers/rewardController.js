const UpgradeController = require("upgradeController");
const PopupController = require("popupController");
const HudController = require("hudController");
var rewardController = cc.Class({
    extends: cc.Component,

    properties: {
        upgradeController: UpgradeController,
        popupController: PopupController,
        hudController: HudController,
        reward: cc.Label,
    },

    onEnable: function(){
        
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    checkTime(){
        let d = new Date(); 
        let date = {d: d.getDate(), m: d.getMonth(), y: d.getFullYear()};
        let lastPrize = window.gameSession.date;

        let newDay = this.isNewDay(date, lastPrize);
        if (newDay){
            this.wbPrize();
            this.popupController.openPermanentPopup("dailyReward");
            window.gameSession.date = date;
            this.saveGame();
        }
    },

    isNewDay(today, lastDay){
        if(!lastDay) {
            window.gameSession.date = today;
            return false;
        }

        if (lastDay.y < today.y) return true;
        // went back in time?
        if (lastDay.y > today.y) return false;

        if (lastDay.m < today.m) return true;
        // went back in time?
        if (lastDay.m > today.m) return false;

        if (lastDay.d < today.d) return true;
        // went back in time?
        if (lastDay.d > today.d) return false;

        return false;
    },

    wbPrize(){
        let minXP = this.upgradeController.getMinXP();

        this.upgradeController.getXP(minXP, "dailyXP");
        this.reward.string = minXP + "XP";

        window.gameSession.currency+=10;
        this.hudController.updateLabel("soul", ""+window.gameSession.currency);
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});

module.exports = rewardController;