// Learn cc.Class:
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var gridController = cc.Class({
	extends: cc.Component,

	properties: {
		tilePrefab: cc.Prefab,

		gridNode: cc.Node,
		nextButton: cc.Node,
		upgradePopup: cc.Node,
		deathPopup: cc.Node,

		dungeonHP: cc.Label,
		dungeonLevel: cc.Label,
		dungeonXP: cc.Label,
		feedback: cc.Label,

		inventoryFire: cc.Label,
		inventoryIce: cc.Label,
		inventoryAcid: cc.Label,
		inventoryElectricity: cc.Label,
		inventorySpikes: cc.Label,
		inventoryPoison: cc.Label,
		inventoryPotion: cc.Label,
		deathMessage: cc.Label,

		door_corner: cc.SpriteFrame,
		door_side: cc.SpriteFrame,
		deadend: cc.SpriteFrame,
		line: cc.SpriteFrame,
		curve: cc.SpriteFrame,
		threeway: cc.SpriteFrame,
		fourway: cc.SpriteFrame,
		unknown: cc.SpriteFrame,
		open: cc.SpriteFrame
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

	// onLoad () {},
	start () {
		this.enumSides = {undefined: 0, block: 1, wall: 2, open: 3};
		this.enumTile = {undefined: 0, entrance: 1, exit: 2, deadend: 3,corridor: 4};
		this.enumStatus = {hidden: 0, flashing: 1, visible: 2};
		this.enumContent = {empty: 0, treasure: 1, danger: 2};
		this.enumSprite = {entrance: 0, exit: 1, deadend: 2, curve: 3, line: 4, threeway: 5, fourway: 6};

		this.initUI();
		this.showUpgrades();

		this.saveGame();

		this.clicks = 0;
		this.dangers = 0;
		this.treasures = 0;
		this.clickable = 0;
		this.feedback.node.opacity = 0;
		this.running = false;
		this.timeToRun = 0.5;
		this.size = 10;

		this.initGrid(this.size);
	},

	saveGame(){
		cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
	},

	showUpgrades: function(){
		let minXP = Math.min(window.gameSession.upgrades.fireMin, window.gameSession.upgrades.fireMax, window.gameSession.upgrades.iceMin,
		window.gameSession.upgrades.iceMax, window.gameSession.upgrades.acidMin, window.gameSession.upgrades.acidMax, window.gameSession.upgrades.electricityMin,
		window.gameSession.upgrades.electricityMax, window.gameSession.upgrades.spikesMin, window.gameSession.upgrades.spikesMax, window.gameSession.upgrades.poisonMin,
		window.gameSession.upgrades.poisonMax, window.gameSession.upgrades.potionMin, window.gameSession.upgrades.potionMax, window.gameSession.upgrades.hpMax,
		window.gameSession.upgrades.levelMax, window.gameSession.upgrades.info);

		if (window.gameSession.xp > minXP) {
			this.upgradePopup.active = true;
		}
	},

	initUI: function(){
		this.dungeonLevel.string = "Floor: " + window.gameSession.level;
		this.dungeonXP.string = "XP: " + window.gameSession.xp;
		this.dungeonHP.string = "HP: " + window.gameSession.hp;

		this.inventoryPotion.string = "Potion: " + window.gameSession.inventory.potion;
		this.inventoryFire.string = "Fire: " + window.gameSession.inventory.fire;
		this.inventoryIce.string = "Ice: " + window.gameSession.inventory.ice;
		this.inventoryAcid.string = "Acid: " + window.gameSession.inventory.acid;
		this.inventoryElectricity.string = "Electricity: " + window.gameSession.inventory.electricity;
		this.inventorySpikes.string = "Spikes: " + window.gameSession.inventory.spikes;
		this.inventoryPoison.string = "Poison: " + window.gameSession.inventory.poison;
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
		// define entrance and exit
		this.setDoorDirection(size);
		// make maze
		this.buildStack = new Array();
		this.buildMaze(this.entrance.x, this.entrance.y);
		// put tiles on grid
		this.fillGrid(size);

		this.showClickZones(this.entrance.x, this.entrance.y);
	},

	showClickZones: function(x, y){
		let tile = this.grid[x][y];
		if (tile.north == this.enumSides["open"]) {
			this.addClickFunction(x-1,y);
		}
		if (tile.south == this.enumSides["open"]) {
			this.addClickFunction(x+1,y);
		}
		if (tile.east == this.enumSides["open"]) {
			this.addClickFunction(x,y+1);
		}
		if (tile.west == this.enumSides["open"]) {
			this.addClickFunction(x,y-1);
		}
	},

	addClickFunction: function(x,y){
		let tile = this.grid[x][y];
		if (tile.status == this.enumStatus["visible"]) return false;
		if (tile.status == this.enumStatus["flashing"]) return true;
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
		return true;
	},

	startRunning: function(){
		this.running = true;
		this.timeToRun = 0.5;
	},

	run: function(size){
		if (this.clickable > 1){
			this.running = false;
			return
		}
		let node = {};

		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){
				let cell = this.gridUI[i][j];
				if (cell.tile && cell.tile.status == this.enumStatus["flashing"]) node.target = cell;
			}
		}

		if (node.target != null) this.gridClick(node);
	},

	gridClick: function(node){
		if (node.target.used) return;
		if (window.gameSession.hp < 1) return;
		// mark tiles walked to avoid tile replay
		node.target.used = true;
		this.clickable--;

		// show tile
		let tile = node.target.tile;
		tile.status = this.enumStatus["visible"];
		let sprite = node.target.getComponent(cc.Sprite);
		sprite.spriteFrame = tile.sprite;

		this.showClickZones(tile.x, tile.y);

		// use a potion
		if (window.gameSession.hp < window.gameSession.hpMax && window.gameSession.inventory.potion > 0) {
			window.gameSession.inventory.potion--;
			window.gameSession.hp++;
			this.showFeedback("Used potion", new cc.Color(0,255,0));
			this.dungeonHP.string = "HP: " + window.gameSession.hp;
			this.inventoryPotion.string = "Potion: " + window.gameSession.inventory.potion;
		}
		
		// extra xp for clean map
		this.clicks++;
		if (this.clicks == 99) window.gameSession.xp += window.gameSession.level*101;

		// gain exploration xp
		window.gameSession.xp += window.gameSession.level;

		// verify content
		if(tile.content == this.enumContent["treasure"]) {
			this.running = false;
			this.giveTreasure(Math.floor((Math.random() * 100) + 1));
		}
		if(tile.content == this.enumContent["danger"]) {
			this.running = false;
			this.fightDanger(Math.floor((Math.random() * 6) + 1));
			// victory xp
			if (window.gameSession.hp > 0) {
				window.gameSession.xp += window.gameSession.level*25
			} else {
				this.deathPopup.active = true;
				this.deathMessage.string = "You died! \n You were " + this.lastDanger + "!";
			}
		};

		this.dungeonXP.string = "XP: " + window.gameSession.xp;

		if (tile.tile == this.enumTile["exit"]){
			// found exit
			// show next level button
			this.nextButton.active = true;
		}
	},

	iDied: function(){
		this.closePopup();
		// back to level
		window.gameSession.level = window.gameSession.levelMin;

		// restore hp
		window.gameSession.hp = window.gameSession.hpMax;

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

	closePopup: function(){
		this.deathPopup.active = false;
		this.upgradePopup.active = false;
	},

	fightDanger: function(danger){
		this.dangers--;
		let damage = Math.floor(window.gameSession.level/10 + 1);
		let feedback;
		let effect;
		let field;
		let item;
		switch(danger) {
			case 1:
				// code block
				feedback = "Fire Trap";
				effect = "burned";
				field = "fire";
				item = "Fire"
				break;
			case 2:
				// code block
				feedback = "Freezing Trap";
				effect = "frozen";
				field = "ice"
				item = "Ice";
				break;
			case 3:
				// code block
				feedback = "Acid Trap";
				effect = "dissolved";
				field = "acid"
				item = "Acid";
				break;
			case 4:
				// code block
				feedback = "Electricity Trap";
				effect = "electrocuted";
				field = "electricity"
				item = "Electricity";
				break;
			case 5:
				// code block
				feedback = "Floor Spikes Trap";
				effect = "impaled";
				field = "spikes"
				item = "Spikes";
				break;
			case 6:
				// code block
				feedback = "Poisoned Dart Trap";
				effect = "poisoned";
				field = "poison"
				item = "Poison";
				break;
			default:
				// code block
		}
		this.showFeedback(feedback, new cc.Color(255,0,0));
		this.lastDanger = effect;
		if (window.gameSession.inventory[field] > 0){
			window.gameSession.inventory[field] -= damage;
			if (window.gameSession.inventory[field] < 0 ) {
				window.gameSession.hp += window.gameSession.inventory[field];
				window.gameSession.inventory[field] = 0;
			}
			this["inventory"+item].string = item + ": " + window.gameSession.inventory[field];
		} else {
			window.gameSession.hp -= damage;
		}

		this.dungeonHP.string = "HP: " + window.gameSession.hp;
	},

	giveTreasure: function(prize){
		if (prize <= 10) {
			window.gameSession.inventory.potion = Math.min(window.gameSession.inventory.potion+1, window.gameSession.inventory.potionMax);
			this.inventoryPotion.string = "Potion: " + window.gameSession.inventory.potion;
			this.showFeedback("Got Potion", new cc.Color(0,255,0));
		} else if (prize <= 25 ) {
			window.gameSession.inventory.fire = Math.min(window.gameSession.inventory.fire+1, window.gameSession.inventory.fireMax);
			this.inventoryFire.string = "Fire: " + window.gameSession.inventory.fire;
			this.showFeedback("Got Fire Protection", new cc.Color(0,255,0));
		} else if (prize <= 40 ) {
			window.gameSession.inventory.ice = Math.min(window.gameSession.inventory.ice+1, window.gameSession.inventory.iceMax);
			this.inventoryIce.string = "Ice: " + window.gameSession.inventory.ice;
			this.showFeedback("Got Ice Protection", new cc.Color(0,255,0));
		} else if (prize <= 55 ) {
			window.gameSession.inventory.acid = Math.min(window.gameSession.inventory.acid+1, window.gameSession.inventory.acidMax);
			this.inventoryAcid.string = "Acid: " + window.gameSession.inventory.acid;
			this.showFeedback("Got Acid Protection", new cc.Color(0,255,0));
		} else if (prize <= 70 ) {
			window.gameSession.inventory.electricity = Math.min(window.gameSession.inventory.electricity+1, window.gameSession.inventory.electricityMax);
			this.inventoryElectricity.string = "Electricity: " + window.gameSession.inventory.electricity;
			this.showFeedback("Got Electricity Protection", new cc.Color(0,255,0));
		} else if (prize <= 85 ) {
			window.gameSession.inventory.spikes = Math.min(window.gameSession.inventory.spikes+1, window.gameSession.inventory.spikesMax);
			this.inventorySpikes.string = "Spikes: " + window.gameSession.inventory.spikes;
			this.showFeedback("Got Spikes Protection", new cc.Color(0,255,0));
		} else if (prize <= 100 ) {
			window.gameSession.inventory.poison = Math.min(window.gameSession.inventory.poison+1, window.gameSession.inventory.poisonMax);
			this.inventoryPoison.string = "Poison: " + window.gameSession.inventory.poison;
			this.showFeedback("Got Poison Protection", new cc.Color(0,255,0));
		}
	},

	nextLevel: function(){
		if (window.gameSession.hp < 1) return; 
		window.gameSession.level++;
		if (window.gameSession.level > window.gameSession.levelMax) window.gameSession.levelMax = window.gameSession.level;
		cc.director.loadScene("gameScene");
	},

	fillGrid: function(size){
		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){
				let tile = this.grid[i][j];
				this.makeWall(tile);
				this.findSprite(tile);

				let cell = cc.instantiate(this.tilePrefab);
				this.gridUI[i][j] = cell;
				cell.parent = this.gridNode;
				cell.rotation = tile.rotation;
				let sprite = cell.getComponent(cc.Sprite);
				if (tile.status == this.enumStatus["visible"]) {
					sprite.spriteFrame = tile.sprite;	
				} else if (tile.status == this.enumStatus["hidden"]) {
					sprite.spriteFrame = this.unknown;
				} 
			}
		}
	},

	findSprite: function(tile){
		if (tile.tile == this.enumTile["entrance"] || tile.tile == this.enumTile["exit"]) {
			this.showDoor(tile);
		} else if (tile.tile == this.enumTile["deadend"]){
			this.showDeadend(tile);
		} else {
			let paths = 0;
			if (tile.north == this.enumSides["open"]) paths++;
			if (tile.south == this.enumSides["open"]) paths++;
			if (tile.east == this.enumSides["open"]) paths++;
			if (tile.west == this.enumSides["open"]) paths++;
			
			if (paths == 2 && ( (tile.north == this.enumSides["open"] && tile.south == this.enumSides["open"]) || (tile.east == this.enumSides["open"] && tile.west == this.enumSides["open"]))){
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
					tile.rotation = 0;
				} else if (tile.east == 1) {
					tile.rotation = 90;
				}  
			} else if (tile.south == 1){
				if (tile.west == 1) {
					tile.rotation = 270;
				} else if (tile.east == 1) {
					tile.rotation = 180;
				}
			}
		} else if (blocks == 1) {
			// side door
			tile.sprite = this.door_side;
			// find rotation
			if (tile.north == 1){
				tile.rotation = 0;
			} else if (tile.east == 1) {
				tile.rotation = 90;
			} else if (tile.south == 1){
				tile.rotation = 180;
			} else if (tile.west == 1) {
				tile.rotation = 270;
			}
		} else {
			console.error("ERROR: should not have that amount of blocks", tile, blocks);
		}
	},
	showDeadend: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.deadend;
		if (tile.north == this.enumSides["open"]){
			tile.rotation = 270;
		} else if (tile.east == this.enumSides["open"]) {
			tile.rotation = 0;
		} else if (tile.south == this.enumSides["open"]){
			tile.rotation = 90;
		} else if (tile.west == this.enumSides["open"]) {
			tile.rotation = 180;
		}

		// mark if has treasure or danger
		let chance = Math.floor((Math.random() * 100) + 1);
		let level = Math.min(25, window.gameSession.level);
		if (chance <= 25+level) {
			// 25% de chance de perigo +1% por level, max 50%
			tile.content = this.enumContent["danger"];
			this.dangers++;
		} else{
			tile.content = this.enumContent["treasure"];
			this.treasures++;
		}
		
	},
	showLine: function(tile){
		// 1 sprite, 2 directions
		tile.sprite = this.line;
		if (tile.north == this.enumSides["open"]){
			tile.rotation = 0;
		} else if (tile.east == this.enumSides["open"]) {
			tile.rotation = 90;
		}
	},
	showCurve: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.curve;
		if (tile.north == this.enumSides["open"]){
			if (tile.west == this.enumSides["open"]) {
				tile.rotation = 180;
			} else if (tile.east == this.enumSides["open"]) {
				tile.rotation = 270;
			}  
		} else if (tile.south == this.enumSides["open"]){
			if (tile.west == this.enumSides["open"]) {
				tile.rotation = 90;
			} else if (tile.east == this.enumSides["open"]) {
				tile.rotation = 0;
			}
		}
	},
	showThreeWay: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.threeway;
		if (tile.north == this.enumSides["wall"] || tile.north == this.enumSides["block"]){
			tile.rotation = 0;
		} else if (tile.east == this.enumSides["wall"] || tile.east == this.enumSides["block"]) {
			tile.rotation = 90;
		} else if (tile.south == this.enumSides["wall"] || tile.south == this.enumSides["block"]){
			tile.rotation = 180;
		} else if (tile.west == this.enumSides["wall"] || tile.west == this.enumSides["block"]) {
			tile.rotation = 270;
		} else {
			console.error("ERROR: no wall", tile);
		}
	},
	showFourWay: function(tile){
		// 1 sprite, 1 direction
		tile.sprite = this.fourway;
		tile.rotation = 0;
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
				if (chance <=5) {
					let chance = Math.floor((Math.random() * 100) + 1);
					let level = Math.min(25, window.gameSession.level);
					if (chance <= 25+level) {
						// 25% de chance de perigo +1% por level, max 50%
						tile.content = this.enumContent["danger"];
						this.dangers++;
					} else{
						tile.content = this.enumContent["treasure"];
						this.treasures++;
					}
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
		switch(dir) {
			case 1:
				// north - south
				this.makeDoors(0, Math.floor((Math.random() * size)), size-1, Math.floor((Math.random() * size)));
				break;
			case 2:
				// south - north
				this.makeDoors(size-1, Math.floor((Math.random() * size)), 0, Math.floor((Math.random() * size)));
				break;
			case 3:
				// east - west
				this.makeDoors(Math.floor((Math.random() * size)), 0, Math.floor((Math.random() * size)), size-1);
				break;
			case 4:
				// west - east
				this.makeDoors(Math.floor((Math.random() * size)), size-1, Math.floor((Math.random() * size)), 0);
				break;
			default:
				// code block
		}
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

	showFeedback: function(text, color){
		this.feedback.string = text;
		this.feedback.node.opacity = 255;
		this.feedback.node.color = color;
	},

	update (dt) {
		if (this.feedback.node.opacity > 0) {
			this.feedback.node.opacity -= dt*100
			if (this.feedback.node.opacity < 0) this.feedback.node.opacity = 0;
		}

		if (this.running){
			this.timeToRun -= dt;
			if (this.timeToRun < 0) {
				this.run(this.size);
				this.timeToRun = 0.5;
			}
		}
	},
});
