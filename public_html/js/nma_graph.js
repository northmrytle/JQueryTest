/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

//var graphs = [];

function nmaGraph(
        parentElement,
        id,
        name,
        dataPath, 
        factor, 
        minValue, 
        maxValue, 
        height, 
        width,
        top,
        left
        ){
    
//        console.log ('vmsGraph(' + 
//                    parentElement + ', ' +
//                    id + ', ' +
//                    name + ', ' +
//                    dataPath +', ' + 
//                    factor + ', ' +
//                    minValue + ', ' +
//                    maxValue + ', ' +
//                    height + ', ' + 
//                    width + ', ' +
//                    top + ', ' + 
//                    left + ')');
    
    this.type = 'graph';
    this.parentElement = parentElement;
    this.id = id; 
    this.name = name;
    this.dataPath = dataPath;
    this.factor = factor;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.height = height;
    this.width = width;
    this.top = top; 
    this.left = left;    
    this.calibrationFactor = 1;
   
    this.path = '';
    this.yValues = [];
    
    this.parent = document.getElementById(parentElement);
    this.frame = document.createElement('div');
    
    this.frame.setAttribute('id', id);
    this.frame.className = 'graphFrame';
    this.frame.style.position = 'absolute';
    this.frame.style.top = top + 'px';
    this.frame.style.left = left + 'px';
    this.parent.appendChild(this.frame);
        
    this.graph = Raphael( id, width , height);
       
    this.graph.rect(5, 5, width -10, height-10, 5).attr({
            "stroke-width": 6,
            "stroke": "#737373",
            "fill": "#000000"
            });   
            
    this.graph.rect(5, 5, width -10, height-10, 5).attr({
            "stroke-width": 6,
            "stroke": "#737373"
            });    
    
    this.graph.rect(4, 6, width -10, height -10, 5).attr({
            "stroke-width": 1,
            "stroke": "#e6e6e6"
            });    
    
    //Title Display
    this.graph.text(width/2 + 5, height * .10 + 5, name).attr({
        "stroke-width": 1,
        "fill": "white",
        "stroke": "white",
        "font-size": Math.min(height/8, width/8)
    });

    var graphWidth = width - 20;     
    var graphHeight = height;       
   
    var bX = graphHeight - 15;
    var bPath = 'M30,' + bX + 'L' + graphWidth + ',' + bX;
   
    this.graph.path(bPath).attr(
            'stroke', 'white'
            );             
    this.graph.text(20, graphHeight - 20 , "0").attr(
            'stroke', 'white'
            );
    this.graph.text(20, 30, maxValue).attr(
            'stroke', 'white'
            );
    
    this.yValues[0] = bX;
         
    this.setValue = function(newValue){

        if (this.lastValue > 0.00){
            
            if (typeof this.graphPlot !== 'undefined'){
               this.graphPlot.remove();
            };
            
            var graphWidth = width - 20;    
            var graphHeight = height;  
                                   
            var bX = graphHeight - 15;

            var scaleHeight = bX - 35;
            var scaleUnit = scaleHeight/maxValue;
            newValue = Number(newValue) * Number(this.factor);
            var newY = (newValue * scaleUnit * -1) + bX;
                        
            this.yValues.push(newY);
        
            if (this.yValues.length > (graphWidth/5) - 6 ) {
                this.yValues.shift();
            };
                 
            var path = 'M';
            var i;
            for (i = 0; i < this.yValues.length; i++){
                path += ((i * 5)+30) + ',' + (this.yValues[i]) + 'L';
  
            };         
            
            this.graphPlot = this.graph.path(path).attr(
                    'stroke', 'white');            
            
        }
        
        this.lastValue = newValue;
        
//        try {
//            console.log ('setting localstorage yvalues');
//            localStorage.setItem(this.name + 'yValues', JSONStringify(this.yValues));
//        } catch(err) {} 
     
    };
    
    
    
    
};
