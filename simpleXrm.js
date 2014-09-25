/// <summary>
///simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
///In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
///To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
///</summary>
var simpleXrm = {};

simpleXrm.error = function (e, m) {

    /// <summary>
    ///simpleXrm.error() returns an error message, writes to the console, and optionally presents the user with a custom message
    ///</summary>
    /// <param name="e" type="String">The element (attribute, control, argument) that throws the error.</param>
    if (simpleXrm.valid(m.toString())) {
        Xrm.Utility.alertDialog(m.toString());
    }
    console.log("Error: Oops! Something went wrong with a script. Contact your CRM Administrator with the following details: Element " + e.toString() + " was not found or is invalid.");
    throw new Error("Error: Oops! Something went wrong with a script. Contact your CRM Administrator with the following details: Element " + e.toString() + " was not found or is invalid.");
}

simpleXrm.getAttDate = function (a) {
    if (simpleXrm.valid(a)) {
        if (simpleXrm.hasVal(a)) {
            var x = simpleXrm.getAttVal(a);
            d = {
                year: x.getFullYear(),
                month: x.getMonth(),
                date: x.getDate(),
                hours: x.getHours(),
                minutes: x.getMinutes()
            };
            return d;
        }
    }
}


simpleXrm.valid = function (a) {
    ///<summary>
    ///simpleXrm.valid() returns true if the argument 'a' is a valid argument (as we will see later, this is a big time saver)
    ///</summary>
    ///<parameter name="a" type="Argument">the argument that is checked for validity in the DOM/Xrm collection(s)</parameter>
    ///<returns type="Boolean" />
    return (a != null && a != undefined);
};


simpleXrm.doesNotContainData = function (a) {
    ///<summary>
    ///simpleXrm.doesNotContainData() returns true if the attribute 'a' does not have a value and false otherwise
    ///</summary>
    ///<param name="a" type="Attribute">The attribute to be checked for data. sample usage: simpleXrm.doesNotContainData('companyname')</param>
    ///<returns type="Boolean" />
    if (simpleXrm.valid(Xrm.Page.getAttribute(a.toString())) && Xrm.Page.getAttribute(a.toString()).getValue() === null) {
        return true;
    } else if (simpleXrm.valid(Xrm.Page.getAttribute(a.toString())) && Xrm.Page.getAttribute(a.toString()).getValue() != null) {
        return false;
    } else {
        simpleXrm.error(a);
    }
}



simpleXrm.containsData = function (a) {
    ///<summary>
    ///simpleXrm.containsData() returns true if the attribute 'a' has a value and false otherwise.
    ///Sample Usage: simpleXrm.containsData('companyname')
    ///</summary>
    ///<param name="a" type="Attribute">The attribute to be checked for data. </param>
    ///<returns type="Boolean" />
    return !simpleXrm.doesNotContainData(a);
}



simpleXrm.validAtt = function (a) {
    /// <summary>
    ///simpleXrm.validAtt() checks for existence of an attribute 'a' in the Xrm.Page.attributes collection.
    ///sample usage: simpleXrm.validAtt('companyname')
    ///</summary>
    /// <param name="a" type="String">an attribute 'a' in the Xrm.Page.attributes collection</param>
    /// <returns type="Boolean" />
    return simpleXrm.valid(Xrm.Page.getAttribute(a.toString()));
}

//

