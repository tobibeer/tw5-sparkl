/*\
title: $:/plugins/tobibeer/sparkl/widget.js
type: application/javascript
module-type: widget

The sparkl widget renders simple inline sparkline diagrams

@preserve
\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget,
	SparklWidget = function(parseTreeNode,options) {
		this.initialise(parseTreeNode,options);
	};

/*
Inherit from the base widget class
*/
SparklWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
SparklWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.nextSibling = nextSibling;
	this.computeAttributes();
	this.execute();
	var self = this,
		box,bar,classes,link,margin,max,maxWhich,min,minWhich,
		segments,title,titles=[],v,value,values=[],wrap,width,
		fallback = self.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/default");
	// No values?
	if(!self.values || !self.titles && self.filter) {
		// Nothing to do
		return;
	}
	// Got titles?
	if(self.titles) {
		// Loop titles
		$tw.utils.each(
			self.wiki.filterTiddlers(
				// Titles filter
				self.titles,
				// In the context of this widget
				self
			), function(t) {
			// Get value
			// Add value
			titles.push(t);
		});
	}
	// Loop values
	$tw.utils.each(
		self.filter ? titles : self.values.split(" "),
		function(v) {
			if(self.filter) {
				// Execute filter against title replaced in it
				v = self.wiki.filterTiddlers(self.values.replace(/%title%/mg,v),self);
				// If no result or not a number
				if(!v.length  || isNaN(parseFloat(v[0],10))) {
					// Use defined default or global default fallback
					v = self.default || fallback;
				// All good
				} else {
					// Take first item
					v = v[0];
				}
			}
			// Get value
			v = parseFloat(v,10);
			// NaN assumed to be 0
			if(isNaN(v)) {
				v = 0;
			}
			if(min === undefined) {
				min = v;
				max = v;
			}
			if(max < v) {
				max = v;
			}
			if (min > v) {
				min = v;
			}
			// Add value
			values.push(v);
		}
	);
	// No values?
	if(!values.length) {
		// No sparkl
		return;
	}
	// Check if we're linking
	link =
		// Only when filtering for values
		self.link || self.filter ? (
			// Disabled or not specified via attribute?
			self.link === "" ?
			// Use global default
			self.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/link") :
			(
				// Otherwise, if set to disabled
				["false","no"].indexOf(self.link) >= 0 ?
				// Disable
				0 :
				// Otherwise, finally, enable
				1
			)
		) :
		0;
	// Max specified? otherwise default
	maxWhich = self.max ? self.max : self.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/max");
	if(maxWhich !== "max") {
		max = parseInt(maxWhich,10);
	}
	// Min specified? otherwise default
	minWhich = self.min ? self.min : self.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/min");
	if(minWhich !== "min") {
		// Min specified as % (of range)
		if(minWhich.charAt(minWhich.length-1) === "%") {
			// Reduce min by defined percentage of range
			min = min - (max-min)*parseInt(minWhich.substr(0,minWhich.length-1),10)/100;
		// Min is specified
		} else {
			// Take specified min
			min = parseInt(minWhich,10);
		}
	}
	segments = parseInt(self.segments,10);
	if(isNaN(segments)) {
		segments = parseInt(self.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/segments"),10) || 20;
	}
	margin = self.margin || self.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/margin") || 0;
	width = self.width || self.wiki.getTiddlerText("$:/plugins/tobibeer/sparkl/defaults/width") || "3px";
	switch(values.length) {
		case 1:
			width="1em";
			break;
		case 2:
			width="0.5em";
			break;
		case 3:
			width="0.33em";
			break;
	}
	box = self.document.createElement("span");
	box.textContent = String.fromCharCode(160);
	classes = self.classes ? self.classes.split(" ") : [];
	classes.push("tc-sparkl");
	box.className = classes.join(" ");
	parent.insertBefore(box,nextSibling);
	for(v=0; v<values.length; v++) {
		title = titles[v];
		if(link) {
			wrap = document.createElement("a");
			wrap.setAttribute("href","#" + titles[v]);
			wrap.style.cursor = "pointer";
		} else {
			wrap = document.createElement("span");
		}
		wrap.className = "tc-sparkl-bar";
		wrap.title = title ? title + " (" + values[v] + ")" : values[v];
		bar = document.createElement("b");
		bar.style.width = width;
		value = max === min ? 0 : 1- ((values[v] - min)/(max-min));
		value = Math.max(0,value);
		value = Math.round(segments*value)/segments;
		bar.style.borderTopWidth = value + "em";
		bar.style.marginLeft = margin;
		wrap.appendChild(bar);
		box.appendChild(wrap);
	}
};

/*
Compute the internal state of the widget
*/
SparklWidget.prototype.execute = function() {
	// Handle filter for sparklvalues
	this.values = this.getAttribute("values");
	this.titles = this.getAttribute("titles");
	this.default = this.getAttribute("default");
	this.classes = this.getAttribute("class");
	this.min = this.getAttribute("min");
	this.max = this.getAttribute("max");
	this.segments = this.getAttribute("segments");
	this.width = this.getAttribute("width");
	this.margin = this.getAttribute("margin");
	this.link = (this.getAttribute("link") || "").toLowerCase();
	if(this.values.indexOf("%title%") >= 0) {
		this.filter = 1;
	}
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
SparklWidget.prototype.refresh = function() {
	var changedAttributes = this.computeAttributes();
	if(
		changedAttributes.values ||
		changedAttributes.titles ||
		changedAttributes["class"] ||
		changedAttributes.default ||
		changedAttributes.min ||
		changedAttributes.max ||
		changedAttributes.width ||
		changedAttributes.margin ||
		changedAttributes.segments ||
		changedAttributes.link
	  ) {
		this.refreshSelf();
		return true;
	} else {
		return false;
	}
};

// Now we got a widget ready for use
exports.sparkl= SparklWidget;

})();