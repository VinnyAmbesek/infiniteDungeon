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
        popups: [cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable () {
        //this.message.label = window.gameGlobals.tutorial;
    },

    start () {

    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
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

    // update (dt) {},
});