simpleXrm.getAtt = function (a) {
    /// <summary>
    ///simpleXrm.getAtt() returns the attribute object for attribute named 'a'.
    ///Sample usage: simpleXrm.getAtt('companyname') returns an attribute object if companyname
    ///is on the current form; logical equivalent to Xrm.Page.getAttribute('companyname')
    ///</summary>
    /// <param name="a" type="String">The name of the attribute.</param>
    if (simpleXrm.validAtt(a)) {
        return Xrm.Page.getAttribute(a.toString());
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.getAttType = function (a) {
    /// <summary>
    /// Returns the attribute type of attribute a'.
    /// Sample usage: simpleXrm.getAttType('companyname') returns "string".
    /// </summary>
    /// <param name="a" type="String">The name of the attribute to investigate.</param>
    if (simpleXrm.validAtt(a)) {
        return Xrm.Page.getAttribute(a.toString()).getAttributeType();
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.getAttVal = function (a) {
    ///<summary>
    ///simpleXrm.getAttVal() returns the current value of attribute 'a'.
    ///Sample usage: simpleXrm.getAttVal('companyname') returns the value of companyname e.g. "An Old Company".
    ///</summary>
    /// <param name="a" type="String">The name of the attribute.</param>
    if (simpleXrm.validAtt(a)) {
        return Xrm.Page.getAttribute(a.toString()).getValue();
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.hasVal = function (a) {
    ///<summary>
    ///simpleXrm.hasVal() returns true if the current value of the attribute 'a' has info.
    ///Sample usage: ///simpleXrm.getAttVal('companyname') returns the value of companyname e.g. "An Old Company".
    ///</summary>
    /// <param name="a" type="String">The name of the attribute.</param>
    if (simpleXrm.validAtt(a)) {
        return simpleXrm.valid(Xrm.Page.getAttribute(a.toString()).getValue());
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.getLookupVal = function (a) {
    /// <summary>
    ///simpleXrm.getLookupVal() returns the name of the selected record in a lookup attribute, or returns null if
    ///no record is selected. Sample usage: simpleXrm.getLookupVal(customerid)
    ///</summary>
    /// <param name="a" type="String">The name of the lookup attribute to get the value from.</param>
    if (simpleXrm.hasVal(a)) {
        return Xrm.Page.getAttribute(a.toString()).getValue()[0].name;
    } else if (simpleXrm.validAtt(a)) {
        return null;
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.getLookupID = function (a) {
    ///<summary>
    ///simpleXrm.getLookupID() returns the GUID of the selected record in a lookup attribute, or returns null if no
    ///record is selected. Sample usage: simpleXrm.getLookupID(customerid) returns the GUID of the current customer.
    ///</summary>
    /// <param name="a" type="String">The name of the lookup attribute to get the value from.</param>
    if (simpleXrm.hasVal(a)) {
        return Xrm.Page.getAttribute(a.toString()).getValue()[0].id;
    } else if (simpleXrm.validAtt(a)) {
        return null;
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.getLookupEntityName = function (a) {
    ///<summary>
    ///simpleXrm.getLookupEntityName() returns the entity logical name of the selected record in a lookup attribute,
    ///or returns null if no record is selected. Sample usage: simpleXrm.getLookupEntityName(customerid) returns the entity
    ///logical name ('contact' or 'account') for the current customer.
    ///</summary>
    /// <param name="a" type="String">The name of the lookup attribute to get the value from.</param>
    if (simpleXrm.hasVal(a)) {
        return Xrm.Page.getAttribute(a.toString()).getValue()[0].entityType;
    } else if (simpleXrm.validAtt(a)) {
        return null;
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.setAttVal = function (a, v) {
    /// <summary>
    ///simpleXrm.setAttVal() sets the value of the attribute 'a' to value 'v'. sample usage:
    ///simpleXrm.setAttVal(companyname,"A New Company") overwrites value of companyname with "A New Company".
    ///</summary>
    /// <param name="a" type="String">The target attribute as a string.</param>
    /// <param name="v" type="Varies">The value passed to the target attribute. Check Dynamics CRM SDK for
    ///acceptable values based on different attribute types. Note: rejects v = null. Use simpleXrm.clearAttVal() to clear
    ///field value.</param>
    if (simpleXrm.validAtt(a) && simpleXrm.valid(v)) {
        Xrm.Page.getAttribute(a.toString()).setValue(v);
        simpleXrm.sendAttAlways(a.toString());
    } else if (!simpleXrm.validAtt(a)) {
        simpleXrm.error(a);
    } else {
        simpleXrm.error(v);
    }
}

simpleXrm.clearAttVal = function (a) {
    /// <summary>
    ///simpleXrm.clearAttVal() clears the value of the attribute 'a'. Sample usage: simpleXrm.clearAttVal('companyname')
    ///changes companyname to null.
    ///</summary>
    /// <param name="a" type="String">The target attribute passed as a string.</param>
    if (simpleXrm.validAtt(a)) {
        Xrm.Page.getAttribute(a.toString()).setValue(null);
        simpleXrm.sendAttAlways(a.toString());
    } else {
        simpleXrm.error(a);
    }
}

simpleXrm.clearAttsVal = function () {
    /// <summary>simpleXrm.clearAttsVal() clears the current value of the attribute(s) passed as arguments.
    ///Sample usage: simpleXrm.clearAttsVal(companyname, firstname, lastname) clears the current values of
    ///attributes 'companyname', 'firstname', and 'lastname'.
    ///</summary>
    /// <param name="arguments[i] for i >= 0" type="String">The attribute(s) to be cleared of value(s).</param>
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.clearAttVal(arguments[i]);
    }
}

simpleXrm.sendAttAlways = function (a) {
    /// <summary>
    ///simpleXrm.sendAttAlways() includes the current value of 'a' in the XML form data submitted to the server.
    ///Sample usage: simpleXrm.sendAttAlways('companyname') will send the value of companyname to the server
    ///regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'.
    ///</summary>
    /// <param name="a" type="String">The attribute to be submitted to the server.</param>
    simpleXrm.getAtt(a).setSubmitMode("always");
}

simpleXrm.sendAttsAlways = function () {
    /// <summary>simpleXrm.sendAttsAlways() includes the current values of all attribute(s) passed as arguments to the function in the XML form data submitted to the server. Sample usage: simpleXrm.sendAttsAlways(companyname,firstname,lastname,fullname) will send the values of attributes 'companyname', 'firstname', 'lastname', and 'fullname' to the server regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'.</summary>
    /// <param name="arguments[i] for i >= 0" type="String">The attribute(s) to be submitted to the server.</param>
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.sendAttAlways(arguments[i]);
    }
}

simpleXrm.sendAttNever = function (a) {
    /// <summary>
    /// simpleXrm.sendAttNever() excludes the current value of 'a' in the XML form data submitted to the server.
    /// Sample usage: simpleXrm.sendAttNever('companyname') will not send the value of companyname to the server
    /// regardless of whether the field value was modified ('dirty').
    /// </summary>
    /// <param name="a" type="String">The name of the attribute.</param>
    simpleXrm.getAtt(a).setSubmitMode("never");
}

//sendAttsNever() excludes the current values of all attributes 'a1', 'a2', etc. passed as arguments
//to the function in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttsNever(companyname,firstname,lastname,fullname) 
//will not send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server regardless of whether the field values were modified ('dirty')

simpleXrm.sendAttsNever = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.sendAttNever(arguments[i]);
    }
}

//sendAttChanges() will only include the value of 'a' in the XML form data submitted to the server if 'a' was updated/modified
//sample usage: simpleXrm.sendAttChanges('companyname') will send the value of companyname to the server
//only if/when the field value was modified ('dirty')

simpleXrm.sendAttChanges = function (a) {
    simpleXrm.getAtt(a).setSubmitMode("dirty");
}

//sendAttsChanges() will only include the current values of all attributes 'a1', 'a2', etc. passed as arguments
//to the function in the XML form data submitted to the server if each individual attribute was updated/modified
//sample usage: simpleXrm.sendAttsChanges(companyname,firstname,lastname,fullname) 
//will only send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server if the field values were updated or modified ('dirty')

simpleXrm.sendAttsChanges = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.sendAttChanges(arguments[i]);
    }
}

//getAttReqd() returns the required status of attribute 'a'
//sample usage: simpleXrm.getAttReqd('companyname') 
//returns 'required', 'recommended', or 'none' depending on the requirement level of the attribute

simpleXrm.getAttReqd = function (a) {
    return simpleXrm.getAtt(a).getRequiredLevel();
}

//setAttReqd() sets the required status of attribute 'a' to 'required'
//sample usage: simpleXrm.setAttReqd('companyname') 
//attribute 'companyname' is now business required

simpleXrm.setAttReqd = function (a) {
    simpleXrm.getAtt(a).setRequiredLevel("required");
}

//setAttsReqd() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'required'
//sample usage: simpleXrm.setAttsReqd(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business required

simpleXrm.setAttsReqd = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.setAttReqd(arguments[i]);
    }
}

//clearAttReqd() sets the required status of attribute 'a' to 'none'
//sample usage: simpleXrm.clearAttReqd('companyname') 
//attribute 'companyname' is not business required

simpleXrm.clearAttReqd = function (a) {
    simpleXrm.getAtt(a).setRequiredLevel("none");
}


simpleXrm.clearAttsReqd = function () {
    /// <summary>
    ///simpleXrm.clearAttsReqd() sets the requirement level of all attributes 'a1', 'a2', etc. passed as arguments to 'not required'.
    ///Sample usage: simpleXrm.clearAttsReqd(companyname,firstname,lastname,fullname) changes attributes 'companyname',
    ///'firstname', 'lastname', and 'fullname' to not business required.
    ///</summary>
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.clearAttReqd(arguments[i]);
    }
}



simpleXrm.setAttRecommended = function (a) {
    /// <summary>
    ///simpleXrm.setAttRecommended() sets the required status of attribute 'a' to 'recommended'
    ///sample usage: simpleXrm.setAttRecommended('companyname') changes attribute 'companyname' to 'business recommended'.
    ///</summary>
    simpleXrm.getAtt(a).setRequiredLevel("recommended");
}

//setAttsRecommended() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'recommended'
//sample usage: simpleXrm.setAttsRecommended(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business recommended

simpleXrm.setAttsRecommended = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.setAttRecommended(arguments[i]);
    }
}

//fireOnChange() mirrors the SDK implementation of Xrm.Page.getAttribute().fireOnChange()
//sample usage: simpleXrm.fireOnChange('companyname')
//triggers scripts registered on the change event of 'companyname' if it is included in the attributes collection

simpleXrm.fireOnChange = function (a) {
    if (simpleXrm.validAtt(a)) {
        simpleXrm.getAtt(a).fireOnChange();
    } else {
        simpleXrm.error(a);
    }
}

//fireChanges() triggers the onChange events of all attributes 'a1', 'a2', etc.
//passed as arguments to the function 
//sample usage: simpleXrm.fireChanges(companyname,firstname,lastname,fullname) 
//scripts running onChange for attributes 'companyname', 'firstname', 'lastname', and 'fullname' will now run

simpleXrm.fireChanges = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.fireOnChange(arguments[i]);
    }
}


//validCtrl() checks the form for control 'c'
//sample usage: simpleXrm.validCtrl('companyname') 
//returns true if 'companyname' is present on the form
//(note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)

simpleXrm.validCtrl = function (c) {
    if (simpleXrm.valid(c)) {
        return (simpleXrm.valid(Xrm.Page.getControl(c.toString())));
    } else {
        simpleXrm.error(c);
    }
}

//getCtrl() gets the object for control 'c'
//sample usage: simpleXrm.getCtrl('companyname') 
//returns a control object if 'companyname' is present on the form
//(note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)

simpleXrm.getCtrl = function (c) {
    if (simpleXrm.validCtrl(c)) {
        return Xrm.Page.getControl(c.toString());
    } else {
        simpleXrm.error(c);
    }
}

simpleXrm.getAllCtrls = function (a) {
    /// <summary>
    /// simpleXrm.getAllCtrls() returns an array containing all controls for attribute 'a'.
    /// Sample usage: simpleXrm.getAllCtrls("companyname")
    /// creturns an array of control objects if 'companyname' is present on the form ['companyname','companyname1','companyname2'...].
    ///</summary>
    /// <param name="a" type="String">The name of the attribute whose controls collection will' be returned.</param>
    return simpleXrm.getAtt(a).controls;
}

simpleXrm.showCtrl = function (c) {
    /// <summary>
    /// simpleXrm.showCtrl() shows the control 'c' (if the name of an attribute is passed, it will
    /// show the first control for that attribute on the page).
    /// Sample usage: simpleXrm.showCtrl("companyname")
    /// changes visibility of the first control for attribute 'companyname'to visible.
    ///</summary>
    /// <param name="c" type="String">The name of the control to be shown.</param>
    if (simpleXrm.valid(simpleXrm.getCtrl(c))) {
        simpleXrm.getCtrl(c).setVisible(true);
    }
}


simpleXrm.showCtrls = function () {
    /// <summary>
    /// simpleXrm.showCtrls() shows all controls 'c1, c2, c3' passed as arguments
    /// Sample usage: simpleXrm.showCtrls("companyname","firstname","lastname","fullname")
    /// changes visibility of the first control for attributes 'companyname', 'firstname',
    /// 'lastname', and 'fullname' to visible.
    ///</summary>
    /// <param name="arguments[i]" type="String">The name of the control(s) to be shown, separated by commas.</param>
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.showCtrl(arguments[i]);
    }
}

