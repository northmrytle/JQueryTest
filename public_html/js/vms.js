/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//'use strict';

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
    console.log('$(document).ready');
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onReady();
    };                          
});


function onDeviceReady(){
    console.log('onDeviceReady');
    onReady();
};


function onReady(){ 
    console.log('onReady');
    try{
//        displayTitle();
        displayLayout();
//        displayControlPanel();
//        startSpeed();
//        document.getElementById('');
//        $("#main").on("swipeleft",swipeleftHandler);
//        $("#main").on("swiperight",swiperightHandler);
//        $(".gaugeFrame").draggable();
//        $(".displayFrame").draggable();
//        $(".warningFrame").draggable();
//        $(".graphFrame").draggable();
//        document.getElementById('page1').style.height = viewHeight - 40;
//        setDisplayMode(localStorage.displayMode);
        startInstrumentation();
//        setSwipeParameters();
//        $("#main").on('taphold', toggleDisplayMode);
    }
    catch(err){
        console.log('error initializing app');
        console.log(err); 
        };
 };
 
  
//window.onresize = function() {
//    resize();
//};

$.mobile.loading().hide();


function setSwipeParameters(){
//    console.log('setSwipeParameters');
    $.event.special.swipe.scrollSupressionThreshold = 10;       // More than this horizontal displacement, and we will suppress scrolling.
    $.event.special.swipe.horizontalDistanceThreshold = 15;     // Swipe horizontal displacement must be more than this.
    $.event.special.swipe.durationThreshold = 750;              // More time than this, and it isn't a swipe.
    $.event.special.swipe.verticalDistanceThreshold = 50;       // Swipe vertical displacement must be less than this.
};



function displayTitle(){
        
    var parent = document.getElementById('main');
    var header = document.createElement('div');
    header.setAttribute('id', 'appHeader');
    header.className = 'appHeader';
    header.innterHTML = '';
    parent.appendChild(header);
    
    var title = document.createElement('div');
    title.setAttribute('id', 'appTitle');
    title.className = 'appTitle';
    title.innerHTML = 'NMM VMS';
    header.appendChild(title);
    
    var menuButton = document.createElement('div');
    menuButton.setAttribute('id', 'appMenuButton');
    menuButton.className = 'appMenuButton';
    menuButton.innerHTML = "<img src='img/menu_lines.png' height='25px' width='25px'/>";
    menuButton.addEventListener('click', displaySettingsMenu, false);
    header.appendChild(menuButton);   
    
};


//function displayMenu(){
//    var dialog = new vmsDialog(parent, 
//                        'Settings', 
//                        '',
//                        function OK(){});
//                        
//    text = document.createElement('div');
//    text.innerHTML = 'Screen Saver';
//    dialog.appendChild(text);           
//    
//    menuSwitch = document.createElement('input');
//    menuSwitch.id = "screensaver-flipswitch2";
//    dialog.appendChild(menuSwitch);
//    $("#screensaver-flipswitch2").flipswitch({mini: true});
//    $("#screensaver-flipswitch2").change(toggleScreenSaver);
//    $("#screensaver-flipswitch2").prop( "checked", screenSaver).flipswitch( "refresh" );
//    
//    document.getElementById('dialogYes').innerHTML = 'OK';
//};


function toggleScreenSaver() {
    console.log('checkbox changed');
    cb = document.getElementById('screensaver-flipswitch2');
    screenSaver = cb.checked;
    if (cb.checked) {
        enableScreenSaver();
    } else {
        disableScreenSaver();
    };  
 };


function enableScreenSaver(){
    console.log('enableScreenSaver()');
    try{
        window.plugins.insomnia.allowSleepAgain();
    } catch (err){
        console.log(err.toString());
    };
};


