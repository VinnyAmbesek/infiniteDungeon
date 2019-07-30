require=function o(a,r,d){function c(i,e){if(!r[i]){if(!a[i]){var n="function"==typeof require&&require;if(!e&&n)return n(i,!0);if(h)return h(i,!0);var t=new Error("Cannot find module '"+i+"'");throw t.code="MODULE_NOT_FOUND",t}var s=r[i]={exports:{}};a[i][0].call(s.exports,function(e){return c(a[i][1][e]||e)},s,s.exports,o,a,r,d)}return r[i].exports}for(var h="function"==typeof require&&require,e=0;e<d.length;e++)c(d[e]);return c}({deathController:[function(e,i,n){"use strict";cc._RF.push(i,"6c4a65Zyl5N9a5j6+E0StCV","deathController"),cc.Class({extends:cc.Component,properties:{deathPopup:cc.Node},iDied:function(){this.close(),window.gameSession.level=window.gameSession.levelMin,window.gameSession.hp=window.gameSession.hpMax,window.gameSession.inventory.fire=Math.min(window.gameSession.inventory.fireMin,window.gameSession.inventory.fireMax),window.gameSession.inventory.ice=Math.min(window.gameSession.inventory.iceMin,window.gameSession.inventory.iceMax),window.gameSession.inventory.acid=Math.min(window.gameSession.inventory.acidMin,window.gameSession.inventory.acidMax),window.gameSession.inventory.electricity=Math.min(window.gameSession.inventory.electricityMin,window.gameSession.inventory.electricityMax),window.gameSession.inventory.spikes=Math.min(window.gameSession.inventory.spikesMin,window.gameSession.inventory.spikesMax),window.gameSession.inventory.poison=Math.min(window.gameSession.inventory.poisonMin,window.gameSession.inventory.poisonMax),window.gameSession.inventory.potion=Math.min(window.gameSession.inventory.potionMin,window.gameSession.inventory.potionMax),cc.director.loadScene("gameScene")},start:function(){},close:function(){this.node.active=!1,window.gameGlobals.popup=!1},open:function(){this.node.active=!0,window.gameGlobals.popup=!0}}),cc._RF.pop()},{}],gridController:[function(e,i,n){"use strict";cc._RF.push(i,"2bcdfsBj75NDKCCf3TUBANw","gridController");cc.Class({extends:cc.Component,properties:{tilePrefab:cc.Prefab,tile15Prefab:cc.Prefab,tile20Prefab:cc.Prefab,gridNode:cc.Node,nextButton:cc.Node,upgradePopup:cc.Node,deathPopup:cc.Node,dungeonHP:cc.Label,dungeonLevel:cc.Label,dungeonXP:cc.Label,trapFinder:cc.Label,treasureHunter:cc.Label,feedback:cc.Label,deathMessage:cc.Label,door_corner:cc.SpriteFrame,door_side:cc.SpriteFrame,deadend:cc.SpriteFrame,line:cc.SpriteFrame,curve:cc.SpriteFrame,threeway:cc.SpriteFrame,fourway:cc.SpriteFrame,unknown:cc.SpriteFrame,open:cc.SpriteFrame,danger:[cc.SpriteFrame],chest:cc.SpriteFrame,stair_down:cc.SpriteFrame,stair_up:cc.SpriteFrame},start:function(){this.enumSides={undefined:0,block:1,wall:2,open:3},this.enumTile={undefined:0,entrance:1,exit:2,deadend:3,corridor:4},this.enumStatus={hidden:0,flashing:1,visible:2},this.enumContent={empty:0,treasure:1,danger:2,darkness:3},this.enumSprite={entrance:0,exit:1,deadend:2,curve:3,line:4,threeway:5,fourway:6},this.initUI(),this.showUpgrades(),this.saveGame(),this.clicks=0,this.dangers=0,this.treasures=0,this.clickable=0,this.feedback.node.opacity=0,this.running=!1,this.timeToRun=.5,this.size=10,50<window.gameSession.level&&(this.size=15,this.tilePrefab=this.tile15Prefab),100<window.gameSession.level&&(this.size=20,this.tilePrefab=this.tile20Prefab),this.initGrid(this.size),this.setDoorDirection(this.size),this.buildStack=new Array,this.buildMaze(this.entrance.x,this.entrance.y),this.fillGrid(this.size),this.showClickZones(this.entrance.x,this.entrance.y),this.revealSubSprite(this.entrance.x,this.entrance.y),window.gameSession.treasureHunter&&(this.treasureHunter.node.active=!0),window.gameSession.trapFinder&&(this.trapFinder.node.active=!0)},saveGame:function(){cc.sys.localStorage.setItem("gameSession",JSON.stringify(window.gameSession))},showUpgrades:function(){var e=Math.min(window.gameSession.upgrades.fireMin,window.gameSession.upgrades.fireMax,window.gameSession.upgrades.iceMin,window.gameSession.upgrades.iceMax,window.gameSession.upgrades.acidMin,window.gameSession.upgrades.acidMax,window.gameSession.upgrades.electricityMin,window.gameSession.upgrades.electricityMax,window.gameSession.upgrades.spikesMin,window.gameSession.upgrades.spikesMax,window.gameSession.upgrades.poisonMin,window.gameSession.upgrades.poisonMax,window.gameSession.upgrades.potionMin,window.gameSession.upgrades.potionMax,window.gameSession.upgrades.hpMax,window.gameSession.upgrades.levelMin,window.gameSession.upgrades.info);window.gameSession.xp>e&&(this.upgradePopup.active=!0,window.gameGlobals.popup=!0)},initUI:function(){this.dungeonLevel.string="Floor: "+window.gameSession.level,this.dungeonXP.string="XP: "+window.gameSession.xp,this.dungeonHP.string="HP: "+window.gameSession.hp},cleanGrid:function(e){this.clicks=0,this.dangers=0;for(var i=this.treasures=0;i<e;i++)for(var n=0;n<e;n++)this.gridUI[i][n].destroy()},initGrid:function(e){this.grid=new Array(e),this.gridUI=new Array(e);for(var i=0;i<e;i++){this.grid[i]=new Array(e),this.gridUI[i]=new Array(e);for(var n=0;n<e;n++)this.grid[i][n]={},this.grid[i][n].x=i,this.grid[i][n].y=n,this.grid[i][n].north=this.enumSides[void 0],this.grid[i][n].south=this.enumSides[void 0],this.grid[i][n].east=this.enumSides[void 0],this.grid[i][n].west=this.enumSides[void 0],this.grid[i][n].tile=this.enumTile[void 0],this.grid[i][n].status=this.enumStatus.hidden,this.grid[i][n].content=this.enumContent.empty,0==i&&(this.grid[i][n].north=this.enumSides.block),i==e-1&&(this.grid[i][n].south=this.enumSides.block),0==n&&(this.grid[i][n].west=this.enumSides.block),n==e-1&&(this.grid[i][n].east=this.enumSides.block)}},showClickZones:function(e,i){var n=this.grid[e][i],t=0;n.north==this.enumSides.open&&this.addClickFunction(e-1,i)&&t++,n.south==this.enumSides.open&&this.addClickFunction(e+1,i)&&t++,n.east==this.enumSides.open&&this.addClickFunction(e,i+1)&&t++,n.west==this.enumSides.open&&this.addClickFunction(e,i-1)&&t++,1<t&&(this.running=!1)},addClickFunction:function(e,i){var n=this.grid[e][i];if(n.status==this.enumStatus.visible)return!1;if(n.status==this.enumStatus.flashing)return this.lastClickZone=this.gridUI[e][i],!0;n.status=this.enumStatus.flashing,this.clickable++;var t=this.gridUI[e][i];t.getComponent(cc.Sprite).spriteFrame=this.open;var s=new cc.Component.EventHandler;return s.target=this.node,s.component="gridController",s.handler="gridClick",t.tile=n,t.getComponent(cc.Button).clickEvents.push(s),this.lastClickZone=t,!0},startRunning:function(){this.running=!0,this.timeToRun=.5},run:function(e){var i={};this.lastClickZone?(i.target=this.lastClickZone,(this.lastClickZone=null)!=i.target&&this.gridClick(i)):this.running=!1},gridClick:function(e){if(!e.target.used&&!(window.gameSession.hp<1||window.gameGlobals.popup)){e.target.used=!0,this.clickable--,window.gameSession.treasureHunter&&(this.treasureHunter.node.active=!0),window.gameSession.trapFinder&&(this.trapFinder.node.active=!0),this.startRunning();var i=e.target.tile;if(i.status=this.enumStatus.visible,e.target.getComponent(cc.Sprite).spriteFrame=i.sprite,this.showClickZones(i.x,i.y),window.gameSession.hp<window.gameSession.hpMax&&0<window.gameSession.inventory.potion&&(window.gameSession.inventory.potion--,window.gameSession.hp++,this.showFeedback("Used potion",new cc.Color(0,255,0)),this.dungeonHP.string="HP: "+window.gameSession.hp),this.clicks++,99==this.clicks&&(window.gameSession.xp+=101*window.gameSession.level),window.gameSession.xp+=window.gameSession.level,i.content==this.enumContent.treasure&&(this.running=!1,this.giveTreasure(Math.floor(100*Math.random()+1))),i.content==this.enumContent.danger){this.running=!1;var n=Math.floor(6*Math.random()+1);this.fightDanger(n),this.findSubSprite(i,n),0<window.gameSession.hp?window.gameSession.xp+=25*window.gameSession.level:(this.deathPopup.active=!0,window.gameGlobals.popup=!0,this.deathMessage.string="You died! \n You were "+this.lastDanger+"!")}if(i.content==this.enumContent.darkness){this.running=!1;var t=e.target.tile.x,s=e.target.tile.y;this.cleanGrid(this.size),this.initGrid(this.size),this.setDoorDirection(this.size),this.buildStack=new Array,this.buildMaze(this.entrance.x,this.entrance.y),this.grid[this.entrance.x][this.entrance.y].status=this.enumStatus.hidden,this.grid[t][s].status=this.enumStatus.visible,this.fillGrid(this.size),this.showClickZones(t,s)}this.revealSubSprite(i.x,i.y),this.dungeonXP.string="XP: "+window.gameSession.xp,i.tile==this.enumTile.exit&&(this.running=!1,this.nextButton.active=!0)}},revealSubSprite:function(e,i){var n=this.grid[e][i],t=this.gridUI[e][i],s=t.getChildByName("content");s.rotation=360-t.rotation,n.subsprite&&(s.getComponent(cc.Sprite).spriteFrame=n.subsprite)},fightDanger:function(e){window.gameSession.traps++,this.dangers--,this.trapFinder.string="Traps: "+this.dangers;var i=Math.floor(window.gameSession.level/10+1),n=void 0,t=void 0,s=void 0;switch(e){case 1:n="Fire Trap",t="burned",s="fire","Fire";break;case 2:n="Freezing Trap",t="frozen",s="ice","Ice";break;case 3:n="Acid Trap",t="dissolved",s="acid","Acid";break;case 4:n="Electricity Trap",t="electrocuted",s="electricity","Electricity";break;case 5:n="Floor Spikes Trap",t="impaled",s="spikes","Spikes";break;case 6:n="Poisoned Dart Trap",t="poisoned",s="poison","Poison"}this.showFeedback(n,new cc.Color(255,0,0)),this.lastDanger=t,0<window.gameSession.inventory[s]?(window.gameSession.inventory[s]-=i,window.gameSession.inventory[s]<0&&(window.gameSession.hp+=window.gameSession.inventory[s],window.gameSession.inventory[s]=0)):window.gameSession.hp-=i,this.dungeonHP.string="HP: "+window.gameSession.hp},giveTreasure:function(e){this.treasures--,this.treasureHunter.string="Treasures: "+this.treasures,window.gameSession.treasures++,e<=10?(window.gameSession.inventory.potion=Math.min(window.gameSession.inventory.potion+1,window.gameSession.inventory.potionMax),this.showFeedback("Got Potion",new cc.Color(0,255,0))):e<=25?(window.gameSession.inventory.fire=Math.min(window.gameSession.inventory.fire+1,window.gameSession.inventory.fireMax),this.showFeedback("Got Fire Protection",new cc.Color(0,255,0))):e<=40?(window.gameSession.inventory.ice=Math.min(window.gameSession.inventory.ice+1,window.gameSession.inventory.iceMax),this.showFeedback("Got Ice Protection",new cc.Color(0,255,0))):e<=55?(window.gameSession.inventory.acid=Math.min(window.gameSession.inventory.acid+1,window.gameSession.inventory.acidMax),this.showFeedback("Got Acid Protection",new cc.Color(0,255,0))):e<=70?(window.gameSession.inventory.electricity=Math.min(window.gameSession.inventory.electricity+1,window.gameSession.inventory.electricityMax),this.showFeedback("Got Electricity Protection",new cc.Color(0,255,0))):e<=85?(window.gameSession.inventory.spikes=Math.min(window.gameSession.inventory.spikes+1,window.gameSession.inventory.spikesMax),this.showFeedback("Got Spikes Protection",new cc.Color(0,255,0))):e<=100&&(window.gameSession.inventory.poison=Math.min(window.gameSession.inventory.poison+1,window.gameSession.inventory.poisonMax),this.showFeedback("Got Poison Protection",new cc.Color(0,255,0)))},nextLevel:function(){window.gameSession.hp<1||(window.gameSession.level++,window.gameSession.level>window.gameSession.levelMax&&(window.gameSession.levelMax=window.gameSession.level),cc.director.loadScene("gameScene"))},fillGrid:function(e){for(var i=0;i<e;i++)for(var n=0;n<e;n++){var t=this.grid[i][n];this.makeWall(t),this.findSprite(t),this.findSubSprite(t,-1);var s=cc.instantiate(this.tilePrefab);(this.gridUI[i][n]=s).parent=this.gridNode,s.rotation=t.rotation;var o=s.getComponent(cc.Sprite);t.status==this.enumStatus.visible?o.spriteFrame=t.sprite:t.status==this.enumStatus.hidden&&(o.spriteFrame=this.unknown)}},findSubSprite:function(e,i){e.tile==this.enumTile.entrance?e.subsprite=this.stair_up:e.tile==this.enumTile.exit?e.subsprite=this.stair_down:e.content==this.enumContent.treasure?e.subsprite=this.chest:e.content==this.enumContent.danger&&-1<i&&(e.subsprite=this.danger[i-1])},findSprite:function(e){if(e.tile==this.enumTile.deadend)this.showDeadend(e);else{var i=0;e.north==this.enumSides.open&&i++,e.south==this.enumSides.open&&i++,e.east==this.enumSides.open&&i++,e.west==this.enumSides.open&&i++,1==i?this.showDeadend(e):2==i&&(e.north==this.enumSides.open&&e.south==this.enumSides.open||e.east==this.enumSides.open&&e.west==this.enumSides.open)?this.showLine(e):2==i?this.showCurve(e):3==i?this.showThreeWay(e):4==i?this.showFourWay(e):console.error("ERROR: no sprite",e)}},showDoor:function(e){var i=0;e.north==this.enumSides.block&&i++,e.south==this.enumSides.block&&i++,e.east==this.enumSides.block&&i++,e.west==this.enumSides.block&&i++,2==i?(e.sprite=this.door_corner,1==e.north?1==e.west?e.rotation=0:1==e.east&&(e.rotation=90):1==e.south&&(1==e.west?e.rotation=270:1==e.east&&(e.rotation=180))):1==i?(e.sprite=this.door_side,1==e.north?e.rotation=0:1==e.east?e.rotation=90:1==e.south?e.rotation=180:1==e.west&&(e.rotation=270)):console.error("ERROR: should not have that amount of blocks",e,i)},showDeadend:function(e){e.sprite=this.deadend,e.north==this.enumSides.open?e.rotation=270:e.east==this.enumSides.open?e.rotation=0:e.south==this.enumSides.open?e.rotation=90:e.west==this.enumSides.open&&(e.rotation=180),Math.floor(100*Math.random()+1)<=25+Math.min(25,window.gameSession.level)?(e.content=this.enumContent.danger,this.dangers++,this.trapFinder.string="Traps: "+this.dangers):(e.content=this.enumContent.treasure,this.treasures++,this.treasureHunter.string="Treasures: "+this.treasures)},showLine:function(e){e.sprite=this.line,e.north==this.enumSides.open?e.rotation=0:e.east==this.enumSides.open&&(e.rotation=90)},showCurve:function(e){e.sprite=this.curve,e.north==this.enumSides.open?e.west==this.enumSides.open?e.rotation=180:e.east==this.enumSides.open&&(e.rotation=270):e.south==this.enumSides.open&&(e.west==this.enumSides.open?e.rotation=90:e.east==this.enumSides.open&&(e.rotation=0))},showThreeWay:function(e){e.sprite=this.threeway,e.north==this.enumSides.wall||e.north==this.enumSides.block?e.rotation=0:e.east==this.enumSides.wall||e.east==this.enumSides.block?e.rotation=90:e.south==this.enumSides.wall||e.south==this.enumSides.block?e.rotation=180:e.west==this.enumSides.wall||e.west==this.enumSides.block?e.rotation=270:console.error("ERROR: no wall",e)},showFourWay:function(e){e.sprite=this.fourway,e.rotation=0},makeWall:function(e){e.north==this.enumSides[void 0]&&(e.north=this.enumSides.wall),e.south==this.enumSides[void 0]&&(e.south=this.enumSides.wall),e.east==this.enumSides[void 0]&&(e.east=this.enumSides.wall),e.west==this.enumSides[void 0]&&(e.west=this.enumSides.wall)},buildMaze:function(e,i){this.buildStack.push({x:e,y:i});var n=this.grid[e][i],t=this.findPath(n);if(0==t){if(n.tile==this.enumTile[void 0]&&(n.tile=this.enumTile.deadend),this.buildStack.pop(),0<this.buildStack.length){var s=this.buildStack.pop();this.buildMaze(s.x,s.y)}}else{if(n.tile==this.enumTile[void 0])if(n.tile=this.enumTile.corridor,Math.floor(100*Math.random()+1)<=5){var o=Math.floor(100*Math.random()+1),a=Math.min(25,window.gameSession.level);0==window.gameSession.level%10&&o<=1?n.content=this.enumContent.darkness:o<=25+a?(n.content=this.enumContent.danger,this.dangers++,this.trapFinder.string="Traps: "+this.dangers):(n.content=this.enumContent.treasure,this.treasures++,this.treasureHunter.string="Treasures: "+this.treasures)}var r=Math.floor(Math.random()*t+1);this.makePath(e,i,r)}},makePath:function(e,i,n){var t=this.grid[e][i],s=0;return t.north==this.enumSides[void 0]&&s++,s==n?(t.north=this.enumSides.open,this.grid[e-1][i].south=this.enumSides.open,void this.buildMaze(e-1,i)):(t.east==this.enumSides[void 0]&&s++,s==n?(t.east=this.enumSides.open,this.grid[e][i+1].west=this.enumSides.open,void this.buildMaze(e,i+1)):(t.south==this.enumSides[void 0]&&s++,s==n?(t.south=this.enumSides.open,this.grid[e+1][i].north=this.enumSides.open,void this.buildMaze(e+1,i)):(t.west==this.enumSides[void 0]&&s++,s==n?(t.west=this.enumSides.open,this.grid[e][i-1].east=this.enumSides.open,void this.buildMaze(e,i-1)):void 0)))},findPath:function(e){var i=0;return e.north==this.enumSides[void 0]&&this.isPathFree("north",e,e.x-1,e.y)?i++:e.north==this.enumSides[void 0]&&(e.north=this.enumSides.wall),e.south==this.enumSides[void 0]&&this.isPathFree("south",e,e.x+1,e.y)?i++:e.south==this.enumSides[void 0]&&(e.south=this.enumSides.wall),e.east==this.enumSides[void 0]&&this.isPathFree("east",e,e.x,e.y+1)?i++:e.east==this.enumSides[void 0]&&(e.east=this.enumSides.wall),e.west==this.enumSides[void 0]&&this.isPathFree("west",e,e.x,e.y-1)?i++:e.west==this.enumSides[void 0]&&(e.west=this.enumSides.wall),i},isPathFree:function(e,i,n,t){if(i[e]==this.enumSides.block)return!1;var s=this.grid[n][t];return s.tile!=this.enumTile.deadend&&s.tile!=this.enumTile.corridor&&(s.tile==this.enumTile[void 0]||s.tile==this.enumTile.exit)},setDoorDirection:function(e){switch(Math.floor(4*Math.random()+1)){case 1:this.makeDoors(0,Math.floor(Math.random()*e),e-1,Math.floor(Math.random()*e));break;case 2:this.makeDoors(e-1,Math.floor(Math.random()*e),0,Math.floor(Math.random()*e));break;case 3:this.makeDoors(Math.floor(Math.random()*e),0,Math.floor(Math.random()*e),e-1);break;case 4:this.makeDoors(Math.floor(Math.random()*e),e-1,Math.floor(Math.random()*e),0)}},makeDoors:function(e,i,n,t){var s=this.grid[e][i];s.tile=this.enumTile.entrance,s.status=this.enumStatus.visible,this.entrance={x:e,y:i},(s=this.grid[n][t]).tile=this.enumTile.exit,this.exit={x:n,y:t}},showFeedback:function(e,i){this.feedback.string=e,this.feedback.node.opacity=255,this.feedback.node.color=i},update:function(e){0<this.feedback.node.opacity&&(this.feedback.node.opacity-=100*e,this.feedback.node.opacity<0&&(this.feedback.node.opacity=0)),this.running&&(this.timeToRun-=e,this.timeToRun<0&&(this.startRunning(),this.run(this.size)))}});cc._RF.pop()},{}],inventoryController:[function(e,i,n){"use strict";cc._RF.push(i,"417d1Ks4C1G6rI6w1DtonjZ","inventoryController"),cc.Class({extends:cc.Component,properties:{inventoryFire:cc.Label,inventoryIce:cc.Label,inventoryAcid:cc.Label,inventoryElectricity:cc.Label,inventorySpikes:cc.Label,inventoryPoison:cc.Label,inventoryPotion:cc.Label,popups:[cc.Node]},onEnable:function(){this.updateLabel("fire"," Shield"),this.updateLabel("ice"," Shield"),this.updateLabel("acid"," Shield"),this.updateLabel("electricity"," Shield"),this.updateLabel("spikes"," Shield"),this.updateLabel("poison"," Shield"),this.updateLabel("potion","")},start:function(){},updateLabel:function(e,i){var n=this.jsUcfirst(e);this["inventory"+n].string=n+i+": "+window.gameSession.inventory[e]+"/"+window.gameSession.inventory[e+"Max"]},jsUcfirst:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},close:function(){this.node.active=!1,window.gameGlobals.popup=!1},open:function(){for(var e=0;e<this.popups.length;e++)this.popups[e].active=!1;this.node.active=!0,window.gameGlobals.popup=!0}}),cc._RF.pop()},{}],tutorialController:[function(e,i,n){"use strict";cc._RF.push(i,"eb052hXqyVDe45o+9GyjV2u","tutorialController"),cc.Class({extends:cc.Component,properties:{sprite:cc.Sprite,tutorial:[cc.SpriteFrame]},start:function(){this.index=0,this.initSession()},verifyUpdate:function(e){0==e.major&&1==e.minor&&this.updateV2()},initSession:function(){if(this.loadGame(),window.gameGlobals={},null!=window.gameSession)return window.gameSession.saveVersion||(window.gameSession.saveVersion={major:0,minor:1,fix:0}),void this.verifyUpdate(window.gameSession.saveVersion);window.gameSession={},window.gameSession.xp=0,window.gameSession.hp=3,window.gameSession.hpMax=3,window.gameSession.level=1,window.gameSession.levelMin=1,window.gameSession.levelMax=1,window.gameSession.treasures=0,window.gameSession.treasureHunter=!1,window.gameSession.traps=0,window.gameSession.trapFinder=!1,window.gameSession.inventory={},window.gameSession.inventory.fire=0,window.gameSession.inventory.fireMin=0,window.gameSession.inventory.fireMax=3,window.gameSession.inventory.ice=0,window.gameSession.inventory.iceMin=0,window.gameSession.inventory.iceMax=3,window.gameSession.inventory.acid=0,window.gameSession.inventory.acidMin=0,window.gameSession.inventory.acidMax=3,window.gameSession.inventory.electricity=0,window.gameSession.inventory.electricityMin=0,window.gameSession.inventory.electricityMax=3,window.gameSession.inventory.spikes=0,window.gameSession.inventory.spikesMin=0,window.gameSession.inventory.spikesMax=3,window.gameSession.inventory.poison=0,window.gameSession.inventory.poisonMin=0,window.gameSession.inventory.poisonMax=3,window.gameSession.inventory.potion=0,window.gameSession.inventory.potionMin=0,window.gameSession.inventory.potionMax=3,window.gameSession.upgrades={},window.gameSession.upgrades.fireMin=1e3,window.gameSession.upgrades.fireMax=1e3,window.gameSession.upgrades.iceMin=1e3,window.gameSession.upgrades.iceMax=1e3,window.gameSession.upgrades.acidMin=1e3,window.gameSession.upgrades.acidMax=1e3,window.gameSession.upgrades.electricityMin=1e3,window.gameSession.upgrades.electricityMax=1e3,window.gameSession.upgrades.spikesMin=1e3,window.gameSession.upgrades.spikesMax=1e3,window.gameSession.upgrades.poisonMin=1e3,window.gameSession.upgrades.poisonMax=1e3,window.gameSession.upgrades.potionMin=1e3,window.gameSession.upgrades.potionMax=1e3,window.gameSession.upgrades.hpMax=1e3,window.gameSession.upgrades.levelMin=1e3,window.gameSession.upgrades.info=1e3,window.gameSession.saveVersion=saveVersion},loadGame:function(){window.gameSession=JSON.parse(cc.sys.localStorage.getItem("gameSession"))},next:function(){this.index++,this.index>=this.tutorial.length?this.skip():this.sprite.spriteFrame=this.tutorial[this.index]},skip:function(){cc.director.loadScene("gameScene")},updateV2:function(){window.gameSession.treasures=0,window.gameSession.traps=0,window.gameSession.treasureHunter=!1,window.gameSession.trapFinder=!1,window.gameSession.saveVersion={major:0,minor:2,fix:0}}}),cc._RF.pop()},{}],upgradeController:[function(e,i,n){"use strict";cc._RF.push(i,"c4e2cji+KROBamtHwGOccSx","upgradeController");cc.Class({extends:cc.Component,properties:{grid:cc.Node,button:cc.Prefab,dungeonXP:cc.Label,inventoryFire:cc.Label,inventoryIce:cc.Label,inventoryAcid:cc.Label,inventoryElectricity:cc.Label,inventorySpikes:cc.Label,inventoryPoison:cc.Label,inventoryPotion:cc.Label,popups:[cc.Node]},start:function(){this.setButtons()},onEnable:function(){this.checkSecretPassage(),this.checkTrapFinder(),this.checkTreasureHunter()},setButtons:function(){window.gameSession&&(this.createButton("Fire Protection","fireMin","fire"),this.createButton("Ice Protection","iceMin","ice"),this.createButton("Acid Protection","acidMin","acid"),this.createButton("Electricity Protection","electricityMin","electricity"),this.createButton("Spikes Protection","spikesMin","spikes"),this.createButton("Poison Protection","poisonMin","poison"),this.createButton("Fire Pocket","fireMax",null),this.createButton("Ice Pocket","iceMax",null),this.createButton("Acid Pocket","acidMax",null),this.createButton("Electricity Pocket","electricityMax",null),this.createButton("Spikes Pocket","spikesMax",null),this.createButton("Poison Pocket","poisonMax",null),this.createButton("Starting Potion","potionMin","potion"),this.createButton("Potion Pocket","potionMax",null),this.createButton("Max HP","hpMax",null),this.createSecretPassageButton(),this.checkSecretPassage(),this.createTrapFinderButton(),this.checkTrapFinder(),this.createTreasureHunterButton(),this.checkTreasureHunter())},createTreasureHunterButton:function(){var e=cc.instantiate(this.button);e.parent=this.grid,(this.treasureHunter=e).getChildByName("Name").getComponent(cc.Label).string="Treasure Hunter",e.getChildByName("Value").getComponent(cc.Label).string=0,e.getChildByName("Price").getComponent(cc.Label).string=1e4;var i=new cc.Component.EventHandler;i.target=this.node,i.component="upgradeController",i.handler="upgradeTreasureHunter",e.getComponent(cc.Button).clickEvents.push(i)},checkTreasureHunter:function(){99<window.gameSession.treasures&&!window.gameSession.treasureHunter&&this.treasureHunter?this.treasureHunter.active=!0:this.treasureHunter&&(this.treasureHunter.active=!1)},upgradeTreasureHunter:function(e){var i=e.target;1e4<=window.gameSession.xp&&(window.gameSession.xp-=1e4,this.dungeonXP.string="XP: "+window.gameSession.xp,window.gameSession.treasureHunter=!0,i.getChildByName("Value").getComponent(cc.Label).string=1,i.getChildByName("Price").getComponent(cc.Label).string=1e4,this.saveGame()),this.checkTreasureHunter()},createTrapFinderButton:function(){var e=cc.instantiate(this.button);e.parent=this.grid,(this.trapFinder=e).getChildByName("Name").getComponent(cc.Label).string="Trap Finder",e.getChildByName("Value").getComponent(cc.Label).string=0,e.getChildByName("Price").getComponent(cc.Label).string=1e4;var i=new cc.Component.EventHandler;i.target=this.node,i.component="upgradeController",i.handler="upgradeTrapFinder",e.getComponent(cc.Button).clickEvents.push(i)},checkTrapFinder:function(){99<window.gameSession.traps&&!window.gameSession.trapFinder&&this.trapFinder?this.trapFinder.active=!0:this.trapFinder&&(this.trapFinder.active=!1)},upgradeTrapFinder:function(e){var i=e.target;1e4<=window.gameSession.xp&&(window.gameSession.xp-=1e4,this.dungeonXP.string="XP: "+window.gameSession.xp,window.gameSession.trapFinder=!0,i.getChildByName("Value").getComponent(cc.Label).string=1,i.getChildByName("Price").getComponent(cc.Label).string=1e4,this.saveGame()),this.checkTrapFinder()},createSecretPassageButton:function(){var e=cc.instantiate(this.button);e.parent=this.grid,(this.secretPassage=e).getChildByName("Name").getComponent(cc.Label).string="Secret Passage",e.getChildByName("Value").getComponent(cc.Label).string=window.gameSession.levelMin,window.gameSession.upgrades.levelMin||(window.gameSession.upgrades.levelMin=1e3),e.getChildByName("Price").getComponent(cc.Label).string=window.gameSession.upgrades.levelMin;var i=new cc.Component.EventHandler;i.target=this.node,i.component="upgradeController",i.handler="upgradeSecretPassage",e.getComponent(cc.Button).clickEvents.push(i)},checkSecretPassage:function(){window.gameSession.levelMin+5<window.gameSession.levelMax&&this.secretPassage?this.secretPassage.active=!0:this.secretPassage&&(this.secretPassage.active=!1)},upgradeSecretPassage:function(e){var i=e.target;window.gameSession.xp>=window.gameSession.upgrades.levelMin&&(window.gameSession.xp-=window.gameSession.upgrades.levelMin,this.dungeonXP.string="XP: "+window.gameSession.xp,1==window.gameSession.levelMin?window.gameSession.levelMin=5:window.gameSession.levelMin+=5,i.getChildByName("Value").getComponent(cc.Label).string=window.gameSession.levelMin,window.gameSession.upgrades.levelMin+=1e3,i.getChildByName("Price").getComponent(cc.Label).string=window.gameSession.upgrades.levelMin,this.saveGame()),this.checkSecretPassage()},createButton:function(e,i,n){var t=cc.instantiate(this.button);t.parent=this.grid,t.getChildByName("Name").getComponent(cc.Label).string=e,null!=window.gameSession.inventory[i]?t.getChildByName("Value").getComponent(cc.Label).string=window.gameSession.inventory[i]:t.getChildByName("Value").getComponent(cc.Label).string=window.gameSession[i],t.getChildByName("Price").getComponent(cc.Label).string=window.gameSession.upgrades[i],t.field=i,t.item=n;var s=new cc.Component.EventHandler;s.target=this.node,s.component="upgradeController",s.handler="upgrade",t.getComponent(cc.Button).clickEvents.push(s)},upgrade:function(e){var i=e.target,n=i.field;window.gameSession.xp>=window.gameSession.upgrades[n]&&(window.gameSession.xp-=window.gameSession.upgrades[n],this.dungeonXP.string="XP: "+window.gameSession.xp,null!=window.gameSession.inventory[n]?(window.gameSession.inventory[n]+=1,i.getChildByName("Value").getComponent(cc.Label).string=window.gameSession.inventory[n],i.item&&this.giveItem(i.item)):(window.gameSession[n]+=1,i.getChildByName("Value").getComponent(cc.Label).string=window.gameSession[n]),window.gameSession.upgrades[n]+=1e3,i.getChildByName("Price").getComponent(cc.Label).string=window.gameSession.upgrades[n],this.saveGame())},giveItem:function(e){window.gameSession.inventory[e]+1<=window.gameSession.inventory[e+"Max"]&&window.gameSession.inventory[e]++},saveGame:function(){cc.sys.localStorage.setItem("gameSession",JSON.stringify(window.gameSession))},close:function(){this.node.active=!1,window.gameGlobals.popup=!1},open:function(){for(var e=0;e<this.popups.length;e++)this.popups[e].active=!1;this.node.active=!0,window.gameGlobals.popup=!0}});cc._RF.pop()},{}]},{},["deathController","gridController","inventoryController","tutorialController","upgradeController"]);