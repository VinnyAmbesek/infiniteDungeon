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

        popups: [cc.Node],
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
    },

    jsUcfirst: function(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    close: function() {
        this.node.active = false;
        window.gameGlobals.popup = false;
    },

    open: function() {
        if (window.gameSession.hp < 1) return;
        for (var i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }
        this.node.active = true;
        window.gameGlobals.popup = true;
    },
});
