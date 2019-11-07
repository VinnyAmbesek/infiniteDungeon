const HudController = require("hudController");
const FeedbackController = require("feedbackController");

var inventoryController = cc.Class({
    extends: cc.Component,

    properties: () => ({
        hudController: HudController,
        feedbackController: FeedbackController,
        achievementController: {
            default: null, 
            type: require("achievementController")
        },
        inventoryFire: cc.Label,
        inventoryIce: cc.Label,
        inventoryAcid: cc.Label,
        inventoryElectricity: cc.Label,
        inventorySpikes: cc.Label,
        inventoryPoison: cc.Label,
        inventoryPotion: cc.Label,
    }),

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable () {
        this.updateLabel("fire", " Shield");
        this.updateLabel("ice", " Shield");
        this.updateLabel("acid", " Shield");
        this.updateLabel("electricity", " Shield");
        this.updateLabel("spikes", " Shield");
        this.updateLabel("poison", " Shield");
        this.updateLabel("potion", "");
    },

    start () {

    },

    hasDefenses(){
        return (window.gameSession.inventory.fire + window.gameSession.inventory.ice + window.gameSession.inventory.acid + window.gameSession.inventory.electricity + window.gameSession.inventory.spikes + window.gameSession.inventory.poison) > 0;
    },

    updateLabel: function(item, extra){
        let uc = this.jsUcfirst(item);
        this["inventory"+uc].string = uc + extra + ": " + window.gameSession.inventory[item] + "/" + window.gameSession.inventory[item+"Max"];
        if (window.gameSession.skills.hasOwnProperty(item+"Shield")){
            this["inventory"+uc].string = this["inventory"+uc].string + " (+" + window.gameSession.skills[item + "Shield"] + ")";
        }
    },

    giveItem: function(item, qtd, node, txt, giver = "Treasure"){
        window.analytics.Design_event(giver+":"+item, qtd);
        window.gameSession.inventory[item] = Math.min(window.gameSession.inventory[item]+qtd, window.gameSession.inventory[item+"Max"]);
        this.hudController.updateShields(item);

        if (node!= null) this.feedbackController.showFeedbackAtNode("Got " + qtd + " " + txt, new cc.Color(0,255,0), node, true, 3.0, 150);
    },

    useItem: function(item, qtd, node){
        window.analytics.Design_event("Use:"+item, qtd);
        window.gameSession.inventory[item] = Math.max(window.gameSession.inventory[item]-qtd, 0);
        this.hudController.updateShields(item);
        if(item != "potion") {
            this.feedbackController.showFeedbackAtNode("-" + qtd + " " + item + " Shield", new cc.Color(255,0,0), node, true, 3.0, 150);
        } else {
            this.feedbackController.showFeedbackAtNode("Used potion", new cc.Color(0,255,0), node, true, 3.0, 150);
        }

        this.achievementController.updateStat("items", item, qtd);
        this.achievementController.updateStat("items", 'total', qtd);
    },

    jsUcfirst: function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    openChest: function(){

    },

    openLootSack: function(prize, node){
        this.openCommonChest(prize, node, true);
    },

    openCommonChest: function(prize, node, loot=false){
        let reward = 1 + window.gameSession.skills.totalShield;
        if (loot){
            reward = Math.floor((reward+1)/2);
        }
        this.achievementController.updateStat("items", "chests", reward);
        if (prize <= 10) {
            this.giveItem("potion", reward, node, "Potion");
        } else if (prize <= 25 ) {
            this.giveItem("fire", reward, node, "Fire Shield");
        } else if (prize <= 40 ) {
            this.giveItem("ice", reward, node, "Ice Shield");
        } else if (prize <= 55 ) {
            this.giveItem("acid", reward, node, "Acid Shield");
        } else if (prize <= 70 ) {
            this.giveItem("electricity", reward, node, "Electricity Shield");
        } else if (prize <= 85 ) {
            this.giveItem("spikes", reward, node, "Spikes Shield");
        } else if (prize <= 100 ) {
            this.giveItem("poison", reward, node, "Poison Shield");
        }
    }
});

module.exports = inventoryController;