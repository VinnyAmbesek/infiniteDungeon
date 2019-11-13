const PopupController = require("popupController");
const HudController = require("hudController");
const FeedbackController = require("feedbackController");
const AchievementController = require("achievementController");
const JobController = require("jobController");
const InventoryController = require("inventoryController");

var deathController = cc.Class({
    extends: cc.Component,

    properties: () => ({
        popupController: PopupController,
        hudController: HudController,
        feedbackController: FeedbackController,
        achievementController: AchievementController,
        jobController: JobController,
        inventoryController: InventoryController,
        adsController: {
             default: null,
             type: require("adsController")
         },
        adRes: cc.Node,
        deathMessage: cc.Label,
    }),

    // death functions

    iDied: function(){
        this.achievementController.updateStat(null, "row", -window.gameSession.stats.row);
        window.analytics.Level_Fail("Floor " + window.gameSession.level, "Dungeon Scene");
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
        this.achievementController.updateStat(null, "row", -window.gameSession.stats.row);
        window.gameSession.currency -= 100;
        this.ressurrect();
    },

    resurrect(){
        if (cc.sys.isMobile) console.log("NATIVE: ressurrect");
        window.analytics.Design_event("event:ressurrection", window.gameSession.currency);
        window.gameSession.hp = window.gameSession.hpMax;
        this.hudController.updateLabel("hp", window.gameSession.hp);

        this.saveGame();
        this.popupController.closePopupByName("death");
    },

    kill: function(){
        window.gameSession.hp = -1;
        this.hudController.updateLabel("hp", window.gameSession.hp);
        this.popupController.openPermanentPopup("death");
    },

    // HP control

    isDead(){
        return window.gameSession.hp <1;
    },

    isTrulyDead(){
        return window.gameSession.hp <9;
    },

    isAlmostDead(){
        return window.gameSession.hp == 1;
    },

    hasDamage(){
        return (window.gameSession.hp < window.gameSession.hpMax);
    },

    heal(qtd){
        window.gameSession.hp +=qtd;
        if (window.gameSession.hp > window.gameSession.hpMax) window.gameSession.hp = window.gameSession.hpMax;
        this.hudController.updateLabel("hp", window.gameSession.hp);
        this.feedbackController.showFeedback("+" + qtd + "HP", new cc.Color(0,255,0), "hp", false);
    },

    hurt(qtd){
        window.gameSession.hp -=qtd;
        this.hudController.updateLabel("hp", window.gameSession.hp);
        if (this.isDead()) this.popupController.openPermanentPopup("death");
        this.feedbackController.showFeedback("-" + qtd + "HP", new cc.Color(255,0,0), "hp", false);

        this.saveGame();
    },

    // Trap


    // step on a trap
    stepOnTrap: function(danger, node, left){
        this.hitTrap = true;

        let trap = this.getTrap(danger);

        let strength = Math.floor(window.gameSession.level/10 + 1);
        let chance = Math.floor((Math.random() * 100) + 1);
        cc.log(chance);
        if (chance <= 25+(window.gameSession.level/4)){
            strength += Math.floor((Math.random() * Math.floor(window.gameSession.level/10)) + 1);
            trap.feedback = "Strong " + trap.feedback;
        }
        if (this.jobController.isClass("rogue")) strength--;

        if (this.isAlmostDead() && ! this.inventoryController.hasDefenses()){
            this.achievementController.updateSpecialStat("daredevil");
        }

        window.analytics.Design_event("Trap:" + trap.field + ":" + strength, window.gameSession.inventory[trap.field]);
        strength -= window.gameSession.skills[trap.field + "Shield"];

        this.feedbackController.showFeedbackAtNode(trap.feedback, new cc.Color(255,0,0), node, true, 3.0, 75);
        this.lastDanger = trap.effect;
        this.achievementController.updateStat("traps", trap.field, 1);
        
        if (window.gameSession.inventory[trap.field] > 0){
            let shield = window.gameSession.inventory[trap.field];
            let protection = Math.min(strength, shield);
            protection = Math.max(protection, 0);

            // use shields up to strength of danger
            this.inventoryController.useItem(trap.field, protection, node);

            // danger strength is reduced by spent shields
            strength -= protection;
        }

        // receives strength in damage
        if (strength>0) {
            this.hurt(strength);
            this.achievementController.updateStat("damage", trap.field, strength);
            this.achievementController.updateStat("damage", "total", strength);
        }
        if (this.isDead()) {
            if (this.isTrulyDead()) {
                this.achievementController.updateSpecialStat("truedeath");
            }
            if (window.gameSession.death) {
                this.achievementController.updateSpecialStat("already");
            }
            this.achievementController.updateStat("death", trap.field, 1);
            this.achievementController.updateStat("death", "total", 1);
        }

        this.hudController.updateTraps(trap.field, left);
    },

    getTrap(danger){
        let trap = {};
        switch(danger) {
            case 1:
                // code block
                trap.feedback = "Fire Trap";
                trap.effect = "burned";
                trap.field = "fire";
                break;
            case 2:
                // code block
                trap.feedback = "Freezing Trap";
                trap.effect = "frozen";
                trap.field = "ice";
                break;
            case 3:
                // code block
                trap.feedback = "Acid Trap";
                trap.effect = "dissolved";
                trap.field = "acid";
                break;
            case 4:
                // code block
                trap.feedback = "Electricity Trap";
                trap.effect = "electrocuted";
                trap.field = "electricity";
                break;
            case 5:
                // code block
                trap.feedback = "Floor Spikes Trap";
                trap.effect = "impaled";
                trap.field = "spikes";
                break;
            case 6:
                // code block
                trap.feedback = "Poisoned Dart Trap";
                trap.effect = "poisoned";
                trap.field = "poison";
                break;
            default:
                // code block
        }

        return trap;
    },

    setMessage(msg){
        this.deathMessage.string = "You died!\n" + msg;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // AD
    showResAd(){
        this.adsController.showAd(null, "resurrection");
    },

    onEnable () {
        this.adRes.active = this.adsController.isAvailable("res");
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});

module.exports = deathController;