//declare the namespace simpleXrm
var simpleXrm = {};

//error() returns a textual error and writes to the console

simpleXrm.error = function (e) {
	//debugger;
	console.log("Error: Oops! Something went wrong with a script. Contact your CRM Administrator with the following details: Element " + e.toString() + " was not found or is invalid.");
	console.log("This: " + this.toString());
	throw new Error ("Error: Oops! Something went wrong with a script. Contact your CRM Administrator with the following details: Element " + e.toString() + " was not found or is invalid.");
}

//valid() returns true if the argument 'a' is a valid argument (as we will see later, this is a big time saver)

simpleXrm.valid = function(a) {
	//debugger;
	return (a != null && a != undefined);
};

//doesNotContainData() returns true if the attribute 'a' does not have a value and false otherwise
//sample usage: simpleXrm.doesNotContainData('companyname')
//returns true if 'companyname' is blank, returns false if 'companyname' has a value

simpleXrm.doesNotContainData = function(a) {
	//debugger;
	if (simpleXrm.valid(Xrm.Page.getAttribute(a.toString())) && Xrm.Page.getAttribute(a.toString()).getValue() === null) {
		return true;
	} else if (simpleXrm.valid(Xrm.Page.getAttribute(a.toString())) && Xrm.Page.getAttribute(a.toString()).getValue() != null) {
		return false;
	} else {
		simpleXrm.error(a);
	}
}

//containsData() returns true if the attribute 'a' has a value and false otherwise
//sample usage: simpleXrm.containsData('companyname')
//returns true if 'companyname' has a value, otherwise returns false if 'companyname' is null

simpleXrm.containsData = function (a) {
	//debugger;
	return !simpleXrm.doesNotContainData(a);
}

//validAtt() checks for existence of an attribute 'a' in the Xrm.Page.attributes collection.
//sample usage: simpleXrm.validAtt('companyname')
//returns true if companyname is on the current form

simpleXrm.validAtt = function(a) {
	//debugger;
	return(simpleXrm.valid(Xrm.Page.getAttribute(a.toString())));
}

//getAtt() returns the attribute object for attribute named 'a'
//sample usage: simpleXrm.getAtt('companyname')
//returns an attribute object if companyname is on the current form; logical equivalent to Xrm.Page.getAttribute('companyname')

simpleXrm.getAtt = function(a) {
	//debugger;
	if (simpleXrm.validAtt(a)){
		return Xrm.Page.getAttribute(a.toString());
	} else {
		simpleXrm.error(a);
	}
}

//getAttVal() returns the current value of the attribute 'a'
//sample usage: simpleXrm.getAttVal('companyname')
//returns the value of companyname e.g. "An Old Company"

simpleXrm.getAttVal = function(a) {
	//debugger;
	if (simpleXrm.validAtt(a)) {
		return Xrm.Page.getAttribute(a.toString()).getValue();
	} else {
		simpleXrm.error(a);
	}
}

//hasVal() returns true if the current value of the attribute 'a' has info
//sample usage: simpleXrm.getAttVal('companyname')
//returns the value of companyname e.g. "An Old Company"

simpleXrm.hasVal = function(a) {
	//debugger;
	if (simpleXrm.validAtt(a)) {
		return simpleXrm.valid(Xrm.Page.getAttribute(a.toString()).getValue());
	} else {
		simpleXrm.error(a);
	}
}

//getLookupVal() returns the name of the current selection in lookup attribute 'a'
//sample usage: simpleXrm.getAttVal(customerid)
//returns the name of the current contact/account stored in customerid e.g. "Contoso Ltd."

simpleXrm.getLookupVal = function(a) {
	//debugger;
	if (simpleXrm.hasVal(a)) {
		return Xrm.Page.getAttribute(a.toString()).getValue()[0].name;
	} else if (simpleXrm.validAtt(a)) {
		return null;
	} else {
		simpleXrm.error(a);
	}
}

//setAttVal() sets the value of the attribute 'a' to value 'v'
//sample usage: simpleXrm.setAttVal(companyname,"A New Company")
//overwrites value of companyname with "A New Company"
//check Dynamics CRM SDK for acceptable values based on different field types
//note: rejects v = null. Use simpleXrm.clearAttVal() to clear field

