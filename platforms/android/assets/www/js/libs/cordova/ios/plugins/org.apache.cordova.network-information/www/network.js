/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

cordova.define("org.apache.cordova.network-information.network",function(e,t,n){function u(){this.type="unknown"}var r=e("cordova/exec"),i=e("cordova"),s=e("cordova/channel"),o=e("cordova/utils");typeof navigator!="undefined"&&o.defineGetter(navigator,"onLine",function(){return this.connection.type!="none"}),u.prototype.getInfo=function(e,t){r(e,t,"NetworkStatus","getConnectionInfo",[])};var a=new u,f=null,l=500;s.createSticky("onCordovaConnectionReady"),s.waitForInitialization("onCordovaConnectionReady"),s.onCordovaReady.subscribe(function(){a.getInfo(function(e){a.type=e,e==="none"?f=setTimeout(function(){i.fireDocumentEvent("offline"),f=null},l):(f!==null&&(clearTimeout(f),f=null),i.fireDocumentEvent("online")),s.onCordovaConnectionReady.state!==2&&s.onCordovaConnectionReady.fire()},function(e){s.onCordovaConnectionReady.state!==2&&s.onCordovaConnectionReady.fire(),console.log("Error initializing Network Connection: "+e)})}),n.exports=a});