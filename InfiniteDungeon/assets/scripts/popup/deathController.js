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
        deathPopup: cc.Node,
        hp: cc.Label
    },

    iDied: function(){
        this.close();
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
        window.gameSession.hp = window.gameSession.hpMax;
        this.hp.string = window.gameSession.hp;
        this.close();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    close: function() {
        this.node.active = false;
        window.gameGlobals.popup = false;
    },

    open: function() {
        this.node.active = true;
        window.gameGlobals.popup = true;
    },

    // update (dt) {},
});