simpleXrm.setAttVal = function(a,v) {
	//debugger;
	if (simpleXrm.validAtt(a) && simpleXrm.valid(v)) {
		Xrm.Page.getAttribute(a.toString()).setValue(v);
	} else if (!simpleXrm.validAtt(a)) {
		simpleXrm.error(a);
	} else {
		simpleXrm.error(v);
	}
}

//clearAttVal() clears the value of the attribute 'a'
//sample usage: simpleXrm.clearAttVal('companyname')
//changes companyname to null

simpleXrm.clearAttVal = function(a) {
	//debugger;
	if (simpleXrm.validAtt(a)) {
		Xrm.Page.getAttribute(a.toString()).setValue(null);
	} else {
		simpleXrm.error(a);
	}
}

//clearAttsVal() clears the current value of the attribute(s) passed as arguments
//sample usage: simpleXrm.clearAttsVal(companyname, firstname, lastname)
//clears the current values of attributes 'companyname', 'firstname', and 'lastname'

simpleXrm.clearAttsVal = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.clearAttVal(arguments[i]);
	}
}

//sendAttAlways() includes the current value of 'a' in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttAlways('companyname') will send the value of companyname to the server
//regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'

simpleXrm.sendAttAlways = function(a) {
	//debugger;
	simpleXrm.getAtt(a).setSubmitMode("always");
}

//sendAttsAlways() includes the current values of all attribute(s) passed as arguments
//to the function in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttsAlways(companyname,firstname,lastname,fullname) 
//will send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'

simpleXrm.sendAttsAlways = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.sendAttAlways(arguments[i]);
	}
}

//sendAttNever() excludes the current value of 'a' in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttNever('companyname') will not send the value of companyname to the server
//regardless of whether the field value was modified ('dirty')

simpleXrm.sendAttNever = function(a) {
	//debugger;
	simpleXrm.getAtt(a).setSubmitMode("never");
}

//sendAttsNever() excludes the current values of all attributes 'a1', 'a2', etc. passed as arguments
//to the function in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttsNever(companyname,firstname,lastname,fullname) 
//will not send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server regardless of whether the field values were modified ('dirty')

simpleXrm.sendAttsNever = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.sendAttNever(arguments[i]);
	}
}

//sendAttChanges() will only include the value of 'a' in the XML form data submitted to the server if 'a' was updated/modified
//sample usage: simpleXrm.sendAttChanges('companyname') will send the value of companyname to the server
//only if/when the field value was modified ('dirty')

simpleXrm.sendAttChanges = function(a) {
	//debugger;
	simpleXrm.getAtt(a).setSubmitMode("dirty");
}

//sendAttsChanges() will only include the current values of all attributes 'a1', 'a2', etc. passed as arguments
//to the function in the XML form data submitted to the server if each individual attribute was updated/modified
//sample usage: simpleXrm.sendAttsChanges(companyname,firstname,lastname,fullname) 
//will only send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server if the field values were updated or modified ('dirty')

simpleXrm.sendAttsChanges = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.sendAttChanges(arguments[i]);
	}
}

//getAttReqd() returns the required status of attribute 'a'
//sample usage: simpleXrm.getAttReqd('companyname') 
//returns 'required', 'recommended', or 'none' depending on the requirement level of the attribute

simpleXrm.getAttReqd = function(a) {
	//debugger;
	return simpleXrm.getAtt(a).getRequiredLevel();
}

//setAttReqd() sets the required status of attribute 'a' to 'required'
//sample usage: simpleXrm.setAttReqd('companyname') 
//attribute 'companyname' is now business required

simpleXrm.setAttReqd = function(a) {
	//debugger;
	simpleXrm.getAtt(a).setRequiredLevel("required");
}

//setAttsReqd() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'required'
//sample usage: simpleXrm.setAttsReqd(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business required

simpleXrm.setAttsReqd = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.setAttReqd(arguments[i]);
	}
}

//clearAttReqd() sets the required status of attribute 'a' to 'none'
//sample usage: simpleXrm.clearAttReqd('companyname') 
//attribute 'companyname' is not business required

simpleXrm.clearAttReqd = function(a) {
	//debugger;
	simpleXrm.getAtt(a).setRequiredLevel("none");
}

