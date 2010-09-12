// Castle Age Monster Kill Time Estimater
// version 0.1 ALPHA!
// 2010-09-11
// Copyright (c) 2010, Dark Side Networks
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.  To install it, you need
// Greasemonkey 0.8 or later: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "City of War Wall Manager", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Castle Age Monster Kill Time Estimater
// @namespace     ca-monster-etd
// @description   Estimate time left to kill a monster
// @include       http://apps.facebook.com/castle_age/battle_monster.php*
// ==/UserScript==
// Script Settings

String.prototype.parseTimer = function() {
	var a = this.split(':'), b = 0, i;
	for (i=0; i<a.length; i++) {
		b = b * 60 + parseInt(a[i],10);
	}
	if (isNaN(b)) {
		b = 9999;
	}
  return b;
};

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
  return x1 + x2;
}

var makeTimer = function(sec) {
	var h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = Math.floor(sec % 60);
	return (h ? h+':'+(m>9 ? m : '0'+m) : m) + ':' + (s>9 ? s : '0'+s);
};


function do_it() {
var health;
var health;
var dmg = 0;
var imgs = document.getElementsByTagName("img")
var drgContainer = document.getElementsByClassName("dragonContainer")
if(drgContainer.length == 1) {
  for (var i = 0; imgs.length > i; i++) {
    // Get Health
    if(imgs[i].src.search(/nm_red\.jpg$/) != -1) {
       health = imgs[i].parentNode.style.width 
	}
    // Get Party Strength / Defense
    else if(imgs[i].src.search(/nm_green\.jpg$/) != -1) {
	  strength = imgs[i].parentNode.style.width; 
	}
  }

  var dmgRows = drgContainer[0].children[0].children[0].children[0].cells[1].childNodes[1].childNodes[1].childNodes[5].rows;
  for (var i = 0; dmgRows.length > i; i++) {
    var dmgData = dmgRows[i].children[2];
    if(dmgData != undefined) {
      dmg+= parseInt(dmgData.textContent.replace(/[^0-9\/]/g,'')) 
	}
  }
}

// Calculations
var now = Date.now();
var total = Math.ceil(100 * dmg / (health === 100 ? 0.1 : (100 - parseInt(health))));
var timer = document.getElementById("app46755028429_monsterTicker").textContent.parseTimer()
var dps = dmg / (604800 - timer);
var eta =  now + (Math.floor((total - dmg) / dps) * 1000);
var finish = now + (timer * 1000);
// Format Results
var data = "&nbsp;&nbsp;<b>Monster Health</b> " + Math.round(health.split("%")[0]) + "%<br/>" + 
			"&nbsp;&nbsp;<b>Party Strength</b> " + Math.round(strength.split("%")[0]) + "%<br/><br/>" + 

			"&nbsp;&nbsp;<b>DPS</b> " + dps.toString().split(".")[0] + "<br/>" +
			"&nbsp;&nbsp;<b>Total Damage</b> " + addCommas(dmg) + "<br/><br/>" + 

			"&nbsp;&nbsp;<b>Remaining</b> " + document.getElementById("app46755028429_monsterTicker").textContent + "<br/>" +
			"&nbsp;&nbsp;<b>ETD</b> " + makeTimer((eta - Date.now()) / 1000);

document.getElementById("ca-monster-data").innerHTML = data;
if(eta < finish) { 
	document.getElementById("ca-etd-cpanel").getElementsByTagName("h4")[0].style.background = "green";
} else {
	document.getElementById("ca-etd-cpanel").getElementsByTagName("h4")[0].style.background = "red";
}

}
function pollPage (intId) {
	console.log(intId)
	var drgContainer = document.getElementsByClassName("dragonContainer")
		if (drgContainer.length > 0) {
				clearInterval(intId);
				setTimeout(function () { doTimer(); }, 30000);
				do_it();
		}
}

function timer(intId) { 
	
	var drgContainer = document.getElementsByClassName("dragonContainer")
		if(drgContainer.length > 0) {
				pollPage(intId);
		} 
}

function doTimer() {
var intId = setInterval(function () { timer(intId); }, 3000);
}

function addGlobalStyle (css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) {
                return;
            }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }

addGlobalStyle(

			'#ca-etd-cpanel {' + 
				' -moz-border-radius-topright: 5px;' +
				' -moz-border-radius-topleft: 5px;' +
				'  position: fixed;' + 
				'  left: 20px;' + 
				'  right: 0;' + 
				'  bottom: 0;' + 
				'  top: auto;' + 
				'  background: black;' + 
				'  color: white;' + 
				'  margin: 1em 0 0 0;' + 
				'  width: 220px;' +
				'  text-align: left; ' +
				'  z-index: 99999;' +
				'  font-family: Verdana, sans-serif; }' +

			'#ca-etd-cpanel h4 {' +
				' -moz-border-radius-topright: 5px;' +
				' -moz-border-radius-topleft: 5px;' +
				'  background-color: #ff9900;' +
				'  height: 20px;' +
				'  padding-top: 5px;' +
				'  text-align: center;' +
				'  text-color: white; ' +
				'  color: white; }');

var indent = "&nbsp;&nbsp;"
desc = "<h4>Monster Death Estimator</h4><br/><span id='ca-monster-data'>Visit Monster to view Data</span>";
div = document.createElement('div');
div.id = 'ca-etd-cpanel';
div.innerHTML = desc;
document.body.style.paddingBottom = "4em";
document.body.appendChild(div);
doTimer();