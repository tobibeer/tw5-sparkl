/*\
title: $:/plugins/tobibeer/sparkl/widget.js
type: application/javascript
module-type: widget

The sparkl widget renders simple inline sparkline diagrams

@preserve
\*/
(function(){"use strict";var t=require("$:/core/modules/widgets/widget.js").widget,e=function(t,e){this.initialise(t,e)};e.prototype=new t;e.prototype.render=function(t,e){this.parentDomNode=t;this.nextSibling=e;this.computeAttributes();this.execute();var i=this,s,r,l,a,n,u,d,h,f,p,o,g=[],m,c,b=[],k,w,x=i.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/default");if(!i.values||!i.titles&&i.filter){return}if(i.titles){$tw.utils.each(i.wiki.filterTiddlers(i.titles,i),function(t){g.push(t)})}$tw.utils.each(i.filter?g:i.values.split(" "),function(t){if(i.filter){t=i.wiki.filterTiddlers(i.values.replace(/%title%/gm,t),i);if(!t.length||isNaN(parseFloat(t[0],10))){t=i.default||x}else{t=t[0]}}t=parseFloat(t,10);if(isNaN(t)){t=0}if(h===undefined){h=t;u=t}if(u<t){u=t}if(h>t){h=t}b.push(t)});if(!b.length){return}a=i.link||i.filter?i.link===""?i.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/link"):["false","no"].indexOf(i.link)>=0?0:1:0;d=i.max?i.max:i.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/max");if(d!=="max"){u=parseInt(d,10)}f=i.min?i.min:i.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/min");if(f!=="min"){if(f.charAt(f.length-1)==="%"){h=h-(u-h)*parseInt(f.substr(0,f.length-1),10)/100}else{h=parseInt(f,10)}}p=parseInt(i.segments,10);if(isNaN(p)){p=parseInt(i.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/segments"),10)||20}n=i.margin||i.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/margin")||0;w=i.width||i.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/width")||"3px";switch(b.length){case 1:w="1em";break;case 2:w="0.5em";break;case 3:w="0.33em";break}s=i.document.createElement("span");s.textContent=String.fromCharCode(160);l=i.classes?i.classes.split(" "):[];l.push("tc-sparkl");s.className=l.join(" ");t.insertBefore(s,e);for(m=0;m<b.length;m++){o=g[m];if(a){k=document.createElement("a");k.setAttribute("href","#"+g[m]);k.style.cursor="pointer"}else{k=document.createElement("span")}k.className="tc-sparkl-bar";k.title=o?o+" ("+b[m]+")":b[m];r=document.createElement("b");r.style.width=w;c=u===h?0:1-(b[m]-h)/(u-h);c=Math.max(0,c);c=Math.round(p*c)/p;r.style.borderTopWidth=c+"em";r.style.marginLeft=n;k.appendChild(r);s.appendChild(k)}};e.prototype.execute=function(){this.values=this.getAttribute("values");this.titles=this.getAttribute("titles");this.default=this.getAttribute("default");this.classes=this.getAttribute("class");this.min=this.getAttribute("min");this.max=this.getAttribute("max");this.segments=this.getAttribute("segments");this.width=this.getAttribute("width");this.margin=this.getAttribute("margin");this.link=(this.getAttribute("link")||"").toLowerCase();if(this.values.indexOf("%title%")>=0){this.filter=1}};e.prototype.refresh=function(){var t=this.computeAttributes();if(t.values||t.titles||t["class"]||t.default||t.min||t.max||t.width||t.margin||t.segments||t.link){this.refreshSelf();return true}else{return false}};exports.sparkl=e})();