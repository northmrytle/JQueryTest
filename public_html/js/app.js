/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var viewHeight = document.documentElement.clientHeight;
var viewWidth = document.documentElement.clientWidth;

var displayMode = 'day';  
var screenSaver = true;
var demoMode = false;

var localNetworkStatus = 'disabled';
var remoteNetworkStatus = 'disabled';

var controls = [];
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
//    console.log('onReady()');
    try{
        ajaxSetup();
        getSystemName();
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

        setInterval('updateValues()', 500);
        setSwipeParameters();
        initSettings();
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
//    console.log("displayDefaultLayout");

//    controls.push( new nmaGauge('dashBoard1', 'ff1a', 'GPH Port', 'flow.sensor1.counts.count0',0.4755096,0,30,viewWidth*.45,viewWidth *.45,80,5) );
//    controls.push( new nmaGauge('dashBoard2', 'sp1', 'MPH', 'curspeed', 2.23694,0,90,viewWidth*.75,viewWidth*.75,80,viewWidth * .125) );
    
    controls.push( new nmaDisplay('dashBoard1', 'ff1', 'Fuel Flow Port', 'flow.sensor1.counts.count0','0.4755096','GPH',0,0,75,viewWidth*.50-5,5,5));   //.0005 * .264172 * 3600
    controls.push( new nmaGauge('dashBoard1', 'ff1a', 'GPH Port', 'flow.sensor1.counts.count0',0.4755096,0,30,viewWidth*.45,viewWidth *.45,80,10) );
    controls.push( new nmaDisplay('dashBoard1', 'th1', 'Total Hours Port','flow.sensor1.times.time1',1/3600000,'Hours',1,0,75,viewWidth*.50-5,viewWidth*.75,5) );
    controls.push( new nmaDisplay('dashBoard1', 'tf1', 'Total Fuel Port','flow.sensor1.counts.count1','0.000132086', 'Gallons',1,1,75,viewWidth*.50-5,viewWidth*.75+75,5) );           //.0005 * .264172
        
    controls.push( new nmaDisplay('dashBoard1', 'ff2', 'Fuel Flow Stbd','flow.sensor2.counts.count0','0.4755096', 'GPH',0,0,75,viewWidth*.50,5,viewWidth*.50) );           //.0005 * .264172
    controls.push( new nmaGauge('dashBoard1', 'ff2a', 'GPH Stbd', 'flow.sensor2.counts.count0',0.4755096,0,30,viewWidth*.45,viewWidth *.45,80,viewWidth*.50+10) );
    controls.push( new nmaDisplay('dashBoard1', 'th2', 'Total Hours Stbd','flow.sensor2.times.time1',1/3600000,'Hours',1,0,75,viewWidth*.50,viewWidth*.75,viewWidth*.50) );           //.0005 * .264172
    controls.push( new nmaDisplay('dashBoard1', 'tf2', 'Total Fuel Stbd','flow.sensor2.counts.count1','0.000132086', 'Gallons',1,1,75,viewWidth*.50,viewWidth*.75+75,viewWidth*.50) );           //.0005 * .264172
    
    controls.push( new nmaWarning('dashBoard1', 'fl1', 'FL', 'flow.sensor1.counts.count0',0.4755096,10,60,60,viewWidth*.75+35,viewWidth-85) );

    controls.push( new nmaGraph('dashBoard1', 'ff1b', 'Fuel Flow Port','flow.sensor1.counts.count0',0.4755096,0,30,75,viewWidth-8,viewWidth*.75+147,5) );
    controls.push( new nmaGraph('dashBoard1', 'ff2b', 'Fuel Flow Stbd','flow.sensor2.counts.count0',0.4755096,0,30,75,viewWidth-8,viewWidth*.75+220,5) );
  
    controls.push( new nmaDisplay('dashBoard2', 'rg1', 'Range', '0',0.4755096,'Miles',0,0,75,viewWidth*.50-5,5,5) );   //.0005 * .264172 * 3600
    controls.push( new nmaDisplay('dashBoard2', 'sp2', 'Speed','curspeed',2.23694,'MPH',0,0,75,viewWidth*.50,5,viewWidth*.50) );
    controls.push( new nmaGauge('dashBoard2', 'sp1', 'MPH', 'curspeed', 2.23694,0,90,viewWidth*.75,viewWidth*.75,80,viewWidth * .125) );
    controls.push( new nmaDisplay('dashBoard2', 'as2', 'Average Speed A','0',1,'MPH',1,0,75,viewWidth*.50-5,viewWidth*.75+95,5) );           //.0005 * .264172
    controls.push( new nmaDisplay('dashBoard2', 'sp4', 'Average Speed B','0',1,'MPH',1,0,75,viewWidth*.50-5,viewWidth*.75+95,viewWidth*.50) );           //.0005 * .264172
    controls.push( new nmaGraph('dashBoard2', 'sp3', 'Speed', 'curspeed',2.23694,0,90,150,viewWidth-10,viewWidth*.75+165,5) );
    
    
    $('#dashBoard2').hide();
}; 


function setSwipeParameters(){
//    console.log('setSwipeParameters');
    $.event.special.swipe.scrollSupressionThreshold = 10;       // More than this horizontal displacement, and we will suppress scrolling.
    $.event.special.swipe.horizontalDistanceThreshold = 10;     // Swipe horizontal displacement must be more than this.
    $.event.special.swipe.durationThreshold = 750;              // More time than this, and it isn't a swipe.
    $.event.special.swipe.verticalDistanceThreshold = 50;       // Swipe vertical displacement must be less than this.
};