simpleXrm.hideCtrl = function (c) {
    /// <summary>
    /// simpleXrm.hideCtrl() hides the control 'c' (if the name of an attribute is passed, it will
    /// hide the first control for that attribute on the page).
    /// Sample usage: simpleXrm.hideCtrl("companyname")
    /// changes visibility of the first control for attribute 'companyname'to hidden.
    ///</summary>
    /// <param name="c" type="String">The name of the control to be hidden.</param>
    if (simpleXrm.valid(simpleXrm.getCtrl(c))) {
        simpleXrm.getCtrl(c).setVisible(false);
    }
}

simpleXrm.hideCtrls = function () {
    /// <summary>
    /// simpleXrm.hideCtrls() hides all controls 'c1, c2, c3' passed as arguments
    /// Sample usage: simpleXrm.hideCtrls("companyname","firstname","lastname","fullname")
    /// changes visibility of the first control for attributes 'companyname', 'firstname',
    /// 'lastname', and 'fullname' to hidden.
    ///</summary>
    /// <param name="arguments[i]" type="String">The name of the control(s) to be hidden, separated by commas.</param>
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.hideCtrl(arguments[i]);
    }
}

simpleXrm.clearOptions = function (a) {
    simpleXrm.getAllCtrls(a).forEach(function (x, i) {
        x.clearOptions();
    });

}

