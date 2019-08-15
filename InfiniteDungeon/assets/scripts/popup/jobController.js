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
        jobPrefab: cc.Prefab,
        popups: [cc.Node],
        icons: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.enumClass = {undefined: 0, rogue: 1, fighter: 2, wizard: 3};

    },

    setClass: function(event, id){
        window.analytics.Design_event("class:" + id);
        window.gameSession.job = this.enumClass[id];
        this.saveGame();
        this.close();
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