//clearAttsReqd() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'none'
//sample usage: simpleXrm.clearAttsReqd(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are not business required

simpleXrm.clearAttsReqd = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.clearAttReqd(arguments[i]);
	}
}

//setAttRecommended() sets the required status of attribute 'a' to 'recommended'
//sample usage: simpleXrm.setAttRecommended('companyname') 
//attribute 'companyname' is now business recommended

simpleXrm.setAttRecommended = function(a) {
	//debugger;
	simpleXrm.getAtt(a).setRequiredLevel("recommended");
}

//setAttsRecommended() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'recommended'
//sample usage: simpleXrm.setAttsRecommended(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business recommended

simpleXrm.setAttsRecommended = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.setAttRecommended(arguments[i]);
	}
}

//fireOnChange() mirrors the SDK implementation of Xrm.Page.getAttribute().fireOnChange()
//sample usage: simpleXrm.fireOnChange('companyname')
//triggers scripts registered on the change event of 'companyname' if it is included in the attributes collection

simpleXrm.fireOnChange = function(a) {
	//debugger;
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).fireOnChange();
	} else {
		simpleXrm.error(a);
	}
}

//fireChanges() triggers the onChange events of all attributes 'a1', 'a2', etc.
//passed as arguments to the function 
//sample usage: simpleXrm.fireChanges(companyname,firstname,lastname,fullname) 
//scripts running onChange for attributes 'companyname', 'firstname', 'lastname', and 'fullname' will now run

simpleXrm.fireChanges = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.fireOnChange(arguments[i]);
	}
}


//validCtrl() checks the form for control 'c'
//sample usage: simpleXrm.validCtrl('companyname') 
//returns true if 'companyname' is present on the form
//(note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)

simpleXrm.validCtrl = function(c) {
	//debugger;
	if (simpleXrm.valid(c)){
		return(simpleXrm.valid(Xrm.Page.getControl(c.toString())));
	} else {
		simpleXrm.error(c);
	}
}

//getCtrl() gets the object for control 'c'
//sample usage: simpleXrm.getCtrl('companyname') 
//returns a control object if 'companyname' is present on the form
//(note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)

simpleXrm.getCtrl = function(a) {
	//debugger;
	if (simpleXrm.validCtrl(a)) {
		return Xrm.Page.getControl(a.toString());
	} else {
		simpleXrm.error(a);
	}
}

//getAllCtrls() gets all control objects for attribute 'a'
//sample usage: simpleXrm.getAllCtrls('companyname') 
//returns an array of control objects if 'companyname' is present on the form
//['companyname','companyname1','companyname2'...]

simpleXrm.getAllCtrls = function(a) {
	//debugger;
	simpleXrm.getAtt(a).controls.get();
}

//showCtrl() shows the control 'c'
//sample usage: simpleXrm.showCtrl('companyname') 
//changes visibility of the first control for attribute 'companyname' to visible

simpleXrm.showCtrl = function(c) {
	//debugger;
	simpleXrm.getCtrl(c).setVisible(true);
}

//showCtrls() shows all controls 'c1, c2, c3' passed as arguments
//sample usage: simpleXrm.showCtrls(companyname,firstname,lastname,fullname) 
//changes visibility of the first control for attributes 'companyname', 'firstname',
//'lastname', and 'fullname' to visible
//super handy! show as many or as few fields as you want in a single function call.

simpleXrm.showCtrls = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.showCtrl(arguments[i]);
	}
}


//hideCtrl() hides the control 'c'
//sample usage: simpleXrm.hideCtrl('companyname') 
//changes visibility of the first control for attribute 'companyname' to hidden

simpleXrm.hideCtrl = function(c) {
	//debugger;
	simpleXrm.getCtrl(c).setVisible(false);
}

//hideCtrls() shows all controls 'c1, c2, c3' passed as arguments
//sample usage: simpleXrm.hideCtrls(companyname,firstname,lastname,fullname) 
//changes visibility of the first control for attributes 'companyname', 'firstname',
//'lastname', and 'fullname' to hidden
//super handy! hide as many or as few fields as you want in a single function call.

simpleXrm.hideCtrls = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.hideCtrl(arguments[i]);
	}
}

