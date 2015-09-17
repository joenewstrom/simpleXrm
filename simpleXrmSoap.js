/// <summary>
/// VERSION 1.5.0 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
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
        if (typeof (f) != "string") {
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
        XHR.open("POST", encodeURI(url), false);
        XHR.setRequestHeader("Accept", "application/xml, text/xml, */*");
        XHR.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        XHR.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        XHR.onreadystatechange = a.callback;
        XHR.send(a.request);
    },
    normalizeResults: function (x) {
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
        if (simpleXrmSoap.parseOnReady(x)) {
            var a = null;
            if (x.responseXML) {
                x = x.responseXML; //#document
                if (x.childNodes) {
                    var x = x.childNodes[0]; //s:Envelope
                    if (x.localName === "Envelope" && x.childNodes) {
                        var x = x.childNodes[0]; //s:Body
                        if (x.localName === "Body" && x.childNodes) {
                            var x = x.childNodes[0]; //ExecuteResponse
                            if (x.localName === "ExecuteResponse" && x.childNodes) {
                                var x = x.childNodes[0]; //ExecuteResult
                                if (x.localName === "ExecuteResult" && x.childNodes) {
                                    var y = x.childNodes[0]; //ResponseName
                                    var z = x.childNodes[1];
                                    if (y.localName === "ResponseName" && y.textContent === "RetrieveMultiple" && z.childNodes && z.childNodes.length === 1
                                        && z.childNodes[0].childNodes) {
                                        a = [];
                                        for (var i = 0; i < z.childNodes[0].childNodes.length; i++) {
                                            a.push(simpleXrmSoap.normalizeResults(z.childNodes[0].childNodes[i]))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return a;
        }
    },
    parseFetchResponse: function (x) {
        var r = [];
        if (x.childNodes && x.childNodes.length === 1) {
            x = x.childNodes[0]; //Envelope
            if (x.childNodes && x.childNodes.length === 1) {
                x = x.childNodes[0]; //Body
                if (x.childNodes && x.childNodes.length === 1) {
                    x = x.childNodes[0]; //ExecuteResponse
                    if (x.childNodes && x.childNodes.length === 1) {
                        x = x.childNodes[0]; //ExecuteResult
                        if (x.childNodes && x.childNodes[0]
                            && x.childNodes.length === 2) {
                            if (x.childNodes && x.childNodes[0] && x.childNodes[0].childNodes && x.childNodes[0].childNodes[0]
                                && x.childNodes[0].childNodes[0].nodeValue === "RetrieveMultiple") {
                                x = x.childNodes[1]; //KeyValuePairOfstringanyType
                                if (x.childNodes && x.childNodes[0]) {
                                    x = x.childNodes[0]; //value
                                    if (x.childNodes[1] && x.childNodes[1].childNodes
                                        && x.childNodes[0].childNodes[0].nodeValue === "EntityCollection") {
                                        x = x.childNodes[1];
                                        if (x.childNodes && x.childNodes[0]) {
                                            x = x.childNodes[0];
                                            if (x.childNodes) {
                                                var results = [];
                                                for (var i = 0; i < x.childNodes.length; i++) {
                                                    var result = {
                                                        attributes: {},
                                                        id: x.childNodes[i].childNodes[3].childNodes[0].nodeValue,
                                                        logicalName: x.childNodes[i].childNodes[4].childNodes[0].nodeValue,
                                                        relatedEntities: []
                                                    }
                                                    for (var j = 0; j < x.childNodes[i].childNodes[0].childNodes.length; j++) {
                                                        var y = x.childNodes[i].childNodes[0].childNodes[j].childNodes[0].childNodes[0].nodeValue;
                                                        var z = x.childNodes[i].childNodes[0].childNodes[j].childNodes[1].childNodes[0].nodeValue;
                                                        result.attributes[y] = simpleXrm.parseValue(z);
                                                    }
                                                    for (var k = 0; k < x.childNodes[i].childNodes[2].childNodes.length; k++) {
                                                        var y = x.childNodes[i].childNodes[2].childNodes[k].childNodes[0].childNodes[0].nodeValue;
                                                        var z = x.childNodes[i].childNodes[2].childNodes[k].childNodes[1].childNodes[0].nodeValue;
                                                        result.attributes[y] = simpleXrm.parseValue(z);
                                                    }
                                                    results.push(result);
                                                }
                                                return results;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getFetchResults: function (x) {
        if (simpleXrmSoap.parseOnReady(x)) {
            var response = simpleXrmSoap.normalizeResults(x);
            var results = simpleXrmSoap.parseFetchResponse(response);
            return results;
        }
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
}