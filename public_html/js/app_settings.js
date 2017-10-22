/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function initSettings(){
    console.log('initSettings');
    $("#screenSaverOnOff").change(toggleScreenSaver);
//    $("#screenSaverOnOff").prop( "checked", screenSaver).flipswitch( "refresh" );
    $("#demoModeOnOff").change(toggleDemoMode);
//    $("#demoModeOnOff").prop( "checked", demoMode).flipswitch( "refresh" );

    $("#localNetworkPassphrase").change(updateLocalNetwork);
    $("#remoteNetworkPassphrase").change(updateRemoteNetwork);
    
    getLocalNetwork();
    getRemoteNetwork();
    
};


function toggleScreenSaver() {
//    console.log('toggle screen saver changed');
    var cb = document.getElementById('screenSaverOnOff');
    screenSaver = cb.checked;
    if (cb.checked) {
        enableScreenSaver();
    } else {
        disableScreenSaver();
    };  
 };


function enableScreenSaver(){
//    console.log('enableScreenSaver()');
    try{
        window.plugins.insomnia.allowSleepAgain();
    } catch (err){
        console.log(err.toString());
    };
};


function disableScreenSaver(){
//    console.log('disableScreenSaver()');
    try{
        window.plugins.insomnia.keepAwake();
    } catch (err) {
        console.log(err.toString());
    };
};


function toggleDemoMode() {
    console.log('demo mode checkbox changed');
    var cb = document.getElementById('demoModeOnOff');
    demoMode = cb.checked;
    if (demoMode){
        initData();
    }
 };


function getLocalNetwork(){
    $.get(baseURL + '/config/localNetwork', function(data){
        $('#localNetworkName').val(JSON.parse(data).ssid);
        $('#localNetworkPassphrase').val(JSON.parse(data).passphrase);
    });
};


function getRemoteNetwork(){
    $.get(baseURL + '/config/remoteNetwork', function(data){
        $('#remoteNetworkName').val(JSON.parse(data).ssid);
        $('#remoteNetworkPassphrase').val(JSON.parse(data).passphrase);
    });
};


function getLocalNetworkText(element){
    $.get(baseURL + 'config/localNetwork', function(data){
        var tempData = JSON.parse(data).ssid;
        element.innerHTML =  tempData;
        element.value = tempData;
    });
};


function getRemoteNetworkText(element){
    $.get('app_text/remoteNetworkText.html', function(data){
        element.innerHTML =  data;
        element.value = data;
    });
};


function getText(filePath, element){
    $.get(filePath, function(data){
        element.innerHTML =  data;
        element.value = data;
    });
};


function getSerial(element){
    $.get(baseURL + '/config/serial', function(data){
        var serial = JSON.parse(data).serial;
        element.innerHTML = 'Serial Number: ' + serial;
        element.value = serial;
    });
};



function updateLocalNetwork(){
    
    var url = baseURL + '/config/localNetwork';
    var sendData = {"ssid":  $('#localNetworkName').val(), "passphrase":  $('#localNetworkPassphrase').val()};
    $.ajax({
        url: url,
        type: 'PUT',
        data: JSON.stringify(sendData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            console.log('Updated local network ' + data);
        },
        error: function(data){
            console.log('Error updating local network ' + data);
        }
    });
 
};


function updateRemoteNetwork(){
    console.log('updateRemoteNetwork');
    var url = baseURL + '/config/remoteNetwork';
    var sendData = {"ssid":  $('#remoteNetworkName').val(), "passphrase":  $('#remoteNetworkPassphrase').val()};
    
    $.ajax({
        url: url,
        type: 'PUT',
        data: JSON.stringify(sendData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
            console.log('Updated remote network ' + data);
        },
        error: function(data) {
            console.log('error updating remote network '  + data);
        }
    });
 
};
        
