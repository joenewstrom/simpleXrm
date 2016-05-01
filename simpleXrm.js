/// <summary>
/// VERSION 1.7.2 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
/// simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
/// In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
/// To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
/// 
/// simpleXrm: the base library for form scripts
/// </summary>

var simpleXrm = {
    error: function (e, m) {
        /// <summary>
        /// simpleXrm.error() returns an error message, writes to the console, and optionally presents the user with a custom message
        /// </summary>
        /// <param name="e" type="String">
        /// The element (attribute, control, argument) that throws the error.
        /// </param>
        if (m) {
            simpleXrm.timedFormError(m, 3000);
        }
        console.log("Error originating in a script using the simpleXrm.js library. Contact your CRM Administrator with the following details: Element " + e.toString() + " was not found or is invalid.");
        //throw new Error("Error: Oops! Something went wrong with a script. Contact your CRM Administrator with the following details: Element " + e.toString() + " was not found or is invalid.");
    },
    allAttributes: function () {
        return Xrm.Page.data.entity.attributes;
    },
    getAttDate: function (a) {
        /// <summary>
        /// simpleXrm.getAttDate() returns a JSON date object from a date or datetime field in CRM
        /// </summary>
        var x = simpleXrm.getAttVal(a), d;
        if (x) {
            d = {
                year: x.getFullYear(),
                month: x.getMonth(),
                date: x.getDate(),
                hours: x.getHours(),
                minutes: x.getMinutes()
            }
        }
        return d || null;
    },
    parseDuration: function (d) {
        /// <summary>
        /// simpleXrm.parseDuration() returns a time in minutes from milliseconds (when calculating durations from javascript dates this will be useful.
        /// </summary>
        var x;
        if (d) {
            x = d * 60000;
        }
        return x || null;
    },
    parseDate: function (d) {
        /// <summary>
        /// simpleXrm.parseDate() returns a new javascript date from a JSON date object 'd'.
        /// </summary>
        var x;
        if (d) {
            x = new Date(d.year, d.month, d.date, d.hours, d.minutes).getTime() || null;
        }
        return x || null;
    },
    refreshRibbon: function () {
        Xrm.Page.ui.refreshRibbon()
    },
    getFormId: function () {
        return Xrm.Page.ui.formSelector.getCurrentItem().getId();
    },
    offsetTime: function (x, y) {
        /// <summary>
        /// simpleXrm.offsetTime() returns the time calculated by adding y hours to date/time field x.
        /// </summary>
        var z = simpleXrm.getAttVal(x) || null;
        var year = z.getFullYear() || null;
        var month = z.getMonth() || null;
        var date = z.getDate() || null;
        var hours = z.getHours() || null;
        var minutes = z.getMinutes() || null;
        //calculate the desired value for targetTime shifting the hours value by hoursOffset.
        var t = new Date(year, month, date, hours + y, minutes) || null;
        return t;
    },
    valid: function (a) {
        /// <summary>
        /// simpleXrm.valid() returns true if the argument 'a' is a valid argument. This method can often be shortcutted by using native JavaScript coersion, 
        /// or the double-negative operator '!!' which explicitly evaluates !!x to either true or false. simpleXrm.valid(a) is usually
        /// equivalent to !!a with the notable exception of numerical fields which will return false when equal to zero
        ///
        ///</summary>
        ///<parameter name="a" type="Argument">the argument that is checked for validity in the DOM/Xrm collection(s)</parameter>
        return (a != null && a != undefined);
    },
    doesNotContainData: function (a) {
        /// <summary>
        /// simpleXrm.doesNotContainData() returns true if the attribute 'a' does not have a value and false otherwise
        /// </summary>
        /// <param name="a" type="Attribute">
        /// The attribute to be checked for data. sample usage: simpleXrm.doesNotContainData('companyname')
        /// </param>
        return !Xrm.Page.getAttribute(a).getValue();
    },
    containsData: function (a) {
        /// <summary>
        /// simpleXrm.containsData() returns true if the attribute 'a' has a value and false otherwise.
        /// Sample Usage: simpleXrm.containsData('companyname')
        /// </summary>
        /// <param name="a" type="Attribute">
        /// The attribute to be checked for data. 
        /// </param>
        return simpleXrm.valid(Xrm.Page.getAttribute(a).getValue()) || false;
    },
    validAtt: function (a) {
        /// <summary>
        /// simpleXrm.validAtt() checks for existence of an attribute 'a' in the Xrm.Page.attributes collection.
        /// sample usage: simpleXrm.validAtt('companyname')
        /// </summary>
        /// <param name="a" type="String">
        /// an attribute 'a' in the Xrm.Page.attributes collection
        /// </param>
        return (a && Xrm.Page.getAttribute(a)) || false;
    },
    getCurrentId: function () {
        /// <summary>
        /// simpleXrm.getCurrentId() returns the GUID for the current selected record.
        /// Sample usage: simpleXrm.getCurrentId() returns a GUID as a string for the record whose form is displayed on the screen.
        /// </summary>
        return Xrm.Page.data.entity.getId();
    },
    getCurrentUserId: function () {
        Xrm.Page.context.getUserId();
    },
    getCurrentUserName: function () {
        Xrm.Page.context.getUserName();
    },
    getCurrentEntityName: function () {
        /// <summary>
        /// simpleXrm.getCurrentEntityName() returns the Entity Logical Name for the current selected record.
        /// Sample usage: simpleXrm.getCurrentEntityName() returns a string such as "contact" for the record whose form is displayed on the screen.
        /// </summary>
        return Xrm.Page.data.entity.getEntityName();
    },
    getCurrentPrimaryName: function () {
        /// <summary>
        /// simpleXrm.getCurrentPrimaryName() returns the record Name for the current selected record.
        /// Sample usage: simpleXrm.getCurrentPrimaryName() returns a string such as "A Bicycle Company" for the record whose form is displayed on the screen.
        /// </summary>
        return Xrm.Page.data.entity.getPrimaryAttributeValue();
    },
    getAtt: function (a) {
        /// <summary>
        /// simpleXrm.getAtt() returns the attribute object for attribute named 'a'.
        /// Sample usage: simpleXrm.getAtt('companyname') returns an attribute object if companyname is on the current form; logical equivalent to Xrm.Page.getAttribute('companyname')
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the attribute.
        /// </param>
        return Xrm.Page.getAttribute(a);
    },
    getAttType: function (a) {
        /// <summary>
        /// Returns the attribute type of attribute a'.
        /// Sample usage: simpleXrm.getAttType('companyname') returns "string".
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the attribute to investigate.
        /// </param>
        return Xrm.Page.getAttribute(a).getAttributeType();
    },
    getAttVal: function (a) {
        ///<summary>
        ///simpleXrm.getAttVal() returns the current value of attribute 'a'.
        ///Sample usage: simpleXrm.getAttVal('companyname') returns the value of companyname e.g. "An Old Company".
        ///</summary>
        /// <param name="a" type="String">
        /// The name of the attribute.
        /// </param>
        return Xrm.Page.getAttribute(a).getValue();
    },
    hasVal: function (a) {
        /// <summary>
        /// simpleXrm.hasVal() returns true if the current value of the attribute 'a' has info.
        /// Sample usage: ///simpleXrm.getAttVal('companyname') returns the value of companyname e.g. "An Old Company".
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the attribute.
        /// </param>
        return simpleXrm.valid(Xrm.Page.getAttribute(a).getValue()) || false;
    },
    getLookupVal: function (a) {
        /// <summary>
        /// simpleXrm.getLookupVal() returns the name of the selected record in a lookup attribute, or returns null if
        /// no record is selected. Sample usage: simpleXrm.getLookupVal(customerid)
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the lookup attribute to get the value from.
        /// </param>
        if (simpleXrm.getAttVal(a)) {
            return Xrm.Page.getAttribute(a).getValue()[0].name
        } else {
            return null;
        }
    },
    getLookupID: function (a) {
        /// <summary>
        /// simpleXrm.getLookupID() returns the GUID of the selected record in a lookup attribute, or returns null if no
        /// record is selected. Sample usage: simpleXrm.getLookupID(customerid) returns the GUID of the current customer.
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the lookup attribute to get the value from.
        /// </param>
        if (simpleXrm.getAttVal(a)) {
            return Xrm.Page.getAttribute(a).getValue()[0].id
        } else {
            return null;
        }
    },
    getLookupEntityName: function (a) {
        /// <summary>
        /// simpleXrm.getLookupEntityName() returns the entity logical name of the selected record in a lookup attribute, or returns null if no record is selected.
        /// Sample usage: simpleXrm.getLookupEntityName(customerid) returns the entity logical name ('contact' or 'account') for the current customer.
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the lookup attribute to get the value from.
        /// </param>
        if (simpleXrm.getAttVal(a)) {
            return Xrm.Page.getAttribute(a).getValue()[0].entityType
        } else {
            return null;
        }
    },
    setAttVal: function (a, v) {
        /// <summary>
        /// simpleXrm.setAttVal() sets the value of the attribute 'a' to value 'v'. sample usage:
        /// simpleXrm.setAttVal(companyname,"A New Company") overwrites value of companyname with "A New Company".
        /// </summary>
        /// <param name="a" type="String">
        /// The target attribute as a string.
        /// </param>
        /// <param name="v" type="Varies">
        /// The value passed to the target attribute. Check Dynamics CRM SDK for acceptable values based on different attribute types. Note: rejects v = null. Use simpleXrm.clearAttVal() to clear
        /// field value.
        /// </param>
        if (v || v === false || v === 0) {
            try {
                Xrm.Page.getAttribute(a).setValue(v);
            } catch (e) {
                simpleXrm.error(a, "Could not set the value of attribute " + a + " to value " + v.toString() + ".")
            }
        } else {
            simpleXrm.clearAttVal(a);
        }

    },
    clearAttVal: function (a) {
        /// <summary>
        /// simpleXrm.clearAttVal() clears the value of the attribute 'a'. Sample usage: simpleXrm.clearAttVal('companyname')
        /// changes companyname to null.
        /// </summary>
        /// <param name="a" type="String">The target attribute passed as a string.</param>
        Xrm.Page.getAttribute(a.toString()).setValue(null);
        simpleXrm.sendAttAlways(a.toString());
    },
    clearAttsVal: function () {
        /// <summary>simpleXrm.clearAttsVal() clears the current value of the attribute(s) passed as arguments.
        /// Sample usage: simpleXrm.clearAttsVal(companyname, firstname, lastname) clears the current values of
        /// attributes 'companyname', 'firstname', and 'lastname'.
        /// </summary>
        /// <param name="arguments[i] for i >= 0" type="String">The attribute(s) to be cleared of value(s).</param>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.clearAttVal(arguments[i]);
        }
    },
    sendAttAlways: function (a) {
        /// <summary>
        /// simpleXrm.sendAttAlways() includes the current value of 'a' in the XML form data submitted to the server.
        /// Sample usage: simpleXrm.sendAttAlways('companyname') will send the value of companyname to the server
        /// regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'.
        /// </summary>
        /// <param name="a" type="String">
        /// The attribute to be submitted to the server.
        /// </param>
        simpleXrm.getAtt(a).setSubmitMode("always");
    },
    sendAttsAlways: function () {
        /// <summary>
        /// simpleXrm.sendAttsAlways() includes the current values of all attribute(s) passed as arguments to the function in the XML form data submitted to the server.
        /// Sample usage: simpleXrm.sendAttsAlways(companyname,firstname,lastname,fullname) will send the values of attributes 'companyname', 'firstname', 'lastname', and 'fullname' to the server
        /// regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'.
        /// </summary>
        /// <param name="arguments[i] for i >= 0" type="String">
        /// The attribute(s) to be submitted to the server.
        /// </param>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.sendAttAlways(arguments[i]);
        }
    },
    sendAttNever: function (a) {
        /// <summary>
        /// simpleXrm.sendAttNever() excludes the current value of 'a' in the XML form data submitted to the server.
        /// Sample usage: simpleXrm.sendAttNever('companyname') will not send the value of companyname to the server
        /// regardless of whether the field value was modified ('dirty').
        /// </summary>
        /// <param name="a" type="String">The name of the attribute.</param>
        simpleXrm.getAtt(a).setSubmitMode("never");
    },
    sendAttsNever: function () {
        /// <summary>
        /// sendAttsNever() excludes the current values of all attributes 'a1', 'a2', etc. passed as arguments
        /// to the function in the XML form data submitted to the server
        /// sample usage: simpleXrm.sendAttsNever(companyname,firstname,lastname,fullname) 
        /// will not send the values of attributes 'companyname', 'firstname', 'lastname', and
        /// 'fullname' to the server regardless of whether the field values were modified ('dirty')
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.sendAttNever(arguments[i]);
        }
    },
    sendAttChanges: function (a) {
        /// <summary>
        /// sendAttChanges() will only include the value of 'a' in the XML form data submitted to the server if 'a' was updated/modified
        /// sample usage: simpleXrm.sendAttChanges('companyname') will send the value of companyname to the server
        /// only if/when the field value was modified ('dirty')
        /// </summary>
        simpleXrm.getAtt(a).setSubmitMode("dirty");
    },
    sendAttsChanges: function () {
        /// <summary>
        /// sendAttsChanges() will only include the current values of all attributes 'a1', 'a2', etc. passed as arguments
        /// to the function in the XML form data submitted to the server if each individual attribute was updated/modified
        /// sample usage: simpleXrm.sendAttsChanges(companyname,firstname,lastname,fullname) 
        /// will only send the values of attributes 'companyname', 'firstname', 'lastname', and
        /// 'fullname' to the server if the field values were updated or modified ('dirty')
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.sendAttChanges(arguments[i]);
        }
    },
    getAttReqd: function (a) {
        /// <summary>
        /// getAttReqd() returns the required status of attribute 'a'
        /// sample usage: simpleXrm.getAttReqd('companyname') 
        /// returns 'required', 'recommended', or 'none' depending on the requirement level of the attribute
        /// </summary>    
        return simpleXrm.getAtt(a).getRequiredLevel();
    },
    setAttReqd: function (a) {
        /// <summary>
        /// setAttReqd() sets the required status of attribute 'a' to 'required'
        /// sample usage: simpleXrm.setAttReqd('companyname') 
        /// attribute 'companyname' is now business required
        /// </summary>
        simpleXrm.getAtt(a).setRequiredLevel("required");
    },
    setAttsReqd: function () {
        /// <summary>
        /// setAttsReqd() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
        /// to the function to 'required'
        /// sample usage: simpleXrm.setAttsReqd(companyname,firstname,lastname,fullname) 
        /// attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business required
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.setAttReqd(arguments[i]);
        }
    },
    clearAttReqd: function (a) {
        /// <summary>
        /// clearAttReqd() sets the required status of attribute 'a' to 'none'
        /// sample usage: simpleXrm.clearAttReqd('companyname') 
        /// attribute 'companyname' is not business required
        /// </summary>
        simpleXrm.getAtt(a).setRequiredLevel("none");
    },
    clearAttsReqd: function () {
        /// <summary>
        /// simpleXrm.clearAttsReqd() sets the requirement level of all attributes 'a1', 'a2', etc. passed as arguments to 'not required'.
        /// Sample usage: simpleXrm.clearAttsReqd(companyname,firstname,lastname,fullname) changes attributes 'companyname',
        /// 'firstname', 'lastname', and 'fullname' to not business required.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.clearAttReqd(arguments[i]);
        }
    },
    setAttRecommended: function (a) {
        /// <summary>
        /// simpleXrm.setAttRecommended() sets the required status of attribute 'a' to 'recommended'
        /// sample usage: simpleXrm.setAttRecommended('companyname') changes attribute 'companyname' to 'business recommended'.
        /// </summary>
        simpleXrm.getAtt(a).setRequiredLevel("recommended");
    },
    setAttsRecommended: function () {
        /// <summary>
        /// setAttsRecommended() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
        /// to the function to 'recommended'
        /// sample usage: simpleXrm.setAttsRecommended(companyname,firstname,lastname,fullname) 
        /// attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business recommended
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.setAttRecommended(arguments[i]);
        }
    },
    fireOnChange: function (a) {
        /// <summary>
        /// fireOnChange() mirrors the SDK implementation of Xrm.Page.getAttribute().fireOnChange()
        /// sample usage: simpleXrm.fireOnChange('companyname')
        /// triggers scripts registered on the change event of 'companyname' if it is included in the attributes collection
        /// </summary>
        simpleXrm.getAtt(a).fireOnChange();
    },
    fireChanges: function () {
        /// <summary>
        /// fireChanges() triggers the onChange events of all attributes 'a1', 'a2', etc.
        /// passed as arguments to the function.
        /// sample usage: simpleXrm.fireChanges(companyname,firstname,lastname,fullname) 
        /// scripts running onChange for attributes 'companyname', 'firstname', 'lastname', and 'fullname' will now run
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.fireOnChange(arguments[i]);
        }
    },
    addOnChange: function (o) {
        simpleXrm.getAtt(o.attribute).addOnChange(o.handler);
    },
    removeOnChange: function (o) {
        simpleXrm.getAtt(o.attribute).removeOnChange(o.handler);
    },
    validCtrl: function (c) {
        /// <summary>
        /// validCtrl() checks the form for control 'c'
        /// sample usage: simpleXrm.validCtrl('companyname') 
        /// returns true if 'companyname' is present on the form
        /// (note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)
        /// </summary>
        return simpleXrm.valid(Xrm.Page.getControl(c)) || false;
    },
    getCtrl: function (c) {
        /// <summary>
        /// getCtrl() gets the object for control 'c'
        /// sample usage: simpleXrm.getCtrl('companyname') 
        /// returns a control object if 'companyname' is present on the form
        /// (note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)
        /// </summary>
        return Xrm.Page.getControl(c);
    },
    getAllCtrls: function (a) {
        /// <summary>
        /// simpleXrm.getAllCtrls() returns an array containing all controls for attribute 'a'.
        /// Sample usage: simpleXrm.getAllCtrls("companyname")
        /// creturns an array of control objects if 'companyname' is present on the form ['companyname','companyname1','companyname2'...].
        /// </summary>
        /// <param name="a" type="String">The name of the attribute whose controls collection will' be returned.</param>
        return simpleXrm.getAtt(a).controls;
    },
    showCtrl: function (c) {
        /// <summary>
        /// simpleXrm.showCtrl() shows the control 'c' (if the name of an attribute is passed, it will
        /// show the first control for that attribute on the page).
        /// Sample usage: simpleXrm.showCtrl("companyname")
        /// changes visibility of the first control for attribute 'companyname'to visible.
        /// </summary>
        /// <param name="c" type="String">The name of the control to be shown.</param>
        simpleXrm.getCtrl(c).setVisible(true);
    },
    showCtrls: function () {
        /// <summary>
        /// simpleXrm.showCtrls() shows all controls 'c1, c2, c3' passed as arguments
        /// Sample usage: simpleXrm.showCtrls("companyname","firstname","lastname","fullname")
        /// changes visibility of the first control for attributes 'companyname', 'firstname',
        /// 'lastname', and 'fullname' to visible.
        ///</summary>
        /// <param name="arguments[i]" type="String">The name of the control(s) to be shown, separated by commas.</param>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.showCtrl(arguments[i]);
        }
    },
    hideCtrl: function (c) {
        /// <summary>
        /// simpleXrm.hideCtrl() hides the control 'c' (if the name of an attribute is passed, it will
        /// hide the first control for that attribute on the page).
        /// Sample usage: simpleXrm.hideCtrl("companyname")
        /// changes visibility of the first control for attribute 'companyname'to hidden.
        /// </summary>
        /// <param name="c" type="String">The name of the control to be hidden.</param>
        simpleXrm.getCtrl(c).setVisible(false);
    },
    hideCtrls: function () {
        /// <summary>
        /// simpleXrm.hideCtrls() hides all controls 'c1, c2, c3' passed as arguments
        /// Sample usage: simpleXrm.hideCtrls("companyname","firstname","lastname","fullname")
        /// changes visibility of the first control for attributes 'companyname', 'firstname',
        /// 'lastname', and 'fullname' to hidden.
        /// </summary>
        /// <param name="arguments[i]" type="String">The name of the control(s) to be hidden, separated by commas.</param>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.hideCtrl(arguments[i]);
        }
    },
    clearOptions: function (a) {
        /// <summary>simpleXrm.clearOptions() clears all options from all controls for attribute "a".</summary>
        /// <param name="a" type="String">The name of the optionset attribute to clear.</param>
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.clearOptions();
        });
    },
    restoreOptions: function (a) {
        /// <summary>simpleXrm.restoreOptions() restores all options from all controls for attribute "a".</summary>
        /// <param name="a" type="String">The name of the optionset attribute to restore.</param>
        simpleXrm.clearOptions(a);
        simpleXrm.getAllCtrls(a).forEach(function (c, i) {
            simpleXrm.getAtt(a).getOptions().forEach(function (z, j) {
                c.addOption(z);
            });
        });
    },
    removeOption: function (a, o) {
        /// <summary>simpleXrm.removeOption removes an option with value "o" from all controls for attribute "a". </summary>
        /// <param name="a" type="String">The name of the optionset attribute to restore.</param>
        /// <param name="o" type="Integer">The value of the option to remove from attribute "a".</param>
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.removeOption(o);
        });
    },
    showAllCtrls: function () {
        /// <summary>
        /// simpleXrm.showAllCtrls() shows all controls for attribute 'a'
        /// sample usage: simpleXrm.showAllCtrls('companyname')
        /// changes visibility of all controls for attribute 'companyname' to visible
        /// </summary>
        for (var j = 0, len = arguments.length; j < len; j++) {
            simpleXrm.getAllCtrls(arguments[j]).forEach(function (x, i) {
                x.setVisible(true);
            });
        }
    },
    hideAllCtrls: function (a) {
        /// <summary>
        /// simpleXrm.hideAllCtrls() hides all controls for attribute 'a'
        /// sample usage: simpleXrm.hideAllCtrls('companyname') changes visibility of all controls for attribute 'companyname' to hidden
        /// </summary>
        for (var j = 0, len = arguments.length; j < len; j++) {
            simpleXrm.getAllCtrls(arguments[j]).forEach(function (x, i) {
                x.setVisible(false);
            });
        }
    },
    lockCtrl: function (c) {
        /// <summary>
        /// simpleXrm.lockCtrl() locks the control 'c'
        /// sample usage: simpleXrm.lockCtrl('companyname') locks the first control for attribute 'companyname'
        /// </summary>
        simpleXrm.getCtrl(c).setDisabled(true);
    },
    lockCtrls: function () {
        /// <summary>
        /// simpleXrm.lockCtrls() locks all controls 'c1', 'c2', 'c3' passed as arguments to the function
        /// sample usage: simpleXrm.lockCtrls(companyname, firstname, lastname) locks the first control for attributes 'companyname', 'firstname', and 'lastname'
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.lockCtrl(arguments[i]);
        }
    },
    unlockCtrl: function (c) {
        /// <summary>
        /// simpleXrm.unlockCtrl()  unlocks the control 'c'
        /// sample usage: simpleXrm.unlockCtrl('companyname') unlocks the first control for attribute 'companyname'
        /// </summary>
        simpleXrm.getCtrl(c).setDisabled(false);
    },
    unlockCtrls: function () {
        /// <summary>
        /// simpleXrm.unlockCtrls()  unlocks all controls 'c1', 'c2', 'c3' passed as arguments to the function
        /// sample usage: simpleXrm.unlockCtrls(companyname, firstname, lastname) unlocks the first control for attributes 'companyname', 'firstname', and 'lastname'
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.unlockCtrl(arguments[i]);
        }
    },
    lockAllCtrls: function () {
        /// <summary>
        /// simpleXrm.lockAllCtrls() locks all controls for attribute 'a'
        /// sample usage: simpleXrm.lockAllCtrls('companyname') locks all controls for attribute 'companyname'
        /// </summary>
        for (var j = 0, len = arguments.length; j < len; j++) {
            simpleXrm.getAllCtrls(arguments[j]).forEach(function (x, i) {
                x.setDisabled(true);
            });
        }
    },
    unlockAllCtrls: function () {
        /// <summary>
        /// simpleXrm.unlockAllCtrls() unlocks all controls for attribute 'a'
        /// sample usage: simpleXrm.unlockAllCtrls('companyname') unlocks all controls for attribute 'companyname'
        /// </summary>
        for (var j = 0, len = arguments.length; j < len; j++) {
            simpleXrm.getAllCtrls(arguments[j]).forEach(function (x, i) {
                x.setDisabled(false);
            });
        }
    },
    relabelCtrl: function (c, v) {
        /// <summary>
        /// simpleXrm.relabelCtrl() changes the label for control 'c' to value 'v' (requires string in quotes)
        /// sample usage: simpleXrm.relabelCtrl(companyname, "Account Name") changes the label for the first control for attribute 'companyname' to "Account Name"
        /// </summary>
        simpleXrm.getCtrl(c).setLabel(v);
    },
    relabelAllCtrls: function (a, v) {
        /// <summary>
        /// simpleXrm.relabelAllCtrls() changes the label for all controls for attribute 'a' to value 'v' (requires string in quotes)
        /// sample usage: simpleXrm.relabelAllCtrls(companyname, "Account Name") changes the label for all controls for attribute 'companyname' to "Account Name"
        /// </summary>
        simpleXrm.getAllCtrls(a).forEach(function (x, i) {
            x.setLabel(v);
        });
    },
    allTabs: function () {
        /// <summary>
        /// simpleXrm.allTabs() returns the objects for all tabs
        /// sample usage: simpleXrm.allTabs().get() returns an array [tab, tab_2, tab_3,...]
        /// </summary>
        return Xrm.Page.ui.tabs;
    },
    validTab: function (t) {
        /// <summary>
        /// simpleXrm.validTab() checks the form for tab 't'
        /// sample usage: simpleXrm.validTab('tab_2') returns true if two tabs are present on the form and the second tab's default name has not been modified
        /// </summary>
        return !!simpleXrm.allTabs().get(t) || false;
    },
    getTab: function (t) {
        /// <summary>
        /// simpleXrm.getTab() returns the object for tab 't'
        /// sample usage: simpleXrm.getTab('tab_2') returns the object tab_2
        /// </summary>
        return simpleXrm.allTabs().get(t.toString());
    },
    showTab: function (t) {
        /// <summary>
        /// simpleXrm.showTab() shows tab 't'
        /// sample usage: simpleXrm.showTab(tab_2) changes the visibility of tab_2 to visible
        /// </summary>
        simpleXrm.getTab(t).setVisible(true);
    },
    showTabs: function () {
        /// <summary>
        /// simpleXrm.showTabs() shows all tabs 't1', 't2', 't3' passed as arguments to the function
        /// sample usage: simpleXrm.showTabs(tab_1,tab_2,tab_4) changes the visibility of tab_1, tab_2, and tab_4_ to visible
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.showTab(arguments[i]);
        }
    },
    hideTab: function (t) {
        /// <summary>
        /// simpleXrm.hideTab() hides tab 't'
        /// sample usage: simpleXrm.hideTab(tab_2) changes the visibility of tab_2 to hidden
        /// </summary>
        simpleXrm.getTab(t).setVisible(false);
    },
    hideTabs: function () {
        /// <summary>
        /// simpleXrm.hideTabs() hides all tabs 't1', 't2', 't3' passed as arguments to the function
        /// sample usage: simpleXrm.hideTabs(tab_1,tab_2,tab_4) changes the visibility of tab_1, tab_2, and tab_4_ to hidden
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.hideTab(arguments[i]);
        }
    },
    validSection: function (s) {
        /// <summary>
        /// simpleXrm.validSection() checks the form for section 's'
        /// sample usage: simpleXrm.validSection(tab_2_section_1) returns true if two tabs are present on the form,
        /// the second tab's default name has not been modified, and the tab's first section's default name has not been modified
        /// </summary>
        var t = false;
        simpleXrm.allTabs().forEach(function (x, i) {
            if (!!x.sections.get(s.toString())) {
                t = true;
            }
        });
        return t;
    },
    getSection: function (s) {
        /// <summary>
        /// simpleXrm.getSection() returns the object for section 's'
        /// sample usage: simpleXrm.getSection(tab_2_section_1) returns the object tab_2_section_1
        /// </summary>
        var t = null;
        simpleXrm.allTabs().forEach(function (x, i) {
            if (simpleXrm.valid(x.sections.get(s.toString()))) {
                t = x.sections.get(s.toString());
            }
        });
        return t;
    },
    showSection: function (s) {
        /// <summary>
        /// simpleXrm.showSection() shows section 's'
        /// sample usage: simpleXrm.showSection(tab_2_section_1) changes the visibility of tab_2_section_1 to visible
        /// </summary>
        simpleXrm.getSection(s).setVisible(true);
    },
    showSections: function () {
        /// <summary>
        /// simpleXrm.showSections() shows all sections 's1', 's2', 's3' passed as arguments to the function
        /// sample usage: simpleXrm.showSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to visible
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.showSection(arguments[i]);
        }
    },
    hideSection: function (s) {
        /// <summary>
        /// simpleXrm.hideSection() hides section 's'
        /// sample usage: simpleXrm.hideSection(tab_2_section_1) changes the visibility of tab_2_section_1 to hidden
        /// </summary>
        simpleXrm.getSection(s).setVisible(false);
    },
    hideSections: function () {
        /// <summary>
        /// simpleXrm.hideSections() hides all sections 's1', 's2', 's3' passed as arguments to the function
        /// sample usage: simpleXrm.hideSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to hidden
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.hideSection(arguments[i]);
        }
    },
    closeAtt: function (a) {
        /// <summary>
        /// simpleXrm.closeAtt() changes attribute 'a' to Not Business Required and clears the value.
        /// It also locks and hides all controls for that attribute.
        /// </summary>
        simpleXrm.hideAllCtrls(a);
        simpleXrm.clearAttReqd(a);
        simpleXrm.clearAttVal(a);
        simpleXrm.lockAllCtrls(a);
        simpleXrm.sendAttChanges(a);
    },
    closeAtts: function () {
        /// <summary>
        /// simpleXrm.closeAtts() changes all attributes passed as arguments to Not Business Required and clears the values
        /// It also locks and hides all controls for those attributes.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.closeAtt(arguments[i]);
        }
    },
    openAtt: function (a) {
        /// <summary>
        /// simpleXrm.openAtt() unlocks and shows all controls for attribute 'a'.
        /// </summary>
        simpleXrm.unlockAllCtrls(a);
        simpleXrm.showAllCtrls(a);
        simpleXrm.sendAttChanges(a);
    },
    openAtts: function () {
        /// <summary>
        ///     simpleXrm.openAtts() unlocks and shows all controls for all attributes passed as arguments.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.openAtt(arguments[i]);
        }
    },
    sumAtts: function () {
        /// <summary>
        /// simpleXrm.sumAtts() adds the values of the fields passed as arguments to the function
        /// sample usage: simpleXrm.sumAtts(price1, price2, price3) returns the sum of the current values of price1, price2, and price3
        /// </summary>
        var sum = 0;
        for (var i = 0; i < arguments.length; i++) {
            if (!isNaN(simpleXrm.getAttVal(arguments[i]))) {
                sum += simpleXrm.getAttVal(arguments[i]);
            }
        }
        return sum;
    },
    calculatePercent: function (p, t) {
        /// <summary>
        /// Calculates the percentage equivalent of p/t.
        /// </summary>
        return (p / t) * 100;
    },
    link: function (a, o) {
        /// <summary>
        /// Links elements of array 'a' using the joining character 'o'.
        /// </summary>
        if (a.length === 1) {
            return a[0].toString();
        } else {
            return a.join(o);
        }
    },
    cleanGuid: function (g) {
        /// <summary>
        /// Returns a guid without braces.
        /// </summary>
        var t = g;
        try {
            t = t.replace("{", "")
        } catch (e) {
        };
        try {
            t = t.replace("}", "")
        } catch (e) {
        };
        return t;
    },
    wrapGuid: function (g) {
        /// <summary>
        /// Returns a guid with braces if g is valid, otherwise returns null.
        /// </summary>
        return "{" + simpleXrm.cleanGuid(g) + "}";
    },
    newGuid: function () {
        /// <summary>
        /// Returns a string containing a GUID as "P430934A-716D-401d-A893-5FC0EA51AD01". Not secure. Not for creation of database records. Just a workaround for short-lived GUIDs that are necessary
        /// to hold in memory for methods such as setCustomView()
        /// </summary>
        function s() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (s() + s() + "-" + s() + "-4" + s().substr(0, 3) + "-" + s() + "-" + s() + s() + s()).toString().toUpperCase();
    },
    newBracedGuid: function () {
        /// <summary>
        /// Returns a string containing a GUID wrapped in braces as "{P430934A-716D-401d-A893-5FC0EA51AD01}"
        /// </summary>
        return simpleXrm.wrapGuid(simpleXrm.newGuid());
    },
    timeStamp: function (x, y) {
        /// <summary>
        /// simpleXrm.timeStamp() sets the value of field "x" to the current date/time. Checks optional boolean value y to identify whether to overwrite existing values.
        /// </summary>
        /// <param name="x" type="String">
        /// The field to time stamp.
        /// </param>
        /// <param name="y" type="Boolean">
        /// (Optional) Determines whether to overwrite existing values with the current time.
        /// </param>
        var t = Xrm.Page.getAttribute(x).getValue();
        if (!t || y === true) {
            var z = new Date();
            Xrm.Page.getAttribute(x).setValue(z);
            Xrm.Page.getAttribute(x).setSubmitMode("dirty");
        }
    },
    parseRESTLookup: function (a) {
        /// <summary>
        /// simpleXrm.parseRESTLookup() takes response to OData REST endpoint query as an argument "a" and returns an object which can be directly piped into a CRM lookup using the JavaScript API.
        /// </summary>
        /// <param name="a" type="Object">
        /// An Object returned by a query to the Dynamics CRM OData REST Endpoint. Has the following attributes:
        ///     LogicalName: The entity logical name.
        ///     Id: The GUID of the record.
        ///     Name: The primary attribute (name) of the record.
        /// </param>
        try {
            var r = null;
            if (a.LogicalName && a.Id && a.Name) {
                r = [{
                    entityType: a.LogicalName,
                    id: simpleXrm.wrapGuid(a.Id),
                    name: a.Name
                }];
            }
            return r;
        } catch (e) {
            return null;
        }
    },
    setLookupVal: function (a, b, c) {
        /// <summary>
        /// simpleXrm.setLookupVal() uses an object array passed as "b" to set the lookup value when attribute "a" either does not have a value or when overwrite boolean "c" is true.
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the lookup attribute to set.
        /// </param>
        /// <param name="b" type="Array">
        /// An Array containing one or more objects (activity party lookups can have b.length > 1) of the form [{}].
        /// </param>
        /// <param name="c" type="Boolean">
        /// A boolean that identifies whether or not to override existing values.
        /// </param>
        var x = b || null;
        var y = true;
        if (c === false) {
            y = false;
        }
        if (y) {
            simpleXrm.setAttVal(a, x);
        }
    },
    setBooleanDefault: function (a) {
        /// <summary>
        /// simpleXrm.setBooleanDefault() sets the value of boolean field "a" to false if it is not true. This eliminates the annoyance of having to click twice to check a box in the BPF in CRM 2013.
        /// </summary>
        if (!simpleXrm.getAttVal(a)) {
            simpleXrm.setAttVal(a, false);
        }
    },
    setBooleanDefaults: function () {
        /// <summary>
        /// simpleXrm.setBooleanDefaults() sets the value to false if it is not true for all attributes passed as arguments.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.setBooleanDefault(arguments[i]);
        }
    },
    applyFilter: function (a, f) {
        /// <summary>
        /// simpleXrm.applyFilter() applies a filter "f" to lookup attribute "a".
        /// </summary>
        simpleXrm.getCtrl(a).addPreSearch(function (f) {
            simpleXrm.getCtrl(a).addCustomFilter(f)
        });
    },
    closeSection: function (s) {
        /// <summary>
        /// simpleXrm.closeSection() hides the specified section 's' and clears the value of all attributes with controls within the section.
        /// </summary>
        simpleXrm.hideSection(s);
        simpleXrm.getSection(s).controls.forEach(function (c, i) {
            c.setVisible(false);
            if (c.getAttribute) {
                c.getAttribute().setValue(null);
                c.getAttribute().setSubmitMode("dirty");
                c.getAttribute().setRequiredLevel("none");
                c.setDisabled(true);
            }
        });
    },
    closeSections: function () {
        /// <summary>
        /// simpleXrm.closeSections() hides all sections passed as arguments and clears the value of all attributes with controls within the sections.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.closeSection(arguments[i]);
        };
    },
    openSection: function (s) {
        /// <summary>
        /// simpleXrm.openSection() shows the specified section 's' and unlocks all attributes with controls within the section.
        /// </summary>
        simpleXrm.showSection(s);
        simpleXrm.getSection(s).controls.forEach(function (c, i) {
            c.setDisabled(false);
            c.setVisible(true);
        });
    },
    openSections: function () {
        /// <summary>
        /// simpleXrm.openSections() shows all sections passed as arguments and unlocks all attributes with controls within the sections.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.openSection(arguments[i]);
        };
    },
    lockSection: function (s) {
        /// <summary>
        /// simpleXrm.openSection() shows the specified section 's' and unlocks all attributes with controls within the section.
        /// </summary>
        simpleXrm.showSection(s);
        simpleXrm.getSection(s).controls.forEach(function (c, i) {
            c.setDisabled(true);
            c.setVisible(true);
        });
    },
    lockSections: function () {
        /// <summary>
        /// simpleXrm.openSections() shows all sections passed as arguments and unlocks all attributes with controls within the sections.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.lockSection(arguments[i]);
        };
    },
    closeTab: function (t) {
        /// <summary>
        /// simpleXrm.closeTab() hides the specified tab 't' and clears the value of all attributes with controls within the tab.
        /// </summary>
        simpleXrm.hideTab(t);
        simpleXrm.getTab(t).sections.forEach(function (s, i) {
            s.controls.forEach(function (c, j) {
                try {
                    c.getAttribute().setValue(null);
                } catch (e) { }
            });
        });
    },
    closeTabs: function () {
        /// <summary>
        /// simpleXrm.closeTabs() hides all tabs passed as arguments and clears the value of all attributes with controls within the tabs.
        /// </summary>
        for (var i = 0; i < arguments.length; i++) {
            simpleXrm.closeTab(arguments[i]);
        };
    },
    formatPhoneNumber: function (c) {
        /// <summary>
        /// simpleXrm.formatPhoneNumber() formats phone numbers in the North American fashion (XXX) XXX-XXXX.
        /// TO DO: Add European/International Phone Formatting with a boolean switch so that phone #s can be programmatically formatted based on Country
        /// </summary>
        var p = c.getEventSource();
        var mapPhoneAlpha = function (s) {

            var n = "";
            //loop through each char, and pass it to the translation method
            for (var i = 0; i < s.length; i++) {
                var t = s.charAt(i).toUpperCase();
                var r = t;
                switch (t) {
                    case "A":
                    case "B":
                    case "C":
                        r = 2;
                        break;
                    case "D":
                    case "E":
                    case "F":
                        r = 3;
                        break;
                    case "G":
                    case "H":
                    case "I":
                        r = 4;
                        break;
                    case "J":
                    case "K":
                    case "L":
                        r = 5;
                        break;
                    case "M":
                    case "N":
                    case "O":
                        r = 6;
                        break;
                    case "P":
                    case "Q":
                    case "R":
                    case "S":
                        r = 7;
                        break;
                    case "T":
                    case "U":
                    case "V":
                        r = 8;
                        break;
                    case "W":
                    case "X":
                    case "Y":
                    case "Z":
                        r = 9;
                        break;
                    default:
                        r = t;
                        break;
                };
                n += r;
            }
            return n;
        };
        // Verify that the field is valid
        if (simpleXrm.valid(p)) {
            if (p.getValue() != null) {
                // Remove any special characters
                var q = p.getValue().replace(/[^0-9,A-Z,a-z]/g, "");

                // Translate any letters to the equivalent phone number, if method is included
                try {
                    if (q.length <= 10) {
                        q = mapPhoneAlpha(q);
                    }
                    else {
                        q = mapPhoneAlpha(q.substr(0, 10)) + q.substr(10, q.length);
                    }
                }
                catch (e) {
                };
                switch (q.length) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 8:
                    case 9:
                        break;
                    case 7:
                        p.setValue(q.substr(0, 3) + "-" + q.substr(3, 4));
                        break;
                    case 10:
                        p.setValue("(" + q.substr(0, 3) + ") " + q.substr(3, 3) + "-" + q.substr(6, 4));
                        break;
                    default:
                        p.setValue("(" + q.substr(0, 3) + ") " + q.substr(3, 3) + "-" + q.substr(6, 4) + " " + q.substr(10, q.length));
                        break;
                }
            }
        }
    },
    replaceAll: function (x,y,z) {
        while (x.indexOf(y) >= 0) {
            x = x.replace(y,z)
        }
        return x;
    },
    cleanString: function (s) {
        s = simpleXrm.replaceAll(s, "'", "");
        s = simpleXrm.replaceAll(s, "!", "");
        s = simpleXrm.replaceAll(s, "@", "");
        s = simpleXrm.replaceAll(s, "#", "");
        s = simpleXrm.replaceAll(s, "$", "");
        s = simpleXrm.replaceAll(s, "%", "");
        s = simpleXrm.replaceAll(s, "^", "");
        s = simpleXrm.replaceAll(s, "&", "");
        s = simpleXrm.replaceAll(s, "*", "");
        s = simpleXrm.replaceAll(s, "(", "");
        s = simpleXrm.replaceAll(s, ")", "");
        s = simpleXrm.replaceAll(s, "-", "");
        s = simpleXrm.replaceAll(s, "_", "");
        s = simpleXrm.replaceAll(s, "+", "");
        s = simpleXrm.replaceAll(s, "=", "");
        s = simpleXrm.replaceAll(s, "{", "");
        s = simpleXrm.replaceAll(s, "[", "");
        s = simpleXrm.replaceAll(s, "}", "");
        s = simpleXrm.replaceAll(s, "]", "");
        s = simpleXrm.replaceAll(s, "|", "");
        s = simpleXrm.replaceAll(s, "\\", "");
        s = simpleXrm.replaceAll(s, "~", "");
        s = simpleXrm.replaceAll(s, "`", "");
        s = simpleXrm.replaceAll(s, ":", "");
        s = simpleXrm.replaceAll(s, ";", "");
        s = simpleXrm.replaceAll(s, ",", "");
        s = simpleXrm.replaceAll(s, "<", "");
        s = simpleXrm.replaceAll(s, ".", "");
        s = simpleXrm.replaceAll(s, ">", "");
        s = simpleXrm.replaceAll(s, "/", "");
        s = simpleXrm.replaceAll(s, "?", "");
        return s;
    },
    soundex: function (s) {
        /// <summary>
        /// simpleXrm.soundex() takes a field and encodes the value using the SoundEx algorithm.
        /// </summary>
        s = simpleXrm.cleanString(s);
        var a = s.toLowerCase().split(''), f = a.shift(), r = '',
        codes = {
            a: '', e: '', i: '', o: '', u: '', w: '', h: '',
            b: 1, f: 1, p: 1, v: 1,
            c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
            d: 3, t: 3,
            l: 4,
            m: 5, n: 5,
            r: 6
        };
 
        r = f +
            a
            .map(function (v, i, a) { return codes[v] })
            .filter(function (v, i, a) { return ((i === 0) ? v !== codes[f] : v !== a[i - 1]); })
            .join('');
        var checkAgain = true;
        while (checkAgain === true) {
            checkAgain = false;
            for (var i = 0; i < r.length; i++) {
                if (r[i] === r[i - 1]) {
                    checkAgain = true;
                    r = r.substr(0, i - 1) + r.substr(i + 1, r.length);
                }
            }
        }
        return (r + '000').slice(0, 4).toUpperCase();        
    },
    cardToOrd: function (s) {
            /// <summary>
            /// WORK IN PROGRESS
            /// simpleXrm.cardToOrd() attempts to translate cardinal numbers (e.g. "90") to ordinal numbers (e.g. "ninety").
            /// unit testing needs to be performed
            /// </summary>
            /// <param name="s" type="String">
            /// The string to translate to ordinal numbering.
            /// </param>
            var ordinals = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
            'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 
            'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth'];
            var tens = {
                20: 'twenty',
                30: 'thirty',
                40: 'forty',
                50: 'fifty',
                60: 'fifty',
                70: 'fifty',
                80: 'fifty',
                90: 'ninety'
            };
            var ordinalTens = {
                30: 'thirtieth',
                40: 'fortieth',
                50: 'fiftieth',
                60: 'sixtieth',
                70: 'seventieth',
                80: 'eightieth',
                90: 'ninetieth'
            };
            var cardinal = s;
            if (cardinal <= 20) {
                return ordinals[cardinal];
            }

            if (cardinal % 10 === 0) {
                return ordinalTens[cardinal];
            }

            return tens[cardinal - (cardinal % 10)] + ordinals[cardinal % 10];
    },
    setFormWarning: function (m, i) {
        /// <summary>
        /// simpleXrm.formWarning() creates a form level notification that presents a warning message "m" to the end user.
        /// </summary>
        /// <param name="m" type="String">
        /// The message to present to the end user.
        /// </param>
        /// <param name="i" type="String">
        /// The unique Id of the message to be used in clearing the message. Does not need to be in GUID form.
        /// </param>
        Xrm.Page.ui.setFormNotification(m, "WARNING", i)
    },
    setFormError: function (m, i) {
        /// <summary>simpleXrm.formError() creates a form level notification that presents an error message "m" to the end user.</summary>
        /// <param name="m" type="String">The message to present to the end user.</param>
        /// <param name="i" type="String">The unique Id of the message to be used in clearing the message. Does not need to be in GUID form.</param>
        Xrm.Page.ui.setFormNotification(m, "ERROR", i)
    },
    setFormInfo: function (m, i) {
        /// <summary>
        /// simpleXrm.formInfo() creates a form level notification that presents an info message "m" to the end user.
        /// </summary>
        /// <param name="m" type="String">
        /// The message to present to the end user.
        /// </param>
        /// <param name="i" type="String">
        /// The unique Id of the message to be used in clearing the message. Does not need to be in GUID form.
        /// </param>
        Xrm.Page.ui.setFormNotification(m, "INFO", i)
    },
    clearFormNotification: function (i) {
        try {
            Xrm.Page.ui.clearFormNotification(i);
        } catch (e) {
            //no action necessary
        }
    },
    setFieldWarning: function (a, m, i) {
        /// <summary>
        /// simpleXrm.setFieldWarning() creates a field level notification on attribute "a" that presents an error message "m" to the end user.
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the attribute to set the field warning on.
        /// </param>
        /// <param name="m" type="String">
        /// The message to present to the end user.
        /// </param>
        /// <param name="i" type="String">
        /// The unique Id of the message to be used in clearing the message. Does not need to be in GUID form.
        /// </param>
        simpleXrm.getCtrl(a).setNotification(m, i);
    },
    clearFieldWarning: function (a, i) {
        /// <summary>
        /// simpleXrm.clearFieldWarning() clears a field level notification on attribute "a".
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the attribute to set the field warning on.
        /// </param>
        /// <param name="i" type="String">
        /// The unique Id of the message to be cleared. Must match exactly the Id set using Xrm.Page.Control.setNotification() or simpleXrm.setFieldWarning().
        /// </param>
        try {
            simpleXrm.getCtrl(a).clearNotification(i);
        } catch (e) {
            console.log("Could not clear form notification with ID " + i + ".");
        }
    },
    timedFormError: function (m, t) {
        var i = simpleXrm.newGuid();
        /// <summary>Description</summary>
        /// <param name="m" type="String">
        /// The error message to display to the end user.
        /// </param>
        simpleXrm.setFormError(m, i);
        setTimeout(
            function () {
                simpleXrm.clearFormNotification(i);
            },
            t
        );
    },
    timedFormWarning: function (m, t) {
        var i = simpleXrm.newGuid();
        /// <summary>Description</summary>
        /// <param name="m" type="String">The error message to display to the end user.</param>
        simpleXrm.setFormWarning(m, i);
        setTimeout(
            function () {
                simpleXrm.clearFormNotification(i);
            },
            t
        );
    },
    timedFormInfo: function (m, t) {
        var i = simpleXrm.newGuid();
        /// <summary>Description</summary>
        /// <param name="m" type="String">The error message to display to the end user.</param>
        simpleXrm.setFormInfo(m, i);
        setTimeout(
            function () {
                simpleXrm.clearFormNotification(i);
            },
            t
        );
    },
    confirmPopUp: function (m, y, n) {
        Xrm.Utility.confirmDialog(m, y, n);
    },
    calc2Fields: function (a, b, c) {
        ///<summary>
        /// simpleXrm.calc2Fields() provides dynamic calculation based on the values of 2 fields that are required to add up to value 'c'. Applications include calculating 2 field values that must
        /// necessarily add up to 100% (percent of payment application) or 2 fields that must add up to the value of a 3rd field. Register the script onChange for both fields in order to achieve
        /// predictable behavior. The order the fields are passed is non-trivial, as values will be calculated in the order a > b  (meaning if the value of 'a' is greater than the value of parameter
        /// 'c', the value of field b will be zeroed out). Note also that if only 2 parameters are passed, 'c' is set equal to be 100 (representing a typical percentage calculation).
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the first Field to calculate.
        /// </param>
        /// <param name="b" type="String">
        /// The name of the second Field to calculate.
        /// </param>
        /// <param name="c" type="Decimal">
        /// The total value of fields a & b. Defaults to 100.
        /// </param>
        var x = simpleXrm.getAttVal(a);
        var y = simpleXrm.getAttVal(b);
        var z = c || 100;
        if (!simpleXrm.valid(x)) {
            if (!simpleXrm.valid(y)) {
                //no action
            } else if (y <= z && y >= 0) {
                //handle case only b has data, set a to remainder
                simpleXrm.setAttVal(a, z - y);
            } else if (y > z) {
                simpleXrm.setAttVal(b, z);
            };
        } else if (x <= z && x >= 0) {
            //handle case a has data, always set b to remainder
            simpleXrm.setAttVal(b, z - x);
        } else if (x > z) {
            simpleXrm.setAttVal(a, z);
            simpleXrm.setAttVal(b, 0);
        }
    },
    calc3Fields: function (a, b, c, d) {
        ///<summary>
        /// simpleXrm.calc3Fields() provides dynamic calculation based on the values of 3 fields that are required to add up to value 'd'. Applications include calculating 3 field values that must
        /// necessarily add up to 100% (percent of payment application) or 3 fields that must add up to the value of a 4th field. Register the script onChange for all 3 fields in order to achieve 
        /// predictable behavior. The order the fields are passed is non-trivial, as values will be calculated in the order a > b > c (meaning if the value of 'a' is greater than the value of 
        /// parameter 'd', the values of fields b & c will be zeroed out). Note also that if only 3 parameters are passed, 'd' is set equal to be 100 (representing a typical percentage calculation).
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the first Field to calculate.
        /// </param>
        /// <param name="b" type="String">
        /// The name of the second Field to calculate.
        /// </param>
        /// <param name="c" type="String">
        /// The name of the third Field to calculate.
        /// </param>
        /// <param name="d" type="Decimal">
        /// The total value of fields a, b, & c. Defaults to 100.
        /// </param>
        var w = simpleXrm.getAttVal(a);
        var x = simpleXrm.getAttVal(b);
        var y = simpleXrm.getAttVal(c);
        var z = d || 100;
        if (!simpleXrm.valid(w)) {
            simpleXrm.setAttVal(a, 0);
        }
        if (!simpleXrm.valid(x)) {
            simpleXrm.setAttVal(b, 0);
        }
        if (!simpleXrm.valid(y)) {
            simpleXrm.setAttVal(c, 0);
        }
        if (w >= z) {
            //case 1: a has data & is greater than or equal to z. set a = z and b & c both to 0
            simpleXrm.setAttVal(a, z);
            simpleXrm.setAttVal(b, 0);
            simpleXrm.setAttVal(c, 0);
        } else if (w < z && w >= 0 && x <= z && x >= 0 && w + x > z) {
            //case 2: a & b have data and add to more than z. set b equal to (z - w) and c equal to 0)
            simpleXrm.setAttVal(b, z - w);
            simpleXrm.setAttVal(c, 0);
        } else if (w <= z && w >= 0 && x <= z && x >= 0 && w + x <= z) {
            //case 3: a & b have data and add to less than z. set c equal to (z - (w + x))
            simpleXrm.setAttVal(c, z - (w + x));
        }
    },
    calc4Fields: function (a, b, c, d, e) {
        ///<summary>
        /// simpleXrm.calc4Fields() provides dynamic calculation based on the
        /// values of 4 fields that are required to add up to value 'e'.
        /// Applications include calculating 4 field values that must
        /// necessarily add up to 100% (percent of payment application) or 4 
        /// fields that must add up to the value of a 5th field. Register the
        /// script onChange for all 4 fields in order to achieve predictable
        /// behavior. The order the fields are passed is non-trivial, as 
        /// values will be calculated in the order a > b > c > d (meaning if
        /// the value of 'a' is greater than the value of parameter 'e', the 
        /// values of fields b, c, & d will be zeroed out).
        /// Note also that if only 4 parameters are passed, 'e' is set equal to
        /// be 100 (representing a typical percentage calculation).
        /// </summary>
        /// <param name="a" type="String">
        /// The name of the first Field to calculate.
        /// </param>
        /// <param name="b" type="String">
        /// The name of the second Field to calculate.
        /// </param>
        /// <param name="c" type="String">
        /// The name of the third Field to calculate.
        /// </param>
        /// <param name="d" type="String">
        /// The name of the fourth Field to calculate.
        /// </param>
        /// <param name="e" type="Decimal">
        /// The total value of fields a, b, c, & d. Defaults to 100.
        /// </param>
        var v = simpleXrm.getAttVal(a);
        var w = simpleXrm.getAttVal(b);
        var x = simpleXrm.getAttVal(c);
        var y = simpleXrm.getAttVal(d);
        var z = e || 100;
        if (!simpleXrm.valid(v)) {
            simpleXrm.setAttVal(a, 0);
        }
        if (!simpleXrm.valid(w)) {
            simpleXrm.setAttVal(b, 0);
        }
        if (!simpleXrm.valid(x)) {
            simpleXrm.setAttVal(c, 0);
        }
        if (!simpleXrm.valid(y)) {
            simpleXrm.setAttVal(d, 0);
        }
        if (v >= z) { //case 1
            simpleXrm.setAttVal(a, z);
            simpleXrm.setAttVal(b, 0);
            simpleXrm.setAttVal(c, 0);
            simpleXrm.setAttVal(d, 0);
        } else if (v < z && v >= 0 && w <= z && w >= 0 && (v + w) > z) { //case 2
            simpleXrm.setAttVal(b, z - v);
            simpleXrm.setAttVal(c, 0);
            simpleXrm.setAttVal(d, 0);
        } else if (v < z && v >= 0 && w <= z && w >= 0 && (v + w) <= z && z == 0) { //case 3
            simpleXrm.setAttVal(c, z - (v + w));
            simpleXrm.setAttVal(d, 0);
        } else if (v < z && v >= 0 && w <= z && w >= 0 && x <= z && x >= 0 && (v + w + x) <= z) { //case 4
            simpleXrm.setAttVal(d, z - (v + w + x));
        }
    },
    getSaveMode: function (context) {
        /// <summary>
        /// simpleXrm.getSaveMode() returns the Save mode value as identified in the Dynamics CRM 2013 SDK. See: http://msdn.microsoft.com/en-us/library/gg509060.aspx#BKMK_GetSaveMode
        /// </summary>
        /// <param name="context" type="Object">
        /// The execution Context for the onSave Event. Check the box for "Pass Execution Context as first parameter" in the Form Customization UI when including this function.
        /// </param>
        return context.getEventArgs().getSaveMode();
    },
    preventDefault: function (context) {
        context.getEventArgs().preventDefault();
    },
    refresh: function (b) {
        /// <summary>
        /// simpleXrm.refresh() will refresh the page. Does the same thing as Xrm.Page.data.refresh() but includes a friendly timed notification for the end user.
        /// </summary>
        /// <param name="b" type="Boolean">
        /// Determines whether the form data will be saved.
        /// </param>
        Xrm.Page.data.refresh(b)
    },
    backgroundSave: function (o) {
        Xrm.Page.data.save().then(o.callback, o.failure); 
    },
    getRelatedLinks: function () {
        return Xrm.Page.ui.navigation.items;
    },
    mapFields: function (o) {
        /// <summary>
        /// simpleXrm.mapFields() accepts an object with property names matching destination entity field names and property values matching the field names on the current form.
        /// Pipe the results into the input parameter for simpleXrm.openNewRecord() for easy navigation to a pre-filled record form.
        /// </summary>
        var output = {
            params: {},
            extraqs: []
        };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                var attribute = o[i];
                var value = simpleXrm.getAttVal(attribute);
                if (value && typeof value === "object" && value[0] && value[0].id && value[0].name) {
                    var j = i + "name";
                    output.params[i] = simpleXrm.getLookupID(o[i]);
                    output.params[j] = simpleXrm.getLookupVal(o[i]);
                    output.extraqs.push(i + "=" + simpleXrm.wrapGuid(simpleXrm.getLookupID(o[i])));
                    output.extraqs.push(j + "=" + simpleXrm.getLookupVal(o[i]));
                } else if (value) {
                    output.params[i] = simpleXrm.getAttVal(o[i]);
                    output.extraqs.push(i + "=" + simpleXrm.getAttVal(o[i]).toString());
                }
            }
        }
        return output;
    },
    extendFieldMap: function (o) {
        /// <summary>simpleXrm.extendFieldMap() accepts a field mapping object as input argument o.input and adds name-value pairs defined by the as properties</summary>
        /// <param name="o" type="Object">Object with properties:
        ///     o.input: an object with properties 'params' and 'extraqs' such as that produced by simpleXrm.mapFields().
        ///     o.add: an object with a series of name-value pairs to be appended to the input object. You can use this to statically set values to be passed to a form.
        /// </param>
        var output = o.input;
        for (var i in o.add) {
            output.params[i] = o.add[i];
            output.extraqs.push(i + "=" + o.add[i]);
        }
        return output;
    },
    openNewRecord: function (o) {
        /// <summary>
        /// simpleXrm.openNewRecord() opens a record defined by input parameter 'o' (object) with properties entityType (entity logical name), params (object with key-value pairs
        /// for field pre-filling), and extraqs (array with string equivalents to be used with URI encoding in the event of Xrm.Utility failure).
        /// </summary>
        var id = o.id || null;
        if ((typeof Xrm != "undefined") && (typeof Xrm.Utility != "undefined")) {
            Xrm.Utility.openEntityForm(o.entityType, id, o.params);
        } else {
            var features = "location=no,menubar=no,status=no,toolbar=no,resizable=yes";
            var url = Xrm.Page.context.getClientUrl();
            url += "/main.aspx?etn=" + o.entityType.toLowerCase() + "&pagetype=entityrecord&extraqs=" + encodeURIComponent(o.extraqs.join("&"));
            window.open(url, "_blank", features, false);
        }
    },
    parseValue: function (s) {
        /// <summary>
        /// simpleXrm.parseValue() will return the value of argument 's' as a float. Should be used to normalize currency and decimal data returned from OData endpoint which may 
        /// be returned as objects with the numerical value contained in the ".Value" property, or which may return numerical values as strings, etc. Returns null when no value
        /// can be identified.
        /// </summary>
        /// <param name="s" type="String or Object">
        /// Pass an attribute from the results of an OData query to get its value as a valid floating point number. Note that the Dynamics CRM JavaScript API will automatically
        /// convert floating point values to the correct format for currency or decimal fields.
        /// </param>
        if (s) {
            if (typeof s === "object" && s.Value) {
                s = s.Value;
            } else if (typeof s === "object") {
                s = null;
            }
            if (typeof s === "string") {
                s = parseFloat(s);
            };
        }
        return s || null;
    },
    refreshWebResource: function (n) {
        /// <summary>simpleXrm.refreshWebResource() will refresh the web resource with name 'n'.</summary>
        /// <param name="n" type="String">The name of the web resource to refresh.</param>
        var webResource = simpleXrm.getCtrl(n);
        if (webResource && webResource.getSrc()) {
            var parameter = webResource.getSrc();
            parameter += "?Data='" + simpleXrm.newGuid() + "'";
            webResource.setSrc(parameter);
        }
    },
    calcPriceListPrice: function (o) {
        /// <summary>
        /// example: simpleXrm.calcPriceListPrice({
        ///     pricingMethodCode: 2,
        ///     listPrice: 307.70,
        ///     percentage: 95,
        ///     roundingPolicyCode: 2,
        ///     roundingOptionCode: 2,
        ///     roundingOptionAmount: 5
        /// }) //returns 295; (307.70 * 0.95 = 292.315 which is rounded up to the nearest multiple of 5)
        var round = true, p;
        if (o.roundingPolicyCode == 1) {
            round = false;
        };
        switch (o.pricingMethodCode) {
            case 1:
                p = o.amount;
                round = false;
                break;
            case 2:
                p = o.percentage * o.listPrice / 100;
                break;
            case 3:
                p = ((o.percentage + 100) * o.currentCost) / 100;
                break;
            case 4:
                p = ((100 * o.currentCost) / (100 - o.percentage));
                break;
            case 5:
                p = ((o.percentage + 100) * o.standardCost) / 100;
                break;
            case 6:
                p = ((100 * o.standardCost) / (100 - o.percentage));
                break;
            default:
                p = o.listPrice;
        };
        var p1 = null;
        var p2 = null;
        if (round) {
            switch (o.roundingPolicyCode) {
                case 2: //round up
                    if (o.roundingOptionCode == 1) { //ends in
                        p1 = 10 * Math.floor(p / 10) + o.roundingOptionAmount;
                        if (p > p1) {
                            p1 += 10;
                        };
                    } else if (o.roundingOptionCode == 2) { //multiple of
                        p1 = Math.ceil(p / o.roundingOptionAmount) * (o.roundingOptionAmount);
                    };
                    break;
                case 3: //round down
                    if (o.roundingOptionCode == 1) { //ends in
                        p1 = 10 * Math.floor(p / 10) + o.roundingOptionAmount;
                        if (p < p1) {
                            p1 -= 10;
                        };
                    } else if (o.roundingOptionCode == 2) { //multiple of
                        p1 = Math.floor(p / o.roundingOptionAmount) * (o.roundingOptionAmount);
                    };
                    break;
                case 4: //round nearest
                    if (o.roundingOptionCode == 1) { //ends in
                        p1 = 10 * Math.floor(p / 10) + o.roundingOptionAmount;
                        if (p > p1) {
                            p2 = p1 + 10;
                        } else if (p < p1) {
                            p1 -= 10;
                            p2 = p1 + 10;
                        };
                        if (Math.abs(p - p1) > Math.abs(p - p2)) { //only concerned about the case where p2 is closer to p than p1
                            p1 = p2;
                        };
                    } else if (o.roundingOptionCode == 2) { //multiple of
                        p1 = Math.round(p / o.roundingOptionAmount) * (o.roundingOptionAmount);
                    }
                    break;
                default:
                    break; //or throw a fault here?
            }
            if (p1) {
                p = p1;
            };
        };
        return p;
    }
}