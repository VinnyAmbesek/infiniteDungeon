// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var upgradeController = cc.Class({
	extends: cc.Component,

	properties: {
		grid: cc.Node,

		button: cc.Prefab,

		dungeonXP: cc.Label,

		inventoryFire: cc.Label,
		inventoryIce: cc.Label,
		inventoryAcid: cc.Label,
		inventoryElectricity: cc.Label,
		inventorySpikes: cc.Label,
		inventoryPoison: cc.Label,
		inventoryPotion: cc.Label,

		popups: [cc.Node],

		icons: [cc.SpriteFrame],
		// foo: {
		//	 // ATTRIBUTES:
		//	 default: null,		// The default value will be used only when the component attaching
		//						   // to a node for the first time
		//	 type: cc.SpriteFrame, // optional, default is typeof default
		//	 serializable: true,   // optional, default is true
		// },
		// bar: {
		//	 get () {
		//		 return this._bar;
		//	 },
		//	 set (value) {
		//		 this._bar = value;
		//	 }
		// },
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start () {
		this.setButtons();
	},

	onEnable (){
		this.checkSecretPassage();
		this.checkTrapFinder();
		this.checkTreasureHunter();
	},

	setButtons: function(){
		if (! window.gameSession) return;

		this.createButton("Fire Protection", "fireMin", "fire", "Starting amount of Fire Shields", 0);
		this.createButton("Ice Protection", "iceMin", "ice", "Starting amount of Ice Shields", 0);
		this.createButton("Acid Protection", "acidMin", "acid", "Starting amount of Acid Shields", 0);
		this.createButton("Electricity Protection", "electricityMin", "electricity", "Starting amount of Electricity Shields", 0);
		this.createButton("Spikes Protection", "spikesMin", "spikes", "Starting amount of Spikes Shields", 0);
		this.createButton("Poison Protection", "poisonMin", "poison", "Starting amount of Poison Shields", 0);

		this.createButton("Fire Pocket", "fireMax", null, "Maximum amount of Fire Shields", 1);
		this.createButton("Ice Pocket", "iceMax", null, "Maximum amount of Ice Shields", 1);
		this.createButton("Acid Pocket", "acidMax", null, "Maximum amount of Acid Shields", 1);
		this.createButton("Electricity Pocket", "electricityMax", null, "Maximum amount of Electricity Shields", 1);
		this.createButton("Spikes Pocket", "spikesMax", null, "Maximum amount of Spikes Shields", 1);
		this.createButton("Poison Pocket", "poisonMax", null, "Maximum amount of Poison Shields", 1);

		this.createButton("Starting Potion", "potionMin", "potion", "Starting amount of Potions", 3);
		this.createButton("Potion Pocket", "potionMax", null, "Maximum amount of Potions", 1);

		this.createButton("Health Points", "hpMax", null, "Increases maximum HP", 2);

		this.createButton("Sword Skill", "melee", null, "Increases skill with swords", 5);
		this.createButton("Bow Skill", "ranged", null, "Increases skill with bows", 6);
		this.createButton("Wand Skill", "magic", null, "Increases skill with wands", 7);

		this.createSecretPassageButton();
		this.checkSecretPassage();

		this.createTrapFinderButton();
		this.checkTrapFinder();

		this.createTreasureHunterButton();
		this.checkTreasureHunter();
		
	},

	createTreasureHunterButton(){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;
		this.treasureHunter = button;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = "Treasure Hunter";
		button.getChildByName("Description").getComponent(cc.Label).string = "Find how many chests exist in a floor.";
		button.getChildByName("Value").getComponent(cc.Label).string = 0;
		button.getChildByName("Price").getComponent(cc.Label).string = "10000XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[4];

		//add click event

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = "upgradeTreasureHunter";
		button.getComponent(cc.Button).clickEvents.push(eventHandler);
	},

	checkTreasureHunter: function(){
		if (window.gameSession.treasures > 99 && !(window.gameSession.treasureHunter) && this.treasureHunter) {
			// show trap finder upgrade
			this.treasureHunter.active = true;
		} else if (this.treasureHunter) {
			this.treasureHunter.active = false;
		}
	},

	upgradeTreasureHunter(event){
		let button = event.target;

		if (window.gameSession.xp >= 10000) {
			// take xp
			window.gameSession.xp -= 10000;
			this.dungeonXP.string = "XP: " + window.gameSession.xp;

			// do upgrade
			window.gameSession.treasureHunter = true;
			
			button.getChildByName("Value").getComponent(cc.Label).string = 1;
			
			// increase next xp cost
			button.getChildByName("Price").getComponent(cc.Label).string = "10000XP";

			this.saveGame();
		}

		this.checkTreasureHunter();
	},

	createTrapFinderButton(){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;
		this.trapFinder = button;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = "Trap Finder";
		button.getChildByName("Description").getComponent(cc.Label).string = "Find how many traps exist in a floor.";
		button.getChildByName("Value").getComponent(cc.Label).string = 0;
		button.getChildByName("Price").getComponent(cc.Label).string = "10000XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[4];

		//add click event

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = "upgradeTrapFinder";
		button.getComponent(cc.Button).clickEvents.push(eventHandler);
	},

	checkTrapFinder: function(){
		if (window.gameSession.traps > 99 && !(window.gameSession.trapFinder) && this.trapFinder) {
			// show trap finder upgrade
			this.trapFinder.active = true;
		} else if (this.trapFinder) {
			this.trapFinder.active = false;
		}
	},

	upgradeTrapFinder(event){
		let button = event.target;

		if (window.gameSession.xp >= 10000) {
			// take xp
			window.gameSession.xp -= 10000;
			this.dungeonXP.string = "XP: " + window.gameSession.xp;

			// do upgrade
			window.gameSession.trapFinder = true;
			
			button.getChildByName("Value").getComponent(cc.Label).string = 1;
			
			// increase next xp cost
			button.getChildByName("Price").getComponent(cc.Label).string = "10000XP";

			this.saveGame();
		}

		this.checkTrapFinder();
	},

	createSecretPassageButton(){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;
		this.secretPassage = button;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = "Secret Passage";
		button.getChildByName("Description").getComponent(cc.Label).string = "The floor you start back when you die.";
		button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.levelMin;
		if (! window.gameSession.upgrades.levelMin) window.gameSession.upgrades.levelMin = 1000;
		button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades.levelMin + "XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[4];
		//add click event

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "upgradeController";
        eventHandler.handler = "upgradeSecretPassage";
		button.getComponent(cc.Button).clickEvents.push(eventHandler);
	},

	checkSecretPassage: function(){
		if (window.gameSession.levelMin+5 < window.gameSession.levelMax && this.secretPassage) {
			// show secret passage upgrade
			this.secretPassage.active = true;
		} else if (this.secretPassage) {
			this.secretPassage.active = false;
		}
	},

	upgradeSecretPassage(event){
		let button = event.target;

		if (window.gameSession.xp >= window.gameSession.upgrades.levelMin) {
			// take xp
			window.gameSession.xp -= window.gameSession.upgrades.levelMin;
			this.dungeonXP.string = "XP: " + window.gameSession.xp;

			// do upgrade
			if (window.gameSession.levelMin == 1){
				window.gameSession.levelMin = 5;
			} else {
				window.gameSession.levelMin += 5;
			}
			
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.levelMin;
			
			// increase next xp cost
			window.gameSession.upgrades.levelMin += 1000;
			button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades.levelMin + "XP";

			this.saveGame();
		}

		this.checkSecretPassage();
	},

	createButton(name, field, item, desc, id){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = name;
		button.getChildByName("Description").getComponent(cc.Label).string = desc;
		if (window.gameSession.inventory[field] != null) {
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.inventory[field];
		} else {
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession[field];
		}
		button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades[field] + "XP";
		button.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.icons[id];

		button.field = field;
		button.item = item;

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
			this.dungeonXP.string = "XP: " + window.gameSession.xp;
			// do upgrade
			if (window.gameSession.inventory[field] != null) {
				window.gameSession.inventory[field] += 1;
				button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.inventory[field];
				if (button.item) this.giveItem(button.item);
			} else {
				window.gameSession[field] += 1;
				button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession[field];
			}
			// increase next xp cost
			window.gameSession.upgrades[field] += 1000;
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
