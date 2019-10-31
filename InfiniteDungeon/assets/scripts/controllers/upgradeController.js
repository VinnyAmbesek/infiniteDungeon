var upgradeController = cc.Class({
	extends: cc.Component,

	properties: {
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
		this.checkSpecialButton(window.gameSession.stats.traps.total, window.gameSession.trapFinder, this.trapFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.fire, window.gameSession.fireFinder, this.fireFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.ice, window.gameSession.iceFinder, this.iceFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.acid, window.gameSession.acidFinder, this.acidFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.electricity, window.gameSession.electricityFinder, this.electricityFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.spikes, window.gameSession.spikesFinder, this.spikesFinder);
		this.checkSpecialButton(window.gameSession.stats.traps.poison, window.gameSession.poisonFinder, this.poisonFinder);
		this.checkSpecialButton(window.gameSession.stats.items.chests, window.gameSession.treasureHunter, this.treasureHunter);
		this.checkSpecialButton(window.gameSession.stats.kills.total, window.gameSession.tracker, this.tracker);

		this.checkPermanentShield("fire");
		this.checkPermanentShield("ice");
		this.checkPermanentShield("acid");
		this.checkPermanentShield("electricity");
		this.checkPermanentShield("spikes");
		this.checkPermanentShield("poison");
		this.checkPermanentShield("total");
	},

	setButtons: function(){
		if (! window.gameSession) return;

		this.createButton("Fire Protection", "fireMin", "fire", "Starting amount of Fire Shields", 0, 1, 0);
		this.createButton("Ice Protection", "iceMin", "ice", "Starting amount of Ice Shields", 0, 1, 0);
		this.createButton("Acid Protection", "acidMin", "acid", "Starting amount of Acid Shields", 0, 1, 0);
		this.createButton("Electricity Protection", "electricityMin", "electricity", "Starting amount of Electricity Shields", 0, 1, 0);
		this.createButton("Spikes Protection", "spikesMin", "spikes", "Starting amount of Spikes Shields", 0, 1, 0);
		this.createButton("Poison Protection", "poisonMin", "poison", "Starting amount of Poison Shields", 0, 1, 0);

		this.createButton("Fire Pocket", "fireMax", null, "Maximum amount of Fire Shields", 1, 1, 3);
		this.createButton("Ice Pocket", "iceMax", null, "Maximum amount of Ice Shields", 1, 1, 3);
		this.createButton("Acid Pocket", "acidMax", null, "Maximum amount of Acid Shields", 1, 1, 3);
		this.createButton("Electricity Pocket", "electricityMax", null, "Maximum amount of Electricity Shields", 1, 1, 3);
		this.createButton("Spikes Pocket", "spikesMax", null, "Maximum amount of Spikes Shields", 1, 1, 3);
		this.createButton("Poison Pocket", "poisonMax", null, "Maximum amount of Poison Shields", 1, 1, 3);

		this.createButton("Starting Potion", "potionMin", "potion", "Starting amount of Potions", 3, 1, 0);
		this.createButton("Potion Pocket", "potionMax", null, "Maximum amount of Potions", 1, 1, 3);

		this.createButton("Health Points", "hpMax", null, "Increases maximum HP", 2, 1, 3);

		this.createButton("Sword Skill", "melee", null, "Increases skill with swords", 5, 2, 1);
		this.createButton("Bow Skill", "ranged", null, "Increases skill with bows", 6, 2, 1);
		this.createButton("Wand Skill", "magic", null, "Increases skill with wands", 7, 2, 1);

		this.createSecretPassageButton();
		this.checkSecretPassage();

		this.createSpecialButton("trapFinder","Trap Finder","Find how many traps exist in a floor.","upgradeTrapFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.total, window.gameSession.trapFinder, this.trapFinder);
		this.createSpecialButton("fireFinder","Fire Finder","Find how many fire traps exist in a floor.","upgradeFireFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.fire, window.gameSession.fireFinder, this.fireFinder);
		this.createSpecialButton("iceFinder","Ice Finder","Find how many ice traps exist in a floor.","upgradeIceFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.ice, window.gameSession.iceFinder, this.iceFinder);
		this.createSpecialButton("acidFinder","Acid Finder","Find how many acid traps exist in a floor.","upgradeAcidFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.acid, window.gameSession.acidFinder, this.acidFinder);
		this.createSpecialButton("electricityFinder","Electricity Finder","Find how many electricity traps exist in a floor.","upgradeElectricityFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.electricity, window.gameSession.electricityFinder, this.electricityFinder);
		this.createSpecialButton("spikesFinder","Spikes Finder","Find how many spikes traps exist in a floor.","upgradeSpikesFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.spikes, window.gameSession.spikesFinder, this.spikesFinder);
		this.createSpecialButton("poisonFinder","Poison Finder","Find how many poison traps exist in a floor.","upgradePoisonFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.poison, window.gameSession.poisonFinder, this.poisonFinder);

		this.createSpecialButton("treasureHunter","Treasure Hunter","Find how many chests exist in a floor.","upgradeTreasureHunter");		
		this.checkSpecialButton(window.gameSession.stats.items.chests, window.gameSession.treasureHunter, this.treasureHunter);

		this.createSpecialButton("tracker","Tracker","Find how many enemies are in a floor.","upgradeTracker");
		this.checkSpecialButton(window.gameSession.stats.kills.total, window.gameSession.tracker, this.tracker);

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
		//this.checkPermanentShield();
	},

	createPermanentShield: function(name, desc, field, id){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = name;
		button.getChildByName("Description").getComponent(cc.Label).string = desc;
		button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.skills[field + "Shield"];
		button.getChildByName("Price").getComponent(cc.Label).string = (window.gameSession.skills[field + "Shield"] + 1)*5000 + "XP";
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

		if (window.gameSession.xp >= price){
			// take xp
			window.gameSession.xp -= price;
			window.gameSession.stats.xp += price;
			if (window.gameSession.stats.xp % 100000 == 0) this.showFeedback("Achievement: High Level", new cc.Color(0,255,0), this.dungeonAchievement, true);
			this.dungeonXP.string = window.gameSession.xp;

			//do upgrade
			window.gameSession.skills[field + "Shield"]++;
			window.analytics.Design_event("upgrade:permanentShield:"+field, window.gameSession.skills[field + "Shield"]);

			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.skills[field + "Shield"];
			button.getChildByName("Price").getComponent(cc.Label).string = (price+5000) + "XP";

			this.saveGame();
		}

		this.checkPermanentShield(field);
	},

	createSpecialButton: function(me, name, desc, callback){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;
		this[me] = button;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = name;
		button.getChildByName("Description").getComponent(cc.Label).string = desc;
		button.getChildByName("Value").getComponent(cc.Label).string = 0;
		button.getChildByName("Price").getComponent(cc.Label).string = "5000XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[4];

		//add click event

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = callback;
		button.getComponent(cc.Button).clickEvents.push(eventHandler);
	},

	checkSpecialButton: function(req, upgrade, me){
		if (req > 49 && !(upgrade) && me) {
			// show trap finder upgrade
			me.active = true;
		} else if (me) {
			me.active = false;
		}
	},

	upgradeSpecial: function(event, upgrade){
		let button = event.target;

		if (window.gameSession.xp >= 5000) {
			window.analytics.Design_event("upgrade:special:"+upgrade);
			// take xp
			window.gameSession.xp -= 5000;
			window.gameSession.stats.xp += 5000;
			if (window.gameSession.stats.xp % 100000 == 0) this.showFeedback("Achievement: High Level", new cc.Color(0,255,0), this.dungeonAchievement, true);
			this.dungeonXP.string = window.gameSession.xp;

			// do upgrade
			window.gameSession[upgrade] = true;
			
			button.getChildByName("Value").getComponent(cc.Label).string = 1;
			
			// increase next xp cost
			button.getChildByName("Price").getComponent(cc.Label).string = "5000XP";

			this.saveGame();
		}
	},

	upgradeFireFinder(event){
		this.upgradeSpecial(event, "fireFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.fire, window.gameSession.fireFinder, this.fireFinder);
	},

	upgradeIceFinder(event){
		this.upgradeSpecial(event, "iceFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.ice, window.gameSession.iceFinder, this.iceFinder);
	},

	upgradeAcidFinder(event){
		this.upgradeSpecial(event, "acidFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.acid, window.gameSession.acidFinder, this.acidFinder);
	},

	upgradeElectricityFinder(event){
		this.upgradeSpecial(event, "electricityFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.electricity, window.gameSession.electricityFinder, this.electricityFinder);
	},

	upgradeSpikesFinder(event){
		this.upgradeSpecial(event, "spikesFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.spikes, window.gameSession.spikesFinder, this.spikesFinder);
	},

	upgradePoisonFinder(event){
		this.upgradeSpecial(event, "poisonFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.poison, window.gameSession.poisonFinder, this.poisonFinder);
	},

	upgradeTrapFinder(event){
		this.upgradeSpecial(event, "trapFinder");
		this.checkSpecialButton(window.gameSession.stats.traps.total, window.gameSession.trapFinder, this.trapFinder);
	},

	upgradeTreasureHunter(event){
		this.upgradeSpecial(event, "treasureHunter");
		this.checkSpecialButton(window.gameSession.stats.items.chests, window.gameSession.treasureHunter, this.treasureHunter);
	},

	upgradeTracker(event){
		this.upgradeSpecial(event, "tracker");
		this.checkSpecialButton(window.gameSession.stats.kills.total, window.gameSession.tracker ,this.tracker);
	},

	createSecretPassageButton(){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;
		this.secretPassage = button;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = "Secret Passage";
		button.getChildByName("Description").getComponent(cc.Label).string = "The floor you start back when you die.";
		button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.levelPassage;
		if (! window.gameSession.upgrades.levelPassage) window.gameSession.upgrades.levelPassage = 1000;
		button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades.levelPassage + "XP";
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

		if (window.gameSession.xp >= window.gameSession.upgrades.levelPassage) {
			// take xp
			window.gameSession.xp -= window.gameSession.upgrades.levelPassage;
			window.gameSession.stats.xp += window.gameSession.upgrades.levelPassage;
			if (window.gameSession.stats.xp % 100000 == 0) this.showFeedback("Achievement: High Level", new cc.Color(0,255,0), this.dungeonAchievement, true);
			this.dungeonXP.string = window.gameSession.xp;

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
			window.gameSession.upgrades.levelPassage += 1000;
			button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades.levelPassage + "XP";

			this.saveGame();
		}

		this.checkSecretPassage();
	},

	createButton(name, field, item, desc, id, mult, start){
		let button = cc.instantiate(this.button);
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
		price -= start;
		window.gameSession.upgrades[field] = price * 1000 * mult;
		button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades[field] + "XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[id];

		button.field = field;
		button.item = item;
		button.mult = mult;
		button.start = start;

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

		if (window.gameSession.xp >= window.gameSession.upgrades[field]) {
			// take xp
			window.gameSession.xp -= window.gameSession.upgrades[field];
			window.gameSession.stats.xp += window.gameSession.upgrades[field];
			if (window.gameSession.stats.xp % 100000 == 0) this.showFeedback("Achievement: High Level", new cc.Color(0,255,0), this.dungeonAchievement, true);
			this.dungeonXP.string = window.gameSession.xp;
			// do upgrade
			let price;
			if (window.gameSession.inventory[field] != null) {
				window.gameSession.inventory[field] += 1;
				window.analytics.Design_event("upgrade:common:inventory:"+field, window.gameSession.inventory[field]);
				price = window.gameSession.inventory[field] + 1;
				button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.inventory[field];
				if (button.item) this.giveItem(button.item);
			} else {
				window.gameSession[field] += 1;
				window.analytics.Design_event("upgrade:common:"+field, window.gameSession[field]);
				price = window.gameSession[field] + 1;
				button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession[field];
			}
			// increase next xp cost
			price -= button.start;
			window.gameSession.upgrades[field] = price * 1000 * button.mult;
			button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades[field] + "XP";

			this.saveGame();
		}
	},

	giveItem: function(item){
		if (window.gameSession.inventory[item] +1 <= window.gameSession.inventory[item+"Max"]){
			window.gameSession.inventory[item]++;
		}
	},

	saveGame(){
		cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
	},

	showFeedback: function(text, color, parent, stay){
		let duration = 2.0;

		let feedback = cc.instantiate(this.feedbackPrefab);
		feedback.parent = this.canvas;
		feedback.color = color;
		
		let position = parent.parent.convertToWorldSpaceAR(parent.position);
		position = this.canvas.convertToNodeSpaceAR(position);
		feedback.x = position.x;
		feedback.y = position.y;

		feedback.getComponent(cc.Label).string = text;

		// move up and change opacity
		let action;
		if (stay){
			action = cc.sequence(cc.moveBy(duration, cc.v2(0,100)), cc.fadeOut(duration), cc.callFunc(this.removeFeedback, this, feedback))
		} else {
			action = cc.sequence(cc.spawn(cc.moveBy(duration, cc.v2(0,100)), cc.fadeOut(duration)), cc.callFunc(this.removeFeedback, this, feedback))
		}
		
		feedback.runAction( action );

		//add to log
		let log = cc.instantiate(this.logPrefab);
		log.parent = this.feedbackLog;
		log.getComponent(cc.Label).string = text;
		log.color = color;
	},

	removeFeedback: function(feedback){
		feedback.destroy();
	},

	// update (dt) {},
});

module.exports = upgradeController;