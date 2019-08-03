var achievementController = cc.Class({
    extends: cc.Component,

    properties: {
        list: cc.Node,
        button: cc.Prefab,
        popups: [cc.Node],
        icons: [cc.SpriteFrame],
        dungeonXP: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable () {
        this.updateSpecialButton("truedeath");
        this.updateSpecialButton("daredevil");
        this.updateSpecialButton("already");
        this.updateSpecialButton("overkill");
        this.updateSpecialButton("darkness");
        this.updateSpecialButton("lucky");

        this.updateButton(this["levelMax"], null, "levelMax", 100);
        this.updateButton(this["xp"], null, "xp", 0.01);
        this.updateButton(this["tiles"], null, "tiles", 0.1);

        this.updateButton(this["killstotal"], "kills", "total", 1);
        this.updateButton(this["killsmelee"], "kills", "melee", 1);
        this.updateButton(this["killsranged"], "kills", "ranged", 1);
        this.updateButton(this["killsmagic"], "kills", "magic", 1);

        this.updateButton(this["trapstotal"], "traps", "total", 1);
        this.updateButton(this["trapsfire"], "traps", "fire", 1);
        this.updateButton(this["trapsice"], "traps", "ice", 1);
        this.updateButton(this["trapsacid"], "traps", "acid", 1);
        this.updateButton(this["trapselectricity"], "traps", "electricity", 1);
        this.updateButton(this["trapsspikes"], "traps", "spikes", 1);
        this.updateButton(this["trapspoison"], "traps", "poison", 1);

        this.updateButton(this["itemschests"], "items", "chests", 1);
        this.updateButton(this["itemstotal"], "items", "total", 1);
        this.updateButton(this["itemsfire"], "items", "fire", 1);
        this.updateButton(this["itemsice"], "items", "ice", 1);
        this.updateButton(this["itemsacid"], "items", "acid", 1);
        this.updateButton(this["itemselectricity"], "items", "electricity", 1);
        this.updateButton(this["itemsspikes"], "items", "spikes", 1);
        this.updateButton(this["itemspoison"], "items", "poison", 1);
        this.updateButton(this["itemspotion"], "items", "potion", 1);

        this.updateButton(this["damagetotal"], "damage", "total", 1);
        this.updateButton(this["damagefire"], "damage", "fire", 1);
        this.updateButton(this["damageice"], "damage", "ice", 1);
        this.updateButton(this["damageacid"], "damage", "acid", 1);
        this.updateButton(this["damageelectricity"], "damage", "electricity", 1);
        this.updateButton(this["damagespikes"], "damage", "spikes", 1);
        this.updateButton(this["damagepoison"], "damage", "poison", 1);
        this.updateButton(this["damagemelee"], "damage", "melee", 1);
        this.updateButton(this["damageranged"], "damage", "ranged", 1);
        this.updateButton(this["damagemagic"], "damage", "magic", 1);

        this.updateButton(this["deathtotal"], "death", "total", 10);
        this.updateButton(this["deathfire"], "death", "fire", 10);
        this.updateButton(this["deathice"], "death", "ice", 10);
        this.updateButton(this["deathacid"], "death", "acid", 10);
        this.updateButton(this["deathelectricity"], "death", "electricity", 10);
        this.updateButton(this["deathspikes"], "death", "spikes", 10);
        this.updateButton(this["deathpoison"], "death", "poison", 10);
        this.updateButton(this["deathmelee"], "death", "melee", 10);
        this.updateButton(this["deathranged"], "death", "ranged", 10);
        this.updateButton(this["deathmagic"], "death", "magic", 10);
    },

    start () {
        this.createSpecialButton("True Death", "Get to -10HP", "truedeath", 1);
        this.createSpecialButton("Daredevil", "Face a trap with 1HP and 0 shields", "daredevil", 1);
        this.createSpecialButton("Already back?", "Die, then die again in the next floor", "already", 1);
        this.createSpecialButton("Overkill", "Get an enemy to -10HP", "overkill", 1);
        this.createSpecialButton("Stop Moving!", "Get 'Dungeon Moves' twice in a floor", "darkness", 1);
        this.createSpecialButton("Lucky", "Cross a floor without hitting any trap", "lucky", 1);

        this.createButton("Explorer", "Deepest floor you went", null, "levelMax", 1, 100);
        this.createButton("High level", "Total XP spent", null, "xp", 1, 0.01);
        this.createButton("Runner", "Tiles walked", null, "tiles", 1, 0.1);

        this.createButton("God of War", "Enemies you defeated", "kills", "total", 1, 1);
        this.createButton("Warrior", "Enemies you defeated with your sword", "kills", "melee", 1, 1);
        this.createButton("Archer", "Enemies you defeated with your bow", "kills", "ranged", 1, 1);
        this.createButton("Archmage", "Enemies you defeated with your wand", "kills", "magic", 1, 1);

        this.createButton("Trap Finder", "Total traps found the hard way", "traps", "total", 1, 1);
        this.createButton("Getting warmer", "Total fire traps found the hard way", "traps", "fire", 1, 1);
        this.createButton("Getting colder", "Total ice traps found the hard way", "traps", "ice", 1, 1);
        this.createButton("Dirty floor", "Total acid traps found the hard way", "traps", "acid", 1, 1);
        this.createButton("Tesla attack", "Total electricity traps found the hard way", "traps", "electricity", 1, 1);
        this.createButton("Holed floor", "Total spikes traps found the hard way", "traps", "spikes", 1, 1);
        this.createButton("Holed wall", "Total poisoned dart traps found the hard way", "traps", "poison", 1, 1);

        this.createButton("Treasure Hunter", "Total chests found", "items", "chests", 1, 1);
        this.createButton("Spender", "Total items used", "items", "total", 1, 1);
        this.createButton("Like sunscreen", "Total fire shields used", "items", "fire", 1, 1);
        this.createButton("A warm blanket", "Total ice shields used", "items", "ice", 1, 1);
        this.createButton("Still intact", "Total acid shields used", "items", "acid", 1, 1);
        this.createButton("Fully isolated", "Total electricity shields used", "items", "electricity", 1, 1);
        this.createButton("Steel boots", "Total spikes shields used", "items", "spikes", 1, 1);
        this.createButton("Antidote", "Total poison shields used", "items", "poison", 1, 1);
        this.createButton("Not addicted", "Total potions used", "items", "potion", 1, 1);

        this.createButton("It hurts everywhere", "Total damage taken", "damage", "total", 1, 1);
        this.createButton("Needs some Aloe", "Total fire damage", "damage", "fire", 1, 1);
        this.createButton("I want a blanket", "Total ice damage", "damage", "ice", 1, 1);
        this.createButton("I need a base", "Total acid damage", "damage", "acid", 1, 1);
        this.createButton("I need rubber boots", "Total electricity damage", "damage", "electricity", 1, 1);
        this.createButton("Not again...", "Total spikes damage", "damage", "spikes", 1, 1);
        this.createButton("Feeling kind green", "Total poison damage", "damage", "poison", 1, 1);
        this.createButton("I need a shield", "Total damage in melee combat", "damage", "melee", 1, 1);
        this.createButton("The problem is the bow", "Total damage in ranged combat", "damage", "ranged", 1, 1);
        this.createButton("I need a staff", "Total damage in magic combat", "damage", "magic", 1, 1);

        this.createButton("Kenny", "Total deaths", "death", "total", 1, 10);
        this.createButton("Barbecue", "Total burned deaths", "death", "fire", 1, 10);
        this.createButton("Popsicle", "Total frozen deaths", "death", "ice", 1, 10);
        this.createButton("Not much left", "Total dissolved deaths", "death", "acid", 1, 10);
        this.createButton("Full of Energy", "Total electricity deaths", "death", "electricity", 1, 10);
        this.createButton("Is Vlad here?", "Total impaled deaths", "death", "spikes", 1, 10);
        this.createButton("Is there an antidote?", "Total poisoned deaths", "death", "poison", 1, 10);
        this.createButton("Shaky hand", "Total deaths in melee combat", "death", "melee", 1, 10);
        this.createButton("Bad Sight", "Total deaths in ranged combat", "death", "ranged", 1, 10);
        this.createButton("Curled Tongue", "Total deaths in magic combat", "death", "magic", 1, 10);
    },

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
        button.prize = value;
        button.sub = sub;
        button.field = field;
        button.mult = 1;
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
    },

    getSpecialPrize(event){
        let button = event.target;
        let progress = button.progress;
        let sub = button.sub;
        let field = button.field;

        //give prize
        if (progress >= 1 && !(window.gameSession.achievements.unique[field])) {
            window.gameSession.xp += button.prize;
            this.dungeonXP.string = "XP: " + window.gameSession.xp;

            // update achievement level
            window.gameSession.achievements.unique[field] = true;
        }

        // update button
        this.updateSpecialButton(field);

        this.saveGame();
    },

    updateSpecialButton(field){
        let button = this["unique" + field]
        if (!button) return;

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
    },

    createButton(name, desc, sub, field, id, mult){
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

        let xp = (achievement + 1) * 100;
        let value = xp;
        let progress = stat/xp;
        let completion = stat + " / " + xp;
        if (mult > 1) {
            value *= mult;
        } else if (mult < 1) {
            progress = stat/ (xp / mult);
            completion = stat + " / " + (xp / mult);
        }

        let button = cc.instantiate(this.button);
        button.parent = this.list;
        button.progress = progress;
        button.prize = value;
        button.sub = sub;
        button.field = field;
        button.mult = mult;
        button.id = id;

        // fill data
        button.getChildByName("Name").getComponent(cc.Label).string = name;
        button.getChildByName("Description").getComponent(cc.Label).string = desc;
        button.getChildByName("Value").getComponent(cc.Label).string = value + "XP";
        button.getChildByName("Progress").getComponent(cc.ProgressBar).progress = progress;
        button.getChildByName("Completion").getComponent(cc.Label).string = completion;
        if (achievement < 1) {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[0];
        } else {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[id];
        }
        
        //add click event
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "achievementController";
        eventHandler.handler = "getPrize";
        button.getComponent(cc.Button).clickEvents.push(eventHandler);

        //save button
        this[buttonName] = button;
    },

    getPrize(event){
        let button = event.target;
        let progress = button.progress;
        let sub = button.sub;
        let field = button.field;

        //give prize
        if (progress >= 1) {
            window.gameSession.xp += button.prize;
            this.dungeonXP.string = "XP: " + window.gameSession.xp;

            // update achievement level
            if (sub) {
                window.gameSession.achievements[sub][field]++;
            } else {
                window.gameSession.achievements[field]++;
            }
        }

        // update button
        this.updateButton(button, sub, field, button.mult);

        this.saveGame();
    },

    updateButton(button, sub, field, mult){
        if (!button) return;

        let achievement;
        let stat;
        if (sub) {
            achievement = window.gameSession.achievements[sub][field];
            stat = window.gameSession.stats[sub][field];
        } else {
            achievement = window.gameSession.achievements[field];
            stat = window.gameSession.stats[field];
        }

        let xp = (achievement + 1) * 100;
        let value = xp;
        let progress = stat/xp;
        let completion = stat + " / " + xp;
        if (mult > 1) {
            value *= mult;
        } else if (mult < 1) {
            progress = stat/ (xp / mult);
            completion = stat + " / " + (xp / mult);
        }

        button.progress = progress;
        button.prize = value;

        button.getChildByName("Value").getComponent(cc.Label).string = value + "XP";
        button.getChildByName("Progress").getComponent(cc.ProgressBar).progress = progress;
        button.getChildByName("Completion").getComponent(cc.Label).string = completion;

        if (achievement < 1) {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[0];
        } else {
            button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[button.id];
        }
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    close: function() {
        this.node.active = false;
        window.gameGlobals.popup = false;
    },

    open: function() {
        for (var i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }
        this.node.active = true;
        window.gameGlobals.popup = true;
    },

    // update (dt) {},
});
