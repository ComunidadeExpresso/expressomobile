/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 *
 * @version
 * 2.0.320 (May 03 2009)
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * @license
 * This file is part of SyntaxHighlighter.
 * 
 * SyntaxHighlighter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * SyntaxHighlighter is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with SyntaxHighlighter.  If not, see <http://www.gnu.org/copyleft/lesser.html>.
 */

var dp={SyntaxHighlighter:{}};dp.SyntaxHighlighter={parseParams:function(e,t,n,r,i,s){function o(e,t){var n=new XRegExp("^"+t+"\\[(?<value>\\w+)\\]$","gi"),r=null;for(var i=0;i<e.length;i++)if((r=n.exec(e[i]))!=null)return r.value;return null}function u(e,t){return e!=null?e:t}function a(e){return e!=null?e.toString():null}var f=e.split(":"),l=f[0],c={},h={"true":"true"};reverse={"true":"false"},result=null,defaults=SyntaxHighlighter.defaults;for(var p in f)c[f[p]]="true";return t=a(u(t,defaults.gutter)),n=a(u(n,defaults.toolbar)),r=a(u(r,defaults.collapse)),s=a(u(s,defaults.ruler)),i=a(u(i,defaults["first-line"])),result={brush:l,gutter:u(reverse[c.nogutter],t),toolbar:u(reverse[c.nocontrols],n),collapse:u(h[c.collapse],r),ruler:u(h[c.showcolumns],s),"first-line":u(o(f,"firstline"),i)},result},HighlightAll:function(e,t,n,r,i,s){function o(){var e=arguments;for(var t=0;t<e.length;t++){if(e[t]===null)continue;if(typeof e[t]=="string"&&e[t]!="")return e[t]+"";if(typeof e[t]=="object"&&e[t].value!="")return e[t].value+""}return null}function u(e,t,n){var r=document.getElementsByTagName(n);for(var i=0;i<r.length;i++)r[i].getAttribute("name")==t&&e.push(r[i])}var a=[],f=null,l={},c="innerHTML";u(a,e,"pre"),u(a,e,"textarea");if(a.length===0)return;for(var h=0;h<a.length;h++){var p=a[h],d=o(p.attributes["class"],p.className,p.attributes.language,p.language),v="";if(d===null)continue;d=dp.SyntaxHighlighter.parseParams(d,t,n,r,i,s),SyntaxHighlighter.highlight(d,p)}}};