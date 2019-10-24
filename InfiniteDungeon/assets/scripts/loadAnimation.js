// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        animated: cc.Node,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.animate();
    },

    animate: function(){
        let duration = 0.1;
        let animation = cc.sequence(cc.moveBy(duration, cc.v2(-100,0)), cc.moveBy(duration*2, cc.v2(0,200)), cc.moveBy(duration*2, cc.v2(-200,0)), 
            cc.moveBy(duration*4, cc.v2(0,-400)), cc.moveBy(duration*2, cc.v2(200,0)), cc.moveBy(duration*2, cc.v2(0,200)), cc.moveBy(duration*2, cc.v2(200,0)), 
            cc.moveBy(duration*2, cc.v2(0,200)), cc.moveBy(duration*2, cc.v2(200,0)), cc.moveBy(duration*4, cc.v2(0,-400)), cc.moveBy(duration*2, cc.v2(-200,0)), 
            cc.moveBy(duration*2, cc.v2(0,200)), cc.moveBy(duration, cc.v2(-100,0)) );

        this.animated.runAction(cc.repeatForever(animation));
    },

    // update (dt) {},
});
