var popupController = cc.Class({
    extends: cc.Component,

    properties: {
        job: cc.Node,
        upgrade: cc.Node,
        inventory: cc.Node,
        achievement: cc.Node,
        tutorial: cc.Node,
        log: cc.Node,
        death: cc.Node,
        dailyReward: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // Open popup, if another is opened this one is automatically closed
    openPopup(property){
        this.closePopup();
        this[property].active = true;
        this.current = this[property];
    },

    openPopupByButton(event,property){
        this.openPopup(property);
    },

    // this popup won't be closed if other is open
    openPermanentPopup(property){
        this.closePopup();
        this[property].active = true;
    },

    //close current popup
    closePopup(){
        if (this.hasOwnProperty("current")) this.current.active = false;
    },

    //close specific popup
    closePopupByName(property){
        this[property].active = false;
    },

    //close specific popup through button
    closePopupByButton(event, property){
        this.closePopupByName(property);
    },

    isAnyOpen(){
        if (! this.hasOwnProperty("current")) return false;
        return this.current.active;
    },


    // update (dt) {},
});

module.exports = popupController;