simpleXrm.restoreOptions = function (a) {
    simpleXrm.clearOptions(a);
    var x = simpleXrm.getAtt(a).getOptions();
    simpleXrm.getAllCtrls(a).forEach(function (y, i) {
        x.forEach(function (z, j) {
            z.addOption(y);
        });
    });
}

simpleXrm.removeOption = function (a, o) {
    simpleXrm.getAllCtrls(a).forEach(function (x, i) {
        x.removeOption(o);
    });
}

//showAllCtrls() shows all controls for attribute 'a'
//sample usage: simpleXrm.showAllCtrls('companyname') 
//changes visibility of all controls for attribute 'companyname' to visible

simpleXrm.showAllCtrls = function (a) {
    if (simpleXrm.valid(simpleXrm.getAllCtrls(a))) {
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.setVisible(true);
        });
    }
}

//hideAllCtrls() hides all controls for attribute 'a'
//sample usage: simpleXrm.hideAllCtrls('companyname') 
//changes visibility of all controls for attribute 'companyname' to hidden


simpleXrm.hideAllCtrls = function (a) {
    if (simpleXrm.valid(simpleXrm.getAllCtrls(a))) {
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.setVisible(false);
        });
    }
}

//lockCtrl() locks the control 'c'
//sample usage: simpleXrm.lockCtrl('companyname') 
//locks the first control for attribute 'companyname'

simpleXrm.lockCtrl = function (c) {
    simpleXrm.getCtrl(c).setDisabled(true);
}

//lockCtrls() locks all controls 'c1', 'c2', 'c3' passed as arguments to the function
//sample usage: simpleXrm.lockCtrls(companyname, firstname, lastname) 
//locks the first control for attributes 'companyname', 'firstname', and 'lastname'

simpleXrm.lockCtrls = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.lockCtrl(arguments[i]);
    }
}

//unlockCtrl()  unlocks the control 'c'
//sample usage: simpleXrm.unlockCtrl('companyname') 
//unlocks the first control for attribute 'companyname'

simpleXrm.unlockCtrl = function (c) {
    simpleXrm.getCtrl(c).setDisabled(false);
}

//unlockCtrls()  unlocks all controls 'c1', 'c2', 'c3' passed as arguments to the function
//sample usage: simpleXrm.unlockCtrls(companyname, firstname, lastname) 
//unlocks the first control for attributes 'companyname', 'firstname', and 'lastname'

simpleXrm.unlockCtrls = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.unlockCtrl(arguments[i]);
    }
}

//lockAllCtrls() locks all controls for attribute 'a'
//sample usage: simpleXrm.lockAllCtrls('companyname') 
//locks all controls for attribute 'companyname'

simpleXrm.lockAllCtrls = function (a) {
    if (simpleXrm.valid(simpleXrm.getAllCtrls(a))) {
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.setDisabled(true);
        });
    }
}

