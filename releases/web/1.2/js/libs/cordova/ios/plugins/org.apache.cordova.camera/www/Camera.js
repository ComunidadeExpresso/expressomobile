/*
 *
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

cordova.define("org.apache.cordova.camera.camera",function(e,t,n){var r=e("cordova/argscheck"),i=e("cordova/exec"),s=e("./Camera"),o={};for(var u in s)o[u]=s[u];o.getPicture=function(e,t,n){r.checkArgs("fFO","Camera.getPicture",arguments),n=n||{};var o=r.getValue,u=o(n.quality,50),a=o(n.destinationType,s.DestinationType.FILE_URI),f=o(n.sourceType,s.PictureSourceType.CAMERA),l=o(n.targetWidth,-1),c=o(n.targetHeight,-1),h=o(n.encodingType,s.EncodingType.JPEG),p=o(n.mediaType,s.MediaType.PICTURE),d=!!n.allowEdit,v=!!n.correctOrientation,m=!!n.saveToPhotoAlbum,g=o(n.popoverOptions,null),y=o(n.cameraDirection,s.Direction.BACK),b=[u,a,f,l,c,h,p,d,v,m,g,y];i(e,t,"Camera","takePicture",b)},o.cleanup=function(e,t){i(e,t,"Camera","cleanup",[])},n.exports=o});