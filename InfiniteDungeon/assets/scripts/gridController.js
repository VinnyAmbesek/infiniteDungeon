const PopupController = require("popupController");
const InventoryController = require("inventoryController");
const HudController = require("hudController");
const FeedbackController = require("feedbackController");
const DeathController = require("deathController");

var gridController = cc.Class({
	extends: cc.Component,

	properties: {
		popupController: PopupController,
		inventoryController: InventoryController,
        hudController: HudController,
        feedbackController: FeedbackController,
        deathController: DeathController,

		tilePrefab: cc.Prefab,

		gridNode: cc.Node,
		nextButton: cc.Node,
		loadingAnimation: cc.Node,

		door_corner: cc.SpriteFrame,
		door_side: cc.SpriteFrame,
		deadend: cc.SpriteFrame,
		line: cc.SpriteFrame,
		curve: cc.SpriteFrame,
		threeway: cc.SpriteFrame,
		fourway: cc.SpriteFrame,
		unknown: cc.SpriteFrame,
		open: cc.SpriteFrame,

		danger: [cc.SpriteFrame],
		monster: [cc.SpriteFrame],
		chest: cc.SpriteFrame,
		stair_down: cc.SpriteFrame,
		stair_up: cc.SpriteFrame,
		lever: cc.SpriteFrame,
		stone: cc.SpriteFrame,
	},

	// onLoad () {},
	start () {
		if (this.deathController.isDead()) {
			this.popupController.openPermanentPopup("death");
		}
		window.analytics.Level_Start("Floor " + window.gameSession.level, "Dungeon Scene");

		this.enumSides = {undefined: 0, block: 1, wall: 2, open: 3};
		this.enumTile = {undefined: 0, entrance: 1, exit: 2, deadend: 3,corridor: 4};
		this.enumStatus = {hidden: 0, flashing: 1, visible: 2};
		this.enumContent = {empty: 0, treasure: 1, danger: 2, darkness: 3, monster: 4, lever: 5};
		this.enumSprite = {entrance: 0, exit: 1, deadend: 2, curve: 3, line: 4, threeway: 5, fourway: 6};
		this.enumClass = {undefined: 0, rogue: 1, fighter: 2, wizard: 3};

		this.hudController.updateAllLabels();
		if (window.gameSession.job < 1) {
			this.showJobSelection();
		}
		this.showUpgrades();
		this.checkTime();
		
		this.saveGame();

		// init variables
		this.clicks = 0;
		this.dangers = 0;
		this.dangersType = [0,0,0,0,0,0];
		this.treasures = 0;
		this.monsters = 0;
		this.clickable = 0;
		this.dungeonMoves = 0;
		this.running = false;
		this.hitTrap = false;
		this.timeToRun = 0.5;
		let tileQTD = Math.min(Math.floor(window.gameSession.level/10), 10);
		this.size = 10 + tileQTD;
		
		let tileWidth = [75, 68, 62.1, 57.2, 53, 49.3, 46.1, 43.2, 40.7, 38.5, 36.5];
		let subtileWidth = [54, 48.9, 44.7, 41.2, 38.1, 35.5, 33.2, 31.1, 29.3, 27.7, 26.2];

		this.tileWidth = tileWidth[tileQTD];
		this.subtileWidth = subtileWidth[tileQTD];

		this.gridSize = this.size * this.size - 1;

		this.initGrid(this.size);

		this.closed = window.gameSession.level % 5 == 0;

		// define entrance and exit
		this.setDoorDirection(this.size);
		if (this.closed) this.setLever(this.size);

		// make maze
		this.buildStack = new Array();
		this.buildMaze(this.entrance.x, this.entrance.y);

		// put tiles on grid
		this.fillGrid(this.size);

		this.showClickZones(this.entrance.x, this.entrance.y);
		this.revealSubSprite(this.entrance.x, this.entrance.y);

		// show upgrades
		if(window.gameSession.treasureHunter) this.hudController.activateLabel("chests");
		if(window.gameSession.trapFinder) this.hudController.activateLabel("traps");
		if(window.gameSession.fireFinder) this.hudController.activateTrapLabel("fire");
		if(window.gameSession.iceFinder) this.hudController.activateTrapLabel("ice");
		if(window.gameSession.acidFinder) this.hudController.activateTrapLabel("acid");
		if(window.gameSession.electricityFinder) this.hudController.activateTrapLabel("electricity");
		if(window.gameSession.spikesFinder) this.hudController.activateTrapLabel("spikes");
		if(window.gameSession.poisonFinder) this.hudController.activateTrapLabel("poison");
		if(window.gameSession.tracker) this.hudController.activateLabel("enemies");
	},

	checkTime(){
		let d = new Date(); 
		let date = {d: d.getDate(), m: d.getMonth(), y: d.getFullYear()};
		let lastPrize = window.gameSession.date;

		let newDay = this.isNewDay(date, lastPrize);
		if (newDay){
			this.wbPrize();
			this.popupController.openPermanentPopup("dailyReward");
			window.gameSession.date = date;
			this.saveGame();
		}
	},

	isNewDay(today, lastDay){
		if(!lastDay) {
			window.gameSession.date = today;
			return false;
		}

		if (lastDay.y < today.y) return true;
		// went back in time?
		if (lastDay.y > today.y) return false;

		if (lastDay.m < today.m) return true;
		// went back in time?
		if (lastDay.m > today.m) return false;

		if (lastDay.d < today.d) return true;
		// went back in time?
		if (lastDay.d > today.d) return false;

		return false;
	},

	wbPrize(){
		let minXP = Math.min(window.gameSession.upgrades.fireMin, window.gameSession.upgrades.fireMax, window.gameSession.upgrades.iceMin,
		window.gameSession.upgrades.iceMax, window.gameSession.upgrades.acidMin, window.gameSession.upgrades.acidMax, window.gameSession.upgrades.electricityMin,
		window.gameSession.upgrades.electricityMax, window.gameSession.upgrades.spikesMin, window.gameSession.upgrades.spikesMax, window.gameSession.upgrades.poisonMin,
		window.gameSession.upgrades.poisonMax, window.gameSession.upgrades.potionMin, window.gameSession.upgrades.potionMax, window.gameSession.upgrades.hpMax);

		window.gameSession.xp += minXP;
		window.gameGlobals.xpReward = minXP;
		this.hudController.updateLabel("xp", ""+window.gameSession.xp);
		this.feedbackController.showFeedback("+" + minXP + "XP", new cc.Color(0,255,0), "xp", false);
		window.analytics.Design_event("event:dailyXP", minXP);

		window.gameSession.currency+=10;
		this.hudController.updateLabel("soul", ""+window.gameSession.currency);
	},

	saveGame(){
		cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
	},

	showUpgrades: function(){
		let minXP = Math.min(window.gameSession.upgrades.fireMin, window.gameSession.upgrades.fireMax, window.gameSession.upgrades.iceMin,
		window.gameSession.upgrades.iceMax, window.gameSession.upgrades.acidMin, window.gameSession.upgrades.acidMax, window.gameSession.upgrades.electricityMin,
		window.gameSession.upgrades.electricityMax, window.gameSession.upgrades.spikesMin, window.gameSession.upgrades.spikesMax, window.gameSession.upgrades.poisonMin,
		window.gameSession.upgrades.poisonMax, window.gameSession.upgrades.potionMin, window.gameSession.upgrades.potionMax, window.gameSession.upgrades.hpMax);

		if (window.gameSession.xp > minXP) this.popupController.openPopup("upgrade");
	},

	showJobSelection: function(){
		this.popupController.openPermanentPopup("job");
	},

	cleanGrid: function (size){
		this.nextButton.active = false;

		this.clicks = 0;
		this.dangers = 0;
		this.dangersType = [0,0,0,0,0,0];
		this.treasures = 0;
		this.monsters = 0;

		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){
				this.gridUI[i][j].destroy();
			}
		}
	},

	initGrid: function (size){
		this.grid = new Array(size);
		this.gridUI = new Array(size);
		for(var i = 0; i < size; i++){
			this.grid[i] = new Array(size);
			this.gridUI[i] = new Array(size);

			for(var j = 0; j < size; j++){
				this.grid[i][j] = {};
				// my position
				this.grid[i][j].x = i;
				this.grid[i][j].y = j;
				// sides
				this.grid[i][j].north = this.enumSides["undefined"];
				this.grid[i][j].south = this.enumSides["undefined"];
				this.grid[i][j].east = this.enumSides["undefined"];
				this.grid[i][j].west = this.enumSides["undefined"];
				// tile
				this.grid[i][j].tile = this.enumTile["undefined"];
				// status
				this.grid[i][j].status = this.enumStatus["hidden"];
				// content
				this.grid[i][j].content = this.enumContent["empty"];

				// mark grid borders
				if(i == 0) this.grid[i][j].north = this.enumSides["block"];
				if(i == size-1) this.grid[i][j].south = this.enumSides["block"];
				if(j == 0) this.grid[i][j].west = this.enumSides["block"];
				if(j == size-1) this.grid[i][j].east = this.enumSides["block"];
			}
		}
	},

	showClickZones: function(x, y){
		let tile = this.grid[x][y];
		let zones = 0;
		if (tile.north == this.enumSides["open"]) {
			if (this.addClickFunction(x-1,y)) zones++;
		}
		if (tile.south == this.enumSides["open"]) {
			if (this.addClickFunction(x+1,y)) zones++;
		}
		if (tile.east == this.enumSides["open"]) {
			if (this.addClickFunction(x,y+1)) zones++;
		}
		if (tile.west == this.enumSides["open"]) {
			if (this.addClickFunction(x,y-1)) zones++;
		}
		if (zones > 1) this.running = false;
	},

	addClickFunction: function(x,y){
		let tile = this.grid[x][y];
		if (tile.status == this.enumStatus["visible"]) return false;
		if (tile.status == this.enumStatus["flashing"]) {
			this.lastClickZone = this.gridUI[x][y];
			return true;
		}
		tile.status = this.enumStatus["flashing"];
		this.clickable++;
		let cell = this.gridUI[x][y];
		let sprite = cell.getComponent(cc.Sprite);
		sprite.spriteFrame = this.open;

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "gridController";
        eventHandler.handler = "gridClick";
        cell.tile = tile;
		cell.getComponent(cc.Button).clickEvents.push(eventHandler);
		this.lastClickZone = cell;
		return true;
	},

	startRunning: function(){
		this.running = true;
		this.timeToRun = 0.5;
	},

	run: function(size){
		let node = {};

		if (this.lastClickZone){
			node.target = this.lastClickZone;
			this.lastClickZone = null;
		} else {
			this.running = false;
			return;
		}

		if (node.target != null) this.gridClick(node);
	},

	gridClick: function(event){
		//if dead ignore click
		if (this.deathController.isDead()){
			this.popupController.openPermanentPopup("death");
			return;
		}
		//if popup open ignore click
		if (this.popupController.isAnyOpen()) return;

		// click on exit tile a second time to go to next floor
		if (event.target.tile.tile == this.enumTile["exit"] && event.target.used && !this.closed){
			this.nextLevel();
			return;
		} else if (event.target.used) { // ignore clicks in open tiles
			return;
		}

		// mark tiles walked to avoid tile replay
		event.target.used = true;
		this.clickable--;
		window.gameSession.stats.tiles++;
		if (window.gameSession.stats.tiles % 1000 == 0) this.feedbackController.showFeedback("Achievement: Runner", new cc.Color(0,255,0), "achievement", true, 5.0);

		if(window.gameSession.treasureHunter) this.hudController.activateLabel("chests");
		if(window.gameSession.trapFinder) this.hudController.activateLabel("traps");
		if(window.gameSession.fireFinder) this.hudController.activateTrapLabel("fire");
		if(window.gameSession.iceFinder) this.hudController.activateTrapLabel("ice");
		if(window.gameSession.acidFinder) this.hudController.activateTrapLabel("acid");
		if(window.gameSession.electricityFinder) this.hudController.activateTrapLabel("electricity");
		if(window.gameSession.spikesFinder) this.hudController.activateTrapLabel("spikes");
		if(window.gameSession.poisonFinder) this.hudController.activateTrapLabel("poison");
		if(window.gameSession.tracker) this.hudController.activateLabel("enemies");

		this.startRunning();

		// show tile
		let tile = event.target.tile;
		tile.status = this.enumStatus["visible"];
		let sprite = event.target.getComponent(cc.Sprite);
		sprite.spriteFrame = tile.sprite;

		// open new clickzones
		this.showClickZones(tile.x, tile.y);

		// use a potion
		if (this.deathController.hasDamage() && window.gameSession.inventory.potion > 0) {
			this.inventoryController.useItem("potion", 1, event.target);
			if (window.gameSession.stats.items.potion % 100 == 0) this.feedbackController.showFeedback("Achievement: Not addicted", new cc.Color(0,255,0), "achievement", true, 5.0);
			if (window.gameSession.stats.items.total % 100 == 0) this.feedbackController.showFeedback("Achievement: Spender", new cc.Color(0,255,0), "achievement", true, 5.0);

			if (window.gameSession.job == this.enumClass["wizard"]) {
				this.deathController.heal(2);
			} else {
				this.deathController.heal(1);
			}
		}
		
		let xp = 0;
		// extra xp for clean map
		this.clicks++;
		if (this.clicks == this.gridSize) {
			window.analytics.Design_event("event:cleanFloor", window.gameSession.level);
			xp += window.gameSession.level*(this.gridSize+1);
			if (window.gameSession.job == this.enumClass["wizard"]) xp += window.gameSession.level*this.gridSize;
		}

		// gain exploration xp
		xp += window.gameSession.level;
		if (window.gameSession.job == this.enumClass["wizard"]) xp += window.gameSession.level;

		// verify room content
		if(tile.content == this.enumContent["treasure"]) {
			this.running = false;
			this.giveTreasure(Math.floor((Math.random() * 100) + 1), event.target);
		}
		if(tile.content == this.enumContent["danger"]) {
			this.running = false;
			this.fightDanger(tile.contentType, event.target);
			this.findSubSprite(tile, tile.contentType);
			// victory xp
			if (! this.deathController.isDead()) {
				xp += window.gameSession.level*25;
				if (window.gameSession.job == this.enumClass["rogue"]) xp += window.gameSession.level*25;
				window.gameSession.stats.traps.total++;
				if (window.gameSession.stats.traps.total % 100 == 0) this.feedbackController.showFeedback("Achievement: Trap Finder", new cc.Color(0,255,0), "achievement", true, 5.0);
			} else {
				this.popupController.openPermanentPopup("death");
				this.deathController.setMessage("You were " + this.lastDanger + "!");
			}
		}
		if(tile.content == this.enumContent["darkness"]){
			this.feedbackController.showFeedback("Dungeon Moves!", new cc.Color(255,0,0), "floor", true);
			this.dungeonMoves++;
			window.analytics.Design_event("event:darkness", this.dungeonMoves);
			if (this.dungeonMoves> 1) {
				window.gameSession.stats.unique.darkness = true
				if (! window.gameSession.achievements.unique.darkness) this.feedbackController.showFeedback("Achievement: Stop Moving!", new cc.Color(0,255,0), "achievement", true, 5.0);
			}
			this.running = false;
			let x = event.target.tile.x;
			let y = event.target.tile.y;

			this.cleanGrid(this.size);

			this.initGrid(this.size);

			// define entrance and exit
			this.closed = window.gameSession.level % 25 == 0;
			this.setDoorDirection(this.size);
			if (this.closed) this.setLever(this.size);

			// make maze
			this.buildStack = new Array();
			this.buildMaze(this.entrance.x, this.entrance.y);

			let entrance = this.grid[this.entrance.x][this.entrance.y];
			entrance.status = this.enumStatus["hidden"];

			let tile = this.grid[x][y];
			tile.status = this.enumStatus["visible"];
		
			// put tiles on grid
			this.fillGrid(this.size);

			this.showClickZones(x, y);
		}
		if(tile.content == this.enumContent["monster"]) {
			this.running = false;
			let index = Math.floor((Math.random() * 3) + 1);
			this.fightMonster(index, event.target, 0);
			this.findSubSprite(tile, index)
			// victory xp
			if (! this.deathController.isDead()) {
				xp += window.gameSession.level*25;
				if (window.gameSession.job == this.enumClass["fighter"]) xp += window.gameSession.level*50;
			} else {
				this.popupController.openPermanentPopup("death");
				this.deathController.setMessage("You were " + this.lastDanger + "!");
			}
		}
		if(tile.content == this.enumContent["lever"]){
			window.analytics.Design_event("event:lever", window.gameSession.level);
			this.feedbackController.showFeedback("Stairs Unlocked", new cc.Color(0,255,0), "floor", true);
			this.closed = false;
			let exitTile = this.grid[this.exit.x][this.exit.y];
			this.findSubSprite(exitTile, -1);
			// if found lever after exit
			if (exitTile.status == this.enumStatus["visible"]) {
				this.revealSubSprite(this.exit.x,this.exit.y);
				this.nextButton.active = true;
			}
		}

		this.revealSubSprite(tile.x,tile.y);

		if (tile.tile == this.enumTile["exit"]){
			// found exit
			// show next level button
			this.running = false;
			if (this.closed) {
				this.feedbackController.showFeedback("Stairs Locked", new cc.Color(255,0,0), "floor", true);
				window.analytics.Design_event("event:stairsLocked", window.gameSession.level);
			}else {
				this.nextButton.active = true;
			}

			let boss = 0;
			if (window.gameSession.level%10 == 0) {
				boss = 2;
			} else if (window.gameSession.level%5 == 0) {
				boss = 1;
			}

			if (boss > 0){
				this.monsters++;
				let index = Math.floor((Math.random() * 3) + 1);
				this.fightMonster(index, event.target, boss);
				this.findSubSprite(tile, index);
				// victory xp
				if (! this.deathController.isDead()) {
					xp += window.gameSession.level*25;
					if (window.gameSession.job == this.enumClass["fighter"]) xp += window.gameSession.level*50;
				} else {
					this.popupController.openPermanentPopup("death");
					this.deathController.setMessage("You were " + this.lastDanger + "!");
				}
			}
		}

		// show xp gain
		window.gameSession.xp += xp;
		this.hudController.updateLabel("xp", ""+window.gameSession.xp);
		this.feedbackController.showFeedback("+" + xp + "XP", new cc.Color(0,255,0), "xp", false);
	},

	revealSubSprite: function(x,y){
		let tile = this.grid[x][y];
		let cell = this.gridUI[x][y];
		let content = cell.getChildByName("content");
		content.angle = (360-cell.angle);
		if (tile.subsprite) content.getComponent(cc.Sprite).spriteFrame = tile.subsprite;
	},

	fightMonster: function(monster, node, boss){
		this.monsters--;
		this.hudController.updateLabel("enemies", ""+this.monsters);
		let strength = Math.floor(window.gameSession.level/5) + 1 + boss * Math.floor((Math.random() * Math.floor(window.gameSession.level/10)) + 1);
		if (window.gameSession.job == this.enumClass["fighter"]) strength--;
		let feedback;
		let effect;
		let field;
		let achivDamage;
		let achivKills;
		let achivDeath;
		switch(monster) {
			case 1:
				// code block
				feedback = "Fought Orc";
				effect = "murdered";
				field = "melee";
				achivDamage = "I need a shield";
				achivKills = "Warrior";
				achivDeath = "Shaky Hand";
				break;
			case 2:
				// code block
				feedback = "Fought Cockatrice";
				effect = "petrified";
				field = "ranged";
				achivDamage = "This bow is bad";
				achivKills = "Archer";
				achivDeath = "Bad Sight";
				break;
			case 3:
				// code block
				feedback = "Fought Ghost";
				effect = "drained of life";
				field = "magic";
				achivDamage = "I need a staff";
				achivKills = "Archmage";
				achivDeath = "Curled Tongue";
				break;
			default:
				// code block
		}
		if (boss > 1) {
			feedback = feedback + " Boss";
		} else if (boss > 0) {
			feedback = feedback + " Sub-boss";
		}

		this.feedbackController.showFeedbackAtNode(feedback, new cc.Color(255,0,0), node, true, 3.0, 75);
		this.lastDanger = effect;

		if ((strength - window.gameSession.inventory[field]) < -9) {
			if (!window.gameSession.achievements.unique.overkill) this.feedbackController.showFeedback("Achievement: Overkill", new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.unique.overkill = true;
		}
		window.analytics.Design_event("Fight:" + field + ":" + strength, window.gameSession.inventory[field]);
		strength -= Math.min(strength, window.gameSession.inventory[field]);
		// receives strength in damage
		if (strength>0) {
			this.deathController.hurt(strength);
			window.gameSession.stats.damage[field] += strength;
			if (window.gameSession.stats.damage[field] % 100 == 0) this.feedbackController.showFeedback("Achievement: " + achivDamage, new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.damage.total += strength;
			if (window.gameSession.stats.damage.total % 100 == 0) this.feedbackController.showFeedback("Achievement: It hurts everywhere", new cc.Color(0,255,0), "achievement", true, 5.0);
		}

		if (! this.deathController.isDead()) {
			window.gameSession.stats.kills[field]++;
			if (window.gameSession.stats.kills[field] % 100 == 0) this.feedbackController.showFeedback("Achievement: " + achivKills, new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.kills.total++;
			if (window.gameSession.stats.kills.total % 100 == 0) this.feedbackController.showFeedback("Achievement: God of War", new cc.Color(0,255,0), "achievement", true, 5.0);

			//LOOT
			this.giveTreasure(Math.floor((Math.random() * 100) + 1), node, true);
		} else {
			if (this.deathController.isTrulyDead()) {
				if (!window.gameSession.achievements.unique.truedeath) this.feedbackController.showFeedback("Achievement: True Death", new cc.Color(0,255,0), "achievement", true, 5.0);
				window.gameSession.stats.unique.truedeath = true;
			}
			if (boss == 1) {
				if (!window.gameSession.achievements.unique.subboss) this.feedbackController.showFeedback("Achievement: Did not expected that", new cc.Color(0,255,0), "achievement", true, 5.0);
				window.gameSession.stats.unique.subboss = true;
			}
			if (boss == 2) {
				if (!window.gameSession.achievements.unique.boss) this.feedbackController.showFeedback("Achievement: Expected that", new cc.Color(0,255,0), "achievement", true, 5.0);
				window.gameSession.stats.unique.boss = true;
			}
			if (window.gameSession.death) {
				if (!window.gameSession.achievements.unique.already) this.feedbackController.showFeedback("Achievement: Already Back?", new cc.Color(0,255,0), "achievement", true, 5.0);
				window.gameSession.stats.unique.already = true;
			}
			window.gameSession.stats.death[field]++;
			if (window.gameSession.stats.death[field] % 100 == 0) this.feedbackController.showFeedback("Achievement: " + achivDeath, new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.death.total++;
			if (window.gameSession.stats.death.total % 100 == 0) this.feedbackController.showFeedback("Achievement: Kenny", new cc.Color(0,255,0), "achievement", true, 5.0);
		}
	},

	fightDanger: function(danger, node){
		this.dangers--;
		this.hitTrap = true;
		this.hudController.updateLabel("traps", ""+this.dangers);
		let strength = Math.floor(window.gameSession.level/10 + 1);
		if (window.gameSession.job == this.enumClass["rogue"]) strength--;
		let feedback;
		let effect;
		let field;
		let item;
		let achivTrap;
		let achivItem;
		let achivDeath;

		if (this.deathController.isAlmostDead() && ! this.inventoryController.hasDefenses()){
			if (!window.gameSession.achievements.unique.daredevil) this.feedbackController.showFeedback("Achievement: Daredevil", new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.unique.daredevil = true;
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

		this.dangersType[danger-1]--;
		this.hudController.updateTraps(field, this.dangersType[danger-1]);

		window.analytics.Design_event("Trap:" + field + ":" + strength, window.gameSession.inventory[field]);
		strength -= window.gameSession.skills[field + "Shield"];

		this.feedbackController.showFeedbackAtNode(feedback, new cc.Color(255,0,0), node, true, 3.0, 75);
		this.lastDanger = effect;
		window.gameSession.stats.traps[field]++;
		if (window.gameSession.stats.traps[field] % 100 == 0) this.feedbackController.showFeedback("Achievement: " + achivTrap, new cc.Color(0,255,0), "achievement", true, 5.0);
		
		if (window.gameSession.inventory[field] > 0){
			let shield = window.gameSession.inventory[field];
			let protection = Math.min(strength, shield);

			// use shields up to strength of danger
			this.inventoryController.useItem(field, protection, node);
			if (window.gameSession.stats.items[field] % 100 == 0) this.feedbackController.showFeedback("Achievement: " + achivItem, new cc.Color(0,255,0), "achievement", true, 5.0);
			if (window.gameSession.stats.items.total % 100 == 0) this.feedbackController.showFeedback("Achievement: Spender", new cc.Color(0,255,0), "achievement", true, 5.0);

			// danger strength is reduced by spent shields
			strength -= protection;
		}

		// receives strength in damage
		if (strength>0) {
			this.deathController.hurt(strength);
			window.gameSession.stats.damage[field] += strength;
			if (window.gameSession.stats.items[field] % 100 == 0) this.feedbackController.showFeedback("Achievement: " + achivItem, new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.damage.total += strength;
			if (window.gameSession.stats.damage.total % 100 == 0) this.feedbackController.showFeedback("Achievement: It hurts everywhere", new cc.Color(0,255,0), "achievement", true, 5.0);
		}
		if (this.deathController.isDead()) {
			if (this.deathController.isTrulyDead()) {
				if (!window.gameSession.achievements.unique.truedeath) this.feedbackController.showFeedback("Achievement: True Death", new cc.Color(0,255,0), "achievement", true, 5.0);
				window.gameSession.stats.unique.truedeath = true;
			}
			if (window.gameSession.death) {
				if (!window.gameSession.achievements.unique.already) this.feedbackController.showFeedback("Achievement: Already Back?", new cc.Color(0,255,0), "achievement", true, 5.0);
				window.gameSession.stats.unique.already = true;
			}
			window.gameSession.stats.death[field]++;
			if (window.gameSession.stats.death[field] % 100 == 0) this.feedbackController.showFeedback("Achievement: " + achivDeath, new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.death.total++;
			if (window.gameSession.stats.death.total % 100 == 0) this.feedbackController.showFeedback("Achievement: Kenny", new cc.Color(0,255,0), "achievement", true, 5.0);
		}
	},

	giveTreasure: function(prize, node, loot=false){
		if (!loot){
			this.treasures--;
			this.hudController.updateLabel("chests", ""+this.treasures);
		}
		let reward = 1 + window.gameSession.skills.totalShield;
		window.gameSession.stats.items.chests += reward;
		if (window.gameSession.stats.items.chests % 100 == 0) this.feedbackController.showFeedback("Achievement: Treasure Hunter", new cc.Color(0,255,0), "achievement", true, 5.0);
		if (prize <= 10) {
			this.inventoryController.giveItem("potion", reward, node, "Potion");
		} else if (prize <= 25 ) {
			this.inventoryController.giveItem("fire", reward, node, "Fire Shield");
		} else if (prize <= 40 ) {
			this.inventoryController.giveItem("ice", reward, node, "Ice Shield");
		} else if (prize <= 55 ) {
			this.inventoryController.giveItem("acid", reward, node, "Acid Shield");
		} else if (prize <= 70 ) {
			this.inventoryController.giveItem("electricity", reward, node, "Electricity Shield");
		} else if (prize <= 85 ) {
			this.inventoryController.giveItem("spikes", reward, node, "Spikes Shield");
		} else if (prize <= 100 ) {
			this.inventoryController.giveItem("poison", reward, node, "Poison Shield");
		}
	},

	nextLevel: function(){
		if (this.deathController.isDead()) {
			this.popupController.openPermanentPopup("death");
			return; 
		}
		this.loadingAnimation.active = true;
		window.gameSession.death = false;
		if (!this.hitTrap) {
			if (!window.gameSession.achievements.unique.lucky) this.feedbackController.showFeedback("Achievement: Lucky", new cc.Color(0,255,0), "achievement", true, 5.0);
			window.gameSession.stats.unique.lucky = true;
		}
		window.gameSession.currency++;
		window.gameSession.stats.row++;

		window.analytics.Level_Complete("Floor " + window.gameSession.level, "Dungeon Scene");
		window.gameSession.level++;
		if (window.gameSession.level > window.gameSession.stats.levelMax) window.gameSession.stats.levelMax = window.gameSession.level;
		if (window.gameSession.stats.levelMax % 100 == 0) this.feedbackController.showFeedback("Achievement: Explorer", new cc.Color(0,255,0), "achievement", true, 5.0);
		cc.director.loadScene("gameScene");
	},

	fillGrid: function(size){
		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){
				let tile = this.grid[i][j];
				this.makeWall(tile);
				this.findSprite(tile);
				this.findSubSprite(tile, -1);

				let cell = cc.instantiate(this.tilePrefab);
				this.gridUI[i][j] = cell;

				cell.width = this.tileWidth;
				cell.height = this.tileWidth;
				let child = cell.getChildByName("content");
				child.width = this.subtileWidth;
				child.height = this.subtileWidth;

				cell.parent = this.gridNode;
				cell.angle = tile.angle;
				let sprite = cell.getComponent(cc.Sprite);
				if (tile.status == this.enumStatus["visible"]) {
					sprite.spriteFrame = tile.sprite;	
				} else if (tile.status == this.enumStatus["hidden"]) {
					sprite.spriteFrame = this.unknown;
				}
			}
		}
	},

	findSubSprite: function(tile, index){
		if (tile.tile == this.enumTile["entrance"]) {
			tile.subsprite = this.stair_up;
		} else if (tile.tile == this.enumTile["exit"] && this.closed) {
			tile.subsprite = this.stone;
		} else if (tile.tile == this.enumTile["exit"]) {
			tile.subsprite = this.stair_down;
		} else if (tile.content == this.enumContent["treasure"]) {
			tile.subsprite = this.chest;
		} else if (tile.content == this.enumContent["danger"] && index > -1) {
			tile.subsprite = this.danger[index-1];
		} else if (tile.content == this.enumContent["monster"] && index > -1) {
			tile.subsprite = this.monster[index-1];
		} else if (tile.content == this.enumContent["lever"]) {
			tile.subsprite = this.lever;
		}
	},

	findSprite: function(tile){
		if (tile.tile == this.enumTile["deadend"]){
			this.showDeadend(tile);
		} else {
			let paths = 0;
			if (tile.north == this.enumSides["open"]) paths++;
			if (tile.south == this.enumSides["open"]) paths++;
			if (tile.east == this.enumSides["open"]) paths++;
			if (tile.west == this.enumSides["open"]) paths++;
			
			if (paths == 1){
				this.showDeadend(tile);
			} else if (paths == 2 && ( (tile.north == this.enumSides["open"] && tile.south == this.enumSides["open"]) || (tile.east == this.enumSides["open"] && tile.west == this.enumSides["open"]))){
				this.showLine(tile);
			} else if (paths == 2) {
				this.showCurve(tile);
			} else if (paths == 3){
				this.showThreeWay(tile);
			} else if (paths == 4){
				this.showFourWay(tile);
			} else {
				console.error("ERROR: no sprite", tile);
			}
		}
	},

	showDoor: function(tile){
		// 2 sprites, 4 directions each
		let blocks = 0;
		if (tile.north == this.enumSides["block"]) blocks++;
		if (tile.south == this.enumSides["block"]) blocks++;
		if (tile.east == this.enumSides["block"]) blocks++;
		if (tile.west == this.enumSides["block"]) blocks++;
		
		if (blocks == 2) {
			// corner door
			tile.sprite = this.door_corner;
			// find rotation
			if (tile.north == 1){
				if (tile.west == 1) {
					tile.angle = -0;
				} else if (tile.east == 1) {
					tile.angle = -90;
				}  
			} else if (tile.south == 1){
				if (tile.west == 1) {
					tile.angle = -270;
				} else if (tile.east == 1) {
					tile.angle = -180;
				}
			}
		} else if (blocks == 1) {
			// side door
			tile.sprite = this.door_side;
			// find rotation
			if (tile.north == 1){
				tile.angle = -0;
			} else if (tile.east == 1) {
				tile.angle = -90;
			} else if (tile.south == 1){
				tile.angle = -180;
			} else if (tile.west == 1) {
				tile.angle = -270;
			}
		} else {
			console.error("ERROR: should not have that amount of blocks", tile, blocks);
		}
	},
	showDeadend: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.deadend;
		if (tile.north == this.enumSides["open"]){
			tile.angle = -270;
		} else if (tile.east == this.enumSides["open"]) {
			tile.angle = -0;
		} else if (tile.south == this.enumSides["open"]){
			tile.angle = -90;
		} else if (tile.west == this.enumSides["open"]) {
			tile.angle = -180;
		}

		// mark if has treasure or danger
		let chance = Math.floor((Math.random() * 100) + 1);
		let level = Math.min(35, window.gameSession.level);
		if (chance <= 25+level && tile.content == this.enumContent["empty"] && tile.tile != this.enumTile["entrance"] && tile.tile != this.enumTile["exit"]) {
			// 25% de chance de perigo +1% por level, max 50%
			tile.content = this.enumContent["danger"];
			tile.contentType = Math.floor((Math.random() * 6) + 1);
			this.dangersType[tile.contentType-1]++;
			this.hudController.updateTrapsByNumber(tile.contentType-1, this.dangersType[tile.contentType-1]);
			this.dangers++;
			this.hudController.updateLabel("traps", ""+this.dangers);
		} else if (tile.content == this.enumContent["empty"] && tile.tile != this.enumTile["entrance"] && tile.tile != this.enumTile["exit"]) {
			tile.content = this.enumContent["treasure"];
			this.treasures++;
			this.hudController.updateLabel("chests", ""+this.treasures);
		}	
	},
	showLine: function(tile){
		// 1 sprite, 2 directions
		tile.sprite = this.line;
		if (tile.north == this.enumSides["open"]){
			tile.angle = -0;
		} else if (tile.east == this.enumSides["open"]) {
			tile.angle = -90;
		}
	},
	showCurve: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.curve;
		if (tile.north == this.enumSides["open"]){
			if (tile.west == this.enumSides["open"]) {
				tile.angle = -180;
			} else if (tile.east == this.enumSides["open"]) {
				tile.angle = -270;
			}  
		} else if (tile.south == this.enumSides["open"]){
			if (tile.west == this.enumSides["open"]) {
				tile.angle = -90;
			} else if (tile.east == this.enumSides["open"]) {
				tile.angle = -0;
			}
		}
	},
	showThreeWay: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.threeway;
		if (tile.north == this.enumSides["wall"] || tile.north == this.enumSides["block"]){
			tile.angle = -0;
		} else if (tile.east == this.enumSides["wall"] || tile.east == this.enumSides["block"]) {
			tile.angle = -90;
		} else if (tile.south == this.enumSides["wall"] || tile.south == this.enumSides["block"]){
			tile.angle = -180;
		} else if (tile.west == this.enumSides["wall"] || tile.west == this.enumSides["block"]) {
			tile.angle = -270;
		} else {
			console.error("ERROR: no wall", tile);
		}
	},
	showFourWay: function(tile){
		// 1 sprite, 1 direction
		tile.sprite = this.fourway;
		tile.angle = -0;
	},

	makeWall: function(tile){
		if (tile.north == this.enumSides["undefined"]) tile.north = this.enumSides["wall"];
		if (tile.south == this.enumSides["undefined"]) tile.south = this.enumSides["wall"];
		if (tile.east == this.enumSides["undefined"]) tile.east = this.enumSides["wall"];
		if (tile.west == this.enumSides["undefined"]) tile.west = this.enumSides["wall"];
	},

	buildMaze: function(x, y){
		this.buildStack.push({x: x, y: y});
		let tile = this.grid[x][y];
		let dir = this.findPath(tile);

		// no path, deadend
		if (dir == 0){
			if (tile.tile == this.enumTile["undefined"]) tile.tile = this.enumTile["deadend"];
			// visit another branch

			// pop itselt
			this.buildStack.pop();

			// if there is still cells in stack
			if (this.buildStack.length > 0) {
				// pop new branch 
				let pop = this.buildStack.pop();
				this.buildMaze(pop.x, pop.y);
			} 
		} else {
			if (tile.tile == this.enumTile["undefined"]) {
				tile.tile = this.enumTile["corridor"];
				// chance to have trap or treasure
				let chance = Math.floor((Math.random() * 100) + 1);
				if (chance <=5 && tile.content == this.enumContent["empty"]) {
					let chance = Math.floor((Math.random() * 100) + 1);
					let level = Math.min(25, window.gameSession.level);
					let mod = window.gameSession.level % 5;
					if (mod == 0 && chance <= 1){
						// 1% chance of dungeon moving from 10 to 10 levels
						tile.content = this.enumContent["darkness"];
					} else if (chance <= 25+level) {
						// 25% de chance de perigo +1% por level, max 50%
						tile.content = this.enumContent["danger"];
						tile.contentType = Math.floor((Math.random() * 6) + 1);
						this.dangersType[tile.contentType-1]++;
						this.hudController.updateTrapsByNumber(tile.contentType-1, this.dangersType[tile.contentType-1]);
						this.dangers++;
						this.hudController.updateLabel("traps", ""+this.dangers);
					} else{
						tile.content = this.enumContent["treasure"];
						this.treasures++;
						this.hudController.updateLabel("chests", ""+this.treasures);
					}
				} else if (chance <=10 && tile.content == this.enumContent["empty"]) {
					tile.content = this.enumContent["monster"];
					this.monsters++;
					this.hudController.updateLabel("enemies", ""+this.monsters);
				}
			}
			// make a path in random direction
			let path = Math.floor((Math.random() * dir) + 1);
			this.makePath(x, y, path);
		}
	},

	makePath: function(x, y, path){
		let tile = this.grid[x][y];
		let i = 0;

		// check north opening
		if (tile.north == this.enumSides["undefined"])i++;
		if (i == path){
			tile.north = this.enumSides["open"];
			let north = this.grid[x-1][y];
			north.south = this.enumSides["open"];
			this.buildMaze(x-1, y);
			return;
		}

		// check east opening
		if (tile.east == this.enumSides["undefined"])i++;
		if (i == path){
			tile.east = this.enumSides["open"];
			let east = this.grid[x][y+1];
			east.west = this.enumSides["open"];
			this.buildMaze(x, y+1);
			return;
		}

		// check south opening
		if (tile.south == this.enumSides["undefined"])i++;
		if (i == path){
			tile.south = this.enumSides["open"];
			let south = this.grid[x+1][y];
			south.north = this.enumSides["open"];
			this.buildMaze(x+1, y);
			return;
		}

		// check west opening
		if (tile.west == this.enumSides["undefined"])i++;
		if (i == path){
			tile.west = this.enumSides["open"];
			let west = this.grid[x][y-1];
			west.east = this.enumSides["open"];
			this.buildMaze(x, y-1);
			return;
		}
	},

	findPath: function(tile){
		let paths = 0;
		// for each direction verify if can go, if not create wall
		if (tile.north == this.enumSides["undefined"] && this.isPathFree("north", tile, tile.x-1, tile.y)){ 
			paths++
		} else if (tile.north == this.enumSides["undefined"]){
			tile.north = this.enumSides["wall"];
		}

		if (tile.south == this.enumSides["undefined"] && this.isPathFree("south", tile, tile.x+1, tile.y)){ 
			paths++
		} else if (tile.south == this.enumSides["undefined"]){
			tile.south = this.enumSides["wall"];
		}

		if (tile.east == this.enumSides["undefined"] && this.isPathFree("east", tile, tile.x, tile.y+1)){ 
			paths++
		} else if (tile.east == this.enumSides["undefined"]){
			tile.east = this.enumSides["wall"];
		}

		if (tile.west == this.enumSides["undefined"] && this.isPathFree("west", tile, tile.x, tile.y-1)){ 
			paths++
		} else if (tile.west == this.enumSides["undefined"]){
			tile.west = this.enumSides["wall"];
		}

		return paths;
	},

	isPathFree: function(dir, tile, x, y){
		if(tile[dir] == this.enumSides["block"]) return false;
		let adj = this.grid[x][y];
		if (adj.tile == this.enumTile["deadend"] || adj.tile == this.enumTile["corridor"]) return false;
		if (adj.tile == this.enumTile["undefined"] || adj.tile == this.enumTile["exit"]) return true;
		return false;
	},

	setDoorDirection: function(size){
		// sets entrance and exit in opposite sides
		let dir = Math.floor((Math.random() * 4) + 1);
		let endMod = Math.floor(Math.random() * Math.floor(this.size/2));
		switch(dir) {
			case 1:
				// north - south
				this.makeDoors(0, Math.floor((Math.random() * size)), size-1-endMod, Math.floor((Math.random() * size)));
				break;
			case 2:
				// south - north
				this.makeDoors(size-1, Math.floor((Math.random() * size)), 0+endMod, Math.floor((Math.random() * size)));
				break;
			case 3:
				// east - west
				this.makeDoors(Math.floor((Math.random() * size)), 0, Math.floor((Math.random() * size)), size-1-endMod);
				break;
			case 4:
				// west - east
				this.makeDoors(Math.floor((Math.random() * size)), size-1, Math.floor((Math.random() * size)), 0+endMod);
				break;
			default:
				// code block
		}
	},

	setLever: function(size){
		let x = Math.floor((Math.random() * (size-2)) + 1);
		let y = Math.floor((Math.random() * (size-2)) + 1);
		let tile = this.grid[x][y];
		tile.content = this.enumContent["lever"];
	},

	makeDoors: function(x1, y1, x2, y2){
		// entrance
		let tile = this.grid[x1][y1];
		tile.tile = this.enumTile["entrance"];
		tile.status = this.enumStatus["visible"];
		this.entrance = {x: x1, y: y1};

		// exit
		tile = this.grid[x2][y2];
		tile.tile = this.enumTile["exit"];
		this.exit = {x: x2, y: y2};
	},

	update (dt) {
		if (this.running){
			this.timeToRun -= dt;
			if (this.timeToRun < 0) {
				this.startRunning();
				this.run(this.size);
			}
		}
	},
});
