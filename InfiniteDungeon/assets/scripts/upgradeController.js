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

		this.createButton("Fire Protection", "fireMin", "fire");
		this.createButton("Ice Protection", "iceMin", "ice");
		this.createButton("Acid Protection", "acidMin", "acid");
		this.createButton("Electricity Protection", "electricityMin", "electricity");
		this.createButton("Spikes Protection", "spikesMin", "spikes");
		this.createButton("Poison Protection", "poisonMin", "poison");

		this.createButton("Fire Pocket", "fireMax", null);
		this.createButton("Ice Pocket", "iceMax", null);
		this.createButton("Acid Pocket", "acidMax", null);
		this.createButton("Electricity Pocket", "electricityMax", null);
		this.createButton("Spikes Pocket", "spikesMax", null);
		this.createButton("Poison Pocket", "poisonMax", null);

		this.createButton("Starting Potion", "potionMin", "potion");
		this.createButton("Potion Pocket", "potionMax", null);

		this.createButton("Max HP", "hpMax", null);

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
		button.getChildByName("Value").getComponent(cc.Label).string = 0;
		button.getChildByName("Price").getComponent(cc.Label).string = 10000;

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
			button.getChildByName("Price").getComponent(cc.Label).string = 10000;

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
		button.getChildByName("Value").getComponent(cc.Label).string = 0;
		button.getChildByName("Price").getComponent(cc.Label).string = 10000;

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
			button.getChildByName("Price").getComponent(cc.Label).string = 10000;

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
		button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.levelMin;
		if (! window.gameSession.upgrades.levelMin) window.gameSession.upgrades.levelMin = 1000;
		button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades.levelMin;

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
			button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades.levelMin;

			this.saveGame();
		}

		this.checkSecretPassage();
	},

	createButton(name, field, item){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;

		// fill data
		button.getChildByName("Name").getComponent(cc.Label).string = name;
		if (window.gameSession.inventory[field] != null) {
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession.inventory[field];
		} else {
			button.getChildByName("Value").getComponent(cc.Label).string = window.gameSession[field];
		}
		button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades[field];

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
			button.getChildByName("Price").getComponent(cc.Label).string = window.gameSession.upgrades[field];

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
