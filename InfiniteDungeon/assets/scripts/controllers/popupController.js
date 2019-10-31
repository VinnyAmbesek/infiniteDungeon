var popupController = cc.Class({
    extends: cc.Component,

    properties: {
        job: cc.Node, // usually only activated permanently
        upgrade: cc.Node,
        inventory: cc.Node,
        store: cc.Node,
        achievement: cc.Node,
        options: cc.Node,
        tutorial: cc.Node,
        log: cc.Node,
        death: cc.Node, // usually only activated permanently
        dailyReward: cc.Node, // usually only activated permanently
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // Open popup, if another is opened this one will be automatically closed
    openPopup(property){
        this.closePopup();
        this[property].active = true;
        this.current = this[property];
    },

    openPopupByButton(event,property){
        this.openPopup(property);
    },

    // this popup won't be closed if another is open
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

    // verifies if any popup is open
    isAnyOpen(){
        if (! this.hasOwnProperty("current")) return false;
        return (this.current.active || this.job.active || this.death.active || this.dailyReward.active );
    },


    // update (dt) {},
});

module.exports = popupController;