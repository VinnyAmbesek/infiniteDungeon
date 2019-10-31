var feedbackController = cc.Class({
    extends: cc.Component,

    properties: {
        defaultPosition: cc.Node,
        floorPosition: cc.Node,
        hpPosition: cc.Node,
        xpPosition: cc.Node,
        soulPosition: cc.Node,
        achievementPosition: cc.Node,

        feedbackLog: cc.Node,

        feedbackPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    showFeedbackAtNode: function(text, color, parent, stay = false, duration = 2.0, move = 100){
        let feedback = cc.instantiate(this.feedbackPrefab);
        feedback.parent = this.node;
        feedback.color = color;
        
        let position = parent.parent.convertToWorldSpaceAR(parent.position);
        position = this.node.convertToNodeSpaceAR(position);
        feedback.x = position.x;
        if (feedback.x < -231) feedback.x = -200;
        if (feedback.x > 231) feedback.x = 200;
        feedback.y = position.y;

        feedback.getComponent(cc.Label).string = text;

        // move up and change opacity
        let action;
        if (stay){
            action = cc.sequence(cc.moveBy(duration, cc.v2(0,move)), cc.fadeOut(duration), cc.callFunc(this.removeFeedback, this, feedback))
        } else {
            action = cc.sequence(cc.spawn(cc.moveBy(duration, cc.v2(0,move)), cc.fadeOut(duration)), cc.callFunc(this.removeFeedback, this, feedback))
        }
        
        feedback.runAction( action );

        //add to log
        let log = cc.instantiate(this.feedbackPrefab);
        log.parent = this.feedbackLog;
        log.getComponent(cc.Label).string = text;
        log.color = color;
    },

    showFeedback: function(text, color, location, stay = false, duration = 2.0, move = 100){
        let parent = this.defaultPosition;
        if (this.hasOwnProperty(location+"Position")) parent = this[location+"Position"];

        this.showFeedbackAtNode(text, color, parent, stay, duration);
    },

    removeFeedback: function(feedback){
        feedback.destroy();
    },

    // update (dt) {},
});

module.exports = feedbackController;