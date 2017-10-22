/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

//var displays = [];
//var timeoutId = 0;
//var timeout = 0;

function nmaDisplay (
        parentElement,
        id, 
        name, 
        dataPath, 
        factor, 
        units,
        allowReset,
        allowCalibrate,
        height,
        width,
        top,
        left){
           
//        console.log ('vmsDisplay(' + 
//                    parentElement + ', ' +
//                    id + ', ' +
//                    name + ', ' +
//                    dataPath +', ' + 
//                    factor + ', ' +
//                    units + ', ' +
//                    allowReset + ', ' +
//                    allowCalibrate + ', ' +
//                    height + ', ' +  
//                    width + ', ' +
//                    top + ', ' + 
//                    left + ')');       
           
    this.type = 'display';
    this.parentElement = parentElement;
    this.id = id;
    this.name = name;
    this.dataPath = dataPath; 
    this.factor = factor;
    this.units = units;
    this.allowReset = allowReset;
    this.allowCalibrate = allowCalibrate;
    this.height = height;
    this.width = width;
    this.top = top;
    this.left = left;
    this.value = 0;
    this.calibrationFactor = 1;
    
    this.parameters = {
        'type': 'display',
        'parentElement': parentElement,
        'name': this.name,
        'dataPath': this.dataPath,
        'factor': this.factor,
        'units': this.units,
        'allowReset': this.allowReset,
        'allowCalibrate': this.allowCalibrate,
        'height': this.height,
        'width': this.width,
        'top': this.top,
        'left': this.left
        };
    
    this.JSONString = JSON.stringify(this.parameters);
    
    this.parent = document.getElementById(parentElement);
    this.frame = document.createElement('div');
    
    this.frame.setAttribute('id', id);
    this.frame.className = 'displayFrame';
    this.frame.style.position = 'absolute';
    this.frame.style.top = top + 'px';
    this.frame.style.left = left + 'px';
    this.parent.appendChild(this.frame);
    
    this.display = Raphael( id, width, height);
    
    this.display.rect(2, 2, width -10, height-10, 5).attr({
            "stroke-width": 6,
            "stroke": "#737373",
            "fill": "#000000"
            });   
            
    this.display.rect(2, 2, width -10, height-10, 5).attr({
            "stroke-width": 6,
            "stroke": "#737373"
            });    
    
    this.display.rect(1, 3, width -10, height -10, 5).attr({
            "stroke-width": 1,
            "stroke": "#e6e6e6"
            });    
    
    //Title Display
    this.display.text(width/2 + 5, height * .10 + 5, name).attr({
        "stroke-width": 1,
        "fill": "white",
        "stroke": "#ffffff",
        "font-size": Math.min(height/8, width/8)
    });
    
    //Value Display
    this.valueDisplay = this.display.text(width/2 + 5, height/2, "0").attr({
        "stroke-width": 1,
        "fill": "white",
        "stroke": "#ffffff",
        "font-size": Math.min(height/3, width/3)
    });
       
    //Units Display
    this.display.text(width/2 + 5, height * .80, units).attr({
        "stroke-width": 1,
        "fill": "white",
        "stroke": "#ffffff",
        "font-size": Math.min(height/8, width/8)
    });
    
    $(this.frame).on('taphold', calibrateX);
    $(this.frame).on('click', resetX);
    
    
    function calibrateX(){
//        console.log('calibrateX');
        if (allowCalibrate === 1){
            calibrate(dataPath, factor, name);
        };    
    };
    
    
    function resetX(){
//        console.log('resetX');
        if (allowReset === 1){
            reset();
        }
    }
    
        
    function reset(){
//        console.log('reset');
        if (localNetworkStatus === 'up'){
//            console.log('local network is up');
            displayResetForm();
        } else {
        var dialog = new vmsDialog(parent, 
            'Reset Error',
            'Cannot reset ' + name + '.  The device is not connected.',
            function(){});  
            document.getElementById('dialogYes').innerHTML = 'OK';
        };
    };
    
    
    function displayResetForm(){
//        console.log ('displayResetForm');
        if (allowReset === 1) {          
            var dialog = new vmsDialog(parent, 
                            'Reset', 
                            'Are you sure you want to reset ' + name + '?',
                            resetYes, 
                            resetNo);         
        };            
    };
       
    
    function resetYes(){
//        console.log('resetYes ' + dataPath);
//        console.log('dataPath ' + baseURL + '/' +  dataPath.replace(/\./g, '/'));
        var sendData = {value: 0};
        $.ajax({
            url: baseURL + '/' + dataPath.replace(/\./g, '/'),
            timeout: ajaxTimeout,
            type: 'PUT',
            data: JSON.stringify(sendData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function() {
//                console.log('updated counter ' + JSON.stringify(sendData));
            },
            error: function(){
                console.log('could not update coutner ' + JSON.stringify(sendData));
            }
        });
    };
     
     
    function resetNo(){
//        console.log('resetNo');
    };
    
   
//    $(this.frame).click(
//        function() {
//            if (this.zoom != true) {
//            $(this).animate({ 'zoom': 2.0 }, 400);
//            this.zoom = true;   
//        
//            }else{
//            $(this).animate({ 'zoom': 1.0 }, 400);
//            this.zoom = false;    
//            };
//    });
    
    
    this.setValue = function(newValue){
//        console.log('setValue ' + newValue);
//        console.log('cf ' + flowCounts.calibrationFactor);
        newValue = Number(newValue) * Number(this.factor);// * eval(dataPath + ' * calibrationFactor' );
        newValue = Math.floor(newValue * 10)/10;
        newValue = newValue.toFixed(1);
        this.valueDisplay.attr("text", newValue);
        this.value = newValue;
    };
       
};



    