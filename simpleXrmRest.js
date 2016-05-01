/// <summary>
/// VERSION 1.5.1 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
/// simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
/// In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
/// To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
/// 
/// simpleXrmRest: a REST-based library for interfacing asynchronously with the OData REST endpoint in a modular fashion using JavaScript Objects to represent queries
/// </summary>

var simpleXrmRest = {
    fakeIt: function () {
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
        simpleXrm.timedFormWarning("It is not 1991 anymore. Please retire your Apple II or CalecoVision and use a browser that supports JSON.", 3000, "ShameOnYou");
    },
    parseDate: function (k, v) {
        /// <summary>simpleXrmRest.parseDate() uses regex to parse the date field response string and return a js date object instead.</summary>
        var a;
        if (typeof v === 'string') {
            a = /Date\(([-+]?\d+)\)/.exec(v);
            if (a) {
                return new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
            }
        }
        return v;
    },
    XHR: function (a) {
        /// <summary>
        /// simpleXrmRest.XHR creates a new XMLHttpRequest object and submits it to the REST endpoint.
        /// </summary>
        /// <param name="a" type="Object">
        /// Object containing the following properties:
        /// a.type: either "GET" or "POST" (if not specified, will default to "GET")
        /// a.method: If specified, calls a X-HTTP-Method (such as "MERGE" which will update records)
        /// a.data: when creating a record, this is the object that contains the initial values
        /// a.query: The query string to append to the base OData URI. For simplicity, this can be built with simpleXrmRest.buildQuery().
        /// a.callback: The callback function to be executed on successful response by the OData Endpoint.
        /// </param>
        if (!window.JSON) {
            simpleXrmRest.fakeIt()
        };
        var oDataUri = Xrm.Page.context.getClientUrl();
        if (simpleXrm.valid(oDataUri)) {
            oDataUri += "/XRMServices/2011/OrganizationData.svc/" + a.query.toString();
            if (window.XMLHttpRequest) {
                XHR = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                XHR = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                simpleXrm.error("We encountered an unexpected issue. Please check your form data before proceeding. Info for Admin: User's browser may not support"
                    + " one of the requested scripts. Please attempt using FireFox or IE 8+");
                return null;
            }
            var type = a.type || "GET";
            var type = type.toUpperCase();
            var data = null;
            if (type === "POST" && a.data) {
                data = window.JSON.stringify(a.data);
            }
            XHR.open(type, encodeURI(oDataUri), true);
            XHR.setRequestHeader("Accept", "application/json");
            XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            if (type === "POST" && a.method) {
                XHR.setRequestHeader("X-HTTP-Method", a.method.toUpperCase()); //use MERGE for Update statements
            }
            XHR.onreadystatechange = a.callback;
            if (!data) {
                XHR.send();
            } else {
                XHR.send(data);
            }
        }
    },
    associate: function (a) {
        var oDataUri = Xrm.Page.context.getClientUrl();
        if (simpleXrm.valid(oDataUri)) {
            oDataUri += "/XRMServices/2011/OrganizationData.svc/";
            var association = {
                uri: oDataUri + a.parentEntity + "Set(guid'" + a.parentId + "')"
            };
            simpleXrmRest.XHR({
                query: a.childEntity + "Set(guid'" + a.childId + "')/$links/" + a.childForeignKey,
                callback: function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 204 || this.status === 1223) {
                            a.callback();
                        }
                    }
                }
            });
        }
    },
    disassociate: function (a) {
        var query = a.parentEntity + "Set(guid'" + a.parentId + "')/$links/" + a.childForeignKey + "(guid'" + childId + "')";
        simpleXrmRest.XHR({
            query: query,
            type: "POST",
            method: "DELETE",
            callback: function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 204 || this.status === 1223) {
                        a.callback();
                    }
                }
            }
        });
    },
    disassociateAll: function (a) {
        var query = a.parentEntity + "Set?$select=" + a.childForeignKey + "/" + a.childPrimaryKey + "&$expand=" + a.childForeignKey + "&$filter=" + a.parentPrimaryKey + " eq guid'" + a.parentId + "'";
        simpleXrmRest.XHR({
            query: query,
            callback: function () {
                if (simpleXrmRest.parseOnReady(this)) {
                    var results = simpleXrmRest.getRetrieveMultipleResults(this);
                    if (results && results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            simpleXrmRest.disassociate({
                                parentEntity: a.parentEntity,
                                parentId: a.parentId,
                                childForeignKey: a.childForeignKey,
                                childId: results[i][a.childPrimaryKey]
                            });
                        };
                        a.callback();
                    }
                }
            }
        })
    },
    query: function (a) {
        simpleXrmRest.XHR({
            query: simpleXrmRest.buildQuery({
                entitySet: a.entity + "Set" || null,
                select: simpleXrmRest.select(a.select) || null,
                filter: simpleXrmRest.filter(a.filter) || null,
                orderBy: simpleXrmRest.orderBy(a.orderBy) || null,
                expand: simpleXrmRest.expand(a.expand) || null,
                skip: simpleXrmRest.skip(a.skip) || null,
                top: simpleXrmRest.top(a.top) || null
            }),
            type: a.type || null,
            method: a.method || null,
            data: a.data || null,
            callback: a.callback || null
        })
    },
    mapResults: function (o) {
        var map = o.map;
        var results = o.results;
        for (x in map) {
            if (!!results[x]) {
                if (typeof results[x] === "object") {
                    if (!!results[x].Value) {
                        simpleXrm.setAttVal(map[x], results[x].Value);
                    } else if (!!results[x].Id && !!results[x].Name) {
                        simpleXrm.setAttVal(map[x], simpleXrm.parseRESTLookup(results[x]));
                    } else (simpleXrm.clearAttVal(map[x]));
                } else {
                    simpleXrm.setAttVal(map[x], results[x]);
                }
            }
        }
    },
    buildQuery: function (a) {
        /// <summary>simpleXrmRest.buildQuery() constructs a query directed at the OData endpoint using parameters.</summary>
        /// <param name="a" type="Object">
        /// Object containing the following properties:
        /// a.entitySet: The schema name of the primary entity set (e.g. "ContactSet") for the OData query.
        /// a.select: The $select query parameter typically constructed using simpleXrmRest.select(),
        /// a.filter: The $filter query parameter typically constructed using simpleXrmRest.filter(),
        /// a.orderBy: The $orderby query parameter typically constructed using simpleXrmRest.orderBy(),
        /// a.expand: The $expand query parameter typically constructed using simpleXrmRest.expand(),
        /// a.skip: The $skip query parameter typically constructed using simpleXrm.oData.skip(),
        /// a.top: The $top query parameter typically constructed using simpleXrm.oData.top()
        /// </param>
        var q = "";
        var e = a.entitySet || null;
        var s = a.select || null;
        var f = a.filter || null;
        var o = a.orderBy || null;
        var x = a.expand || null;
        var k = a.skip || null;
        var t = a.top || null;
        if (e) {
            q += e.toString() + "?";
        };
        if (s) {
            q += s.toString();
        };
        if (f) {
            if (s) {
                q += "&"
            };
            q += f.toString();
        };
        if (o) {
            if (s || f) {
                q += "&"
            };
            q += o.toString();
        };
        if (x) {
            if (s || f || o) {
                q += "&"
            };
            q += x.toString();
        };
        if (k) {
            if (s || f || o || x) {
                q += "&"
            };
            q += k.toString();
        };
        if (t) {
            if (s || f || o || x || k) {
                q += "&"
            };
            q += t.toString();
        };
        return q;
    },
    buildFilter: function (a) {
        /// <summary>simpleXrmRest.buildFilter() takes a set of arguments and constructs a filter conforming to the CRM OData REST API.</summary>
        /// <param name="a" type="String">The attribute that the query will use to filter results. (case sensitive)</param>
        /// <param name="o" type="String">The operator that the filter will use to filter. See list from SDK: http://msdn.microsoft.com/en-us/library/gg309461.aspx#BKMK_filter (case sensitive)</param>
        /// <param name="v" type="String">The value that the operator will use to filter against the attribute. Strings must use "'double quote'" notation. (case sensitive)</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            var filter = "";
            if (a.operator === "startswith" || a.operator === "substringof" || a.operator === "endswith") {
                filter += a.operator + "(" + a.attribute + "," + a.value + ")";
            } else {
                filter += a.attribute + " " + a.operator + " " + a.value;
            }
            return filter;
        } else {
            return "";
        }
    },
    groupFiltersOr: function () {
        /// <summary>simpleXrmRest.groupFiltersOr() constructs a joined "OR" aggregate filter comprised of multiple oData filters.</summary>
        /// <param name="arguments[i]" type="String">An OData filter string (typically constructed using simpleXrm.oDataFilter()). (case sensitive)</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            return "(" + arguments.join(" or ") + ")";
        } else {
            return "";
        }
    },
    groupFiltersAnd: function () {
        /// <summary>simpleXrmRest.groupFiltersOr() constructs a joined "AND" aggregate filter comprised of multiple oData filters.</summary>
        /// <param name="arguments[i]" type="String">An OData filter string (typically constructed using simpleXrm.oDataFilter()). (case sensitive)</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            return "(" + arguments.join(" and ");
        } else {
            return "";
        }
    },
    filter: function () {
        /// <summary>simpleXrmRest.oDataFilter() builds and returns a $filter parameter from individual filter components and group constructors for an OData query. Multiple filters passed as arguments will be grouped "AND" by default.</summary>
        /// <param name="arguments[i]" type="String">A single or aggregate filter to be added to the filtering criteria. (case sensitive)</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            var f = [];
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === "object") {
                    f.push(simpleXrmRest.buildFilter(arguments[i]));
                } else if (typeof arguments[i] === "string") {
                    f.push(arguments[i]);
                }
            }
            return "$filter=" + simpleXrm.link(f, " and ");
        } else {
            return "";
        }
    },
    select: function () {
        /// <summary>simpleXrmRest.select() builds and returns a $select parameter for attribute data from the primary entity for an OData query.</summary>
        /// <param name="arguments[i]" type="String">An attribute on the primary entity to be returned by the OData query. (case sensitive)</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            return "$select=" + simpleXrm.link(arguments, ",");
        } else {
            return "";
        }
    },
    selectFromExpanded: function (x) {
        /// <summary>simpleXrm.oData.selectFromExpanded() builds and returns an input argument for simpleXrmRest.oDataSelect() that handles fields from related (expanded) records.</summary>
        /// <param name="x" type="String">The name of the relationship between the primary entity and the related (expanded) entity. (case sensitive)</param>
        /// <param name="arguments[i] (where i > 0)" type="String">The name of the attribute(s) on the related (expanded) entity to be returned. Add an additional argument for each parameter from this relationship. (case sensitive)</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            var y = [];
            for (var i = 1; i < arguments.length; i++) {
                y.push(x.toString() + "/" + arguments[i].toString());
            }
            return simpleXrm.link(y, ",");
        } else {
            return "";
        }
    },
    expand: function () {
        /// <summary>simpleXrmRest.expand() builds and returns an $expand parameter for a related entity in an OData query.</summary>
        /// <param name="arguments[0]" type="String">The relationship name that connects the expanded entity to the primary entity. (case sensitive)</param>
        /// <param name="arguments[i] (where i > 0)" type="String">An attribute on the expanded entity to be returned by the OData query</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            return "$expand=" + simpleXrm.link(arguments, ",");
        } else {
            return "";
        }
    },
    orderBy: function () {
        /// <summary>simpleXrmRest.orderBy() builds and returns an $orderby parameter for an OData query.</summary>
        /// <param name="arguments[0]" type="String">The name of an attribute that results should be ordered by. Optionally follow by " desc" to list in descending order.</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            return "$orderby=" + simpleXrm.link(arguments, ",");
        } else {
            return "";
        }
    },
    skip: function (n) {
        /// <summary>simpleXrmRest.skip() builds and returns a $skip parameter for an OData query.</summary>
        /// <param name="n" type="int32">The number of records to skip.</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            var y = "$skip=" + n.toString();
            return y;
        } else {
            return "";
        }
    },
    top: function (n) {
        /// <summary>simpleXrmRest.top() builds and returns a $top parameter for an OData query.</summary>
        /// <param name="n" type="int32">The number of records to select from the top of the query.</param>
        if (arguments && arguments.length > 0 && arguments[0]) {
            var y = "$top=" + n.toString();
            return y;
        } else {
            return "";
        }
    },
    queryLookup: function (a) {
        /// <summary>simpleXrmRest.queryLookup() returns the values of attributes arguments[1,2,...] from the selected record of lookup 'a'.</summary>
        /// <param name="a" type="Object">
        /// Object containing the following properties:
        /// a.lookup (string): The schema name of the lookup attribute on the primary record.
        /// a.entityType (string): The schema name of the entity being queried.
        /// a.attributes (array of strings): An array containing the schema names of all attributes on the lookup record to return.
        /// </param>
        /// <param name="b" type="String">The schema name of the entity referenced in "a". (Case sensitive)</param>
        /// <param name="a.attributes" type="Array">An array containing the attribute schema name(s) of the target attribute(s) on the related lookup record. (Case sensitive)</param>
        var x = "guid'" + simpleXrm.cleanGuid(simpleXrm.getLookupID(a.lookup.toString())) + "'";
        var e = a.entityType + "Set";
        var b = simpleXrmRest.buildFilter({ attribute: a.entityType + "Id", operator: 'eq', value: x });
        var f = simpleXrmRest.filter(b);
        var s = simpleXrmRest.select(simpleXrm.link(a.attributes, ","));
        var q = simpleXrmRest.buildQuery({ entitySet: e, filter: f, select: s });
        return q;
    },
    parseOnReady: function (x) {
        if (x.readyState === 4) {
            if (x.status === 200 || x.status === 201) {
                var a = JSON.parse(x.responseText).d;
                return a;
            }
        }
    },
    normalizeResults: function (x) {
        return simpleXrmRest.getRetrieveSingleResults(x);
    },
    getRetrieveSingleResults: function (x) {
        var y = null;
        var a = simpleXrmRest.parseOnReady(x);
        if (simpleXrm.valid(a)) {
            var b = a.results;
            var c = a.result;
            if (simpleXrm.valid(b)) {
                var d = b[0];
                if (simpleXrm.valid(d)) {
                    y = d;
                };
            } else if (simpleXrm.valid(c)) {
                y = c;
            }
        };
        return y;
    },
    getRetrieveMultipleResults: function (x) {
        var y = null;
        var a = simpleXrmRest.parseOnReady(x);
        if (simpleXrm.valid(a)) {
            var b = a.results;
            if (simpleXrm.valid(b)) {
                y = b;
            }
        };
        return y;
    },
    getCreateResults: function (x) {
        var y = null;
        var a = simpleXrmRest.parseOnReady(x);
        if (simpleXrm.valid(a)) {
            var y = a;
        }
        return y;
    },
    setPriceListPrice: function (a) {
        /// <summary>
        /// simpleXrmRest.setPriceListPrice() is an encapsulated method that calls the Product & Price List Item records that are represented by lookups on the current entity form
        /// and applies the Price List Item pricing rules as specified on the form.
        /// Sample usage: simpleXrmRest.setPriceListPrice({productLookupField:"new_product", priceListLookupField: "new_pricelist",
        /// unitPriceField: "new_unitprice", listPriceField: "new_listprice", unitField: "new_units"})
        /// Maps list price of the Product into field 'new_listprice', units from the Price List item into field 'new_units', and the calculated price in field 'new_unitprice'.
        /// </summary>
        /// <param name="a" type="object">
        /// productLookupField: a string containing the name of the attribute that represents the product lookup,
        /// priceListLookupField: a string containing the name of the attribute that represents the price list lookup,
        /// unitPriceField: a string containing the name of the attribute that represents the price per unit,
        /// listPriceField: a string containing the name of the attribute that represents the list price,
        /// unitField: a string containing the name of the attribute that represents the unit lookup,
        /// callback: a callback function to be invoked on successful completion of the operation
        /// </param>

        var c = {
            product: null || simpleXrm.getLookupID(a.productLookupField),
            pricelist: null || simpleXrm.getLookupID(a.priceListLookupField),
            unitPriceField: a.unitPriceField,
            listPriceField: a.listPriceField,
            unitField: a.unitField,
            callback: null || a.callback
        };
        if (simpleXrm.valid(c.product) && simpleXrm.valid(c.pricelist)) {
            simpleXrmRest.XHR({ //query the product
                query: simpleXrmRest.buildQuery({
                    entitySet: "ProductSet",
                    select: "$select=CurrentCost,ProductNumber,Price,StandardCost",
                    filter: "$filter=ProductId eq guid'" + c.product + "'"
                }),
                callback: function () { //x is data, y is textStatus, z is XMLHttpRequest???
                    var q = simpleXrmRest.normalizeResults(this);
                    if (simpleXrm.valid(q)) {
                        c.currentCost = simpleXrm.parseValue(q.CurrentCost.Value);
                        c.productNumber = q.ProductNumber;
                        c.listPrice = simpleXrm.parseValue(q.Price.Value);
                        c.standardCost = simpleXrm.parseValue(q.StandardCost.Value);
                        if (c.listPriceField) {
                            simpleXrm.setAttVal(c.listPriceField, c.listPrice);
                            simpleXrm.sendAttAlways(c.listPriceField);
                        }
                        simpleXrmRest.XHR({ //query the price list item
                            query: simpleXrmRest.buildQuery({
                                entitySet: "ProductPriceLevelSet",
                                select: "$select=Amount,Percentage,PricingMethodCode,UoMId,RoundingOptionCode,RoundingPolicyCode,RoundingOptionAmount",
                                filter: "$filter=(PriceLevelId/Id eq guid'" + c.pricelist + "' and ProductId/Id eq guid'" + c.product + "')"
                            }),
                            callback: function () {
                                var r = simpleXrmRest.normalizeResults(this);
                                if (r) {
                                    c.amount = simpleXrm.parseValue(r.Amount.Value);
                                    c.percentage = simpleXrm.parseValue(r.Percentage);
                                    c.pricingMethodCode = simpleXrm.parseValue(r.PricingMethodCode.Value);
                                    c.unit = simpleXrm.parseRESTLookup(r.UoMId);
                                    if (c.unitField) {
                                        simpleXrm.setAttVal(c.unitField, c.unit);
                                        simpleXrm.sendAttAlways(c.unitField);
                                    }
                                    c.roundingOptionCode = simpleXrm.parseValue(r.RoundingOptionCode.Value);
                                    c.roundingPolicyCode = simpleXrm.parseValue(r.RoundingPolicyCode.Value);
                                    c.roundingOptionAmount = simpleXrm.parseValue(r.RoundingOptionAmount);
                                    var p = null;
                                    var round = true;
                                    if (c.roundingPolicyCode == 1) {
                                        round = false;
                                    };
                                    switch (c.pricingMethodCode) {
                                        case 1:
                                            p = c.amount;
                                            round = false;
                                            break;
                                        case 2:
                                            p = c.percentage * c.listPrice / 100;
                                            break;
                                        case 3:
                                            p = ((c.percentage + 100) * c.currentCost) / 100;
                                            break;
                                        case 4:
                                            p = ((100 * c.currentCost) / (100 - c.percentage));
                                            break;
                                        case 5:
                                            p = ((c.percentage + 100) * c.standardCost) / 100;
                                            break;
                                        case 6:
                                            p = ((100 * c.standardCost) / (100 - c.percentage));
                                            break;
                                        default:
                                            p = c.listPrice;
                                    };
                                    if (round != true && simpleXrm.valid(p)) {
                                        simpleXrm.setAttVal(a.unitPriceField, p);
                                    } else if (round === true && simpleXrm.valid(p)) {
                                        var p1 = null;
                                        var p2 = null;
                                        switch (c.roundingPolicyCode) {
                                            case 2: //round up
                                                if (c.roundingOptionCode == 1) { //ends in
                                                    p1 = 10 * Math.floor(p / 10) + c.roundingOptionAmount;
                                                    if (p > p1) {
                                                        p1 += 10;
                                                    };
                                                } else if (c.roundingOptionCode == 2) { //multiple of
                                                    p1 = Math.ceil(p / c.roundingOptionAmount) * (c.roundingOptionAmount);
                                                };
                                                break;
                                            case 3: //round down
                                                if (c.roundingOptionCode == 1) { //ends in
                                                    p1 = 10 * Math.floor(p / 10) + c.roundingOptionAmount;
                                                    if (p < p1) {
                                                        p1 -= 10;
                                                    };
                                                } else if (c.roundingOptionCode == 2) { //multiple of
                                                    p1 = Math.floor(p / c.roundingOptionAmount) * (c.roundingOptionAmount);
                                                };
                                                break;
                                            case 4: //round nearest
                                                if (c.roundingOptionCode == 1) { //ends in
                                                    p1 = 10 * Math.floor(p / 10) + c.roundingOptionAmount;
                                                    if (p > p1) {
                                                        p2 = p1 + 10;
                                                    } else if (p < p1) {
                                                        p1 -= 10;
                                                        p2 = p1 + 10;
                                                    };
                                                    if (Math.abs(p - p1) > Math.abs(p - p2)) { //only concerned about the case where p2 is closer to p than p1
                                                        p1 = p2;
                                                    };
                                                } else if (c.roundingOptionCode == 2) { //multiple of
                                                    p1 = Math.round(p / c.roundingOptionAmount) * (c.roundingOptionAmount);
                                                }
                                                break;
                                            default:
                                                break; //or throw a fault here?
                                        };
                                        if (simpleXrm.valid(p1)) {
                                            p = p1;
                                        };
                                    };
                                    simpleXrm.setAttVal(c.unitPriceField, p);
                                    simpleXrm.sendAttAlways(c.unitPriceField);
                                    try {
                                        c.callback();
                                    } catch (e) {
                                        simpleXrm.timedFormError("The callback function could not be invoked.", 3000)
                                    }
                                } else {
                                    simpleXrm.timedFormError("The Price List Item could not be loaded.", 3000)
                                }
                            }
                        });
                    };
                }
            });
        };
    }
}