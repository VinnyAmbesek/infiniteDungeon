const PopupController = require("popupController");

var gridController = cc.Class({
	extends: cc.Component,

	properties: {
		popupController: PopupController,
		tilePrefab: cc.Prefab,
		feedbackPrefab: cc.Prefab,
		logPrefab: cc.Prefab,

		gridNode: cc.Node,
		nextButton: cc.Node,
		canvas: cc.Node,
		inventoryButton: cc.Node,
		dungeonAchievement: cc.Node,
		feedbackLog: cc.Node,
		loadingAnimation: cc.Node,

		dungeonHP: cc.Label,
		dungeonLevel: cc.Label,
		dungeonXP: cc.Label,
		trapFinder: cc.Label,
		treasureHunter: cc.Label,
		tracker: cc.Label,
		deathMessage: cc.Label,
		currencyLabel: cc.Label,
		shields: [cc.Label],
		trapsQtd: [cc.Label],

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
		window.analytics.Level_Start("Floor " + window.gameSession.level, "Dungeon Scene");

		this.enumSides = {undefined: 0, block: 1, wall: 2, open: 3};
		this.enumTile = {undefined: 0, entrance: 1, exit: 2, deadend: 3,corridor: 4};
		this.enumStatus = {hidden: 0, flashing: 1, visible: 2};
		this.enumContent = {empty: 0, treasure: 1, danger: 2, darkness: 3, monster: 4, lever: 5};
		this.enumSprite = {entrance: 0, exit: 1, deadend: 2, curve: 3, line: 4, threeway: 5, fourway: 6};
		this.enumClass = {undefined: 0, rogue: 1, fighter: 2, wizard: 3};

		this.initUI();
		if (window.gameSession.job < 1) {
			this.showJobSelection();
		}
		this.showUpgrades();
		this.checkTime();
		
		if (!window.gameSession.currency) window.gameSession.currency = 0;
		this.currencyLabel.string = window.gameSession.currency;
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
		if(window.gameSession.treasureHunter) this.treasureHunter.node.active = true;
		if(window.gameSession.trapFinder) this.trapFinder.node.active = true;
		if(window.gameSession.fireFinder) this.trapsQtd[0].node.active = true;
		if(window.gameSession.iceFinder) this.trapsQtd[1].node.active = true;
		if(window.gameSession.acidFinder) this.trapsQtd[2].node.active = true;
		if(window.gameSession.electricityFinder) this.trapsQtd[3].node.active = true;
		if(window.gameSession.spikesFinder) this.trapsQtd[4].node.active = true;
		if(window.gameSession.poisonFinder) this.trapsQtd[5].node.active = true;
		if(window.gameSession.tracker) this.tracker.node.active = true;
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
		this.dungeonXP.string = window.gameSession.xp;
		this.showFeedback("+" + minXP + "XP", new cc.Color(0,255,0), this.dungeonXP.node, false);
		window.analytics.Design_event("event:dailyXP", minXP);
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

	initUI: function(){
		this.dungeonLevel.string = window.gameSession.level;
		this.dungeonXP.string = window.gameSession.xp;
		this.dungeonHP.string = window.gameSession.hp;

		this.shields[0].string = window.gameSession.inventory.fire;
		this.shields[1].string = window.gameSession.inventory.ice;
		this.shields[2].string = window.gameSession.inventory.acid;
		this.shields[3].string = window.gameSession.inventory.electricity;
		this.shields[4].string = window.gameSession.inventory.spikes;
		this.shields[5].string = window.gameSession.inventory.poison;
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
		if (window.gameSession.hp < 1) return;
		if (this.popupController.isAnyOpen()) return;

		// click on exit tile a second time to go to next floor
		if (event.target.tile.tile == this.enumTile["exit"] && event.target.used && !this.closed){
			this.nextLevel();
			return;
		} else if (event.target.used) {
			return;
		}

		// mark tiles walked to avoid tile replay
		event.target.used = true;
		this.clickable--;
		window.gameSession.stats.tiles++;
		if (window.gameSession.stats.tiles % 1000 == 0) this.showFeedback("Achievement: Runner", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);

		if(window.gameSession.treasureHunter) this.treasureHunter.node.active = true;
		if(window.gameSession.trapFinder) this.trapFinder.node.active = true;
		if(window.gameSession.fireFinder) this.trapsQtd[0].node.active = true;
		if(window.gameSession.iceFinder) this.trapsQtd[1].node.active = true;
		if(window.gameSession.acidFinder) this.trapsQtd[2].node.active = true;
		if(window.gameSession.electricityFinder) this.trapsQtd[3].node.active = true;
		if(window.gameSession.spikesFinder) this.trapsQtd[4].node.active = true;
		if(window.gameSession.poisonFinder) this.trapsQtd[5].node.active = true;
		if(window.gameSession.tracker) this.tracker.node.active = true;

		this.startRunning();

		// show tile
		let tile = event.target.tile;
		tile.status = this.enumStatus["visible"];
		let sprite = event.target.getComponent(cc.Sprite);
		sprite.spriteFrame = tile.sprite;

		// open new clickzones
		this.showClickZones(tile.x, tile.y);

		// use a potion
		if (window.gameSession.hp < window.gameSession.hpMax && window.gameSession.inventory.potion > 0) {
			window.analytics.Design_event("event:potion");
			window.gameSession.inventory.potion--;
			window.gameSession.stats.items.potion++;
			if (window.gameSession.stats.items.potion % 100 == 0) this.showFeedback("Achievement: Not addicted", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			window.gameSession.stats.items.total++;
			if (window.gameSession.stats.items.total % 100 == 0) this.showFeedback("Achievement: Spender", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			

			this.showFeedback("Used potion", new cc.Color(0,255,0), event.target, true);
			
			if (window.gameSession.job == this.enumClass["wizard"]) {
				window.gameSession.hp+=2;
				this.showFeedback("+2HP", new cc.Color(0,255,0), this.dungeonHP.node, false);
			} else {
				window.gameSession.hp++;
				this.showFeedback("+1HP", new cc.Color(0,255,0), this.dungeonHP.node, false);
			}
			this.dungeonHP.string = window.gameSession.hp;
			
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
			if (window.gameSession.hp > 0) {
				xp += window.gameSession.level*25;
				if (window.gameSession.job == this.enumClass["rogue"]) xp += window.gameSession.level*25;
				window.gameSession.stats.traps.total++;
				if (window.gameSession.stats.traps.total % 100 == 0) this.showFeedback("Achievement: Trap Finder", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			} else {
				this.popupController.openPermanentPopup("death");
				this.deathMessage.string = "You died! \n You were " + this.lastDanger + "!";
			}
		}
		if(tile.content == this.enumContent["darkness"]){
			this.showFeedback("Dungeon Moves!", new cc.Color(255,0,0), this.dungeonLevel.node, true);
			this.dungeonMoves++;
			window.analytics.Design_event("event:darkness", this.dungeonMoves);
			if (this.dungeonMoves> 1) {
				window.gameSession.stats.unique.darkness = true
				if (! window.gameSession.achievements.unique.darkness) this.showFeedback("Achievement: Stop Moving!", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
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
			if (window.gameSession.hp > 0) {
				xp += window.gameSession.level*25;
				if (window.gameSession.job == this.enumClass["fighter"]) xp += window.gameSession.level*50;
			} else {
				this.popupController.openPermanentPopup("death");
				this.deathMessage.string = "You died! \n You were " + this.lastDanger + "!";
			}
		}
		if(tile.content == this.enumContent["lever"]){
			window.analytics.Design_event("event:lever", window.gameSession.level);
			this.showFeedback("Stairs Unlocked", new cc.Color(0,255,0), this.dungeonLevel.node, true);
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
				this.showFeedback("Stairs Locked", new cc.Color(255,0,0), this.dungeonLevel.node, true);
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
				if (window.gameSession.hp > 0) {
					xp += window.gameSession.level*25;
					if (window.gameSession.job == this.enumClass["fighter"]) xp += window.gameSession.level*50;
				} else {
					this.popupController.openPermanentPopup("death");
					this.deathMessage.string = "You died! \n You were " + this.lastDanger + "!";
				}
			}
		}

		// show xp gain
		window.gameSession.xp += xp;
		this.dungeonXP.string = window.gameSession.xp;
		this.showFeedback("+" + xp + "XP", new cc.Color(0,255,0), this.dungeonXP.node, false);
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
		this.tracker.string = this.monsters;
		let strength = Math.floor(window.gameSession.level/5) + 1 + boss;
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

		this.showFeedback(feedback, new cc.Color(255,0,0), node, true, 3.0);
		this.lastDanger = effect;

		if ((strength - window.gameSession.inventory[field]) < -9) {
			window.gameSession.stats.unique.overkill = true;
			if (!window.gameSession.achievements.unique.overkill) this.showFeedback("Achievement: Overkill", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
		}
		window.analytics.Design_event("Fight:" + field + ":" + strength, window.gameSession.inventory[field]);
		strength -= Math.min(strength, window.gameSession.inventory[field]);
		// receives strength in damage
		if (strength>0) {
			this.showFeedback("-" + strength + "HP", new cc.Color(255,0,0), this.dungeonHP.node, false);
			window.gameSession.hp -= strength;
			window.gameSession.stats.damage[field] += strength;
			if (window.gameSession.stats.damage[field] % 100 == 0) this.showFeedback("Achievement: " + achivDamage, new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			window.gameSession.stats.damage.total += strength;
			if (window.gameSession.stats.damage.total % 100 == 0) this.showFeedback("Achievement: It hurts everywhere", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			this.dungeonHP.string = window.gameSession.hp;
		}

		if (window.gameSession.hp > 0) {
			window.gameSession.stats.kills[field]++;
			if (window.gameSession.stats.kills[field] % 100 == 0) this.showFeedback("Achievement: " + achivKills, new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			window.gameSession.stats.kills.total++;
			if (window.gameSession.stats.kills.total % 100 == 0) this.showFeedback("Achievement: God of War", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);

			//LOOT
			this.giveTreasure(Math.floor((Math.random() * 100) + 1), node, true);
		} else {
			if (window.gameSession.hp < -9) {
				window.gameSession.stats.unique.truedeath = true;
				if (!window.gameSession.achievements.unique.truedeath) this.showFeedback("Achievement: True Death", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			}
			if (window.gameSession.death) {
				window.gameSession.stats.unique.already = true;
				if (!window.gameSession.achievements.unique.already) this.showFeedback("Achievement: Already Back?", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			}
			window.gameSession.stats.death[field]++;
			if (window.gameSession.stats.death[field] % 100 == 0) this.showFeedback("Achievement: " + achivDeath, new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			window.gameSession.stats.death.total++;
			if (window.gameSession.stats.death.total % 100 == 0) this.showFeedback("Achievement: Kenny", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
		}
	},

	fightDanger: function(danger, node){
		this.dangers--;
		this.hitTrap = true;
		this.trapFinder.string = this.dangers;
		let strength = Math.floor(window.gameSession.level/10 + 1);
		if (window.gameSession.job == this.enumClass["rogue"]) strength--;
		let feedback;
		let effect;
		let field;
		let item;
		let achivTrap;
		let achivItem;
		let achivDeath;

		if (window.gameSession.hp <2 && (window.gameSession.inventory.fire + window.gameSession.inventory.ice + window.gameSession.inventory.acid + window.gameSession.inventory.electricity + window.gameSession.inventory.spikes + window.gameSession.inventory.poison) <1){
			window.gameSession.stats.unique.daredevil = true;
			if (!window.gameSession.achievements.unique.daredevil) this.showFeedback("Achievement: Daredevil", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
		}

		this.dangersType[danger-1]--;
		this.trapsQtd[danger-1].string = this.dangersType[danger-1];
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

		this.showFeedback(feedback, new cc.Color(255,0,0), node, true);
		this.lastDanger = effect;
		window.gameSession.stats.traps[field]++;
		if (window.gameSession.stats.traps[field] % 100 == 0) this.showFeedback("Achievement: " + achivTrap, new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
		
		if (window.gameSession.inventory[field] > 0){
			let shield = window.gameSession.inventory[field];
			let protection = Math.min(strength, shield);

			// lose shields up to strength of danger
			window.gameSession.inventory[field] -= protection;
			window.gameSession.stats.items[field] += protection; 
			this.shields[danger-1].string = window.gameSession.inventory[field];
			if (window.gameSession.stats.items[field] % 100 == 0) this.showFeedback("Achievement: " + achivItem, new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			window.gameSession.stats.items.total += protection;
			if (window.gameSession.stats.items.total % 100 == 0) this.showFeedback("Achievement: Spender", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);

			// danger strength is reduced by spent shields
			strength -= protection;

			this.showFeedback("-" + protection + " " + item + " Shield", new cc.Color(255,0,0), this.dungeonLevel.node, true);
		}

		// receives strength in damage
		if (strength>0) {
			this.showFeedback("-" + strength + "HP", new cc.Color(255,0,0), this.dungeonHP.node, false);
			window.gameSession.hp -= strength;
			window.gameSession.stats.damage[field] += strength;
			if (window.gameSession.stats.items[field] % 100 == 0) this.showFeedback("Achievement: " + achivItem, new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			window.gameSession.stats.damage.total += strength;
			if (window.gameSession.stats.damage.total % 100 == 0) this.showFeedback("Achievement: It hurts everywhere", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			this.dungeonHP.string = window.gameSession.hp;
		}
		if (window.gameSession.hp <= 0) {
			if (window.gameSession.hp < -9) {
				window.gameSession.stats.unique.truedeath = true;
				if (!window.gameSession.achievements.unique.truedeath) this.showFeedback("Achievement: True Death", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			}
			if (window.gameSession.death) {
				window.gameSession.stats.unique.already = true;
				if (!window.gameSession.achievements.unique.already) this.showFeedback("Achievement: Already Back?", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			}
			window.gameSession.stats.death[field]++;
			if (window.gameSession.stats.death[field] % 100 == 0) this.showFeedback("Achievement: " + achivDeath, new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
			window.gameSession.stats.death.total++;
			if (window.gameSession.stats.death.total % 100 == 0) this.showFeedback("Achievement: Kenny", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
		}
	},

	giveTreasure: function(prize, node, loot=false){
		if (!loot){
			this.treasures--;
			this.treasureHunter.string = this.treasures;
		}
		let reward = 1 + window.gameSession.skills.totalShield;
		window.gameSession.stats.items.chests += reward;
		if (window.gameSession.stats.items.chests % 100 == 0) this.showFeedback("Achievement: Treasure Hunter", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
		if (prize <= 10) {
			window.analytics.Design_event("Treasure:potion", reward);
			window.gameSession.inventory.potion = Math.min(window.gameSession.inventory.potion+reward, window.gameSession.inventory.potionMax);
			this.showFeedback("Got " + reward + " Potion", new cc.Color(0,255,0), node, true);
		} else if (prize <= 25 ) {
			window.analytics.Design_event("Treasure:fire", reward);
			window.gameSession.inventory.fire = Math.min(window.gameSession.inventory.fire+reward, window.gameSession.inventory.fireMax);
			this.showFeedback("Got " + reward + " Fire Shield", new cc.Color(0,255,0), node, true);
			this.shields[0].string = window.gameSession.inventory.fire;
		} else if (prize <= 40 ) {
			window.analytics.Design_event("Treasure:ice", reward);
			window.gameSession.inventory.ice = Math.min(window.gameSession.inventory.ice+reward, window.gameSession.inventory.iceMax);
			this.showFeedback("Got " + reward + " Ice Shield", new cc.Color(0,255,0), node, true);
			this.shields[1].string = window.gameSession.inventory.ice;
		} else if (prize <= 55 ) {
			window.analytics.Design_event("Treasure:acid", reward);
			window.gameSession.inventory.acid = Math.min(window.gameSession.inventory.acid+reward, window.gameSession.inventory.acidMax);
			this.showFeedback("Got " + reward + " Acid Shield", new cc.Color(0,255,0), node, true);
			this.shields[2].string = window.gameSession.inventory.acid;
		} else if (prize <= 70 ) {
			window.analytics.Design_event("Treasure:electricity", reward);
			window.gameSession.inventory.electricity = Math.min(window.gameSession.inventory.electricity+reward, window.gameSession.inventory.electricityMax);
			this.showFeedback("Got " + reward + " Electricity Shield", new cc.Color(0,255,0), node, true);
			this.shields[3].string = window.gameSession.inventory.electricity;
		} else if (prize <= 85 ) {
			window.analytics.Design_event("Treasure:spikes", reward);
			window.gameSession.inventory.spikes = Math.min(window.gameSession.inventory.spikes+reward, window.gameSession.inventory.spikesMax);
			this.showFeedback("Got " + reward + " Spikes Shield", new cc.Color(0,255,0), node, true);
			this.shields[4].string = window.gameSession.inventory.spikes;
		} else if (prize <= 100 ) {
			window.analytics.Design_event("Treasure:poison", reward);
			window.gameSession.inventory.poison = Math.min(window.gameSession.inventory.poison+reward, window.gameSession.inventory.poisonMax);
			this.showFeedback("Got " + reward + " Poison Shield", new cc.Color(0,255,0), node, true);
			this.shields[5].string = window.gameSession.inventory.poison;
		}
	},

	nextLevel: function(){
		if (window.gameSession.hp < 1) return; 
		this.loadingAnimation.active = true;
		window.gameSession.death = false;
		if (!this.hitTrap) {
			window.gameSession.stats.unique.lucky = true;
			if (!window.gameSession.achievements.unique.lucky) this.showFeedback("Achievement: Lucky", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
		}
		window.gameSession.currency++;

		window.analytics.Level_Complete("Floor " + window.gameSession.level, "Dungeon Scene");
		window.gameSession.level++;
		if (window.gameSession.level > window.gameSession.stats.levelMax) window.gameSession.stats.levelMax = window.gameSession.level;
		if (window.gameSession.stats.levelMax % 100 == 0) this.showFeedback("Achievement: Explorer", new cc.Color(0,255,0), this.dungeonAchievement, true, 5.0);
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
			this.trapsQtd[tile.contentType-1].string = this.dangersType[tile.contentType-1];
			this.dangers++;
			this.trapFinder.string = this.dangers;
		} else if (tile.content == this.enumContent["empty"] && tile.tile != this.enumTile["entrance"] && tile.tile != this.enumTile["exit"]) {
			tile.content = this.enumContent["treasure"];
			this.treasures++;
			this.treasureHunter.string = this.treasures;
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
						this.trapsQtd[tile.contentType-1].string = this.dangersType[tile.contentType-1];
						this.dangers++;
						this.trapFinder.string = this.dangers;
					} else{
						tile.content = this.enumContent["treasure"];
						this.treasures++;
						this.treasureHunter.string = this.treasures;
					}
				} else if (chance <=10 && tile.content == this.enumContent["empty"]) {
					tile.content = this.enumContent["monster"];
					this.monsters++;
					this.tracker.string = this.monsters;
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

	showFeedback: function(text, color, parent, stay, duration = 2.0){
		let feedback = cc.instantiate(this.feedbackPrefab);
		feedback.parent = this.canvas;
		feedback.color = color;
		
		let position = parent.parent.convertToWorldSpaceAR(parent.position);
		position = this.canvas.convertToNodeSpaceAR(position);
		feedback.x = position.x;
		if (feedback.x < -231) feedback.x = -200;
		if (feedback.x > 231) feedback.x = 200;
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
