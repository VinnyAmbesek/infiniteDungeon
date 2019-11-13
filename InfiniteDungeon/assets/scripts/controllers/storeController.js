const InventoryController = require("inventoryController");
const HudController = require("hudController");
const DeathController = require("deathController");
const AdsController = require("adsController");

cc.Class({
    extends: cc.Component,

    properties: {
        inventoryController: InventoryController,
        hudController: HudController,
        deathController: DeathController,
        adsController: AdsController,
        grid: cc.Node,
        storeButton: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onEnable (){
        if (this.hasOwnProperty("adButton")) this.adButton.active = this.adsController.isAvailable("soul");
    },

    start () {
        this.adButton = this.createButton("10 Souls", "Sell your soul for 10 souls.", 0, "currency", "getSoul", "Watch an Ad.");
        this.adButton.active = this.adsController.isAvailable("soul");
        this.createButton("Fire Shield", "Get as many as you can carry.", 10, "fire", "fillPocket");
        this.createButton("Ice Shield", "Get as many as you can carry.", 10, "ice", "fillPocket");
        this.createButton("Acid Shield", "Get as many as you can carry.", 10, "acid", "fillPocket");
        this.createButton("Electricity Shield", "Get as many as you can carry.", 10, "electricity", "fillPocket");
        this.createButton("Spikes Shield", "Get as many as you can carry.", 10, "spikes", "fillPocket");
        this.createButton("Poison Shield", "Get as many as you can carry.", 10, "poison", "fillPocket");
        this.createButton("Potion", "Get as many as you can carry.", 50, "potion", "fillPocket");
        this.createButton("A Place to Rest", "You can continue when fully rested.", 75, "", "healing");
    },

    createButton(name, desc, price, item, handler, altPrice = ""){
        let button = cc.instantiate(this.storeButton);
        button.parent = this.grid;

        button.getChildByName("Name").getComponent(cc.Label).string = name;
        button.getChildByName("Description").getComponent(cc.Label).string = desc;
        button.getChildByName("Price").getComponent(cc.Label).string = price + " Souls";

        button.item = item;
        button.price = price;
        button.txt = name;
        if (altPrice != "") button.getChildByName("Price").getComponent(cc.Label).string = altPrice;

                //add click event
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "storeController";
        eventHandler.handler = handler;
        button.getComponent(cc.Button).clickEvents.push(eventHandler);

        return button;
    },

    fillPocket(event){
        let button = event.target;
        let item = button.item;
        let price = button.price;

        if (window.gameSession.currency < price) return;

        window.gameSession.currency -= price;
        this.hudController.updateLabel("soul", window.gameSession.currency);
        this.inventoryController.giveItem(item, window.gameSession.inventory[item+"Max"], button, button.txt, "Store");

        this.saveGame();
    },

    healing(event){
        let button = event.target;
        let item = button.item;
        let price = button.price;

        if (window.gameSession.currency < price) return;

        window.gameSession.currency -= price;
        this.hudController.updateLabel("soul", window.gameSession.currency);
        this.deathController.heal(window.gameSession.hpMax);

        this.saveGame();
    },

    getSoul(){
        this.adsController.showAd(null, "soul");
    },

    saveGame(){
        cc.sys.localStorage.setItem('gameSession', JSON.stringify(window.gameSession));
    },

    // update (dt) {},
});
