//require("gameanalytics");
var ga = require('gameanalytics');

var analytics = cc.Class({
    extends: cc.Component,

    properties: {

        Info_Log:true,

        Analytics_Enabled:true,

        Analytics_Initialized:{
            default:false,
            visible:false,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        // Init on start (make sure you have internet connection)
        this.Init_Analytics();
    },

    Init_Analytics(){// Force it if you're sure that you need

        if(!this.Analytics_Initialized){

            if(this.Info_Log){
                ga.GameAnalytics.setEnabledInfoLog(true);
            }

            if(!this.Analytics_Enabled){
                ga.GameAnalytics.setEnabledEventSubmission(false);
            }

            ga.GameAnalytics.configureBuild("0.5.0");
            ga.GameAnalytics.initialize("63d0bf37a3c7e7bbb8ece69373eabb43", "3f919b525355ccba0faabc45f7cd0108908abe1f");

            this.Analytics_Initialized = true;
            cc.log("Analytics is on");
        }

        window.analytics = this;

    },

    // GameAnalytics SDK initialized and ready
    Analytics_Ready(){
        return ga.GameAnalytics.isSdkReady(true, false);
    },

    Start_Analytics_Session(){
        ga.GameAnalytics.startSession(); // Start session on game start
    },

    End_Analytics_Session(){
        ga.GameAnalytics.endSessionImmediate(); // End session on game end or went to background
    },

    Get_User_ID(){
        return ga.GameAnalytics.Get_User_ID();
    },

    // Sample Game Events

    Level_Start(event_detail,scene_name){

        scene_name = scene_name || cc.director.getScene().name;

        if(this.Analytics_Ready()){
            ga.GameAnalytics.addProgressionEvent( ga.EGAProgressionStatus.Start, scene_name , event_detail );
        }
        
    },


    // Sample Game Events
    Level_Start(event_detail,scene_name){

        scene_name = scene_name || cc.director.getScene().name;

        if(this.Analytics_Ready()){
            ga.GameAnalytics.addProgressionEvent( ga.EGAProgressionStatus.Start, scene_name , event_detail );
        }
        
    },

    Level_Fail(event_detail,scene_name){

        scene_name = scene_name || cc.director.getScene().name;

        if(this.Analytics_Ready()){
            ga.GameAnalytics.addProgressionEvent( ga.EGAProgressionStatus.Fail, scene_name , event_detail);
        }
    },

    Level_Complete(event_detail,scene_name){

        scene_name = scene_name || cc.director.getScene().name;

        if(this.Analytics_Ready()){
            ga.GameAnalytics.addProgressionEvent( ga.EGAProgressionStatus.Complete, scene_name , event_detail);
        }
    },

    Design_event(event_detail, value){

        if (!value) value = -1;

        if(this.Analytics_Ready()){
            ga.GameAnalytics.addDesignEvent(event_detail, value);
        }
    },

});

module.exports = analytics;