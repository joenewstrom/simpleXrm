// JavaScript source code
/// <reference path="C:\DynamicsCRM\Scripts\simpleXrm.js" />

simpleXrmRest = {};

simpleXrmRest.fakeIt = function () {
    /// <summary>
    ///Low grade JSON Polyfill as per MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON#Methods 
    ///Seriously folks, it's 2014, your browser should support native JSON.
    ///</summary>
    if (!window.JSON) {
        console.log("It is not 1991 anymore. Please retire your Apple II or CalecoVision and use a browser that supports JSON.")
        window.JSON = {
            parse: function (sJSON) { return eval("(" + sJSON + ")"); },
            stringify: function (vContent) {
                if (vContent instanceof Object) {
                    var sOutput = "";
                    if (vContent.constructor === Array) {
                        for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
                        return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
                    }
                    if (vContent.toString !== Object.prototype.toString) {
                        return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\"";
                    }
                    for (var sProp in vContent) {
                        sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ",";
                    }
                    return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
                }
                return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
            }
        };
    }
    Xrm.Page.alertDialog("I pity the fool that doesn't update his browser! Tell your administrator to upgrade your CalecoVision so you can log onto Prodigy.net.");
}

simpleXrmRest.parseDate = function (k, v) {
    /// <summary>simpleXrmRest.parseDate() uses regex to parse the date field response string and return a js date object instead.</summary>
    debugger;
    var a;
    if (typeof v === 'string') {
        a = /Date\(([-+]?\d+)\)/.exec(v);
        if (a) {
            return new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
        }
    }
    return v;
}

simpleXrmRest.XHR = function (a) {
    /// <summary>simpleXrmRest.XHR creates a new XMLHttpRequest object and submits it to the REST endpoint.</summary>
    var oDataUri = Xrm.Page.context.getClientUrl();
    if (simpleXrm.valid(oDataUri)) {
        oDataUri += "/XRMServices/2011/OrganizationData.svc/" + a.query.toString();
        if (window.XMLHttpRequest) {
            XHR = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            XHR = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            simpleXrm.error("We encountered an unexpected issue. Please check your form data before proceeding. Info for Admin: User's browser may not support one of the requested scripts. Please attempt using FireFox or IE 8+");
            return null;
        }
        XHR.open("GET", encodeURI(oDataUri), false);
        XHR.setRequestHeader("Accept", "application/json");
        XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        XHR.onreadystatechange = a.callback;
        XHR.send();
    }
}

simpleXrmRest.buildQuery = function (a) {
    /// <summary>simpleXrmRest.buildQuery() constructs a query directed at the OData endpoint using parameters.</summary>
    /// <param name="e" type="String">The primary entity set (e.g. "ContactSet") for the OData query.</param>
    /// <param name="s" type="String">The $select query parameter typically constructed using simpleXrm.oData.select().</param>
    /// <param name="f" type="String">The $filter query parameter typically constructed using simpleXrm.oData.filter().</param>
    /// <param name="o" type="String">The $orderby query parameter typically constructed using simpleXrm.oData.orderBy().</param>
    /// <param name="x" type="String">The $expand query parameter typically constructed using simpleXrm.oData.expand().</param>
    /// <param name="k" type="String">The $skip query parameter typically constructed using simpleXrm.oData.skip().</param>
    /// <param name="t" type="String">The $top query parameter typically constructed using simpleXrm.oData.top().</param>
    var q = "";
    var e = a.entitySet;
    var s = a.select;
    var f = a.filter;
    var o = a.orderBy;
    var x = a.expand;
    var k = a.skip;
    var t = a.top;
    if (simpleXrm.valid(e)) {
        q += e.toString() + "?";
    };
    if (simpleXrm.valid(s)) {
        q += s.toString();
    };
    if (simpleXrm.valid(f)) {
        if (simpleXrm.valid(s)) {
            q += "&"
        };
        q += f.toString();
    };
    if (simpleXrm.valid(o)) {
        if (simpleXrm.valid(s) || simpleXrm.valid(f)) {
            q += "&"
        };
        q += o.toString();
    };
    if (simpleXrm.valid(x)) {
        if (simpleXrm.valid(s) || simpleXrm.valid(f) || simpleXrm.valid(o)) {
            q += "&"
        };
        q += x.toString();
    };
    if (simpleXrm.valid(k)) {
        if (simpleXrm.valid(s) || simpleXrm.valid(f) || simpleXrm.valid(o) || simpleXrm.valid(x)) {
            q += "&"
        };
        q += k.toString();
    };
    if (simpleXrm.valid(t)) {
        if (simpleXrm.valid(s) || simpleXrm.valid(f) || simpleXrm.valid(o) || simpleXrm.valid(x) || simpleXrm.valid(k)) {
            q += "&"
        };
        q += t.toString();
    };
    return q;
}