//showAllCtrls() shows all controls for attribute 'a'
//sample usage: simpleXrm.showAllCtrls('companyname') 
//changes visibility of all controls for attribute 'companyname' to visible

simpleXrm.showAllCtrls = function(a) {
	//debugger;
	simpleXrm.getAllCtrls(a).forEach(
		function (control, index) {
			control.setVisible(true);
		}
	);
}

//hideAllCtrls() hides all controls for attribute 'a'
//sample usage: simpleXrm.hideAllCtrls('companyname') 
//changes visibility of all controls for attribute 'companyname' to hidden


simpleXrm.hideAllCtrls = function(a) {
	//debugger;
	simpleXrm.getAllCtrls(a).forEach(
		function (control, index) {
			control.setVisible(false);
		}
	);
}

//lockCtrl() locks the control 'c'
//sample usage: simpleXrm.lockCtrl('companyname') 
//locks the first control for attribute 'companyname'

simpleXrm.lockCtrl = function(c) {
	//debugger;
	simpleXrm.getCtrl(c).setDisabled(true);
}

//lockCtrls() locks all controls 'c1', 'c2', 'c3' passed as arguments to the function
//sample usage: simpleXrm.lockCtrls(companyname, firstname, lastname) 
//locks the first control for attributes 'companyname', 'firstname', and 'lastname'

simpleXrm.lockCtrls = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.lockCtrl(arguments[i]);
	}
}

//unlockCtrl()  unlocks the control 'c'
//sample usage: simpleXrm.unlockCtrl('companyname') 
//unlocks the first control for attribute 'companyname'

simpleXrm.unlockCtrl = function(c) {
	//debugger;
	simpleXrm.getCtrl(c).setDisabled(false);
}

//unlockCtrls()  unlocks all controls 'c1', 'c2', 'c3' passed as arguments to the function
//sample usage: simpleXrm.unlockCtrls(companyname, firstname, lastname) 
//unlocks the first control for attributes 'companyname', 'firstname', and 'lastname'

simpleXrm.unlockCtrls = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.unlockCtrl(arguments[i]);
	}
}

//lockAllCtrls() locks all controls for attribute 'a'
//sample usage: simpleXrm.lockAllCtrls('companyname') 
//locks all controls for attribute 'companyname'

simpleXrm.lockAllCtrls = function(a) {
	//debugger;
	simpleXrm.getAllCtrls(a).forEach(
		function (control, i) {
			control.setDisabled(true);
		}
	);
}

//unlockAllCtrls() unlocks all controls for attribute 'a'
//sample usage: simpleXrm.unlockAllCtrls('companyname') 
//unlocks all controls for attribute 'companyname'

simpleXrm.unlockAllCtrls = function(a) {
	//debugger;
	simpleXrm.getAllCtrls(a).forEach(
		function (control, i) {
			control.setDisabled(false);
		}
	);
}

//relabelCtrl() changes the label for control 'c' to value 'v' (requires string in quotes)
//sample usage: simpleXrm.relabelCtrl(companyname, "Account Name") 
//changes the label for the first control for attribute 'companyname' to "Account Name"

simpleXrm.relabelCtrl = function(c, v) {
	//debugger;
	simpleXrm.getCtrl(c).setLabel(v);
}

//relabelAllCtrls() changes the label for all controls for attribute 'a' to value 'v' (requires string in quotes)
//sample usage: simpleXrm.relabelAllCtrls(companyname, "Account Name") 
//changes the label for all controls for attribute 'companyname' to "Account Name"

simpleXrm.relabelAllCtrls = function(a, v) {
	//debugger;
	simpleXrm.getAllCtrls(a).forEach(
		function (control, i) {
			control.setLabel(v);
		}
	);
}

//allTabs() returns the objects for all tabs
//sample usage: simpleXrm.allTabs() 
//returns an array [tab, tab_2, tab_3,...]

simpleXrm.allTabs = function() {
	debugger;
	return Xrm.Page.ui.tabs;
}

//validTab() checks the form for tab 't'
//sample usage: simpleXrm.validTab('tab_2') 
//returns true if two tabs are present on the form and the second tab's name has not been modified

