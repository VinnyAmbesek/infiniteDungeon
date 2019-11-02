const UpgradeController = require("upgradeController");
const FeedbackController = require("feedbackController");

var achievementController = cc.Class({
    extends: cc.Component,

    properties: {
        upgradeController: UpgradeController,
        feedbackController: FeedbackController,
        list: cc.Node,
        button: cc.Prefab,
        notification: cc.Node,
        icons: [cc.SpriteFrame],
        dungeonXP: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable () {
        this.notification.active = false;

        this.updateSpecialButton("truedeath");
        this.updateSpecialButton("daredevil");
        this.updateSpecialButton("already");
        this.updateSpecialButton("overkill");
        this.updateSpecialButton("darkness");
        this.updateSpecialButton("lucky");

        this.updateButton("levelMax");
        this.updateButton("xp");
        this.updateButton("tiles");

        this.updateButton("killstotal");
        this.updateButton("killsmelee");
        this.updateButton("killsranged");
        this.updateButton("killsmagic");

        this.updateButton("trapstotal");
        this.updateButton("trapsfire");
        this.updateButton("trapsice");
        this.updateButton("trapsacid");
        this.updateButton("trapselectricity");
        this.updateButton("trapsspikes");
        this.updateButton("trapspoison");

        this.updateButton("itemschests");
        this.updateButton("itemstotal");
        this.updateButton("itemsfire");
        this.updateButton("itemsice");
        this.updateButton("itemsacid");
        this.updateButton("itemselectricity");
        this.updateButton("itemsspikes");
        this.updateButton("itemspoison");
        this.updateButton("itemspotion");

        this.updateButton("damagetotal");
        this.updateButton("damagefire");
        this.updateButton("damageice");
        this.updateButton("damageacid");
        this.updateButton("damageelectricity");
        this.updateButton("damagespikes");
        this.updateButton("damagepoison");
        this.updateButton("damagemelee");
        this.updateButton("damageranged");
        this.updateButton("damagemagic");

        this.updateButton("deathtotal");
        this.updateButton("deathfire");
        this.updateButton("deathice");
        this.updateButton("deathacid");
        this.updateButton("deathelectricity");
        this.updateButton("deathspikes");
        this.updateButton("deathpoison");
        this.updateButton("deathmelee");
        this.updateButton("deathranged");
        this.updateButton("deathmagic");
    },

    start () {
        this.setButtons();
    },

    setButtons () {
        if (!window.gameSession) return;
        if (!this.hasOwnProperty("initiated")) this.initiated = false;
        if (this.initiated) return;

        this.createSpecialButton("Stairs!", "Finish your first level.", "firstLevel", 1);
        this.createSpecialButton("Subdued", "Kill your first sub-boss", "killSubboss", 1);
        this.createSpecialButton("Going up the food chain", "Kill your first boss", "killBoss", 1);
        this.createSpecialButton("What does this do?", "Find a lever before the closed door.", "lever", 1); 
        this.createSpecialButton("True Death", "Get to -10HP", "truedeath", 1);
        this.createSpecialButton("Daredevil", "Face a trap with 1HP and 0 shields", "daredevil", 1);
        this.createSpecialButton("Already back?", "Die, then die again in the next floor", "already", 1);
        this.createSpecialButton("Overkill", "Get an enemy to -10HP", "overkill", 1);
        this.createSpecialButton("Stop Moving!", "Get 'Dungeon Moves' twice in a floor", "darkness", 1);
        this.createSpecialButton("Lucky", "Cross a floor without hitting any trap", "lucky", 1);
        this.createSpecialButton("Did not expected that", "Die to a sub boss", "subboss", 1);
        this.createSpecialButton("Expected that", "Die to a boss", "boss", 1);

        this.createButton("Explorer", "Deepest floor you went", null, "levelMax", 2, 10, 10000);
        this.createButton("High level", "Total XP spent", null, "xp", 2, 100000);
        this.createButton("Runner", "Tiles walked", null, "tiles", 2, 1000);
        this.createButton("In a Row", "Floors explored without dying", null, "row", 2, 5, 5000);

        this.createButton("God of War", "Enemies you defeated", "kills", "total", 3);
        this.createButton("Warrior", "Enemies you defeated with your sword", "kills", "melee", 3, 100, 500);
        this.createButton("Archer", "Enemies you defeated with your bow", "kills", "ranged", 4, 100, 500);
        this.createButton("Archmage", "Enemies you defeated with your wand", "kills", "magic", 5, 100, 500);

        this.createButton("Trap Finder", "Total traps found the hard way", "traps", "total", 6);
        this.createButton("Getting warmer", "Total fire traps found the hard way", "traps", "fire", 6, 50, 2500);
        this.createButton("Getting colder", "Total ice traps found the hard way", "traps", "ice", 6, 50, 2500);
        this.createButton("Dirty floor", "Total acid traps found the hard way", "traps", "acid", 6, 50, 2500);
        this.createButton("Tesla attack", "Total electricity traps found the hard way", "traps", "electricity", 6, 50, 2500);
        this.createButton("Holed floor", "Total spikes traps found the hard way", "traps", "spikes", 6, 50, 2500);
        this.createButton("Holed wall", "Total poisoned dart traps found the hard way", "traps", "poison", 6, 50, 2500);

        this.createButton("Treasure Hunter", "Total chests found", "items", "chests", 7);
        this.createButton("Spender", "Total items used", "items", "total", 8, 500);
        this.createButton("Like sunscreen", "Total fire shields used", "items", "fire", 9, 100, 500);
        this.createButton("A warm blanket", "Total ice shields used", "items", "ice", 9, 100, 500);
        this.createButton("Still intact", "Total acid shields used", "items", "acid", 9, 100, 500);
        this.createButton("Fully isolated", "Total electricity shields used", "items", "electricity", 9, 100, 500);
        this.createButton("Steel boots", "Total spikes shields used", "items", "spikes", 9, 100, 500);
        this.createButton("Antidote", "Total poison shields used", "items", "poison", 9, 100, 500);
        this.createButton("Not addicted", "Total potions used", "items", "potion", 10, 100, 500);

        this.createButton("It hurts everywhere", "Total damage taken", "damage", "total", 11, 100, 500);
        this.createButton("Needs some Aloe", "Total fire damage", "damage", "fire", 11, 50, 1000);
        this.createButton("I want a blanket", "Total ice damage", "damage", "ice", 11, 50, 1000);
        this.createButton("I need a base", "Total acid damage", "damage", "acid", 11, 50, 1000);
        this.createButton("I need rubber boots", "Total electricity damage", "damage", "electricity", 11, 50, 1000);
        this.createButton("Not again...", "Total spikes damage", "damage", "spikes", 11, 50, 1000);
        this.createButton("Feeling kind green", "Total poison damage", "damage", "poison", 11, 50, 1000);
        this.createButton("I need a shield", "Total damage in melee combat", "damage", "melee", 3, 50, 1000);
        this.createButton("Gunch shooter", "Total damage in ranged combat", "damage", "ranged", 4, 50, 1000);
        this.createButton("I need a staff", "Total damage in magic combat", "damage", "magic", 5, 50, 1000);

        this.createButton("Kenny", "Total deaths", "death", "total", 12, 10, 2500);
        this.createButton("Barbecue", "Total burned deaths", "death", "fire", 12, 10, 5000);
        this.createButton("Popsicle", "Total frozen deaths", "death", "ice", 12, 10, 5000);
        this.createButton("Not much left", "Total dissolved deaths", "death", "acid", 12, 10, 5000);
        this.createButton("Full of Energy", "Total electricity deaths", "death", "electricity", 12, 10, 5000);
        this.createButton("Is Vlad here?", "Total impaled deaths", "death", "spikes", 12, 10, 5000);
        this.createButton("Is there an antidote?", "Total poisoned deaths", "death", "poison", 12, 10, 5000);
        this.createButton("Shaky hand", "Total deaths in melee combat", "death", "melee", 12, 10, 5000);
        this.createButton("Bad Sight", "Total deaths in ranged combat", "death", "ranged", 12, 10, 5000);
        this.createButton("Curled Tongue", "Total deaths in magic combat", "death", "magic", 12, 10, 5000);

        this.initiated = true;
    },

    // Unique achievements
    createSpecialButton(name, desc, field, id){
        let sub = "unique";
        let stat = 0;
        if (window.gameSession.stats.unique[field]) stat = 1;
        let buttonName = sub + field;

        let value = 10000;
        let progress = stat/1;
        let completion = stat + " / 1";

        let button = cc.instantiate(this.button);
        button.parent = this.list;
        button.progress = progress;
        button.title = name;
        button.prize = value;
        button.sub = sub;
        button.field = field;
        button.id = id;

        // fill data
        button.getChildByName("Name").getComponent(cc.Label).string = name;
        button.getChildByName("Description").getComponent(cc.Label).string = desc;
        button.getChildByName("Value").getComponent(cc.Label).string = value + "XP";
        button.getChildByName("Progress").getComponent(cc.ProgressBar).progress = progress;
        button.getChildByName("Completion").getComponent(cc.Label).string = completion;
        if (! window.gameSession.achievements.unique[field]) {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[0];
        } else {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[id];
        }
        
        //add click event
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "achievementController";
        eventHandler.handler = "getSpecialPrize";
        button.getComponent(cc.Button).clickEvents.push(eventHandler);

        //save button
        this[buttonName] = button;

        if (progress >= 1 && !(window.gameSession.achievements.unique[field])) this.notification.active = true;
    },

    getSpecialPrize(event){
        let button = event.target;
        let progress = button.progress;
        let sub = button.sub;
        let field = button.field;

        //give prize
        if (progress >= 1 && !(window.gameSession.achievements.unique[field])) {
            window.analytics.Design_event("achievement:unique:"+field);
            this.upgradeController.getXP(button.prize, null);

            // update achievement level
            window.gameSession.achievements.unique[field] = true;
        }

        // update button
        this.updateSpecialButton(field);

        this.saveGame();
    },

    updateSpecialButton(field){
        let button = this["unique" + field];
        if (!button) return;

        let oldProgress = button.progress;

        let stat = 0;
        if (window.gameSession.stats.unique[field]) stat = 1;

        let value = 10000;
        let progress = stat/1;
        let completion = stat + " / 1";


        button.progress = progress;
        button.prize = value;

        button.getChildByName("Value").getComponent(cc.Label).string = value + "XP";
        button.getChildByName("Progress").getComponent(cc.ProgressBar).progress = progress;
        button.getChildByName("Completion").getComponent(cc.Label).string = completion;

        if (! window.gameSession.achievements.unique[field]) {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[0];
        } else {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[button.id];
        }

        if (oldProgress <1 && progress >=1){
            // just unlocked the achievement
            this.feedbackController.showFeedback("Achievement: " + button.title, new cc.Color(0,255,0), "achievement", true, 5.0);
            this.showNotification();
        }
    },

    updateSpecialStat(field){
        this.setButtons();
        if (window.gameSession.achievements.unique[field]) return;
        window.gameSession.stats.unique[field] = true;
        this.updateSpecialButton(field);  
    },

    // Repeatable achievements

    createButton(name, desc, sub, field, spriteID, step=100, prize=100){
        let achievement;
        let stat;
        let buttonName;

        // get values
        if (sub) {
            achievement = window.gameSession.achievements[sub][field];
            stat = window.gameSession.stats[sub][field];
            buttonName = sub + field;
        } else {
            achievement = window.gameSession.achievements[field];
            stat = window.gameSession.stats[field];
            buttonName = field;
        }

        let required = (achievement + 1) * step;
        let reward = (achievement + 1) * prize;
        let progress = (stat-required+step)/step;
        let completion = stat + " / " + required;

        let button = cc.instantiate(this.button);
        button.parent = this.list;
        button.title = name;
        button.progress = progress;
        button.step = step;
        button.prize = prize;
        button.reward = reward;
        button.sub = sub;
        button.field = field;
        button.spriteID = spriteID;

        // fill data
        button.getChildByName("Name").getComponent(cc.Label).string = name;
        button.getChildByName("Description").getComponent(cc.Label).string = desc;
        button.getChildByName("Value").getComponent(cc.Label).string = reward + "XP";
        button.getChildByName("Progress").getComponent(cc.ProgressBar).progress = progress;
        button.getChildByName("Completion").getComponent(cc.Label).string = completion;
        if (achievement < 1) {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[0];
        } else {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[spriteID];
        }
        
        //add click event
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "achievementController";
        eventHandler.handler = "getPrize";
        button.getComponent(cc.Button).clickEvents.push(eventHandler);

        //save button
        this[buttonName] = button;

        if (progress >= 1 && achievement < 100) this.notification.active = true;
    },

    getPrize(event){
        let button = event.target;
        let progress = button.progress;
        let sub = button.sub;
        let field = button.field;

        //give prize
        if (progress >= 1) {
            let underLimit = true;
            // update achievement level
            if (sub) {
                window.gameSession.achievements[sub][field]++;
                if (window.gameSession.achievements[sub][field] > 100) {
                    underLimit = false;
                    // 100 is the limit, if go above it undo
                    window.gameSession.achievements[sub][field] = 100;
                } else {
                    window.analytics.Design_event("achievement:multiple:"+sub+":"+field, window.gameSession.achievements[sub][field]);
                }
            } else {
                window.gameSession.achievements[field]++;
                if (window.gameSession.achievements[field] > 100) {
                    underLimit = false;
                    // 100 is the limit, if go above it undo
                    window.gameSession.achievements[field] = 100;
                } else {
                    window.analytics.Design_event("achievement:multiple:"+field, window.gameSession.achievements[field]);
                }
            }

            // if achievement lvl under 100 give XP prize
            if (underLimit)this.upgradeController.getXP(button.reward, null);
        }

        // update button
        let buttonName = field;
        if (sub != null) buttonName = sub + field;
        this.updateButton(buttonName);

        this.saveGame();
    },

    updateButton(buttonName){
        let button = this[buttonName];
        if (!button) return;
        let sub = button.sub;
        let field = button.field;
        let step = button.step;
        let oldProgress = button.progress;

        let achievement;
        let stat;
        if (sub) {
            achievement = window.gameSession.achievements[sub][field];
            stat = window.gameSession.stats[sub][field];
        } else {
            achievement = window.gameSession.achievements[field];
            stat = window.gameSession.stats[field];
        }

        let required = (achievement + 1) * step;
        let reward = (achievement + 1) * button.prize;
        let progress = (stat-required+step)/step;
        let completion = stat + " / " + required;

        button.progress = progress;
        button.reward = reward;

        button.getChildByName("Value").getComponent(cc.Label).string = reward + "XP";
        button.getChildByName("Progress").getComponent(cc.ProgressBar).progress = progress;
        button.getChildByName("Completion").getComponent(cc.Label).string = completion;

        if (achievement < 1) {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[0];
        } else {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[button.spriteID];
        }

        if (oldProgress <1 && progress >=1){
            // just unlocked the achievement
            this.feedbackController.showFeedback("Achievement: " + button.title, new cc.Color(0,255,0), "achievement", true, 5.0);
            this.showNotification();
        }
    },

    updateStat(sub, field, value){
        this.setButtons();
        let obj = window.gameSession.stats;
        let name = field;
        if (sub != null){
            obj = obj[sub];
            name = "" + sub + field;
        }
        if(! obj.hasOwnProperty(field)) return;

        obj[field] += value;
        this.updateButton(name);
    },

    // Other

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    showNotification(){
        this.notification.active = true;
    },

    // update (dt) {},
});

module.exports = achievementController;