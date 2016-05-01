/// <summary>
/// VERSION 1.7.2 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
/// simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
/// In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
/// To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
/// 
/// simpleXrmSoap: a library to simplify interaction with the Dynamics CRM SOAP endpoint (expansion planned)
/// </summary>

var simpleXrmSoap = {
    encodeXML: function (f) {
        var line = [];
        for (i = 0; i < f.length; i++) {
            var c = f.charAt(i);
            switch (c) {
                case '<':
                    line.push('&lt;');
                    break;
                case '>':
                    line.push('&gt;');
                    break;
                case '&':
                    line.push('&amp;');
                    break;
                case '"':
                    line.push('&quot;');
                    break;
                case "'":
                    line.push('&#39;');
                    break;
                default:
                    if (c < ' ' || c > '~') {
                        line.push('&#' + c.charCodeAt(0) + ';');
                    } else {
                        line.push(c);
                    }
                    break;
            }
        }
        line = line.join('');
        return line;
    },
    decodeXML: function (f) {
        if (typeof(f) != "string") {
            f = f.toString();
        }
        return f;
    },
    request: function (a) {
        var url = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
        var XHR;
        if (window.XMLHttpRequest) {
            XHR = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            XHR = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            simpleXrm.error("We encountered an unexpected issue. Please check your form data before proceeding. Info for Admin: User's browser may not support one of "
                + "the requested scripts. Please attempt using FireFox or IE 8+");
            return null;
        };
        XHR.open("POST", encodeURI(url), true);
        XHR.setRequestHeader("Accept", "application/xml, text/xml, */*");
        XHR.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        XHR.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        XHR.onreadystatechange = a.callback;
        XHR.send(a.request);
    },
    normalizeResults: function (x) {
        var xmlDoc, parser;
        if (x.responseText) {
            if (window.DOMParser) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(x.responseText, "text/xml");
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(x.responseText);
            }
        }
        return xmlDoc;
    },
    getRetrieveMultipleResults: function (x) { //needs work :|
        var a = null;
        if (simpleXrmSoap.parseOnReady(x)) {
            a = simpleXrmSoap.parseFetchResponse(
                simpleXrmSoap.normalizeResults(x)
            )
        }
        return a;
    },
    parseFetchResponse: function (x) {
        x = x.getElementsByTagName("ExecuteResult")
        if (x && x[0]) {
            x = x[0];
            if (x.childNodes && x.childNodes[0]
                && x.childNodes.length === 2) {
                if (x.childNodes && x.childNodes[0] && x.childNodes[0].childNodes && x.childNodes[0].childNodes[0]
                    && x.childNodes[0].childNodes[0].nodeValue === "RetrieveMultiple") {
                    x = x.childNodes[1]; //Results
                    if (x.childNodes && x.childNodes[0] && x.childNodes[0].localName === "KeyValuePairOfstringanyType") {
                        x = x.childNodes[0]; //KeyValuePairOfstringanyType
                        if (x.childNodes && x.childNodes.length === 2 && x.childNodes[0].localName === "key" 
                            && x.childNodes[0].childNodes[0].nodeValue === "EntityCollection" && x.childNodes[1].localName === "value") {
                            x = x.childNodes[1]; //value
                            if (x.childNodes[1] && x.childNodes[1].childNodes) {
                                x = x.childNodes[0]; //Entities
                                if (x.childNodes && x.childNodes && x.childNodes.length > 0) {
                                    var results = [];
                                    for (var i = 0; i < x.childNodes.length; i++) {
                                        var id = x.childNodes[i].childNodes[3];
                                        var logicalName = x.childNodes[i].childNodes[5];
                                        var result = {
                                            attributes: {},
                                            id: id.childNodes[0].nodeValue,
                                            logicalName: logicalName.childNodes[0].nodeValue,
                                            relatedEntities: []
                                        }
                                        for (var j = 0; j < x.childNodes[i].childNodes[0].childNodes.length; j++) {
                                            var y = x.childNodes[i].childNodes[0].childNodes[j].childNodes[0].childNodes[0].nodeValue;
                                            var z = x.childNodes[i].childNodes[0].childNodes[j].childNodes[1].childNodes[0].nodeValue;
                                            if (!z && x.childNodes[i].childNodes[0].childNodes[j].childNodes[1] //value 
                                                && x.childNodes[i].childNodes[0].childNodes[j].childNodes[1].childNodes[0] //Value
                                                && x.childNodes[i].childNodes[0].childNodes[j].childNodes[1].childNodes[0].childNodes[0].nodeValue) {
                                                z = x.childNodes[i].childNodes[0].childNodes[j].childNodes[1].childNodes[0].childNodes[0].nodeValue;
                                                if (Number(z)) {
                                                    z = Number(z);
                                                }
                                            }
                                            result.attributes[y] = z;
                                        };
                                        results.push(result);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!results) {
            console.log("Results could not be returned from the FetchXML Request.")
        }
        return results || null; 
    },
    getFetchResults: function (x) {
        if (simpleXrmSoap.parseOnReady(x)) {
            var response = simpleXrmSoap.normalizeResults(x);
            var results = null;
            if (response && response.childNodes) {
                results = simpleXrmSoap.jsonify(response.childNodes[0]);
            }
            return results;
        }
    },
    jsonify: function (x) {
        var _parseKVP = function (w) {
            if (w && w.childNodes && w.childNodes.length === 2 && 
            ((w.childNodes[0].localName === "key" && 
            w.childNodes[1].localName === "value") || 
            (w.childNodes[0].localName === "value" && 
            w.childNodes[1].localName === "key"))) {
                var t = {}, u, v;
                for (var i = 0, len = w.childNodes.length; i < len; i++) {
                    if (w.childNodes[i].localName === "key" && w.childNodes[i].childNodes[0]) {
                        u = w.childNodes[i].childNodes[0].nodeValue;
                    } else if (w.childNodes[i].localName === "value" && w.childNodes[i].childNodes[0]) {
                        v = _parseNode(w.childNodes[i].childNodes[0])
                    }
                };
                t[u] = v;
                return t;
            }
        };
        var _isArray = function (a) {
            return (a.__proto__.constructor === Array || a.constructor === Array || a.constructor === HTMLCollection || a.__proto__.constructor === HTMLCollection);
        };
        var _isObject = function (b) {
            return (b.__proto__.constructor === Object || b.constructor === Object || b.constructor === HTMLElement || b.__proto__.constructor === HTMLElement);
        }
        var _parseNode = function (y) {
            var z = {};
            if (y && y.localName && y.localName === "KeyValuePairOfstringanyType") {
                z = _parseKVP(y)
            } else if (y && y.localName && y.localName === "value" && y.nodeValue) {
                z = y.nodeValue
            } else if (y && y.localName && y.childNodes) {
                var s = [];
                for (var i = 0, len = y.childNodes.length; i < len; i++) {
                    s.push(_parseNode(y.childNodes[i]))
                }
                var loop = 0;
                while (loop < 10 && s && _isArray(s) && s.length === 1) {
                    s = s[0];
                    loop++;
                }
                z[y.localName] = s;
            } else if (y && y.localName && y.nodeValue) {
                z[y.localName] = y.nodeValue
            } else if (y && !y.localName && y.nodeValue) {
                z = y.nodeValue
            } else if (y && _isArray(y) && y.length === 1) {
                  z = _parseNode(y[0])
            }
            return z;
        };
        var _parseAttributes = function (m) {
            var n = {};
            if (_isArray(m) && m.length > 0) {
                for (var i = 0, len = m.length; i < len; i++) {
                    if (_isObject(m[i])) {
                        for (var j in m[i]) {
                            n[j] = m[i][j]
                        }
                    }
                }
                return n;
            }
        };
        var _parseEntityCollection = function (o) {
            var p = {};            
            if (o && o.Entities && o.Entities.Entity) {
                p = [o.Entities.Entity];
            } else if (o && o.Entities && _isArray(o) && o.Entities.length > 0) {
                p = o.Entities;
            } else {
                console.log ("Something unexpected happened.")
            };
            return p;
        };
        var _parseEntities = function (q) {
            var r = [];
            if (q && (q.constructor === Array || q.constructor === HTMLCollection) && q.length > 0) {
                for (var i = 0, len = q.length; i < len; i++) {
                    var s = _parseEntity(q[i]);
                    r.push(s);
                }
            }
            return r;            
        };
        var _parseEntity = function (a) {
            var b = {};
            if (a.constructor === Array || a.constructor === HTMLCollection) {
                for (var i = 0, len = a.length; i < len; i++) {
                    if (a[i].Attributes) {
                        b.attributes = _parseAttributes(a[i].Attributes);
                    } else if (a[i].constructor === Object || a[i].constructor === HTMLElement) {
                        for (var j in a[i]) {
                            b[j] = _parseNode(a[i][j]);
                        }
                    }
                }
            } else if (a.constructor === Object || a.constructor === HTMLElement) {
                for (var j in a) {
                    b[j] = _parseNode(a[j]);
                }       
            }
            return b;            
        };
        var results = x.getElementsByTagName("a:Entities");
        if (results) {
            results = _parseNode(results);
        };
        results = _parseEntityCollection(results);
        results = _parseEntities(results);
        return results || null;
    },
    retrieveMultiple: function (a) {
        var f = simpleXrmSoap.encodeXML(a.fetch);
        f = f.replace(/\"/g, "'");
        var r = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
            + "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">"
                + "<s:Body>"
                    + "<RetrieveMultiple xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>"
                        + "<query xmlns:q1='http://schemas.microsoft.com/crm/2006/Query' xsi:type='q1:QueryExpression'>"
                            + a.query
                        + "</query>"
                    + "</RetrieveMultiple>"
                + "</s:Body>"
            + "</s:Envelope>";
        simpleXrmSoap.request({
            request: r,
            callback: a.callback
        })
    },
    fetch: function (a) {
        var f = simpleXrmSoap.encodeXML(a.fetch);
        f = f.replace(/\"/g, "'");
        var r = "<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'>" +
                "<s:Body>" +
                    "<Execute xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services'>" +
                        "<request i:type='b:RetrieveMultipleRequest' xmlns:b='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>" +
                            "<b:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>" +
                                "<b:KeyValuePairOfstringanyType>" +
                                    "<c:key>Query</c:key>" +
                                    "<c:value i:type='b:FetchExpression'>" +
                                        "<b:Query>" + f + "</b:Query>" +
                                    "</c:value>" +
                                "</b:KeyValuePairOfstringanyType>" +
                            "</b:Parameters>" +
                            "<b:RequestId i:nil='true' />" +
                            "<b:RequestName>RetrieveMultiple</b:RequestName>" +
                        "</request>" +
                    "</Execute>" +
                "</s:Body>" +
            "</s:Envelope>";
        simpleXrmSoap.request({
            request: r,
            callback: a.callback
        })
    },
    retrieveDependentComponents: function (o) {
        var r = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
            "<s:Body>" +
                "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">" +
                    "<request i:type=\"b:RetrieveDependenciesForDeleteRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">" +
                        "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">" +
                            "<a:KeyValuePairOfstringanyType>" +
                                "<c:key>ObjectId</c:key>" +
                                "<c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + o.id + "</c:value>" +
                            "</a:KeyValuePairOfstringanyType>" +
                            "<a:KeyValuePairOfstringanyType>" +
                                "<c:key>ComponentType</c:key>" +
                                "<c:value i:type=\"d:int\" xmlns:d=\"http://www.w3.org/2001/XMLSchema\">1</c:value>" +
                            "</a:KeyValuePairOfstringanyType>" +
                        "</a:Parameters>" +
                        "<a:RequestId i:nil=\"true\" />" +
                        "<a:RequestName>RetrieveDependenciesForDelete</a:RequestName>" +
                    "</request>" +
                "</Execute>" +
            "</s:Body>" +
        "</s:Envelope>";
        simpleXrmSoap.request({
            request: r,
            callback: o.callback
        })
    },
    setStatus: function (a) {
        var r = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">"
            + "<s:Body>"
                + "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">"
                    + "<request i:type=\"b:SetStateRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">"
                        + "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">"
                            + "<a:KeyValuePairOfstringanyType>"
                                + "<c:key>EntityMoniker</c:key>"
                                + "<c:value i:type=\"a:EntityReference\">"
                                    + "<a:Id>" + a.record.id + "</a:Id>"
                                    + "<a:LogicalName>" + a.record.entityName + "</a:LogicalName>"
                                    + "<a:Name i:nil=\"true\" />"
                                + "</c:value>"
                            + "</a:KeyValuePairOfstringanyType>"
                            + "<a:KeyValuePairOfstringanyType>"
                                + "<c:key>State</c:key>"
                                + "<c:value i:type=\"a:OptionSetValue\">"
                                    + "<a:Value>" + a.stateCode + "</a:Value>"
                                + "</c:value>"
                            + "</a:KeyValuePairOfstringanyType>"
                            + "<a:KeyValuePairOfstringanyType>"
                                + "<c:key>Status</c:key>"
                                + "<c:value i:type=\"a:OptionSetValue\">"
                                    + "<a:Value>" + a.statusCode + "</a:Value>"
                                + "</c:value>"
                            + "</a:KeyValuePairOfstringanyType>"
                        + "</a:Parameters>"
                        + "<a:RequestId i:nil=\"true\" />"
                        + "<a:RequestName>SetState</a:RequestName>"
                    + "</request>"
                + "</Execute>"
            + "</s:Body>"
        + "</s:Envelope>";
        simpleXrmSoap.request({
            request: r,
            callback: a.callback
        })
    },
    parseOnReady: function (x) {
        var v = false;
        if (x.readyState === 4) {
            if (x.status === 200) {
                x.onreadystatechange = null;
                v = true;
            }
        }
        return v;
    },
    runWorkflow: function (a) {
        var r = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">"
                + "<s:Body>"
                    + "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">"
                        + "<request xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">"
                            + "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">"
                                + "<a:KeyValuePairOfstringanyType>"
                                    + "<b:key>EntityId</b:key>"
                                    + "<b:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + a.target.id
                                    + "</b:value>"
                                + "</a:KeyValuePairOfstringanyType>"
                                + "<a:KeyValuePairOfstringanyType>"
                                    + "<b:key>WorkflowId</b:key>"
                                    + "<b:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + a.workflow.id + "</b:value>"
                                + "</a:KeyValuePairOfstringanyType>"
                            + "</a:Parameters>"
                        + "<a:RequestId i:nil=\"true\" />"
                        + "<a:RequestName>ExecuteWorkflow</a:RequestName>"
                    + "</request>"
                + "</Execute>"
            + "</s:Body>"
        + "</s:Envelope>";
        simpleXrmSoap.request({
            request: r,
            callback: a.callback
        })
    }
};