/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var viewHeight = document.documentElement.clientHeight;
var viewWidth = document.documentElement.clientWidth;

var displayMode = 'day';  
var screenSaver = true;

var controls = [];
var keepAwakeState = false;
var baseURL = 'http://10.10.10.1:5002/vms/api/v1.0';

var watchID = null;
var position = null;

var ajaxTimeout = 750;

var flow = {};

$(document).ready(function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onReady();
    };                          
});


function onDeviceReady(){
    onReady();
};


function onReady(){
    console.log('onReady()');
    try{
//        displayTitle();
        ajaxSetup();
        displayLayout();
        setInterval('updateNetworkStatus()', 1000);
//        displayControlPanel();
//        startSpeed();
//        document.getElementById('');
        $("#appMain").on("swipeleft",swipeleftHandler);
        $("#appMain").on("swiperight",swiperightHandler);
////        $(".gaugeFrame").draggable();
////        $(".displayFrame").draggable();
////        $(".warningFrame").draggable();
////        $(".graphFrame").draggable();
////        document.getElementById('page1').style.height = viewHeight - 40;
//        setDisplayMode(localStorage.displayMode);
//        startInstrumentation();
        setSwipeParameters();
    }
    catch(err){
        console.log('error initializing app');
        console.log(err); 
        };
 };
 


function ajaxSetup(){
//    console.log('ajaxSetup()');
   $.ajaxSetup({'beforeSend': function(xhr){
        if (xhr.overrideMimeType)
            xhr.overrideMimeType("text/plain");
        }
    });
};



function displayLayout() {
    if (localStorage.getItem("controlStrings") === null) {
        displayDefaultLayout();
    } else {
        getLayout();   
    }; 
};    
     
    
function displayDefaultLayout(){ 
    console.log("displayDefaultLayout");

//    controls.push( new vmsGauge('page1', 'ff1a', 'GPH Port', 'flow.sensor1.flowCount0',0.4755096,0,30,viewWidth*.45,viewWidth *.45,80,5) );
//    controls.push( new vmsGauge('page2', 'sp1', 'MPH', 'curspeed', 2.23694,0,90,viewWidth*.75,viewWidth*.75,80,viewWidth * .125) );
    $('#dashBoard2').hide();
}; 


function setSwipeParameters(){
    console.log('setSwipeParameters');
    $.event.special.swipe.scrollSupressionThreshold = 10;       // More than this horizontal displacement, and we will suppress scrolling.
    $.event.special.swipe.horizontalDistanceThreshold = 10;     // Swipe horizontal displacement must be more than this.
    $.event.special.swipe.durationThreshold = 750;              // More time than this, and it isn't a swipe.
    $.event.special.swipe.verticalDistanceThreshold = 50;       // Swipe vertical displacement must be less than this.
};


function swipeleftHandler(event){
    console.log('swipeleftHandler');
    $('#dashBoard2').show('slide', { direction: 'right' }, 500); 
    $('#dashBoard1').hide('slide', { direction: 'left' }, 500); 
};


function swiperightHandler(event){
    console.log('swiperightHandler');
    $('#dashBoard1').show('slide', { direction: 'left' }, 500); 
    $('#dashBoard2').hide('slide', { direction: 'right' }, 500); 
};

function updateNetworkStatus() {
    console.log('updateNetworkStatus()');
    $.ajax({
        url: baseURL + '/config/remoteStatus', 
        timeout: ajaxTimeout,
        success: function(data){
            //if (data.toString().substring(0,2) === 'up'){
            if (JSON.parse(data).status === 'up'){
                document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusUp';}
            else if (JSON.parse(data).status === 'disabled'){
                document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusDisabled';}
            else {
                document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusDown';}},
        error: function(){
            console.log('error getting remote network status');
            document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusDisabled';}
    });
    
    console.log(baseURL + '/config/localStatus');
    $.ajax({
        url: baseURL + '/config/localStatus', 
        timeout: ajaxTimeout,
        success: function(data){
            if (JSON.parse(data).status === 'up'){
               document.getElementById('localNetworkStatus').className = 'controlPanelStatusUp';}
            else if(JSON.parse(data).status === 'disabled'){
                document.getElementById('localNetworkStatus').className = 'controlPanelStatusDisabled';}
            else {
                document.getElementById('localNetworkStatus').className = 'controlPanelStatusDown';}},
        error: function(){
            console.log('error getting local network status');
            document.getElementById('localNetworkStatus').className = 'controlPanelStatusDisabled';}
    });
    
 };