simpleXrm.validTab = function(t) {
	debugger;
	return simpleXrm.valid(simpleXrm.allTabs().get(t.toString()));
}

//getTab() returns the object for tab 't'
//sample usage: simpleXrm.getTab('tab_2') 
//returns the object tab_2

simpleXrm.getTab = function(t) {
	debugger;
	return simpleXrm.allTabs().get(t.toString());
}

//showTab() shows tab 't'
//sample usage: simpleXrm.showTab(tab_2) 
//changes the visibility of tab_2 to visible

simpleXrm.showTab = function(t) {
	//debugger;
	simpleXrm.getTab(t).setVisible(true);
}

//showTabS() shows all tabs 't1', 't2', 't3' passed as arguments to the function
//sample usage: simpleXrm.showTabs(tab_1,tab_2,tab_4) 
//changes the visibility of tab_1, tab_2, and tab_4_ to visible

simpleXrm.showTabs = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.showTab(arguments[i]);
	}
}

//hideTab() hides tab 't'
//sample usage: simpleXrm.hideTab(tab_2) 
//changes the visibility of tab_2 to hidden

simpleXrm.hideTab = function(t) {
	debugger;
	simpleXrm.getTab(t).setVisible(false);
}

//hideTabs() hides all tabs 't1', 't2', 't3' passed as arguments to the function
//sample usage: simpleXrm.hideTabs(tab_1,tab_2,tab_4) 
//changes the visibility of tab_1, tab_2, and tab_4_ to hidden

simpleXrm.hideTabs = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.hideTab(arguments[i]);
	}
}

//validSection() checks the form for section 's'
//sample usage: simpleXrm.validSection(tab_2_section_1) 
//returns true if two tabs are present on the form, the second tab's name has not been modified,
//and the tab's first section's name has not been modified

simpleXrm.validSection = function(s) {
	//debugger;
	simpleXrm.allTabs().forEach(
		function (tab, i) {
			if (simpleXrm.valid(tab.sections.get(s.toString()))) {
				return true;
			}
		}
	);
}

//getSection() returns the object for section 's'
//sample usage: simpleXrm.getSection(tab_2_section_1) 
//returns the object tab_2_section_1

simpleXrm.getSection = function (s) {
	//debugger;
	simpleXrm.allTabs().forEach(
		function (tab, i) {
			if (simpleXrm.valid(tab.sections.get(s.toString()))) {
				return tab.sections.get(s.toString());
			}
		}
	);
}

//showSection() shows section 's'
//sample usage: simpleXrm.showSection(tab_2_section_1) 
//changes the visibility of tab_2_section_1 to visible

simpleXrm.showSection = function (s) {
	//debugger;
	simpleXrm.getSection(s).setVisible(true);
}

//showSections() shows all sections 's1', 's2', 's3' passed as arguments to the function
//sample usage: simpleXrm.showSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) 
//changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to visible

simpleXrm.showSections = function() {
	//debugger;
	for(i=0; i < arguments.length; i++) {
		simpleXrm.showSection(arguments[i]);
	}
}

//hideSection() hides section 's'
//sample usage: simpleXrm.hideSection(tab_2_section_1) 
//changes the visibility of tab_2_section_1 to hidden

simpleXrm.hideSection = function (s) {
	//debugger;
	simpleXrm.getSection(s).setVisible(false);
}

//hideSections() hides all sections 's1', 's2', 's3' passed as arguments to the function
//sample usage: simpleXrm.hideSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) 
//changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to hidden

simpleXrm.hideSections = function() {
	//debugger;
	for (i=0; i < arguments.length; i++) {
		simpleXrm.hideSection(arguments[i]);
	}
}

//sumAtts() adds the values of the fields passed as arguments to the function
//sample usage: simpleXrm.sumAtts(price1, price2, price3)
//returns the sum of the current values of price1, price2, and price3

simpleXrm.sumAtts = function() {
	//debugger;
	var sum = 0;
	for(i=0; i < arguments.length; i++) {
		if(!isNaN(simpleXrm.getAttVal(arguments[i]))){
			sum += simpleXrm.getAttVal(arguments[i]);
		}
	}
	return sum;
}

simpleXrm.calculatePercent = function(p,t) {
	//debugger;
	return (p/t) * 100;
}