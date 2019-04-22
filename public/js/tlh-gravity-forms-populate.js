const GRAV_FIELDS = [
	"utm_source",
	"utm_campaign",
	"utm_medium",
	"cmgfrm",
	"adgroup",
	"originalreferrer",
	"adcampaign",
	"utm_term",
	"utm_content",
	"gclid",
	"lpvariant",
	"mkt1",
	"mkt2"
];

const SEARCH_ENGINES = ["bing", "google", "yahoo"];

// Helpers
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
	const originalRef = Cookies.get("originalreferrer")
		? Cookies.get("originalreferrer")
		: document.referrer
		? document.referrer
		: window.location.host;
	if (SEARCH_ENGINES.some(substr => originalRef.includes(substr))) {
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
}

// Begin main functionality
GRAV_FIELDS.forEach(function(element) {
	let cookieVal = false;
	if (!Cookies.get(element)) {
		if (element === "originalreferrer") {
			cookieVal = document.referrer ? document.referrer : window.location.host;
		} else {
			cookieVal = getQueryVariable(element);
		}
	}
	if (cookieVal) {
		Cookies.set(element, cookieVal, { expires: 1 });
	}
});

document.addEventListener("DOMContentLoaded", function(event) {
	GRAV_FIELDS.forEach(function(element) {
		const cookieVal = Cookies.get(element);
		const getVal = getQueryVariable(element);
		const field = document.querySelector('[data-populate="' + element + '"]');

		if (field && !field.value) {
			// common logic to check cookie and get variable for each item first
			if (cookieVal) {
				field.value = cookieVal;
			} else if (getVal) {
				field.value = getVal;
			} else if (element === "originalreferrer") {
				// extra handling for originalreferrer if cookie or get are not set
				field.value = window.location.hostname;
			} else if (element === "utm_source") {
				// extra handling for utm_source if cookie or get are not set
				field.value = handleUtmSource();
			}
		} // end field
	});

	const orderIdField = document.querySelector('[data-populate="orderid"]');
	if (orderIdField) {
		const date = new Date();
		const dateMonth = date.getMonth() + 1;
		orderIdField.value =
			"" +
			date.getFullYear() +
			dateMonth +
			date.getDate() +
			date.getHours() +
			date.getMinutes() +
			date.getSeconds() +
			getRandomInt(0, 99999);
	}
});
