var jobController = cc.Class({
    extends: cc.Component,

    ctor: function(){
        this.enumClass = {undefined: 0, rogue: 1, fighter: 2, wizard: 3};
    },

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setClass: function(event, id){
        window.analytics.Design_event("class:" + id);
        window.gameSession.job = this.enumClass[id];
        this.saveGame();
    },

    isClass: function(name){
        return (window.gameSession.job == this.enumClass[name]);
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});

module.exports = jobController;