function disableScreenSaver(){
    console.log('disableScreenSaver()');
    try{
        window.plugins.insomnia.keepAwake();
    } catch (err) {
        console.log(err.toString());
    };
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
//    controls.push( new vmsDisplay('page1', 'ff1', 'Fuel Flow Port', 'flow.sensor1.flowCount0','0.4755096','GPH',0,0,75,viewWidth*.50-5,5,5));   //.0005 * .264172 * 3600
    controls.push( new vmsGauge('page1', 'ff1a', 'GPH Port', 'flow.sensor1.flowCount0',0.4755096,0,30,viewWidth*.45,viewWidth *.45,80,5) );
//    controls.push( new vmsDisplay('page1', 'th1', 'Total Hours Port','flow.sensor1.flowTime1',1/3600000,'Hours',1,0,75,viewWidth*.50-5,viewWidth*.75,5) );
//    controls.push( new vmsDisplay('page1', 'tf1', 'Total Fuel Port','flow.sensor1.flowCount1','0.000132086', 'Gallons',1,1,75,viewWidth*.50-5,viewWidth*.75+75,5) );           //.0005 * .264172
//        
//    controls.push( new vmsDisplay('page1', 'ff2', 'Fuel Flow Stbd','flow.sensor2.flowCount0','0.4755096', 'GPH',1,1,75,viewWidth*.50,5,viewWidth*.50) );           //.0005 * .264172
//    controls.push( new vmsGauge('page1', 'ff2a', 'GPH Stbd', 'flow.sensor2.flowCount0',0.4755096,0,30,viewWidth*.45,viewWidth *.45,80,viewWidth*.50) );
//    controls.push( new vmsDisplay('page1', 'th2', 'Total Hours Stbd','flow.sensor2.flowTime1',1/3600000,'Hours',1,1,75,viewWidth*.50,viewWidth*.75,viewWidth*.50) );           //.0005 * .264172
//    controls.push( new vmsDisplay('page1', 'tf2', 'Total Fuel Stbd','flow.sensor2.flowCount1','0.000132086', 'Gallons',1,1,75,viewWidth*.50,viewWidth*.75+75,viewWidth*.50) );           //.0005 * .264172
//    
//    
////    controls.push( new vmsWarning('page1', 'fl1', 'FL', 'flow.sensor1.flowCount0',0.4755096,10,60,60,viewWidth*.75+35,viewWidth-85) );
//
//    controls.push( new vmsGraph('page1', 'ff1b', 'Fuel Flow Port','flow.sensor1.flowCount0',0.4755096,0,30,75,viewWidth-8,viewWidth*.75+147,5) );
//    controls.push( new vmsGraph('page1', 'ff2b', 'Fuel Flow Stbd','flow.sensor2.flowCount0',0.4755096,0,30,75,viewWidth-8,viewWidth*.75+220,5) );
//  
//    controls.push( new vmsDisplay('page2', 'rg1', 'Range', '0',0.4755096,'Miles',0,0,75,viewWidth*.50-5,5,5) );   //.0005 * .264172 * 3600
//    controls.push( new vmsDisplay('page2', 'sp2', 'Speed','curspeed',2.23694,'MPH',1,1,75,viewWidth*.50,5,viewWidth*.50) );
//    controls.push( new vmsGauge('page2', 'sp1', 'MPH', 'curspeed', 2.23694,0,90,viewWidth*.75,viewWidth*.75,80,viewWidth * .125) );
//    controls.push( new vmsDisplay('page2', 'as2', 'Average Speed A','0',1,'MPH',1,1,75,viewWidth*.50-5,viewWidth*.75+95,5) );           //.0005 * .264172
//    controls.push( new vmsDisplay('page2', 'sp4', 'Average Speed B','0',1,'MPH',1,1,75,viewWidth*.50-5,viewWidth*.75+95,viewWidth*.50) );           //.0005 * .264172
//    controls.push( new vmsGraph('page2', 'sp3', 'Speed', 'curspeed',2.23694,0,90,150,viewWidth-10,viewWidth*.75+165,5) );
//    
//    $('#page2').hide();
}; 

 
 function startInstrumentation(){
    console.log('startInsrumentation()');
//    getSystemName();
//    updateStatus();
//    updateValues();
//    setInterval('getSystemName()', 1000);
//    setInterval('updateStatus()', 1000);
    setInterval('updateGauge()', 500);
//    ajaxSetup();
    console.log('done startInstumentation()');
};
 

function updateGauge(){
    console.log('updateGauge');
    range = 30; //maxValue - minValue;
    newValue = Math.floor((Math.random() * 30) + 1);
    newValue = Number(newValue);
    newValue = newValue.toFixed(2) - (range/2) ;
    increment = 270 / range;
    gauge = document.getElementById("ff1");
    needle = gauge.getById("needle");
//    needle.animate({transform: ["R", newValue * increment, 150/2, 150/2 ]}, 750, "<>");
//    value = newValue;    
    console.log('done update gauge');
}


function updateValues(){
//    console.log('updateValues()');
//    console.log(baseURL + '/flow/1');
    $.ajax({
        url: baseURL + '/flow', 
        timeout: ajaxTimeout,
        dataType: 'json',
        success: function(data){
            flow = data;
            },
        error: function(data){
            for ( i = 0; i <= 6; i++) {
                flow['flowCount' + i] = 0;
            };
            flow['flowCalibration'] = 1;
            console.log("error retreiving flow data " + data);
        }
    });

//    sensors = Object.keys(flowCounts);
//    console.log(sensors);
//    Object.keys(flowCounts).forEach(function(key){
//        console.log(key);
//        });

    Object.keys(controls).forEach(function(key){
        var control = controls[key];
//        console.log("key" + key);
//        console.log("name " + control.name);
//        console.log("dataPath " + control.dataPath);
        
        if (control.dataPath.includes('http')){
//            console.log('data path includes http ' + control.dataPath);
            $.ajax({
                url: control.dataPath, 
                timeout: ajaxTimeout,
                success: function(data){
//                    console.log(control.dataPath + ' value ' + JSON.parse(data).value);
//                    console.log(control.dataPath + ' data.value ' + JSON.parse(data).value);
                    control.setValue(JSON.parse(data).value);
                    },
                error: function(){
                    console.log("error updating " + control.name + ' ' + control.type);
                    control.setValue(0);
                    }
                });
            } else {
//                console.log(control.dataPath + ' value ' + eval(control.dataPath));
                control.setValue(eval(control.dataPath));            
            };
    }); 
//    console.log('done updatingValues()');
};


