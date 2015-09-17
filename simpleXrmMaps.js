/// <summary>
/// VERSION 1.5.1 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
/// simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
/// In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
/// To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
/// 
/// simpleXrmMaps: a library to simplify remote execution of the Bing Maps REST API (requires Bing Maps Key)
/// </summary>

var simpleXrmMaps = {
    getRoute: function (o) {
        var XHR;
        var start = o.wayPoints[0];
        var end = o.wayPoints[o.wayPoints.length - 1];
        var uri = "https:\/\/ecn.dev.virtualearth.net\/REST\/v1\/Routes?";
        var route = [];
        for (var i = 0; i < o.wayPoints.length; i++) {
            var w = o.wayPoints[i];
            if (w === start || w === end) {
                route.push("wp." + i.toString() + "=" + w.toString());
            } else {
                route.push("vwp." + i.toString() + "=" + w.toString());
            }
        }
        uri += route.join("&");
        uri += "&routePathOutput=Points&output=json";
        uri += "&key=" + o.key;
        if (window.XMLHttpRequest) {
            XHR = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            XHR = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            simpleXrm.error("We encountered an unexpected issue. Please check your form data before proceeding. Info for Admin: User's browser may not support one of "
                + "the requested scripts. Please attempt using FireFox or IE 8+");
            return null;
        }
        if ("withCredentials" in XHR) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            XHR.open("GET", encodeURI(uri), true);

        } else if (typeof XDomainRequest != "undefined") {
            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            XHR = new XDomainRequest();
            XHR.open("GET", encodeURI(uri));
        } else {
            // Otherwise, CORS is not supported by the browser.
            XHR = null;
        }
        XHR.withCredentials = true;
        XHR.setRequestHeader("Accept", "application/json");
        XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        XHR.onload = o.callback;
        XHR.send();
    },
    getLocation: function (o) {
        var XHR;
        var uri = "https:\/\/ecn.dev.virtualearth.net\/REST\/v1\/Locations?";
        if (o.address) {
            uri += "q=" + o.address;
        } else {
            var query = [];
            if (o.country) {
                query.push("CountryRegion=" + o.country);
            };
            if (o.state) {
                query.push("adminDistrict=" + o.state);
            };
            if (o.city) {
                query.push("locality=" + o.city);
            };
            if (o.zip) {
                query.push("postalCode=" + o.zip);
            };
            if (o.street) {
                query.push("addressLine=" + o.street)
            };
            uri += query.join("&");

        }
        uri += "&key=" + o.key;
        if (window.XMLHttpRequest) {
            XHR = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            XHR = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            simpleXrm.error("We encountered an unexpected issue. Please check your form data before proceeding. Info for Admin: User's browser may not support one of "
                + "the requested scripts. Please attempt using FireFox or IE 8+");
            return null;
        }
        if ("withCredentials" in XHR) {
            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            XHR.open("GET", encodeURI(uri), true);

        } else if (typeof XDomainRequest != "undefined") {
            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            XHR = new XDomainRequest();
            XHR.open("GET", encodeURI(uri));
        } else {

            // Otherwise, CORS is not supported by the browser.
            XHR = null;
        }
        XHR.withCredentials = true;
        XHR.setRequestHeader("Accept", "application/json");
        XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        XHR.onload = o.callback;
        XHR.send();
    },
    parseOnReady: function (x) {
        var v = false;
        if (x.readyState === 4) {
            if (x.status === 200) {
                v = JSON.parse(x.responseText);
                if (v.resourceSets && v.resourceSets[0] && v.resourceSets[0].resources && v.resourceSets[0].resources[0]) {
                    v = v.resourceSets[0].resources[0];
                }
            }
        }
        return v;
    }
}