// Library code
var sparkControl = function(coreid, access_token) {
	this.coreid = coreid;
	this.access_token = access_token;
	
	// Set testMode = true to log communications to the javascript console
	this.testMode = false;
	
	this.lastMessageReceived = "";

	// TODO: only add this EventSource when it's needed
	this.eventSource = new EventSource("https://api.spark.io/v1/devices/" + this.coreid + "/events/?access_token=" + this.access_token);

	// TODO: Add initial connection to the device, see if it's online

}

sparkControl.prototype.sayHello = function() {
	console.log("coreid = " + this.coreid);
};

sparkControl.prototype.callFunction = function(functionName, functionArgs, callbackFunction) {
	// https://api.spark.io/v1/devices/54ff6e066667515125491467/ringDoorBell

	if ($.isFunction(callbackFunction) == 0) {
		this.logTestMessage("callFunction invalid function");
		callbackFunction = function() {}
	}

	$.ajax({
		type: "POST",
		url: "https://api.spark.io/v1/devices/" + this.coreid + "/" + functionName,
		data: {
			access_token: this.access_token,
			arg: functionArgs
		},
		success: [this.logTestMessage, callbackFunction],
		dataType: "json",
		dataFilter: function(data, type) {
			return $.parseJSON(data).return_value;
		}
	});

}

sparkControl.prototype.getVariable = function(variableName, callbackFunction) {
	// https://api.spark.io/v1/devices/54ff6e066667515125491467/ringDoorBell


	if ($.isFunction(callbackFunction) == 0) {
		callbackFunction = function() {}
	}
	
	$.ajax({
		url: "https://api.spark.io/v1/devices/" + this.coreid + "/" + variableName + "/?access_token=" + this.access_token,
		success: [this.logTestMessage, callbackFunction],
		dataType: "json",
		dataFilter: function(data, type) {
			return $.parseJSON(data).result;
		}
	});


}

sparkControl.prototype.subscribe = function(sparkEventName, callbackFunction) {
	this.eventSource.addEventListener(sparkEventName, function(eventResponse) {
		var parsedData = JSON.parse(eventResponse.data).data;
		//this.logTestMessage(eventResponse.data);
		console.log(eventResponse.data);
		if ($.isFunction(callbackFunction) == 1) {
			callbackFunction(parsedData);
		}

	});
}

sparkControl.prototype.logTestMessage = function(message) {
	this.lastMessageReceived = message;
	if (this.testMode) {
		sparkControlTestMessage(message);
	}
	console.log(message);
}

function sparkControlTestMessage (message) {
	console.log(message);
	
}




/* Doesn't work. Possibly need to call an existing function instead of creating a new one on the fly like this.
    
sparkControl.prototype.unsubscribe = function(sparkEventName, callbackFunction) {
   eventSource.removeEventListener (sparkEventName, function(eventResponse) {
     var parsedData = JSON.parse(eventResponse.data).data;
     //console.log(parsedData);
     if ($.isFunction(callbackFunction) == 1) {
       callbackFunction(parsedData);
     }
    
  });
}
*/