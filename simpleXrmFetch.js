/// <reference path="C:\DynamicsCRM\Scripts\simpleXrm.js" />

var simpleXrmFetch = {
    filter: function (o) {
        /// <summary>
        /// simpleXrmFetch.filter() builds a fetchXML filter from parameterized inputs allowing for dynamic querying.
        /// sample usage: simpleXrmFetch.filter({type:"and",conditions:[{attribute:"actualvalue", operator: "gt", value:"10000"}, {attribute: "statecode", operator: "eq", value: "1"}]
        /// will build a filter that will return only records with actual value greater than 10,000 and a status of Closed Won (assuming this filter is applied against the opportunity entity).
        /// </summary>
        var f = "";
        var g = "";
        if (!!o) {
            if (o.type && !!o.conditions && o.conditions.length > 0) {
                f += "<filter type='" + o.type + "'>";
                g += "</filter>"
                for (var i = 0; i < o.conditions.length; i++) {
                    if (!!o.conditions[i].attribute && !!o.conditions[i].operator) {
                        f += "<condition attribute='" + o.conditions[i].attribute + "' operator='" + o.conditions[i].operator + "' ";
                        if (!!o.conditions[i].uiname) {
                            f += "uiname='" + o.conditions[i].uiname + "' "
                        };
                        if (!!o.conditions[i].uitype) {
                            f += "uitype='" + o.conditions[i].uitype + "' "
                        };
                        if (!!o.conditions[i].value) {
                            f += "value='" + o.conditions[i].value + "' "
                        };
                        f += "/>"
                    }
                }
                if (!!o.filter) {
                    f += simpleXrmFetch.filter(o.filter);
                }
            }
            return f + g;
        }
    },
    order: function (o) {
        var f;
        if (!!o.order && o.order.length > 0) {
            if (o.order.length > 2) {
                o.order = o.order.slice(0, 2)
            };
            for (var i = 0; i < o.order.length; i++) {
                f += "<order attribute='" + o.order[i].attribute + "'";
                if (o.order[i].descending) {
                    f += " descending='true'"
                } else {
                    f += " descending='false'"
                };
                f += " />"
            }
        }
        return f;
    },
    attributes: function (a) {
        var f = "";
        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                f += "<attribute name='" + a[i].name +"'";
                if (!!a[i].alias) {
                    f += " alias='" + a[i].alias +"'";
                }
                f += " />"
            }
        }
        return f;
    },
    linkEntity: function (a) {
        var f = "";
        var g = "";
        if (!!a && a.length > 0) {
            for (var i = 0; i < a.length; i++){
                if (!!a[i].name && !!a[i].from && !!a[i].to) {
                    f += "<link-entity name='" + a[i].name + "' from='" + a[i].from + "' to='" + a[i].to + "'";
                    g = "</link-entity>" + g;
                    if (a[i].visible === false) {
                        f += " visible='false'"
                    }
                    if (!!a[i].intersect) {
                        f += " intersect='true'"
                    }
                    if (!!a[i].alias) {
                        f += " alias='" + a[i].alias + "'"
                    }
                    f += ">";
                    if (!!a[i].attributes && a[i].attributes.length > 0) {
                        f += simpleXrmFetch.attributes(a[i].attributes);
                    }
                    if (!!a[i].filter) {
                        f+= simpleXrmFetch.filter(a[i].filter)
                    };
                    if (!!a[i].linkEntity) {
                        simpleXrmFetch.linkEntity(a[i].linkEntity)
                    }
                }
                
            }
        }
        return f + g;
    },
    fetch: function (o) {
        var f = "<fetch version='1.0' output-format='xml-platform' mapping='logical'";
        if (o.distinct) {
            f += " distinct='true'"
        } else {
            f += "distinct='false'"
        }
        f += ">";
        var g = "</fetch>"
        if (!!o.entity) {
            f += "<entity name='" + o.entity + "'>"; g = "</entity>" + g;
        }
        if (!!o.attributes && o.attributes.length > 0) {
            f += simpleXrmFetch.attributes(o.attributes)
        };
        if (!!o.filter) {
            f += simpleXrmFetch.filter(o.filter);
        };
        if (!!o.linkEntity) {
            f += simpleXrmFetch.linkEntity(o.linkEntity);
        }
        return f + g;
    },
    addCustomFilter: function (o) {
        Xrm.Page.getControl(o.control).addCustomFilter(o.filter, o.entityType);
    },
    addCustomView: function (o) {
        var viewId = o.viewId || simpleXrm.newBracedGuid();
        Xrm.Page.getControl(o.control).addCustomView(viewId, o.entityType, o.viewDisplayName, o.fetchXml, o.layoutXml, o.isDefault);
    },
    addPreSearch: function (o) {
        Xrm.Page.getControl(o.control).addPreSearch(o.preSearchHandler);
    }
}

