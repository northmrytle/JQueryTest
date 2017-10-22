/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

//var warnings = [];

function nmaWarning (
        parentElement,
        id,
        name, 
        dataPath, 
        factor,
        thresholdValue,
        height,
        width,
        top,
        left){

//        console.log ('vmsWarning(' + 
//                   parentElement + ', ' +
//                   id + ', ' +
//                   name + ', ' +
//                   dataPath +', ' + 
//                   factor + ', ' +
//                   thresholdValue + ', ' +
//                   height + ', ' +  
//                   width + ', ' +
//                   top + ', ' + 
//                   left + ')');       
            
    this.type = 'warning'; 
    this.parentElement = parentElement;
    this.id = id;
    this.name = name;
    this.dataPath = dataPath;
    this.factor = factor;
    this.thresholdValue = thresholdValue;
    this.height = height;
    this.width = width;
    this.top = top;
    this.left = left;
    this.value = 0;
    this.calibrationFactor = 1;
    
    this.parent = document.getElementById(parentElement);
    this.frame = document.createElement('div');
//    this.title = document.createElement('div');
//    this.units = document.createElement('div');
    
    this.frame.setAttribute('id', id);
    this.frame.className = 'warningFrame';
    this.frame.style.position = 'absolute';
    this.frame.style.top = top + 'px';
    this.frame.style.left = left + 'px';
    this.parent.appendChild(this.frame);
//    
//    this.title.setAttribute('id', name + 'WarningTitle');
//    this.title.className = 'warningTitle';
//    this.title.innerHTML = name;
//    this.frame.appendChild(this.title);
//    
//    document.getElementById(this.name + 'WarningFrame').style.position = 'absolute';
//    document.getElementById(this.name + 'WarningFrame').style.height = height + 'px';
//    document.getElementById(this.name + 'WarningFrame').style.width = width + 'px';
//    document.getElementById(this.name + 'WarningFrame').style.top = top + 'px';
//    document.getElementById(this.name + 'WarningFrame').style.left = left + 'px';
    
//    width = width + 20;
//    height = height + 20;

    this.warning = Raphael( id, width, height);
//    this.warning = Raphael( left-20, top-20, width+5, height+5);
    
    this.background = this.warning.rect(5, 5, width - 10, height - 10, 5).attr({
            "stroke-width": 6,
            "stroke": "#737373",
            "fill": "#000000"
            });   
            
    this.warning.rect(5, 5, width - 10, height - 10, 5).attr({
            "stroke-width": 6,
            "stroke": "#737373"
            });    
    
    this.warning.rect(4, 6, width - 10, height - 10, 5).attr({
            "stroke-width": 1,
            "stroke": "#e6e6e6"
            });    
    
    //Title Display
    this.warning.text(width/2 + 0, height/2 + 0, name).attr({
        "stroke-width": 1,
        "fill": "white",
        "stroke": "#ffffff",
        "font-size": Math.min(height*.4, width*.4)
    });

    
    this.setValue = function(newValue){
//        console.log("warning " + this.name + " newValue " + newValue);
        newValue = Number(newValue) * Number(this.factor);
        newValue = Math.floor(newValue * 10)/10;
        newValue = newValue.toFixed(1);
        if (newValue > this.thresholdValue){
            this.background.attr("fill", "orange");
        } else {
            this.background.attr("fill", "black");
        };
        this.value = newValue;
   };
       
    
};