//unlockAllCtrls() unlocks all controls for attribute 'a'
//sample usage: simpleXrm.unlockAllCtrls('companyname') 
//unlocks all controls for attribute 'companyname'

simpleXrm.unlockAllCtrls = function (a) {
    if (simpleXrm.valid(simpleXrm.getAllCtrls(a))) {
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.setDisabled(false);
        });
    }
}


//relabelCtrl() changes the label for control 'c' to value 'v' (requires string in quotes)
//sample usage: simpleXrm.relabelCtrl(companyname, "Account Name") 
//changes the label for the first control for attribute 'companyname' to "Account Name"

simpleXrm.relabelCtrl = function (c, v) {
    simpleXrm.getCtrl(c).setLabel(v);
}

//relabelAllCtrls() changes the label for all controls for attribute 'a' to value 'v' (requires string in quotes)
//sample usage: simpleXrm.relabelAllCtrls(companyname, "Account Name") 
//changes the label for all controls for attribute 'companyname' to "Account Name"

simpleXrm.relabelAllCtrls = function (a, v) {
    if (simpleXrm.valid(simpleXrm.getAllCtrls(a))) {
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.setLabel(v);
        });
    }
}

//allTabs() returns the objects for all tabs
//sample usage: simpleXrm.allTabs() 
//returns an array [tab, tab_2, tab_3,...]

simpleXrm.allTabs = function () {
    return Xrm.Page.ui.tabs;
}

//validTab() checks the form for tab 't'
//sample usage: simpleXrm.validTab('tab_2') 
//returns true if two tabs are present on the form and the second tab's name has not been modified

simpleXrm.validTab = function (t) {
    return simpleXrm.valid(simpleXrm.allTabs().get(t.toString()));
}

//getTab() returns the object for tab 't'
//sample usage: simpleXrm.getTab('tab_2') 
//returns the object tab_2

simpleXrm.getTab = function (t) {
    return simpleXrm.allTabs().get(t.toString());
}

//showTab() shows tab 't'
//sample usage: simpleXrm.showTab(tab_2) 
//changes the visibility of tab_2 to visible

simpleXrm.showTab = function (t) {
    simpleXrm.getTab(t).setVisible(true);
}

//showTabS() shows all tabs 't1', 't2', 't3' passed as arguments to the function
//sample usage: simpleXrm.showTabs(tab_1,tab_2,tab_4) 
//changes the visibility of tab_1, tab_2, and tab_4_ to visible

simpleXrm.showTabs = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.showTab(arguments[i]);
    }
}

//hideTab() hides tab 't'
//sample usage: simpleXrm.hideTab(tab_2) 
//changes the visibility of tab_2 to hidden

simpleXrm.hideTab = function (t) {
    simpleXrm.getTab(t).setVisible(false);
}

//hideTabs() hides all tabs 't1', 't2', 't3' passed as arguments to the function
//sample usage: simpleXrm.hideTabs(tab_1,tab_2,tab_4) 
//changes the visibility of tab_1, tab_2, and tab_4_ to hidden

simpleXrm.hideTabs = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.hideTab(arguments[i]);
    }
}

//validSection() checks the form for section 's'
//sample usage: simpleXrm.validSection(tab_2_section_1) 
//returns true if two tabs are present on the form, the second tab's name has not been modified,
//and the tab's first section's name has not been modified

simpleXrm.validSection = function (s) {
    simpleXrm.allTabs().forEach(function (x, i) {
        if (simpleXrm.valid(x.sections.get(s.toString()))) {
            return true;
        }
    });
}

//getSection() returns the object for section 's'
//sample usage: simpleXrm.getSection(tab_2_section_1) 
//returns the object tab_2_section_1

simpleXrm.getSection = function (s) {
    var t;
    simpleXrm.allTabs().forEach(function (x, i) {
        if (simpleXrm.valid(x.sections.get(s.toString()))) {
            t = x.sections.get(s.toString());
        }
    });
    return t;
}

//showSection() shows section 's'
//sample usage: simpleXrm.showSection(tab_2_section_1) 
//changes the visibility of tab_2_section_1 to visible

simpleXrm.showSection = function (s) {
    simpleXrm.getSection(s).setVisible(true);
}

//showSections() shows all sections 's1', 's2', 's3' passed as arguments to the function
//sample usage: simpleXrm.showSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) 
//changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to visible

simpleXrm.showSections = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.showSection(arguments[i]);
    }
}

//hideSection() hides section 's'
//sample usage: simpleXrm.hideSection(tab_2_section_1) 
//changes the visibility of tab_2_section_1 to hidden

simpleXrm.hideSection = function (s) {
    simpleXrm.getSection(s).setVisible(false);
}

//hideSections() hides all sections 's1', 's2', 's3' passed as arguments to the function
//sample usage: simpleXrm.hideSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) 
//changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to hidden

simpleXrm.hideSections = function () {
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.hideSection(arguments[i]);
    }
}

simpleXrm.closeAtt = function (a) {
    /// <summary>
    ///simpleXrm.closeAtt() changes attribute 'a' to Not Business Required and clears the value.
    ///It also locks and hides all controls for that attribute.
    ///</summary>
    simpleXrm.hideAllCtrls(a);
    simpleXrm.clearAttReqd(a);
    simpleXrm.clearAttVal(a);
    simpleXrm.lockAllCtrls(a);
    simpleXrm.sendAttAlways(a);
}

