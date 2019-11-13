const HudController = require("hudController");
const DeathController = require("deathController");

var adsController = cc.Class({
    extends: cc.Component,

    properties: {
        hudController: HudController,
        deathController: DeathController,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (cc.sys.isMobile) {
            console.log("ADS: INIT");
            sdkbox.PluginSdkboxAds.init();
            console.log("ADS: INIT AD MOB");
            sdkbox.PluginAdMob.init();

            console.log("ADS: LISTENER resurrection");
            sdkbox.PluginAdMob.setListener({
                adViewDidReceiveAd : function(name) { console.log("ADS: adViewDidReceiveAd "+name); },
                adViewDidFailToReceiveAdWithError : function(name, msg) { console.log("ADS: adViewDidFailToReceiveAdWithError " + name + " " + msg); },
                adViewWillPresentScreen : function(name) { console.log("ADS: adViewWillPresentScreen "+name); },
                adViewDidDismissScreen : function(name) { console.log("ADS: adViewDidDismissScreen "+name); },
                adViewWillDismissScreen : function(name) { console.log("ADS: adViewWillDismissScreen "+name); },
                adViewWillLeaveApplication : function(name) { console.log("ADS: adViewWillLeaveApplication "+name); },
                reward : function(name, currency, amount) {
                    console.log("ADS: REWARD "+ name);
                    console.log("ADS: REWARD "+ currency);
                    console.log("ADS: REWARD "+ amount);
                    this.reward(name);
                    }.bind(this) });

            if (!sdkbox.PluginSdkboxAds.isAvailable("placement-admob-res")){
                console.log("ADS: CACHE resurrection");
                sdkbox.PluginAdMob.cache("resurrection");
            }
            if (!sdkbox.PluginSdkboxAds.isAvailable("placement-admob-soul")){
                console.log("ADS: CACHE soul");
                sdkbox.PluginAdMob.cache("soul");
            }
            console.log("ADS: END");
        } else {
            console.log("ADS: NOT NATIVE");
        }
    },

    reward(name){
        switch(name){
            case "resurrection":
                this.deathController.resurrect();
                break;
            case "soul":
                window.gameSession.currency +=10; 
                this.hudController.updateLabel("soul", ""+window.gameSession.currency);
                break;
        }
        this.saveGame();
    },

    isAvailable(name){
        if (!cc.sys.isMobile) return false;
        return sdkbox.PluginSdkboxAds.isAvailable("placement-admob-" + name);
    },

    showAd(event, ad){
        if (!cc.sys.isMobile) return;
        console.log("ADS: SHOW " + ad);
        sdkbox.PluginAdMob.show(ad);
    },

    ShowAdStats(){
        if (!cc.sys.isMobile) return;
        console.log("ADS: Available " + sdkbox.PluginSdkboxAds.isAvailable("placement-admob"));
        if (sdkbox.PluginSdkboxAds.isAvailable("placement-admob")){
            console.log("ADS: Placement");
            //sdkbox.PluginSdkboxAds.placement("placement-admob");
        }
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});

module.exports = adsController;