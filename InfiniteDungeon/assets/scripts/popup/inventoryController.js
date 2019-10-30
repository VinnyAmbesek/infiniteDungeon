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
        inventoryFire: cc.Label,
        inventoryIce: cc.Label,
        inventoryAcid: cc.Label,
        inventoryElectricity: cc.Label,
        inventorySpikes: cc.Label,
        inventoryPoison: cc.Label,
        inventoryPotion: cc.Label,
    },

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

    // update (dt) {},

    updateLabel: function(item, extra){
        let uc = this.jsUcfirst(item);
        this["inventory"+uc].string = uc + extra + ": " + window.gameSession.inventory[item] + "/" + window.gameSession.inventory[item+"Max"];
        if (window.gameSession.skills.hasOwnProperty(item+"Shield")){
            this["inventory"+uc].string = this["inventory"+uc].string + " (+" + window.gameSession.skills[item + "Shield"] + ")";
        }
    },

    jsUcfirst: function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
});
