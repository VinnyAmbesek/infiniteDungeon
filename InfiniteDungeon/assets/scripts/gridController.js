// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		tilePrefab: cc.Prefab,
		gridNode: cc.Node,
		door_corner: cc.SpriteFrame,
		door_side: cc.SpriteFrame,
		deadend: cc.SpriteFrame,
		line: cc.SpriteFrame,
		curve: cc.SpriteFrame,
		threeway: cc.SpriteFrame,
		fourway: cc.SpriteFrame
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
		this.enumSides = ["undefined", "block", "wall", "open"];
		this.enumTile = ["undefined","entrance", "exit", "deadend","corridor"];
		this.enumStatus = ["hidden", "flashing", "visible"];
		this.enumContent = ["empty","treasure","danger"];
		this.enumSprite = ["entrance", "exit", "deadend", "curve", "line", "threway", "fourway"];

		let size = 10;
		this.initGrid(size);
		cc.log(this.grid);
	},

	initGrid: function (size){
		this.grid = new Array(size);
		for(var i = 0; i < size; i++){
			this.grid[i] = new Array(size);

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
	},

	fillGrid: function(size){
		for(var i = 0; i < size; i++){
			for(var j = 0; j < size; j++){
				let tile = this.grid[i][j];
				this.makeWall(tile);
				this.findSprite(tile);

				//cc.log(tile);
				let cell = cc.instantiate(this.tilePrefab);
				cell.parent = this.gridNode;
				cell.rotation = tile.rotation;
				let sprite = cell.getComponent(cc.Sprite);
				sprite.spriteFrame = tile.sprite;
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
		if (tile.north == 0 && this.canGoNorth(tile)) paths++;
		if (tile.south == 0 && this.canGoSouth(tile)) paths++;
		if (tile.east == 0 && this.canGoEast(tile)) paths++;
		if (tile.west == 0 && this.canGoWest(tile)) paths++;
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
		this.setTileStatus(x2, y2, 2);
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
