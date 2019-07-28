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
		
	},

	checkSecretPassage: function(){
		if (window.gameSession.levelMin+5 < window.gameSession.levelMax && this.secretPassage) {
			// show secret passage upgrade
			this.secretPassage.active = true;
		} else if (this.secretPassage) {
			this.secretPassage.active = false;
		}
	},

	setButtons: function(){
		if (! window.gameSession) return;

		this.createButton("Fire Protection", "fireMin");
		this.createButton("Ice Protection", "iceMin");
		this.createButton("Acid Protection", "acidMin");
		this.createButton("Electricity Protection", "electricityMin");
		this.createButton("Spikes Protection", "spikesMin");
		this.createButton("Poison Protection", "poisonMin");

		this.createButton("Fire Pocket", "fireMax");
		this.createButton("Ice Pocket", "iceMax");
		this.createButton("Acid Pocket", "acidMax");
		this.createButton("Electricity Pocket", "electricityMax");
		this.createButton("Spikes Pocket", "spikesMax");
		this.createButton("Poison Pocket", "poisonMax");

		this.createButton("Starting Potion", "potionMin");
		this.createButton("Potion Pocket", "potionMax");

		this.createButton("Max HP", "hpMax");

		this.createSecretPassageButton();
		this.checkSecretPassage();
		
		//createButton("Information", "info");
	},

	createSecretPassageButton(){
		let button = cc.instantiate(this.button);
		button.parent = this.grid;
		this.secretPassage = button;
		cc.log(this.secretPassage);

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
	},

	createButton(name, field){
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

	saveGame(){
		cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
	},

	close: function(argument) {
		this.node.active = false;
	},

	// update (dt) {},
});
