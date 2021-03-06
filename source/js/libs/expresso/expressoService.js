import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

var ExpressoService = new function() {

	var service;

	this.startService = function() {
		var that = this;
		if (this.service != undefined) {


			this.service.startService(	function(r){ that.handleSuccess(r)},
									function(e){ that.handleError(e)});
		} else {
			console.log("SERVICE - UNDEFINED");
		}
	};

	this.stopService = function() {
		var that = this;
		if (this.service != undefined) {
				this.service.stopService(	function(r){ that.handleSuccess(r)},
										function(e){ that.handleError(e)});
			} else {
			console.log("SERVICE - UNDEFINED");
		}
	};

	this.enableTimer = function() {
		var that = this;
		// VERIFY NEW MESSAGES EVERY 5 MINUTES - 300000
		if (this.service != undefined) {
				this.service.enableTimer(	120000, 
									function(r){ that.handleSuccess(r)},
									function(e){ that.handleError(e)});
			} else {
			console.log("SERVICE - UNDEFINED");
		}
		
	};

	this.disableTimer = function() {
		var that = this;
		if (this.service != undefined) {
				this.service.disableTimer(	function(r){ that.handleSuccess(r)},
									function(e){ that.handleError(e)});
			} else {
			console.log("SERVICE - UNDEFINED");
		}
			
	};
	 			
	this.registerForBootStart = function() {
		var that = this;
		if (this.service != undefined) {
			this.service.registerForBootStart(	function(r){ that.handleSuccess(r)},
											function(e){ that.handleError(e)});
		} else {
			console.log("SERVICE - UNDEFINED");
		}
	};

	this.deregisterForBootStart = function() {
		var that = this;
		if (this.service != undefined) {
			this.service.deregisterForBootStart(	function(r){ that.handleSuccess(r)},
												function(e){ that.handleError(e)});
		} else {
			console.log("SERVICE - UNDEFINED");
		}
	};

	this.registerForUpdates = function() {
		var that = this;
		if (this.service != undefined) {
			this.service.registerForUpdates(	function(r){ that.handleSuccess(r)},
											function(e){ that.handleError(e)});
		} else {
			console.log("SERVICE - UNDEFINED");
		}
	};

	this.deregisterForUpdates = function() {
		var that = this;
		if (this.service != undefined) {
			this.service.deregisterForUpdates(	function(r){ that.handleSuccess(r)},
											function(e){ that.handleError(e)});
		} else {
			console.log("SERVICE - UNDEFINED");
		}
	};

	this.handleSuccess = function(r) {

	};

	this.handleError = function(e) {

	};

	this.setConfig = function(apiURL,auth,username,password) {

		var that = this;
		
		var config = { 
			"auth" : auth,
			"apiURL" : apiURL,
			"username" : username,
			"password" : password 
		};

		if (this.service != undefined) {
			this.service.setConfiguration(	config,
										function(r){ that.handleSuccess(r)},
										function(e){ that.handleError(e)});
		}
	
		
	};

}

export default ExpressoService;
