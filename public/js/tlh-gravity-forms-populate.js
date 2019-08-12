"use strict";

var GRAV_FIELDS = [
	"utm_source",
	"utm_campaign",
	"utm_medium",
	"cmgfrm",
	"uadgroup",
	"originalreferrer",
	"uadcampgn",
	"utm_term",
	"utm_content",
	"gclid",
	"lpvariant",
	"mkt1",
	"mkt2"
];
var SEARCH_ENGINES = ["bing", "google", "yahoo"]; // Helpers

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");

	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");

		if (pair[0] == variable) {
			return pair[1];
		}
	}

	return false;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function handleUtmSource() {
	var originalRef = Cookies.get("originalreferrer")
		? Cookies.get("originalreferrer")
		: document.referrer
		? document.referrer
		: window.location.host;

	if (
		SEARCH_ENGINES.some(function(substr) {
			return originalRef.includes(substr);
		})
	) {
		return "Organic";
	} else if (
		(originalRef.includes(window.location.hostname) &&
			originalRef.indexOf(window.location.hostname) < 10) ||
		originalRef.includes("eloqua")
	) {
		return "Direct";
	} else if (
		originalRef.toLowerCase().includes("instagram.com") ||
		window.navigator.userAgent.toLowerCase().includes("instagram")
	) {
		return "IG";
	} else {
		return "Referring";
	}
} // Begin main functionality

GRAV_FIELDS.forEach(function(element) {
	var cookieVal = false; // if (!Cookies.get(element)) {

	if (element === "originalreferrer") {
		cookieVal = document.referrer ? document.referrer : window.location.host;
	} else {
		cookieVal = getQueryVariable(element);
	} // }

	if (cookieVal && element != "originalreferrer") {
		Cookies.set(element, cookieVal);
	} else if (cookieVal && element === "originalreferrer") {
		if (!document.referrer.startsWith(location.origin) && document.referrer) {
			Cookies.set(element, cookieVal);
		} else if (!document.referrer) {
			Cookies.set(element, cookieVal);
		}
	}
});

if (document.readyState !== "loading") {
	console.log("document is already ready");
	gravityFields();
} else {
	document.addEventListener("DOMContentLoaded", function() {
		console.log("document was not ready");
		gravityFields();
	});
}

function gravityFields() {
	GRAV_FIELDS.forEach(function(element) {
		var cookieVal = Cookies.get(element);
		var getVal = getQueryVariable(element);
		var field = document.querySelectorAll('[data-populate="' + element + '"]');

		if (field && !field.value) {
			field.forEach(function(value, i) {
				// common logic to check cookie and get variable for each item first
				if (cookieVal) {
					field[i].value = cookieVal;
				} else if (getVal) {
					field[i].value = getVal;
				} else if (element === "originalreferrer") {
					// extra handling for originalreferrer if cookie or get are not set
					field[i].value = window.location.hostname;
				} else if (element === "utm_source") {
					// extra handling for utm_source if cookie or get are not set
					field[i].value = handleUtmSource();
				}
			});
		} // end field
	});
	var orderIdField = document.querySelectorAll('[data-populate="orderid"]');

	if (orderIdField) {
		orderIdField.forEach(function(value, i) {
			var date = new Date();
			var dateMonth = date.getMonth() + 1;
			orderIdField[i].value =
				"" +
				date.getFullYear() +
				dateMonth +
				date.getDate() +
				date.getHours() +
				date.getMinutes() +
				date.getSeconds() +
				getRandomInt(0, 99999);
		});
	}
}
