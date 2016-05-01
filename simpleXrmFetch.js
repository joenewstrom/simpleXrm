/// <summary>
/// VERSION 1.7.2 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
/// simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
/// In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
/// To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
/// 
/// simpleXrmFetch: a series of functions that allow FetchXML queries to be modeled as JavaScript Objects and compiling to FetchXML at runtime
/// </summary>

var simpleXrmFetch = {
    fetch: function (o) {
        var f = "<fetch version='1.0' output-format='xml-platform' mapping='logical'";
        if (o.distinct) {
            f += " distinct='true'"
        } else {
            f += " distinct='false'"
        };
        if (o.aggregate) {
            f+= " aggregate='true'"
        }
        f += ">";
        var g = "</fetch>"
        if (o.entity) {
            f += "<entity name='" + o.entity + "'>"; g = "</entity>" + g;
        }
        if (o.attributes && o.attributes.length > 0) {
            f += simpleXrmFetch.attributes(o.attributes)
        };
        if (o.order && o.order.length > 0) {
            f += simpleXrmFetch.order(o.order);
        };
        if (o.filter) {
            f += simpleXrmFetch.filter(o.filter);
        };
        if (o.linkEntity) {
            f += simpleXrmFetch.linkEntity(o.linkEntity);
        }
        return f + g;
    },
    attributes: function (a) {
        var f = "";
        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                f += "<attribute name='" + a[i].name + "'";
                if (!!a[i].alias) {
                    f += " alias='" + a[i].alias + "'";
                };
                if (!!a[i].aggregate) {
                    f += " aggregate='" + a[i].aggregate + "'";
                };
                f += " />"
            }
        }
        return f;
    },
    order: function (a) {
        var f = "";
        if (a && a.length > 0) {
            if (a.length > 2) {
                a = a.slice(0, 2)
            };
            for (var i = 0; i < a.length; i++) {
                f += "<order attribute='" + a[i].attribute + "'";
                if (a[i].descending) {
                    f += " descending='true'"
                } else {
                    f += " descending='false'"
                };
                f += " />"
            }
        }
        return f;
    },
    filter: function (o) {
        /// <summary>
        /// simpleXrmFetch.filter() builds a fetchXML filter from parameterized inputs allowing for dynamic querying.
        /// sample usage: simpleXrmFetch.filter({type:"and",conditions:[{attribute:"actualvalue", operator: "gt", value:"10000"}, {attribute: "statecode", operator: "eq", value: "1"}]
        /// will build a filter that will return only records with actual value greater than 10,000 and a status of Closed Won (assuming this filter is applied against the opportunity entity).
        /// </summary>
        var f = "";
        var g = "";
        if (o) {
            if (o.type && o.conditions && o.conditions.length > 0) {
                f += "<filter type='" + o.type + "'>";
                g += "</filter>"
                for (var i = 0; i < o.conditions.length; i++) {
                    var x = o.conditions[i];
                    if (x.attribute && x.operator) {
                        f += "<condition attribute='" + x.attribute + "' operator='" + o.conditions[i].operator + "'"; 
                        if (x.operator === "in" || x.operator === "not-in") {
                            if (x.values) {
                                f += ">"
                                for (var j = 0; j < x.values.length; j++) {
                                    var y = x.values[j];
                                    f += "<value";
                                    if (y.uiname) {
                                        f += " uiname='" + y.uiname + "'"
                                    };
                                    if (y.uitype) {
                                        f += " uitype='" + y.uitype + "'"
                                    };
                                    f += ">"
                                    if (y.value) {
                                        f += y.value
                                    };
                                    f += "</value>"
                                }
                                f += "</condition>"
                            }
                        } else {
                            if (o.conditions[i].uiname) {
                                f += " uiname='" + o.conditions[i].uiname + "'"
                            };
                            if (o.conditions[i].uitype) {
                                f += " uitype='" + o.conditions[i].uitype + "'"
                            };
                            if (o.conditions[i].value) {
                                f += " value='" + o.conditions[i].value + "'"
                            };
                            f += "/>"
                        }
                    }
                }
                if (o.filter) {
                    f += simpleXrmFetch.filter(o.filter);
                }
            }
            return f + g;
        }
    },
    linkEntity: function (a) {
        var f = [];
        var g = [];
        var h = [];
        if (a && a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].name && a[i].from && a[i].to) {
                    f[i] = "<link-entity name='" + a[i].name + "' from='" + a[i].from + "' to='" + a[i].to + "'";
                    g[i] = "</link-entity>";
                    if (a[i].visible === false) {
                        f[i] += " visible='false'"
                    }
                    if (a[i].intersect) {
                        f[i] += " intersect='true'"
                    }
                    if (a[i].alias) {
                        f[i] += " alias='" + a[i].alias + "'"
                    }
                    f[i] += ">";
                    if (a[i].attributes && a[i].attributes.length > 0) {
                        f[i] += simpleXrmFetch.attributes(a[i].attributes);
                    }
                    if (a[i].filter) {
                        f[i] += simpleXrmFetch.filter(a[i].filter)
                    };
                    if (a[i].linkEntity) {
                        f[i] += simpleXrmFetch.linkEntity(a[i].linkEntity)
                    }
                    h.push(f[i].toString() + g[i].toString())
                }
            }
        }
        return h.join("");
    },
    
    addCustomFilter: function (o) {
        /// <summary>
        /// simpleXrmFetch.addCustomFilter() adds a filter defined by FetchXML passed as a string to the 'filter' property of input parameter 'o' (JSON).
        /// </summary>
        /// <param name="o" type="Object/JSON">
        /// Input parameter 'o' is an object with properties "control", "filter", and "entityType".
        /// </param>
        Xrm.Page.getControl(o.control).addCustomFilter(o.filter, o.entityType);
    },
    addCustomView: function (o) {
        /// <summary>
        /// simpleXrmFetch.addCustomView() will add a custom view with Fetch XML defined by property fetchXml of input parameter 'o' (object/JSON) and with Layout XML defined by
        /// property layoutXml.
        /// </summary>
        /// <param name="o" type="Object/JSON">
        /// JavaScript Object with properties "viewId" (optional), "entityType", "viewDisplayName", "fetchXml", "layoutXml", and "isDefault", (all required).
        /// </param>
        var viewId = "";
        if (o.viewId) {
            viewId = simpleXrm.wrapGuid(o.viewId)
        } else {
            viewId = simpleXrm.newBracedGuid();
        }
        Xrm.Page.getControl(o.control).addCustomView(viewId, o.entityType, o.viewDisplayName, o.fetchXml, o.layoutXml, o.isDefault);
    },
    addPreSearch: function (o) {
        Xrm.Page.getControl(o.control).addPreSearch(o.preSearchHandler);
    }
}