simpleXrmRest.buildFilter = function (a, o, v) {
    /// <summary>simpleXrmRest.buildFilter() takes a set of arguments and constructs a filter conforming to the CRM OData REST API.</summary>
    /// <param name="a" type="String">The attribute that the query will use to filter results. (case sensitive)</param>
    /// <param name="o" type="String">The operator that the filter will use to filter. See list from SDK: http://msdn.microsoft.com/en-us/library/gg309461.aspx#BKMK_filter (case sensitive)</param>
    /// <param name="v" type="String">The value that the operator will use to filter against the attribute. Strings must use "'double quote'" notation. (case sensitive)</param>
    var filter = "";
    if (o === "startswith" || o === "substringof" || o === "endswith") {
        filter += o + "(" + a + "," + v + ")";
    } else {
        filter += a + " " + o + " " + v;
    }
    return filter;
}

simpleXrmRest.groupFiltersOr = function () {
    /// <summary>simpleXrmRest.groupFiltersOr() constructs a joined "OR" aggregate filter comprised of multiple oData filters.</summary>
    /// <param name="arguments[i]" type="String">An OData filter string (typically constructed using simpleXrm.oDataFilter()). (case sensitive)</param>
    return "(" + arguments.join(" or ") + ")";
}

simpleXrmRest.groupFiltersAnd = function () {
    /// <summary>simpleXrmRest.groupFiltersOr() constructs a joined "AND" aggregate filter comprised of multiple oData filters.</summary>
    /// <param name="arguments[i]" type="String">An OData filter string (typically constructed using simpleXrm.oDataFilter()). (case sensitive)</param>
    return "(" + arguments.join(" and ");
}

simpleXrmRest.filter = function () {
    /// <summary>simpleXrmRest.oDataFilter() builds and returns a $filter parameter from individual filter components and group constructors for an OData query. Multiple filters passed as arguments will be grouped "AND" by default.</summary>
    /// <param name="arguments[i]" type="String">A single or aggregate filter to be added to the filtering criteria. (case sensitive)</param>
    return "$filter=" + simpleXrm.link(arguments, " and ");
}

simpleXrmRest.select = function () {
    /// <summary>simpleXrmRest.select() builds and returns a $select parameter for attribute data from the primary entity for an OData query.</summary>
    /// <param name="arguments[i]" type="String">An attribute on the primary entity to be returned by the OData query. (case sensitive)</param>
    return "$select=" + simpleXrm.link(arguments, ",");
}

simpleXrmRest.selectFromExpanded = function (x) {
    /// <summary>simpleXrm.oData.selectFromExpanded() builds and returns an input argument for simpleXrm.oDataSelect() that handles fields from related (expanded) records.</summary>
    /// <param name="x" type="String">The name of the relationship between the primary entity and the related (expanded) entity. (case sensitive)</param>
    /// <param name="arguments[i] (where i > 0)" type="String">The name of the attribute(s) on the related (expanded) entity to be returned. Add an additional argument for each parameter from this relationship. (case sensitive)</param>
    var y = [];
    for (i = 1; i < arguments.length; i++) {
        y.push(x.toString() + "/" + arguments[i].toString());
    }
    return simpleXrm.link(y, ",");
}

simpleXrmRest.expand = function () {
    /// <summary>simpleXrmRest.expand() builds and returns an $expand parameter for a related entity in an OData query.</summary>
    /// <param name="arguments[0]" type="String">The relationship name that connects the expanded entity to the primary entity. (case sensitive)</param>
    /// <param name="arguments[i] (where i > 0)" type="String">An attribute on the expanded entity to be returned by the OData query</param>
    return "$expand=" + simpleXrm.link(arguments, ",");
}

simpleXrmRest.orderBy = function () {
    /// <summary>simpleXrmRest.orderBy() builds and returns an $orderby parameter for an OData query.</summary>
    /// <param name="arguments[0]" type="String">The name of an attribute that results should be ordered by. Optionally follow by " desc" to list in descending order.</param>
    return "$orderby=" + simpleXrm.link(arguments, ",");
}

simpleXrmRest.skip = function (n) {
    /// <summary>simpleXrmRest.skip() builds and returns a $skip parameter for an OData query.</summary>
    /// <param name="n" type="int32">The number of records to skip.</param>
    var y = "$skip=" + n.toString();
    return y;
}

simpleXrmRest.top = function (n) {
    /// <summary>simpleXrmRest.top() builds and returns a $top parameter for an OData query.</summary>
    /// <param name="n" type="int32">The number of records to select from the top of the query.</param>
    var y = "$top=" + n.toString();
    return y;
}

simpleXrmRest.queryLookup = function (a, b, c) {
    /// <summary>simpleXrmRest.queryLookup() returns the values of attributes arguments[1,2,...] from the selected record of lookup 'a'.</summary>
    /// <param name="a" type="String">The name of the lookup attribute on the primary record.</param>
    /// <param name="b" type="String">The schema name of the entity referenced in "a". (Case sensitive)</param>
    /// <param name="c" type="Array">An array containing the attribute schema name(s) of the target attribute(s) on the related lookup record. (Case sensitive)</param>
    debugger;
    var x = "guid'" + simpleXrm.cleanGuid(simpleXrm.getLookupID(a.toString())) + "'";
    var e = b + "Set";
    var b = simpleXrmRest.buildFilter(b + "Id", 'eq', x);
    var f = simpleXrmRest.filter(b);
    var s = simpleXrmRest.select(simpleXrm.link(c, ","));
    var q = simpleXrmRest.buildQuery(e, s, f);
    return q;
}