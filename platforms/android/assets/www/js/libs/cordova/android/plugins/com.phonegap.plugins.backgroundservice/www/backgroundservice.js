/*
 * Copyright 2013 Red Folder Consultancy Ltd
 *   
 * Licensed under the Apache License, Version 2.0 (the "License");   
 * you may not use this file except in compliance with the License.   
 * You may obtain a copy of the License at       
 * 
 * 	http://www.apache.org/licenses/LICENSE-2.0   
 *
 * Unless required by applicable law or agreed to in writing, software   
 * distributed under the License is distributed on an "AS IS" BASIS,   
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   
 * See the License for the specific language governing permissions and   
 * limitations under the License.
 */

cordova.define("com.phonegap.plugins.backgroundservice.BackgroundService",function(e,t,n){function r(){}r.prototype.create=function(t){var n=e("cordova/exec"),r=function(e){var t=e;this.getServiceName=function(){return t}};r.prototype.startService=function(e,t){return n(e,t,"BackgroundServicePlugin","startService",[this.getServiceName()])},r.prototype.stopService=function(e,t){return n(e,t,"BackgroundServicePlugin","stopService",[this.getServiceName()])},r.prototype.enableTimer=function(e,t,r){return n(t,r,"BackgroundServicePlugin","enableTimer",[this.getServiceName(),e])},r.prototype.disableTimer=function(e,t){return n(e,t,"BackgroundServicePlugin","disableTimer",[this.getServiceName()])},r.prototype.setConfiguration=function(e,t,r){return n(t,r,"BackgroundServicePlugin","setConfiguration",[this.getServiceName(),e])},r.prototype.registerForBootStart=function(e,t){return n(e,t,"BackgroundServicePlugin","registerForBootStart",[this.getServiceName()])},r.prototype.deregisterForBootStart=function(e,t){return n(e,t,"BackgroundServicePlugin","deregisterForBootStart",[this.getServiceName()])},r.prototype.isRegisteredForBootStart=function(e,t){return n(e,t,"BackgroundServicePlugin","isRegisteredForBootStart",[this.getServiceName()])},r.prototype.getStatus=function(e,t){return n(e,t,"BackgroundServicePlugin","getStatus",[this.getServiceName()])},r.prototype.runOnce=function(e,t){return n(e,t,"BackgroundServicePlugin","runOnce",[this.getServiceName()])},r.prototype.registerForUpdates=function(e,t){return n(e,t,"BackgroundServicePlugin","registerForUpdates",[this.getServiceName()])},r.prototype.deregisterForUpdates=function(e,t){return n(e,t,"BackgroundServicePlugin","deregisterForUpdates",[this.getServiceName()])};var i=new r(t);return i},n.exports=new r});