function swipeleftHandler(event){
//    console.log('swipeleftHandler');
    $('#dashBoard2').show('slide', { direction: 'right' }, 500); 
    $('#dashBoard1').hide('slide', { direction: 'left' }, 500); 
};


function swiperightHandler(event){
//    console.log('swiperightHandler');
    $('#dashBoard1').show('slide', { direction: 'left' }, 500); 
    $('#dashBoard2').hide('slide', { direction: 'right' }, 500); 
};


function updateNetworkStatus() {
//    console.log('updateNetworkStatus()');
    $.ajax({
        url: baseURL + '/config/remoteStatus', 
        timeout: ajaxTimeout,
        success: function(data){
            //if (data.toString().substring(0,2) === 'up'){
            if (JSON.parse(data).status === 'up'){
                document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusUp';
                remoteNetworkStatus = 'up';}
            else if (JSON.parse(data).status === 'disabled'){
                document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusDisabled';
                remoteNetworkStatus = 'disabled';}
            else {
                document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusDown';
                remoteNetworkStatus = 'down';}
        },
        error: function(){
            console.log('error getting remote network status');
            document.getElementById('remoteNetworkStatus').className = 'controlPanelStatusDisabled';
            remoteNetworkStatus = 'disabled';
        }
    });
    
//    console.log(baseURL + '/config/localStatus');
    $.ajax({
        url: baseURL + '/config/localStatus', 
        timeout: ajaxTimeout,
        success: function(data){
            if (JSON.parse(data).status === 'up'){
               document.getElementById('localNetworkStatus').className = 'controlPanelStatusUp';
                localNetworkStatus = 'up';}
            else if(JSON.parse(data).status === 'disabled'){
                document.getElementById('localNetworkStatus').className = 'controlPanelStatusDisabled';
                localNetworkStatus = 'disabled';}
            else {
                document.getElementById('localNetworkStatus').className = 'controlPanelStatusDown';
                localNetworkStatus = 'down';}
            },
        error: function(){
//            console.log('error getting local network status');
            document.getElementById('localNetworkStatus').className = 'controlPanelStatusDisabled';
            localNetworkStatus = 'disbled';}
    });
    
    getSystemName();
    
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



function updateValues(){
//    console.log('updateValues()');
    if (demoMode === true){
        updateValuesDemo();
    } else {
        updateValuesDevice();
    }
};


function updateValuesDevice(){
//    console.log('updateValuesDevice');
    $.ajax({
        url: baseURL + '/flow', 
        timeout: ajaxTimeout,
        dataType: 'json',
        success: function(data){
            flow = data;
            try{
                localStorage.flow = flow;
//                console.log('successfully saved flow to local storage');
            }catch (err){
                console.log('error saving flow to local storage');
            }
            },
        error: function(data){
            var i;
            for ( i = 1; i <= 2; i++) {
                flow.sensor1.counts.count0 = 0;
                flow.sensor2.counts.count0 = 0;
                flow.sensor1.times.time0 = 0;
                flow.sensor2.times.time0 = 0;
//                flow['sensor' + i][counts]['count0'] = 0;
//                flow['sensor' + i][times]['time0'] = 0;
            };
//            flow['sensor' + i][counts]['flowCalibration'] = 1;
//            console.log("error retreiving flow data " + data);
        }
    });
    updateControlValues();
 };
    

function updateValuesDemo(){
//    console.log('updateValuesDemo');
    
    var random1 = Math.floor((Math.random() * 30) + 1);
    var time1 = 1000;
    flow.sensor1.counts.count0 = random1;
    flow.sensor1.counts.count1 += random1;
    flow.sensor1.counts.count2 += random1;
    flow.sensor1.counts.count3 += random1;
    flow.sensor1.counts.count4 += random1;
    flow.sensor1.counts.count5 += random1;
    flow.sensor1.times.time1 += time1;  
    flow.sensor1.times.time2 += time1;
    flow.sensor1.times.time3 += time1;
    flow.sensor1.times.time4 += time1;
    flow.sensor1.times.time5 += time1;
    
    var random2 = Math.floor((Math.random() * 30) + 1);
    var time2 = 1000;
    flow.sensor2.counts.count0 = random2;
    flow.sensor2.counts.count1 += random2;
    flow.sensor2.counts.count2 += random2;
    flow.sensor2.counts.count3 += random2;
    flow.sensor2.counts.count4 += random2;
    flow.sensor2.counts.count5 += random2;
    flow.sensor2.times.time1 += time2;  
    flow.sensor2.times.time2 += time2;
    flow.sensor2.times.time3 += time2;
    flow.sensor2.times.time4 += time2;
    flow.sensor2.times.time5 += time2;
    
//    curspeed = random2;
    
    updateControlValues();
};
    
    
function updateControlValues(){    
//    console.log('updateControlValues');
    var calibrationFactor;
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
                    }
                });
        } else {
            
//            console.log(control.name + ' value ' + eval(control.dataPath) + ' dataPath ' + control.dataPath);
            try{
                calibrationFactor = eval(control.dataPath.split('.').slice(0,-1).join('.') + '.calibration');
//                console.log('calibrationFactor ' + eval(calibrationFactor) );
                if (typeof calibrationFactor !== 'undefined' ){
//                    console.log('calibrationFactor ' + calibrationFactor);
//                    console.log('calibration factor found');
                } else {
                    calibrationFactor = 1;
//                    console.log('calibration NOT factor found');
                };    
            } catch (err) {
//                console.log(err);
                calibrationFactor = 1;
            };
        };
        control.setValue(eval(control.dataPath) * calibrationFactor);
    }); 
//    console.log('done updatingValues()');
};


