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
		this.enumSides = ["undefined", "block", "wall", "open"];
		this.enumTile = ["undefined","entrance", "exit", "deadend","corridor"];
		this.enumStatus = ["hidden", "flashing", "visible"];
		this.enumContent = ["empty","treasure","danger"];
		this.enumSprite = ["entrance", "exit", "deadend", "curve", "line", "threeway", "fourway"];

		// initialize gameSession
		if (! window.gameSession) this.initSession();
		this.initUI();
		this.showUpgrades();

		this.clicks = 0;
		this.dangers = 0;
		this.treasures = 0;

		let size = 10;
		this.initGrid(size);
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

	initSession: function(){
		window.gameSession = {};

		window.gameSession.level = 1;
		window.gameSession.levelMin = 1;
		window.gameSession.levelMax = 1;

		window.gameSession.info = 0;

		window.gameSession.xp = 0;

		window.gameSession.hp = 3;
		window.gameSession.hpMax = 3;

		// inventory
		window.gameSession.inventory = {};

		window.gameSession.inventory.fire = 0;
		window.gameSession.inventory.fireMin = 0;
		window.gameSession.inventory.fireMax = 3;

		window.gameSession.inventory.ice = 0;
		window.gameSession.inventory.iceMin = 0;
		window.gameSession.inventory.iceMax = 3;

		window.gameSession.inventory.acid = 0;
		window.gameSession.inventory.acidMin = 0;
		window.gameSession.inventory.acidMax = 3;

		window.gameSession.inventory.electricity = 0;
		window.gameSession.inventory.electricityMin = 0;
		window.gameSession.inventory.electricityMax = 3;

		window.gameSession.inventory.spikes = 0;
		window.gameSession.inventory.spikesMin = 0;
		window.gameSession.inventory.spikesMax = 3;

		window.gameSession.inventory.poison = 0;
		window.gameSession.inventory.poisonMin = 0;
		window.gameSession.inventory.poisonMax = 3;

		window.gameSession.inventory.potion = 0;
		window.gameSession.inventory.potionMin = 0;
		window.gameSession.inventory.potionMax = 3;

		// upgrades
		window.gameSession.upgrades = {};

		window.gameSession.upgrades.fireMin = 1000;
		window.gameSession.upgrades.fireMax = 1000;
		window.gameSession.upgrades.iceMin = 1000;
		window.gameSession.upgrades.iceMax = 1000;
		window.gameSession.upgrades.acidMin = 1000;
		window.gameSession.upgrades.acidMax = 1000;
		window.gameSession.upgrades.electricityMin = 1000;
		window.gameSession.upgrades.electricityMax = 1000;
		window.gameSession.upgrades.spikesMin = 1000;
		window.gameSession.upgrades.spikesMax = 1000;
		window.gameSession.upgrades.poisonMin = 1000;
		window.gameSession.upgrades.poisonMax = 1000;

		window.gameSession.upgrades.potionMin = 1000;
		window.gameSession.upgrades.potionMax = 1000;

		window.gameSession.upgrades.hpMax = 1000;
		window.gameSession.upgrades.levelMax = 1000;
		window.gameSession.upgrades.info = 1000;
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
				this.grid[i][j].north = 0;
				this.grid[i][j].south = 0;
				this.grid[i][j].east = 0;
				this.grid[i][j].west = 0;
				// tile
				this.grid[i][j].tile = 0;
				// status
				this.grid[i][j].status = 0;
				// content
				this.grid[i][j].content = 0;

				// mark grid borders
				if(i == 0) this.grid[i][j].north = 1;
				if(i == size-1) this.grid[i][j].south = 1;
				if(j == 0) this.grid[i][j].west = 1;
				if(j == size-1) this.grid[i][j].east = 1;
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
		if (tile.north == 3) {
			this.addClickFunction(x-1,y);
		}
		if (tile.south == 3) {
			this.addClickFunction(x+1,y);
		}
		if (tile.east == 3) {
			this.addClickFunction(x,y+1);
		}
		if (tile.west == 3) {
			this.addClickFunction(x,y-1);
		}
	},

	addClickFunction: function(x,y){
		let tile = this.grid[x][y];
		if (tile.status == 2) return;
		if (tile.status == 1) return;
		tile.status = 1;
		let cell = this.gridUI[x][y];
		let sprite = cell.getComponent(cc.Sprite);
		sprite.spriteFrame = this.open;

		let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "gridController";
        eventHandler.handler = "gridClick";
        cell.tile = tile;
		cell.getComponent(cc.Button).clickEvents.push(eventHandler);
	},

	gridClick: function(node){
		if (node.target.used) return;
		if (window.gameSession.hp < 1) return;
		// mark tiles walked to avoid tile replay
		node.target.used = true;

		// show tile
		let tile = node.target.tile;
		tile.status = 2;
		let sprite = node.target.getComponent(cc.Sprite);
		sprite.spriteFrame = tile.sprite;

		this.showClickZones(tile.x, tile.y);

		// use a potion
		if (window.gameSession.hp < window.gameSession.hpMax && window.gameSession.inventory.potion > 0) {
			window.gameSession.inventory.potion--;
			window.gameSession.hp++;
			cc.log("Used potion");
			this.dungeonHP.string = "HP: " + window.gameSession.hp;
			this.inventoryPotion.string = "Potion: " + window.gameSession.inventory.potion;
		}
		
		// extra xp for clean map
		this.clicks++;
		if (this.clicks == 99) window.gameSession.xp += window.gameSession.level*101;

		// gain exploration xp
		window.gameSession.xp += window.gameSession.level;

		// verify content
		if(tile.content == 1) {
			this.giveTreasure(Math.floor((Math.random() * 100) + 1));
		}
		if(tile.content == 2) {
			this.fightDanger(Math.floor((Math.random() * 6) + 1));
			// victory xp
			if (window.gameSession.hp > 0) {
				window.gameSession.xp += window.gameSession.level*25
			} else {
				cc.log("dead");
				this.deathPopup.active = true;
				this.deathMessage.string = "You died! \n You were " + this.lastDanger + "!";
			}
		};

		this.dungeonXP.string = "XP: " + window.gameSession.xp;

		if (tile.tile == 2){
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
		switch(danger) {
			case 1:
				// code block
				cc.log("Fought Fire");
				this.lastDanger = "burned";
				if (window.gameSession.inventory.fire > 0){
					window.gameSession.inventory.fire -= damage;
					if (window.gameSession.inventory.fire < 0 ) {
						window.gameSession.hp += window.gameSession.inventory.fire;
						window.gameSession.inventory.fire = 0;
					}
					this.inventoryFire.string = "Fire: " + window.gameSession.inventory.fire;
				} else {
					window.gameSession.hp -= damage;
				}
				break;
			case 2:
				// code block
				cc.log("Fought Ice");
				this.lastDanger = "frozen";
				if (window.gameSession.inventory.ice > 0){
					window.gameSession.inventory.ice -= damage;
					if (window.gameSession.inventory.ice < 0 ) {
						window.gameSession.hp += window.gameSession.inventory.ice;
						window.gameSession.inventory.ice = 0;
					}
					this.inventoryIce.string = "Ice: " + window.gameSession.inventory.ice;
				} else {
					window.gameSession.hp -= damage;
				}
				break;
			case 3:
				// code block
				cc.log("Fought Acid");
				this.lastDanger = "dissolved";
				if (window.gameSession.inventory.acid > 0){
					window.gameSession.inventory.acid -= damage;
					if (window.gameSession.inventory.acid < 0 ) {
						window.gameSession.hp += window.gameSession.inventory.acid;
						window.gameSession.inventory.acid = 0;
					}
					this.inventoryAcid.string = "Acid: " + window.gameSession.inventory.acid;
				} else {
					window.gameSession.hp -= damage;
				}
				break;
			case 4:
				// code block
				cc.log("Fought Electricity");
				this.lastDanger = "electrocuted";
				if (window.gameSession.inventory.electricity > 0){
					window.gameSession.inventory.electricity -= damage;
					if (window.gameSession.inventory.electricity < 0 ) {
						window.gameSession.hp += window.gameSession.inventory.electricity;
						window.gameSession.inventory.electricity = 0;
					}
					this.inventoryElectricity.string = "Electricity: " + window.gameSession.inventory.electricity;
				} else {
					window.gameSession.hp -= damage;
				}
				break;
			case 5:
				// code block
				cc.log("Fought Spikes");
				this.lastDanger = "impaled";
				if (window.gameSession.inventory.spikes > 0){
					window.gameSession.inventory.spikes -= damage;
					if (window.gameSession.inventory.spikes < 0 ) {
						window.gameSession.hp += window.gameSession.inventory.spikes;
						window.gameSession.inventory.spikes = 0;
					}
					this.inventorySpikes.string = "Spikes: " + window.gameSession.inventory.spikes;
				} else {
					window.gameSession.hp -= damage;
				}
				break;
			case 6:
				// code block
				cc.log("Fought Poison");
				this.lastDanger = "poisoned";
				if (window.gameSession.inventory.poison > 0){
					window.gameSession.inventory.poison -= damage;
					if (window.gameSession.inventory.poison < 0 ) {
						window.gameSession.hp += window.gameSession.inventory.poison;
						window.gameSession.inventory.poison = 0;
					}
					this.inventoryPoison.string = "Poison: " + window.gameSession.inventory.poison;
				} else {
					window.gameSession.hp -= damage;
				}
				break;
			default:
				// code block
		}

		this.dungeonHP.string = "HP: " + window.gameSession.hp;
	},

	giveTreasure: function(prize){
		if (prize <= 10) {
			window.gameSession.inventory.potion = Math.min(window.gameSession.inventory.potion+1, window.gameSession.inventory.potionMax);
			this.inventoryPotion.string = "Potion: " + window.gameSession.inventory.potion;
			cc.log("Got Potion");
		} else if (prize <= 25 ) {
			window.gameSession.inventory.fire = Math.min(window.gameSession.inventory.fire+1, window.gameSession.inventory.fireMax);
			this.inventoryFire.string = "Fire: " + window.gameSession.inventory.fire;
			cc.log("Got Fire");
		} else if (prize <= 40 ) {
			window.gameSession.inventory.ice = Math.min(window.gameSession.inventory.ice+1, window.gameSession.inventory.iceMax);
			this.inventoryIce.string = "Ice: " + window.gameSession.inventory.ice;
			cc.log("Got Ice");
		} else if (prize <= 55 ) {
			window.gameSession.inventory.acid = Math.min(window.gameSession.inventory.acid+1, window.gameSession.inventory.acidMax);
			this.inventoryAcid.string = "Acid: " + window.gameSession.inventory.acid;
			cc.log("Got Acid");
		} else if (prize <= 70 ) {
			window.gameSession.inventory.electricity = Math.min(window.gameSession.inventory.electricity+1, window.gameSession.inventory.electricityMax);
			this.inventoryElectricity.string = "Electricity: " + window.gameSession.inventory.electricity;
			cc.log("Got Electricity");
		} else if (prize <= 85 ) {
			window.gameSession.inventory.spikes = Math.min(window.gameSession.inventory.spikes+1, window.gameSession.inventory.spikesMax);
			this.inventorySpikes.string = "Spikes: " + window.gameSession.inventory.spikes;
			cc.log("Got Spikes");
		} else if (prize <= 100 ) {
			window.gameSession.inventory.poison = Math.min(window.gameSession.inventory.poison+1, window.gameSession.inventory.poisonMax);
			this.inventoryPoison.string = "Poison: " + window.gameSession.inventory.poison;
			cc.log("Got Poison");
		}
	},

	nextLevel: function(){
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

				//cc.log(tile);
				let cell = cc.instantiate(this.tilePrefab);
				this.gridUI[i][j] = cell;
				cell.parent = this.gridNode;
				cell.rotation = tile.rotation;
				let sprite = cell.getComponent(cc.Sprite);
				if (tile.status == 2) {
					// visible
					sprite.spriteFrame = tile.sprite;	
				} else if (tile.status == 0) {
					// add click event
					sprite.spriteFrame = this.unknown;
				} 
			}
		}
	},

	findSprite: function(tile){
		if (tile.tile == 1 || tile.tile == 2) {
			this.showDoor(tile);
		} else if (tile.tile == 3){
			this.showDeadend(tile);
		} else {
			let paths = 0;
			if (tile.north == 3) paths++;
			if (tile.south == 3) paths++;
			if (tile.east == 3) paths++;
			if (tile.west == 3) paths++;
			
			if (paths == 2 && ( (tile.north == 3 && tile.south == 3) || (tile.east == 3 && tile.west == 3) ) ) {
				this.showLine(tile);
			} else if (paths == 2) {
				this.showCurve(tile);
			} else if (paths == 3){
				this.showThreeWay(tile);
			} else if (paths == 4){
				this.showFourWay(tile);
			} else {
				cc.log("ERROR: no sprite", tile);
			}
		}
	},

	showDoor: function(tile){
		// 2 sprites, 4 directions each
		let blocks = 0;
		if (tile.north == 1) blocks++;
		if (tile.south == 1) blocks++;
		if (tile.east == 1) blocks++;
		if (tile.west == 1) blocks++;
		
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
			cc.log("ERROR: should not have that amount of blocks", tile);
		}
	},
	showDeadend: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.deadend;
		if (tile.north == 3){
			tile.rotation = 270;
		} else if (tile.east == 3) {
			tile.rotation = 0;
		} else if (tile.south == 3){
			tile.rotation = 90;
		} else if (tile.west == 3) {
			tile.rotation = 180;
		}

		// mark if has treasure or danger
		tile.content = Math.floor((Math.random() * 2) + 1);
		if (tile.content == 1) this.treasures++;
		if (tile.content == 2) this.dangers++;
	},
	showLine: function(tile){
		// 1 sprite, 2 directions
		tile.sprite = this.line;
		if (tile.north == 3){
			tile.rotation = 0;
		} else if (tile.east == 3) {
			tile.rotation = 90;
		}
	},
	showCurve: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.curve;
		if (tile.north == 3){
			if (tile.west == 3) {
				tile.rotation = 180;
			} else if (tile.east == 3) {
				tile.rotation = 270;
			}  
		} else if (tile.south == 3){
			if (tile.west == 3) {
				tile.rotation = 90;
			} else if (tile.east == 3) {
				tile.rotation = 0;
			}
		}
	},
	showThreeWay: function(tile){
		// 1 sprite, 4 directions
		tile.sprite = this.threeway;
		if (tile.north == 2 || tile.north == 1){
			tile.rotation = 0;
		} else if (tile.east == 2 || tile.east == 1) {
			tile.rotation = 90;
		} else if (tile.south == 2 || tile.south == 1){
			tile.rotation = 180;
		} else if (tile.west == 2 || tile.west == 1) {
			tile.rotation = 270;
		} else {
			cc.log("ERROR: no wall", tile);
		}
	},
	showFourWay: function(tile){
		// 1 sprite, 1 direction
		tile.sprite = this.fourway;
		tile.rotation = 0;
	},

	makeWall: function(tile){
		if (tile.north == 0) tile.north = 2;
		if (tile.south == 0) tile.south = 2;
		if (tile.east == 0) tile.east = 2;
		if (tile.west == 0) tile.west = 2;
	},

	buildMaze: function(x, y){
		this.buildStack.push({x: x, y: y});
		let tile = this.grid[x][y];
		let dir = this.findPath(tile);

		// no path, deadend
		if (dir == 0){
			if (tile.tile == 0) tile.tile = 3;
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
			if (tile.tile == 0) tile.tile = 4;
			// make a path in random direction
			let path = Math.floor((Math.random() * dir) + 1);
			this.makePath(x, y, path);
		}
	},

	makePath: function(x, y, path){
		let tile = this.grid[x][y];
		let i = 0;

		// check north opening
		if (tile.north == 0)i++;
		if (i == path){
			tile.north = 3;
			let north = this.grid[x-1][y];
			north.south = 3;
			this.buildMaze(x-1, y);
			return;
		}

		// check east opening
		if (tile.east == 0)i++;
		if (i == path){
			tile.east = 3;
			let east = this.grid[x][y+1];
			east.west = 3;
			this.buildMaze(x, y+1);
			return;
		}

		// check south opening
		if (tile.south == 0)i++;
		if (i == path){
			tile.south = 3;
			let south = this.grid[x+1][y];
			south.north = 3;
			this.buildMaze(x+1, y);
			return;
		}

		// check west opening
		if (tile.west == 0)i++;
		if (i == path){
			tile.west = 3;
			let west = this.grid[x][y-1];
			west.east = 3;
			this.buildMaze(x, y-1);
			return;
		}
	},

	findPath: function(tile){
		let paths = 0;
		if (tile.north == 0 && this.canGoNorth(tile)){ 
			paths++
		} else if (tile.north == 0){
			tile.north = 2;
		}
		if (tile.south == 0 && this.canGoSouth(tile)){ 
			paths++
		} else if (tile.south == 0){
			tile.south = 2;
		}
		if (tile.east == 0 && this.canGoEast(tile)){ 
			paths++
		} else if (tile.east == 0){
			tile.east = 2;
		}
		if (tile.west == 0 && this.canGoWest(tile)){ 
			paths++
		} else if (tile.west == 0){
			tile.west = 2;
		}
		return paths;
	},

	canGoNorth: function(tile){
		if(tile.north == 1) return false;
		let adj = this.grid[tile.x-1][tile.y];
		if (adj.tile == 3 || adj.tile == 4) return false;
		if (adj.tile == 0 || adj.tile == 2) return true;
		return false;
	},
	canGoSouth: function(tile){
		if(tile.south == 1) return false;
		let adj = this.grid[tile.x+1][tile.y];
		if (adj.tile == 3 || adj.tile == 4) return false;
		if (adj.tile == 0 || adj.tile == 2) return true;
		return false;
	},
	canGoEast: function(tile){
		if(tile.east == 1) return false;
		let adj = this.grid[tile.x][tile.y+1];
		if (adj.tile == 3 || adj.tile == 4) return false;
		if (adj.tile == 0 || adj.tile == 2) return true;
		return false;
	},
	canGoWest: function(tile){
		if(tile.west == 1) return false;
		let adj = this.grid[tile.x][tile.y-1];
		if (adj.tile == 3 || adj.tile == 4) return false;
		if (adj.tile == 0 || adj.tile == 2) return true;
		return false;
	},

	setDoorDirection: function(size){
		// sets entrance and exit in opposite sides
		let dir = Math.floor((Math.random() * 4) + 1);
		switch(dir) {
			case 1:
				this.makeDoors(0, Math.floor((Math.random() * size)), size-1, Math.floor((Math.random() * size)));
				break;
			case 2:
				this.makeDoors(size-1, Math.floor((Math.random() * size)), 0, Math.floor((Math.random() * size)));
				break;
			case 3:
				this.makeDoors(Math.floor((Math.random() * size)), 0, Math.floor((Math.random() * size)), size-1);
				break;
			case 4:
				this.makeDoors(Math.floor((Math.random() * size)), size-1, Math.floor((Math.random() * size)), 0);
				break;
		  default:
				// code block
		}
	},

	makeDoors: function(x1, y1, x2, y2){
		// entrance
		this.setTile(x1, y1, 1);
		this.setTileStatus(x1, y1, 2);
		this.entrance = {};
		this.entrance.x = x1;
		this.entrance.y = y1;

		// exit
		this.setTile(x2, y2, 2);
		//this.setTileStatus(x2, y2, 2);
		this.exit = {};
		this.exit.x = x2;
		this.exit.y = y2;
	},

	setTile: function(x, y, tile){
		this.grid[x][y].tile = tile;
	},

	setTileStatus: function(x, y, status){
		this.grid[x][y].status = status;
	}

	// update (dt) {},
});
