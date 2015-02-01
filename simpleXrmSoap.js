/// <summary>
/// VERSION 1.5.0 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
/// simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
/// In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
/// To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
/// 
/// simpleXrmSoap: a library to simplify interaction with the Dynamics CRM SOAP endpoint (expansion planned)
/// </summary>

var simpleXrmSoap = {
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
        }
        XHR.open("POST", encodeURI(url), false);
        XHR.setRequestHeader("Accept", "application/xml, text/xml, */*");
        XHR.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        XHR.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        XHR.onreadystatechange = a.callback;
        XHR.send(a.request);
    },
    parseOnReady: function (x) {
        var v = false;
        if (x.readyState === 4) {
            if (x.status === 200) {
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
                                    + "<b:key>Target</b:key>"
                                    + "<b:value i:type=\"a:EntityReference\">"
                                            + "<a:Id>" + a.target.id + "</a:Id>"
                                            + "<a:LogicalName>" + a.target.entityName + "</a:LogicalName>"
                                            + "<a:Name i:nil=\"true\" />"
                                    + "</b:value>"
                                + "</a:KeyValuePairOfstringanyType>"
                                + "<a:KeyValuePairOfstringanyType>"
                                    + "<b:key>WorkflowId/b:key>"
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