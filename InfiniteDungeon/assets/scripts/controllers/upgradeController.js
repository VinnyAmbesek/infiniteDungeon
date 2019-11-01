const InventoryController = require("inventoryController");
const FeedbackController = require("feedbackController");
const HudController = require("hudController");

var upgradeController = cc.Class({
	extends: cc.Component,

	properties: {
		inventoryController: InventoryController,
		feedbackController: FeedbackController,
        hudController: HudController,

		grid: cc.Node,
		canvas: cc.Node,
		dungeonAchievement: cc.Node,
		feedbackLog: cc.Node,

		button: cc.Prefab,
		feedbackPrefab: cc.Prefab,
		logPrefab: cc.Prefab,

		dungeonXP: cc.Label,

		inventoryFire: cc.Label,
		inventoryIce: cc.Label,
		inventoryAcid: cc.Label,
		inventoryElectricity: cc.Label,
		inventorySpikes: cc.Label,
		inventoryPoison: cc.Label,
		inventoryPotion: cc.Label,

		icons: [cc.SpriteFrame],
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start () {
		this.setButtons();
	},

	onEnable (){
		this.checkSecretPassage();
		this.checkSpecialButton(window.gameSession.stats.traps.total, this.trapFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.fire, this.fireFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.ice, this.iceFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.acid, this.acidFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.electricity, this.electricityFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.spikes, this.spikesFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.poison, this.poisonFinder);
		this.checkSpecialButton(window.gameSession.stats.items.chests, this.treasureHunter);
		this.checkSpecialButton(window.gameSession.stats.kills.total, this.tracker);

		this.checkPermanentShield("fire");
		this.checkPermanentShield("ice");
		this.checkPermanentShield("acid");
		this.checkPermanentShield("electricity");
		this.checkPermanentShield("spikes");
		this.checkPermanentShield("poison");
		this.checkPermanentShield("total");
	},

	setButtons: function(){
		if (!window.gameSession) return;
		if (!this.hasOwnProperty("buttonsList")) this.buttonsList = [];
		if (!this.hasOwnProperty("initiated")) this.initiated = false;
		if (this.initiated) return;

		// Create upgrades that do not depend on stats
		this.createButton("Fire Protection", "fireMin", "fire", "Starting amount of Fire Shields", 0, 0, 1000);
		this.createButton("Ice Protection", "iceMin", "ice", "Starting amount of Ice Shields", 0, 0, 1000);
		this.createButton("Acid Protection", "acidMin", "acid", "Starting amount of Acid Shields", 0, 0, 1000);
		this.createButton("Electricity Protection", "electricityMin", "electricity", "Starting amount of Electricity Shields", 0, 0, 1000);
		this.createButton("Spikes Protection", "spikesMin", "spikes", "Starting amount of Spikes Shields", 0, 0, 1000);
		this.createButton("Poison Protection", "poisonMin", "poison", "Starting amount of Poison Shields", 0, 0, 1000);

		this.createButton("Fire Pocket", "fireMax", null, "Maximum amount of Fire Shields", 1, 3, 1000);
		this.createButton("Ice Pocket", "iceMax", null, "Maximum amount of Ice Shields", 1, 3, 1000);
		this.createButton("Acid Pocket", "acidMax", null, "Maximum amount of Acid Shields", 1, 3, 1000);
		this.createButton("Electricity Pocket", "electricityMax", null, "Maximum amount of Electricity Shields", 1, 3, 1000);
		this.createButton("Spikes Pocket", "spikesMax", null, "Maximum amount of Spikes Shields", 1, 3, 1000);
		this.createButton("Poison Pocket", "poisonMax", null, "Maximum amount of Poison Shields", 1, 3, 1000);

		this.createButton("Starting Potion", "potionMin", "potion", "Starting amount of Potions", 3, 0, 1000);
		this.createButton("Potion Pocket", "potionMax", null, "Maximum amount of Potions", 1, 3, 1000);

		this.createButton("Health Points", "hpMax", null, "Increases maximum HP", 2, 3, 1000);

		this.createButton("Sword Skill", "melee", null, "Increases skill with swords", 5, 1, 2000);
		this.createButton("Bow Skill", "ranged", null, "Increases skill with bows", 6, 1, 2000);
		this.createButton("Wand Skill", "magic", null, "Increases skill with wands", 7, 1, 2000);

		// Create secret passage conditional upgrade
		this.createSecretPassageButton();
		this.checkSecretPassage();

		// Create upgrades that depende on stats and are unique
		this.createSpecialButton("trapFinder","Trap Finder","Find how many traps exist in a floor.","upgradeSpecial","traps","total");
		this.checkSpecialButton(window.gameSession.stats.traps.total, this.trapFinder);
		this.createSpecialButton("fireFinder","Fire Finder","Find how many fire traps exist in a floor.","upgradeSpecial","traps","fire");
		this.checkSpecialButton(window.gameSession.stats.traps.fire, this.fireFinder);
		this.createSpecialButton("iceFinder","Ice Finder","Find how many ice traps exist in a floor.","upgradeSpecial","traps","ice");
		this.checkSpecialButton(window.gameSession.stats.traps.ice, this.iceFinder);
		this.createSpecialButton("acidFinder","Acid Finder","Find how many acid traps exist in a floor.","upgradeSpecial","traps","acid");
		this.checkSpecialButton(window.gameSession.stats.traps.acid, this.acidFinder);
		this.createSpecialButton("electricityFinder","Electricity Finder","Find how many electricity traps exist in a floor.","upgradeSpecial","traps","electricity");
		this.checkSpecialButton(window.gameSession.stats.traps.electricity, this.electricityFinder);
		this.createSpecialButton("spikesFinder","Spikes Finder","Find how many spikes traps exist in a floor.","upgradeSpecial","traps","spikes");
		this.checkSpecialButton(window.gameSession.stats.traps.spikes, this.spikesFinder);
		this.createSpecialButton("poisonFinder","Poison Finder","Find how many poison traps exist in a floor.","upgradeSpecial","traps","poison");
		this.checkSpecialButton(window.gameSession.stats.traps.poison, this.poisonFinder);

		this.createSpecialButton("treasureHunter","Treasure Hunter","Find how many chests exist in a floor.","upgradeSpecial","items","chests");
		this.checkSpecialButton(window.gameSession.stats.items.chests, this.treasureHunter);

		this.createSpecialButton("tracker","Tracker","Find how many enemies are in a floor.","upgradeSpecial","kills","total");
		this.checkSpecialButton(window.gameSession.stats.kills.total, this.tracker);

		// Create permanent shield upgrade
		this.createPermanentShield("Fireproof", "Permanent fire shield", "fire", 8);
		this.checkPermanentShield("fire");
		this.createPermanentShield("Freezeproof", "Permanent ice shield", "ice", 8);
		this.checkPermanentShield("ice");
		this.createPermanentShield("Non-corrosive", "Permanent acid shield", "acid", 8);
		this.checkPermanentShield("acid");
		this.createPermanentShield("Ground Wire", "Permanent electricity shield", "electricity", 8);
		this.checkPermanentShield("electricity");
		this.createPermanentShield("Impenetrable", "Permanent spikes shield", "spikes", 8);
		this.checkPermanentShield("spikes");
		this.createPermanentShield("Mithridatism", "Permanent poison shield", "poison", 8);
		this.checkPermanentShield("poison");
		this.createPermanentShield("Scavenger", "Increase itens got by chest", "total", 9);
		this.checkPermanentShield("total");

		this.initiated = true;
	},

	// Create permanent shield

	createPermanentShield: function(name, desc, field, id){
		let button = cc.instantiate(this.button);
		this.buttonsList.push(button);
		button.parent = this.grid;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = name;
		button.getChildByName("Description").getComponent(cc.Label).string = desc;
		button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.skills[field + "Shield"];
		button.xp = (window.gameSession.skills[field + "Shield"] + 1)*5000;
		button.getChildByName("Price").getComponent(cc.Label).string = button.xp + "XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[id];

		button.field = field;

		//add click event
		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = "permanentShield";
		button.getComponent(cc.Button).clickEvents.push(eventHandler);

		this["perm" + field] = button;
	},

	checkPermanentShield: function(field){
		if (window.gameSession.skills[field + "Shield"] < window.gameSession.achievements.items[field] && this["perm" + field]) {
			this["perm" + field].active = true;
		} else if (this["perm" + field]) {
			this["perm" + field].active = false;
		}
	},

	permanentShield: function(event){
		let button = event.target;
		let field = button.field;
		let price = (window.gameSession.skills[field + "Shield"] + 1)*5000;

		if (this.hasXP(price)){
			// take xp
			this.useXP(price);

			//do upgrade
			window.gameSession.skills[field + "Shield"]++;
			window.analytics.Design_event("upgrade:permanentShield:"+field, window.gameSession.skills[field + "Shield"]);

			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.skills[field + "Shield"];
			button.getChildByName("Price").getComponent(cc.Label).string = (price+5000) + "XP";

			this.saveGame();
		}

		this.checkPermanentShield(field);
	},

	// Unique upgrade

	createSpecialButton: function(me, name, desc, callback, sub, field){
		let button = cc.instantiate(this.button);
		this.buttonsList.push(button);
		button.parent = this.grid;
		button.upgrade = me;
		button.sub = sub;
		button.field = field;
		button.xp = 5000;
		this[me] = button;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = name;
		button.getChildByName("Description").getComponent(cc.Label).string = desc;
		button.getChildByName("Value").getComponent(cc.Label).string = 0;
		button.getChildByName("Price").getComponent(cc.Label).string = button.xp + "XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[4];

		//add click event

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = callback;
		button.getComponent(cc.Button).clickEvents.push(eventHandler);
	},

	checkSpecialButton: function(req, me){
		if (me && window.gameSession.achievements[me.sub][me.field] > 0 && !window.gameSession[me.upgrade]) {
			// show trap finder upgrade
			me.active = true;
		} else if (me) {
			me.active = false;
		}
	},

	upgradeSpecial: function(event){
		let button = event.target;
		let upgrade = button.upgrade;

		if (this.hasXP(5000)) {
			window.analytics.Design_event("upgrade:special:"+upgrade);
			// take xp
			this.useXP(5000);

			// do upgrade
			window.gameSession[upgrade] = true;
			
			button.getChildByName("Value").getComponent(cc.Label).string = 1;
			
			// increase next xp cost
			button.getChildByName("Price").getComponent(cc.Label).string = "5000XP";

			this.saveGame();
		}

		this.checkSpecialButton(window.gameSession.stats[button.sub][button.field], this[upgrade]);
	},

	// Secret Passage

	createSecretPassageButton(){
		let button = cc.instantiate(this.button);
		this.buttonsList.push(button);
		button.parent = this.grid;
		this.secretPassage = button;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = "Secret Passage";
		button.getChildByName("Description").getComponent(cc.Label).string = "The floor you start back when you die.";
		let lvl = window.gameSession.levelPassage + 5;
		if (lvl==6) lvl = 5;
		button.getChildByName("Value").getComponent(cc.Label).string = lvl;
		button.xp = 1000 * Math.floor(window.gameSession.levelPassage/5 + 1);
		button.getChildByName("Price").getComponent(cc.Label).string = button.xp + "XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[4];
		//add click event

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = "upgradeSecretPassage";
		button.getComponent(cc.Button).clickEvents.push(eventHandler);
	},

	checkSecretPassage: function(){
		if (window.gameSession.levelPassage+5 < window.gameSession.stats.levelMax && this.secretPassage) {
			// show secret passage upgrade
			this.secretPassage.active = true;
		} else if (this.secretPassage) {
			this.secretPassage.active = false;
		}
	},

	upgradeSecretPassage(event){
		let button = event.target;

		if (this.hasXP(button.xp)) {
			// take xp
			this.useXP(button.xp);

			// do upgrade
			if (window.gameSession.levelPassage == 1){
				window.gameSession.levelPassage = 5;
			} else {
				window.gameSession.levelPassage += 5;
			}
			window.gameSession.levelMin = window.gameSession.levelPassage;
			window.analytics.Design_event("upgrade:special:secretPassage", window.gameSession.levelPassage);
			
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.levelPassage;
			
			// increase next xp cost
			button.xp = 1000 * Math.floor(window.gameSession.levelPassage/5 + 1);
			button.getChildByName("Price").getComponent(cc.Label).string = button.xp + "XP";

			this.saveGame();
		}

		this.checkSecretPassage();
	},

	// Generic upgrade button

	createButton(name, field, item, desc, id, min, step){
		let button = cc.instantiate(this.button);
		this.buttonsList.push(button);
		button.parent = this.grid;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = name;
		button.getChildByName("Description").getComponent(cc.Label).string = desc;
		let price;
		if (window.gameSession.inventory[field] != null) {
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.inventory[field];
			price = window.gameSession.inventory[field] + 1;
		} else {
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession[field];
			price = window.gameSession[field] + 1;
		}
		let lvl = price - min;
		let xp = lvl * step;
		button.getChildByName("Price").getComponent(cc.Label).string = xp + "XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[id];

		button.field = field;
		button.item = item;
		button.min = min;
		button.step = step;
		button.xp = xp;

		//add click event
		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = "upgrade";
		button.getComponent(cc.Button).clickEvents.push(eventHandler); 
	},

	upgrade(event){
		let button = event.target;
		let field = button.field;

		if (this.hasXP(button.xp)) {
			// take xp
			this.useXP(button.xp);
			// do upgrade
			let price;
			if (window.gameSession.inventory[field] != null) {
				window.gameSession.inventory[field] += 1;
				window.analytics.Design_event("upgrade:common:inventory:"+field, window.gameSession.inventory[field]);
				price = window.gameSession.inventory[field] + 1;
				button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.inventory[field];
				if (button.item) this.inventoryController.giveItem(button.item, 1, null, "", "Treasure");
			} else {
				window.gameSession[field] += 1;
				window.analytics.Design_event("upgrade:common:"+field, window.gameSession[field]);
				price = window.gameSession[field] + 1;
				button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession[field];
			}
			// increase next xp cost
			let lvl = price - button.min;
			button.getChildByName("Price").getComponent(cc.Label).string = lvl * button.step + "XP";
			button.xp = lvl * button.step;

			this.saveGame();
		}
	},

	saveGame(){
		cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
	},

	// XP control

	hasXP(cost){
		return (window.gameSession.xp >= cost);
	},

	useXP(qtd){
		window.gameSession.xp -= qtd;
		window.gameSession.stats.xp += qtd;
		if (window.gameSession.stats.xp % 100000 == 0) this.feedbackController.showFeedback("Achievement: High Level", new cc.Color(0,255,0), "achievement", true, 5.0);
		this.hudController.updateLabel("xp", ""+window.gameSession.xp);
	},

	getXP(qtd, giver){
		window.gameSession.xp += qtd;
		this.hudController.updateLabel("xp", ""+window.gameSession.xp);
		this.feedbackController.showFeedback("+" + qtd + "XP", new cc.Color(0,255,0), "xp", false);
		if (giver != null) window.analytics.Design_event("event:"+giver, qtd);
	},

	getMinXP(){
		this.setButtons();
		let minXP = Number.MAX_SAFE_INTEGER;
		let maxXP = 1000;
		for (var i = 0; i < this.buttonsList.length; i++) {
			let button = this.buttonsList[i];
			if (button.active) {
				minXP = Math.min(minXP, button.xp);
				maxXP = Math.max(maxXP, button.xp);
			}
		}
		if (maxXP < minXP) minXP = maxXP;
		return minXP;
	},

	// update (dt) {},
});

module.exports = upgradeController;