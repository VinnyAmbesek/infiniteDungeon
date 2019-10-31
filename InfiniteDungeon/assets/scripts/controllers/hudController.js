var hudController = cc.Class({
    extends: cc.Component,

    properties: {
        soul: cc.Label,
        floor: cc.Label,
        xp: cc.Label,
        hp: cc.Label,

        fireShield: cc.Label,
        iceShield: cc.Label,
        acidShield: cc.Label,
        electricityShield: cc.Label,
        spikesShield: cc.Label,
        poisonShield: cc.Label,

        fireTrap: cc.Label,
        iceTrap: cc.Label,
        acidTrap: cc.Label,
        electricityTrap: cc.Label,
        spikesTrap: cc.Label,
        poisonTrap: cc.Label,

        traps: cc.Label,
        enemies: cc.Label,
        chests: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (! this.hasOwnProperty("elements")) this.elements=["fire","ice","acid","electricity","spikes","poison"];
    },

    activateLabel(label){
        if (this.hasOwnProperty(label)) this[label].node.active = true;
    },

    activateTrapLabel(label){
        if (this.hasOwnProperty(label+"Trap")) this[label+"Trap"].node.active = true;
    },

    updateLabel(label, txt){
        if (this.hasOwnProperty(label)) this[label].string = txt;
    },

    updateShields(shield){
        if (this.hasOwnProperty(shield+"Shield")) this[shield+"Shield"].string = window.gameSession.inventory[shield];
    },

    updateTraps(trap, value){
        if (this.hasOwnProperty(trap+"Trap")) this[trap+"Trap"].string = value;
    },

    updateTrapsByNumber(id, value){
        if (! this.hasOwnProperty("elements")) this.elements=["fire","ice","acid","electricity","spikes","poison"];
        this.updateTraps(this.elements[id], value);
    },

    updateAllLabels(){
        this.updateLabel("floor", ""+window.gameSession.level);
        this.updateLabel("xp", ""+window.gameSession.xp);
        this.updateLabel("hp", ""+window.gameSession.hp);
        this.updateLabel("soul", ""+window.gameSession.currency);

        this.updateShields("fire");
        this.updateShields("ice");
        this.updateShields("acid");
        this.updateShields("electricity");
        this.updateShields("spikes");
        this.updateShields("poison");
    },

    // update (dt) {},
});

module.exports = hudController;