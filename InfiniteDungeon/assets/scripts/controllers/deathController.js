const PopupController = require("popupController");
const HudController = require("hudController");
const FeedbackController = require("feedbackController");
const AchievementController = require("achievementController");
const JobController = require("jobController");
const InventoryController = require("inventoryController");

var deathController = cc.Class({
    extends: cc.Component,

    properties: {
        popupController: PopupController,
        hudController: HudController,
        feedbackController: FeedbackController,
        achievementController: AchievementController,
        jobController: JobController,
        inventoryController: InventoryController,
        deathPopup: cc.Node,
        deathMessage: cc.Label,
    },

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
        this.dangers--;
        this.hitTrap = true;
        this.hudController.updateLabel("traps", ""+this.dangers);
        let strength = Math.floor(window.gameSession.level/10 + 1);
        if (this.jobController.isClass("rogue")) strength--;
        let feedback;
        let effect;
        let field;
        let item;
        let achivTrap;
        let achivItem;
        let achivDeath;

        if (this.isAlmostDead() && ! this.inventoryController.hasDefenses()){
            this.achievementController.updateSpecialStat("daredevil");
        }

        switch(danger) {
            case 1:
                // code block
                feedback = "Fire Trap";
                effect = "burned";
                field = "fire";
                item = "Fire"
                achivTrap = "Getting warmer";
                achivItem = "Like sunscreen";
                achivDeath = "Barbecue";
                break;
            case 2:
                // code block
                feedback = "Freezing Trap";
                effect = "frozen";
                field = "ice"
                item = "Ice";
                achivTrap = "Getting colder";
                achivItem = "A warm blanket";
                achivDeath = "Popsicle";
                break;
            case 3:
                // code block
                feedback = "Acid Trap";
                effect = "dissolved";
                field = "acid"
                item = "Acid";
                achivTrap = "Dirty floor";
                achivItem = "Still intact";
                achivDeath = "Not much left";
                break;
            case 4:
                // code block
                feedback = "Electricity Trap";
                effect = "electrocuted";
                field = "electricity"
                item = "Electricity";
                achivTrap = "Tesla attack";
                achivItem = "Fully isolated";
                achivDeath = "Full of Energy";
                break;
            case 5:
                // code block
                feedback = "Floor Spikes Trap";
                effect = "impaled";
                field = "spikes"
                item = "Spikes";
                achivTrap = "Holed floor";
                achivItem = "Steel boots";
                achivDeath = "Is Vlad here?";
                break;
            case 6:
                // code block
                feedback = "Poisoned Dart Trap";
                effect = "poisoned";
                field = "poison"
                item = "Poison";
                achivTrap = "Holed wall";
                achivItem = "Antidote";
                achivDeath = "Is there an antidote?";
                break;
            default:
                // code block
        }

        window.analytics.Design_event("Trap:" + field + ":" + strength, window.gameSession.inventory[field]);
        strength -= window.gameSession.skills[field + "Shield"];

        this.feedbackController.showFeedbackAtNode(feedback, new cc.Color(255,0,0), node, true, 3.0, 75);
        this.lastDanger = effect;
        this.achievementController.updateStat("traps", field, 1);
        
        if (window.gameSession.inventory[field] > 0){
            let shield = window.gameSession.inventory[field];
            let protection = Math.min(strength, shield);

            // use shields up to strength of danger
            this.inventoryController.useItem(field, protection, node);

            // danger strength is reduced by spent shields
            strength -= protection;
        }

        // receives strength in damage
        if (strength>0) {
            this.hurt(strength);
            this.achievementController.updateStat("damage", field, strength);
            this.achievementController.updateStat("damage", "total", strength);
        }
        if (this.isDead()) {
            if (this.isTrulyDead()) {
                this.achievementController.updateSpecialStat("truedeath");
            }
            if (window.gameSession.death) {
                this.achievementController.updateSpecialStat("already");
            }
            this.achievementController.updateStat("death", field, 1);
            this.achievementController.updateStat("death", "total", 1);
        }

        this.hudController.updateTraps(field, left);
    },

    setMessage(msg){
        this.deathMessage.string = "You died!\n" + msg;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});

module.exports = deathController;