simpleXrm.closeAtts = function () {
    /// <summary>
    ///simpleXrm.closeAtts() changes all attributes passed as arguments to Not Business Required and clears the values
    ///It also locks and hides all controls for those attributes.
    ///</summary>
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.closeAtt(arguments[i]);
    }
}

simpleXrm.openAtt = function (a) {
    /// <summary>
    ///simpleXrm.openAtt() unlocks and shows all controls for attribute 'a'.
    ///</summary>
    simpleXrm.unlockAllCtrls(a);
    simpleXrm.showAllCtrls(a);
    simpleXrm.sendAttAlways(a);
}

simpleXrm.openAtts = function () {
    /// <summary>
    ///simpleXrm.openAtts() unlocks and shows all controls for all attributes passed as arguments.
    ///</summary>
    for (i = 0; i < arguments.length; i++) {
        simpleXrm.openAtt(arguments[i]);
    }
}


//sumAtts() adds the values of the fields passed as arguments to the function
//sample usage: simpleXrm.sumAtts(price1, price2, price3)
//returns the sum of the current values of price1, price2, and price3

simpleXrm.sumAtts = function () {
    var sum = 0;
    for (i = 0; i < arguments.length; i++) {
        if (!isNaN(simpleXrm.getAttVal(arguments[i]))) {
            sum += simpleXrm.getAttVal(arguments[i]);
        }
    }
    return sum;
}

simpleXrm.calculatePercent = function (p, t) {
    return (p / t) * 100;
}


simpleXrm.oData = {}

simpleXrm.oData.fakeIt = function () {
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
    Xrm.Page.alertDialog("I pity the fool that doesn't update his browser! Tell your administrator you are running the browser from the CalecoVision and you need an upgrade so you can log onto Prodigy.net.");
}
simpleXrm.oData.newXHR = function (q, c) {
    /// <summary>
    ///simpleXrm.oData.newXHR uses an AJAX pattern to send a CRM OData query "q" and executes callback function "c" when successful.
    ///</summary>
    /// <param name="q" type="String">A query string, either statically input or constructed with the simpleXrm.oData.buildQuery() function.</param>
    /// <param name="c" type="Function">The callback method to invoke on success of the OData query.</param>
    var oDataUri = Xrm.Page.context.getClientUrl();
    if (simpleXrm.valid(oDataUri)) {
        oDataUri += "/XRMServices/2011/OrganizationData.svc/" + q.toString();
        if (window.XMLHttpRequest) {
            XHR = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            XHR = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            simpleXrm.error("We encountered an unexpected issue. Please check your form data before proceeding. Info for Admin: User's browser may not support one of the requested scripts. Please attempt using FireFox or IE 8+");
            return null;
        }
        XHR.open("GET", encodeURI(oDataUri), true);
        XHR.setRequestHeader("Accept", "application/json");
        XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        XHR.onreadystatechange = c;
        XHR.send();
    }
}

simpleXrm.oData.mapLookupFields = function (a) {
    /// <summary>
    /// simpleXrm.oData.mapLookupFields() gets values from lookup entity a[0] of entity type a[1].
    /// The values listed as the first element of each argument where i > 0 are mapped into the second element
    /// of the same argument.
    /// Sample usage: simpleXrm.oData.mapLookupFields(['OriginatingLead','Lead'],['CompanyName','Name'],['Address1_City','Address1_City'])
    /// Maps fields CompanyName, Address1_City (from the Originating Lead) into fields Name and Address1_City on the current record.
    /// </summary>
    /// <param name="a" type="Array">A 2 element array of form ["new_lookup", "new_customentity"] containing the schema name of the lookup
    /// attribute on the current record (element 0) and the schema name of the lookup entity type (element 1)</param>
    /// <param name="arguments[i] where i > 0" type="Array">Each subsequent parameter is an array of form ["new_sourcefield", "new_targetfield"]
    /// containing the schema names of the source attribute located on the lookup record being mapped (element 0) and the target attribute
    /// on the current record (element 1).</param>
    var b = [];
    var c = [];
    for (i = 1; i < arguments.length; i++) {
        if (simpleXrm.valid(arguments[i][0])) {
            b.push(arguments[i][0]); //source
            c.push(arguments[i][1].toLowerCase()); //target
        }
    }
    var q = simpleXrm.oData.queryLookup(a[0], a[1], b);
    simpleXrm.oData.newXHR(q, function () {
        var a = this;
        simpleXrm.oData.handleLookupResults(a, b, c);
    });
}

simpleXrm.oData.handleLookupResults = function (a, b, c) {
    var x = simpleXrm.oData.results(a);
    if (simpleXrm.valid(x)) {
        for (i = 0; i < b.length; i++) {
            if (simpleXrm.validAtt(c[i])) {
                var t = b[i].toString();
                var u;
                var j = i + 1;
                if (simpleXrm.valid(x[t].Id)) {
                    u = [{
                        id: simpleXrm.wrapGuid(x[t].Id),
                        entityType: x[t].LogicalName,
                        name: x[t].Name
                    }];
                } else {
                    u = x[t].value;
                }
                simpleXrm.setAttVal(c[i], u);
            }
        }
    }
}

