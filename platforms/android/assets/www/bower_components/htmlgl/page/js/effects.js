window.addEventListener("DOMContentLoaded",function(){function P(){if(window.HTMLGL.scrollY>1e3){_+=.1;var r=Math.cos(_),s=Math.sin(_*.8),o=[];for(var u=0;u<k.length;u++)n[u]&&o.push(k[u]);var a=o.indexOf(N);if(a!==-1)e.sprite.filters=[N],o.splice(a,1);else if(e.sprite.filters){var f=e.sprite.filters.indexOf(N);f!==-1&&(e.sprite.filters=null)}A.filters=o.length>0?o:null,i.x=_*10,i.y=_*10,t.render(L)}requestAnimationFrame(P)}var e=document.getElementsByTagName("html-gl")[1],t=window.HTMLGL.renderer,n=[!0,!1,!1,!1,!1,!1,!1,!1,!1,!1,!1],r=new dat.GUI({}),i=new PIXI.TilingSprite.fromImage("assets/img/displacement_map.jpg");window.HTMLGL.stage.addChild(i);var s=new PIXI.filters.DisplacementFilter(i),o=r.addFolder("Displacement");o.add(n,"0").name("apply"),o.add(s.scale,"x",1,200).name("scaleX"),o.add(s.scale,"y",1,200).name("scaleY"),o.open();var u=new PIXI.filters.BlurFilter,a=r.addFolder("Blur");a.add(n,"1").name("apply"),a.add(u,"blurX",0,32).name("blurX"),a.add(u,"blurY",0,32).name("blurY");var f=new PIXI.filters.InvertFilter,l=r.addFolder("Invert");l.add(n,"2").name("apply"),l.add(f,"invert",0,1).name("Invert");var c=new PIXI.filters.PixelateFilter,h=r.addFolder("Pixelate");h.add(n,"3").name("apply"),h.add(c.size,"x",1,32).name("PixelSizeX"),h.add(c.size,"y",1,32).name("PixelSizeY");var p=new PIXI.filters.GrayFilter,d=r.addFolder("Gray");d.add(n,"4").name("apply"),d.add(p,"gray",0,1).name("Gray");var v=new PIXI.filters.SepiaFilter,m=r.addFolder("Sepia");m.add(n,"5").name("apply"),m.add(v,"sepia",0,1).name("Sepia");var g=new PIXI.filters.TwistFilter,y=r.addFolder("Twist");y.add(n,"6").name("apply"),y.add(g,"angle",0,10).name("Angle"),y.add(g,"radius",0,1).name("Radius"),y.add(g.offset,"x",0,1).name("offset.x"),y.add(g.offset,"y",0,1).name("offset.y");var b=new PIXI.filters.DotScreenFilter,w=r.addFolder("DotScreen");w.add(n,"7").name("apply"),w.add(b,"angle",0,10),w.add(b,"scale",0,1);var E=new PIXI.filters.ColorStepFilter,S=r.addFolder("ColorStep");S.add(n,"8").name("apply"),S.add(E,"step",1,100),S.add(E,"step",1,100);var x=new PIXI.filters.CrossHatchFilter,T=r.addFolder("CrossHatch");T.add(n,"9").name("apply");var N=new PIXI.filters.RGBSplitFilter;N.blue=new PIXI.Point(10,10),N.green=new PIXI.Point(-10,10),N.red=new PIXI.Point(10,-10);var C=r.addFolder("RGB Splitter");C.add(n,"10").name("apply");var k=[s,u,f,c,p,v,g,b,E,x,N],L=window.HTMLGL.stage,A=e.sprite;L.interactive=!0;var O=100,M=new PIXI.Rectangle(-O,-O,window.HTMLGL.renderer.width+O*2,window.HTMLGL.renderer.height+O*2);s.scale.x=25,s.scale.y=25;var _=0,D=!1;t.render(L),requestAnimationFrame(P)});