function setDisplayMode(newMode){
    console.log('setDisplayMode(' + newMode + ')');
    displayMode = newMode;
    document.getElementById('main').className = displayMode;  
    try {
        localStorage.displayMode = displayMode;
        console.log('successfully saved mode to localStorage');
    } catch(err) {
        console.log('could not save displayMode to localStorage');
    };
};


function toggleDisplayMode(){
    console.log('toggleDisplayMode ' + displayMode);
    if (displayMode === 'day') {          
        setDisplayMode('night');
    } else {
        setDisplayMode('day');
    };
    try {
        localStorage.displayMode = displayMode;
    } catch(err) {
        console.log('could not save displayMode');
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


function removeElementById(element){
    var e = document.getElementById(element);
    e.parentNode.removeChild(e);
};


function isNumeric(n) { 
      return !isNaN(parseFloat(n)) && isFinite(n); 
};


function swipeleftHandler(event){
//    alert('swipeleftHandler');
//    displaySettingsMenu();
    $('#page2').show('slide', { direction: 'right' }, 500); 
    $('#page1').hide('slide', { direction: 'left' }, 500); 
};


function swiperightHandler(event){
//    alert('swiperightHandler');
//    toggleDisplayMode();
    $('#page1').show('slide', { direction: 'left' }, 500); 
    $('#page2').hide('slide', { direction: 'right' }, 500); 
};


function getLayout(){
    console.log("getLayout");

    var controlStrings = localStorage.getItem("controlStrings");
    console.log(controlStrings);
    var controlStrings = JSON.parse(controlStrings);
    console.log(controlStrings);
    
    Object.keys(controlStrings).forEach(function(key){
        
        var controlString = JSON.parse(controlStrings[key]);

        switch(controlString.type){
            case 'gauge':
//                console.log('adding gauge control');
                controls.push(new vmsGauge(
                        controlString.parentElement, 
                        controlString.id, 
                        controlString.name, 
                        controlString.dataPath, 
                        controlString.factor,
                        controlString.minValue,
                        controlString.maxValue,
                        controlString.height,
                        controlString.width,
                        controlString.top,
                        controlString.left));
                break;
            case 'display':
//                console.log('adding display control');
                controls.push(new vmsDisplay(
                        controlString.parentElement,
                        controlString.id, 
                        controlString.name, 
                        controlString.dataPath, 
                        controlString.factor, 
                        controlString.units,
                        controlString.allowReset,
                        controlString.allowCalibrate,
                        controlString.height,
                        controlString.width,
                        controlString.top,
                        controlString.left));
                break; 
            case 'warning':
//                console.log('adding warning control');
                controls.push(new vmsWarning(
                        controlString.parentElement,
                        controlString.id,
                        controlString.name, 
                        controlString.dataPath, 
                        controlString.factor,
                        controlString.thresholdValue,
                        controlString.height,
                        controlString.width,
                        controlString.top,
                        controlString.left));
                break;
            case 'graph':
//                console.log('adding graph control');
                controls.push(vmsGraph(
                        controlString.parentElement,
                        controlString.id,
                        controlString.name,
                        controlString.dataPath, 
                        controlString.factor, 
                        controlString.minValue, 
                        controlString.maxValue, 
                        controlString.height, 
                        controlString.width,
                        controlString.top,
                        controlString.left));
        };

    });
    console.log('done adding controls');
};


function saveLayout(){
    console.log("saveLayout");
    
    var controlStrings = [];
    
    Object.keys(controls).forEach(function(key){
        var control = controls[key];
        controlStrings[key] = control.getJSONString();
        console.log("getJSONstring()" + control.getJSONString());
    });

    localStorage.removeItem("controlStrings");
    localStorage.setItem("controlStrings", JSON.stringify(controlStrings));
};


function getSystemName(){
//    console.log('getSystemName()');
    $.ajax({
        url: baseURL + '/config/localNetwork', 
        timeout: ajaxTimeout,
        success: function(data){
            document.getElementById('appTitle').innerHTML = JSON.parse(data).ssid.trim().toUpperCase() + '';},
        error: function(){
            document.getElementById('appTitle').innerHTML = 'NMA VMS';}
    });    
};