simpleXrm.oData.results = function (y) {
    /// <summary>
    /// simpleXrm.oData.results() is called by the simpleXrm.oData.newXHR() function. It normalizes results from the data.d.results[0] object into a simple returned variable.
    /// It also handles absence of the window.JSON object in older browsers by using a low level polyfill (simpleXrm.oData.fakeIt()) to assist in handling results.
    ///</summary>
    if (!window.JSON) {
        simpleXrm.oData.fakeIt();
    };
    if (y.readyState == 4 && y.status == 200) {
        var x = null;
        var data = JSON.parse(y.responseText, simpleXrm.oData.parseDate);
        if (simpleXrm.valid(data)) {
            if (simpleXrm.valid(data.d)) {
                if (simpleXrm.valid(data.d.results)) {
                    if (simpleXrm.valid(data.d.results[0])) {
                        x = data.d.results[0];
                    }
                }
            }
        }
        return x;
    }
}

simpleXrm.oData.parseDate = function (k, v) {
    /// <summary>Uses regex to parse the date field response string and return a js date object instead.</summary>
    var a;
    if (typeof v === 'string') {
        a = /Date\(([-+]?\d+)\)/.exec(v);
        if (a) {
            return new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
        }
    }
    return v;
}

simpleXrm.oData.buildQuery = function (e, s, f, o, x, k, t) {
    /// <summary>buildQuery() constructs a query directed at the OData endpoint using parameters.</summary>
    /// <param name="e" type="String">The primary entity set (e.g. "ContactSet") for the OData query.</param>
    /// <param name="s" type="String">The $select query parameter typically constructed using simpleXrm.oData.select().</param>
    /// <param name="f" type="String">The $filter query parameter typically constructed using simpleXrm.oData.filter().</param>
    /// <param name="o" type="String">The $orderby query parameter typically constructed using simpleXrm.oData.orderBy().</param>
    /// <param name="x" type="String">The $expand query parameter typically constructed using simpleXrm.oData.expand().</param>
    /// <param name="k" type="String">The $skip query parameter typically constructed using simpleXrm.oData.skip().</param>
    /// <param name="u" type="String">The $top query parameter typically constructed using simpleXrm.oData.top().</param>
    var q = "";
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

simpleXrm.oData.buildFilter = function (a, o, v) {
    /// <summary>simpleXrm.oData.buildFilter() takes a set of arguments and constructs a filter conforming to the CRM OData REST API.</summary>
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

simpleXrm.link = function (a, o) {
    if (a.length === 1) {
        return a[0].toString();
    } else {
        return a.join(o);
    }
}
simpleXrm.oData.groupFiltersOr = function () {
    /// <summary>groupFiltersOr() constructs a joined "OR" aggregate filter comprised of multiple oData filters.</summary>
    /// <param name="arguments[i]" type="String">An OData filter string (typically constructed using simpleXrm.oDataFilter()). (case sensitive)</param>
    return "(" + arguments.join(" or ") + ")";
}

simpleXrm.oData.groupFiltersAnd = function () {
    /// <summary>groupFiltersOr() constructs a joined "AND" aggregate filter comprised of multiple oData filters.</summary>
    /// <param name="arguments[i]" type="String">An OData filter string (typically constructed using simpleXrm.oDataFilter()). (case sensitive)</param>
    return "(" + arguments.join(" and ");
}

simpleXrm.oData.filter = function () {
    /// <summary>oDataFilter() builds and returns a $filter parameter from individual filter components and group constructors for an OData query. Multiple filters passed as arguments will be grouped "AND" by default.</summary>
    /// <param name="arguments[i]" type="String">A single or aggregate filter to be added to the filtering criteria. (case sensitive)</param>
    return "$filter=" + simpleXrm.link(arguments, " and ");
}

simpleXrm.oData.select = function () {
    /// <summary>simpleXrm.oData.select() builds and returns a $select parameter for attribute data from the primary entity for an OData query.</summary>
    /// <param name="arguments[i]" type="String">An attribute on the primary entity to be returned by the OData query. (case sensitive)</param>
    return "$select=" + simpleXrm.link(arguments, ",");
}

simpleXrm.oData.selectFromExpanded = function (x) {
    /// <summary>simpleXrm.oData.selectFromExpanded() builds and returns an input argument for simpleXrm.oDataSelect() that handles fields from related (expanded) records.</summary>
    /// <param name="x" type="String">The name of the relationship between the primary entity and the related (expanded) entity. (case sensitive)</param>
    /// <param name="arguments[i] (where i > 0)" type="String">The name of the attribute(s) on the related (expanded) entity to be returned. Add an additional argument for each parameter from this relationship. (case sensitive)</param>
    var y = [];
    for (i = 1; i < arguments.length; i++) {
        y.push(x.toString() + "/" + arguments[i].toString());
    }
    return simpleXrm.link(y, ",");
}

simpleXrm.oData.expand = function () {
    /// <summary>simpleXrm.oData.expand() builds and returns an $expand parameter for a related entity in an OData query.</summary>
    /// <param name="arguments[0]" type="String">The relationship name that connects the expanded entity to the primary entity. (case sensitive)</param>
    /// <param name="arguments[i] (where i > 0)" type="String">An attribute on the expanded entity to be returned by the OData query</param>
    return "$expand=" + simpleXrm.link(arguments, ",");
}

simpleXrm.oData.orderBy = function () {
    /// <summary>simpleXrm.oData.orderBy() builds and returns an $orderby parameter for an OData query.</summary>
    /// <param name="arguments[0]" type="String">The name of an attribute that results should be ordered by. Optionally follow by " desc" to list in descending order.</param>
    return "$orderby=" + simpleXrm.link(arguments, ",");
}

simpleXrm.oData.skip = function (n) {
    /// <summary>simpleXrm.oData.skip() builds and returns a $skip parameter for an OData query.</summary>
    /// <param name="n" type="int32">The number of records to skip.</param>
    var y = "$skip=" + n.toString();
    return y;
}

simpleXrm.oData.top = function (n) {
    /// <summary>simpleXrm.oData.top() builds and returns a $top parameter for an OData query.</summary>
    /// <param name="n" type="int32">The number of records to select from the top of the query.</param>
    var y = "$top=" + n.toString();
    return y;
}

simpleXrm.oData.queryLookup = function (a, b, c) {
    /// <summary>simpleXrm.queryLookup() returns the values of attributes arguments[1,2,...] from the selected record of lookup 'a'.</summary>
    /// <param name="a" type="String">The name of the lookup attribute on the primary record.</param>
    /// <param name="b" type="String">The schema name of the entity referenced in "a". (Case sensitive)</param>
    /// <param name="c" type="Array">An array containing the attribute schema name(s) of the target attribute(s) on the related lookup record. (Case sensitive)</param>
    var x = "guid'" + simpleXrm.cleanGuid(simpleXrm.getLookupID(a.toString())) + "'";
    var e = b + "Set";
    var b = simpleXrm.oData.buildFilter(b + "Id", 'eq', x);
    var f = simpleXrm.oData.filter(b);
    var s = simpleXrm.oData.select(simpleXrm.link(c, ","));
    var q = simpleXrm.oData.buildQuery(e, s, f);
    return q;
}

simpleXrm.newGuid = function () {
    /// <summary>Returns a string containing a GUID as "P430934A-716D-401d-A893-5FC0EA51AD01"</summary>
    function s() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    var g = (s() + s() + "-" + s() + "-4" + s().substr(0, 3) + "-" + s() + "-" + s() + s() + s()).toString();
    return (s);
}

simpleXrm.newBracedGuid = function () {
    /// <summary>Returns a string containing a GUID wrapped in braces as "{P430934A-716D-401d-A893-5FC0EA51AD01}"</summary>
    return "{" + newGuid() + "}";
}

simpleXrm.cleanGuid = function (g) {
    /// <summary>Returns a guid without braces.</summary>
    return g.replace("{", "").replace("}", "");
}

simpleXrm.wrapGuid = function (g) {
    /// <summary>Returns a guid with braces.</summary>
    return "{" + simpleXrm.cleanGuid(g) + "}";
}

simpleXrm.layout = {}

simpleXrm.layout.cellXML = function (n, w) {
    /// <summary>simpleXrm.buildCellXml() returns a cell XML element for attribute 'n' and width 'w'.</summary>
    /// <param name="n" type="String">The name of the attribute to be shown in the column.</param>
    return "<cell name='" + n.toString() + "' width='" + w.toString() + "' />";
}

simpleXrm.layout.rowXML = function (a, c, n) {
    /// <summary>simpleXrm.rowXML() returns a row XML element including all child cell elements passed as an array 'c'.</summary>
    /// <param name="a" type="String">The attribute that represents the unique id in the row.</param>
    /// <param name="c" type="Array">An array of strings representing each cell/column in the row. Use simpleXrm.cellXML() to build the elements of the array.</param>
    /// <param name="n" type="String">The name of the Row. Either the entity singular name</param>
    if (!simpleXrm.valid(n.toString())) {
        n = "result";
    };
    var r = "<row id='" + a.toString() + "' name='" + n.toString() + "'>";
    for (i = 0; i < c.length; i++) {
        r += c[i];
    };
    r += "</row>";
    return r;
}

simpleXrm.layout.gridXML = function (o, a, r, n, p, c) {
    /// <summary>Description</summary>
    /// <param name="o" type="String">The 'object' input for the grid. Accepts an entity type code for the grid.</param>
    /// <param name="a" type="String">The 'jump' input for the grid. Accepts the name of the attribute that will be used to filter rows using the alphabetical index at the bottom of the grid.</param>
    /// <param name="r" type="Array">An array of strings representing each row in the grid. Typically length === 1.</param>
    /// <param name="n" type="String">The 'name' input for the grid. Accepts the plural entity name, or "resultset" (defaults to "resultset").</param>
    /// <param name="p" type="Boolean">The 'preview' input for the grid. Defaults to true.</param>
    /// <param name="c" type="Boolean">The 'icon' input for the grid. Determines whether to display icons in the grid view. Defaults to false.</param>
    if (c != true) {
        c = 0;
    } else {
        c = 1;
    };
    if (p != false) {
        p = 1;
    } else {
        p = 0;
    }
    if (!simpleXrm.valid(n.toString())) {
        n = "resultset";
    };
    var g = "<grid icon='" + c.toString() + "' jump='" + a.toString() + "' name='" + n.toString() + "' object='" + o + "' preview='" + p + "' select='true' >";
    for (i = 0; i < r.length; i++) {
        g += r[i];
    };
    g += "</ grid>";
    return g;
}