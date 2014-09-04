//declare the namespace simpleXrm
var simpleXrm = {};

//valid() returns true if the argument 'a' is a valid argument (as we will see later, this is a big time saver)

simpleXrm.valid = function(a) {
	return (a != null && a != undefined);
};

//validAtt() checks for existence of an attribute 'a' in the Xrm.Page.attributes collection.
//sample usage: simpleXrm.validAtt(companyname)
//returns true if companyname is on the current form

simpleXrm.validAtt = function(a) {
	if (simpleXrm.valid(a)){
		return(simpleXrm.valid(Xrm.Page.getAttribute(a.toString())));
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found.");
	}
}

//getAtt() returns the attribute object for attribute named 'a'
//sample usage: simpleXrm.getAtt(companyname)
//returns an attribute object if companyname is on the current form; logical equivalent to Xrm.Page.getAttribute('companyname')

simpleXrm.getAtt = function(a) {
	if (simpleXrm.validAtt(a)){
		return Xrm.Page.getAttribute(a.toString());
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//getAttVal() returns the current value of the attribute 'a'
//sample usage: simpleXrm.getAttVal(companyname)
//returns the value of companyname e.g. "An Old Company"

simpleXrm.getAttVal = function(a) {
	if (simpleXrm.validAtt(a)) {
		return simpleXrm.getAtt(a).getValue();
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//setAttVal() sets the value of the attribute 'a' to value 'v' (requires string in quotes)
//sample usage: simpleXrm.setAttVal(companyname,"A New Company")
//overwrites value of companyname with "A New Company"

simpleXrm.setAttVal = function(a,v) {
	if (simpleXrm.validAtt(a) && simpleXrm.valid(v)) {
		simpleXrm.getAtt(a).setValue(v);
	} else if (!simpleXrm.validAtt(a)) {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	} else if (!simpleXrm.valid(v)) {
		throw new Error("Error: target value " + v.toString() + " was not found or is invalid.");
	} else {
		throw new Error("Error: an unexpected error has occurred; please contact your administrator.");
	}
}

//sendAttAlways() includes the current value of 'a' in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttAlways(companyname) will send the value of companyname to the server
//regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'

simpleXrm.sendAttAlways = function(a) {
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).setSubmitMode("always");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//sendAttsAlways() includes the current values of all attributes 'a1', 'a2', etc. passed as arguments
//to the function in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttsAlways(companyname,firstname,lastname,fullname) 
//will send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server regardless of whether the field value was modified ('dirty') or whether the field is marked 'read only'

simpleXrm.sendAttsAlways = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.sendAttAlways(arguments[i]);
	}
}

//sendAttNever() excludes the current value of 'a' in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttNever(companyname) will not send the value of companyname to the server
//regardless of whether the field value was modified ('dirty')

simpleXrm.sendAttNever = function(a) {
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).setSubmitMode("never");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//sendAttsNever() excludes the current values of all attributes 'a1', 'a2', etc. passed as arguments
//to the function in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttsNever(companyname,firstname,lastname,fullname) 
//will not send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server regardless of whether the field values were modified ('dirty')

simpleXrm.sendAttsNever = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.sendAttNever(arguments[i]);
	}
}

//sendAttChanges() will only include the value of 'a' in the XML form data submitted to the server if 'a' was updated/modified
//sample usage: simpleXrm.sendAttChanges(companyname) will send the value of companyname to the server
//only if/when the field value was modified ('dirty')

simpleXrm.sendAttChanges = function(a) {
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).setSubmitMode("dirty");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//sendAttsChanges() will only include the current values of all attributes 'a1', 'a2', etc. passed as arguments
//to the function in the XML form data submitted to the server if each individual attribute was updated/modified
//sample usage: simpleXrm.sendAttsChanges(companyname,firstname,lastname,fullname) 
//will only send the values of attributes 'companyname', 'firstname', 'lastname', and
//'fullname' to the server if the field values were updated or modified ('dirty')

simpleXrm.sendAttsChanges = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.sendAttChanges(arguments[i]);
	}
}

//getAttReqd() returns the required status of attribute 'a'
//sample usage: simpleXrm.getAttReqd(companyname) 
//returns 'required', 'recommended', or 'none' depending on the requirement level of the attribute

simpleXrm.getAttReqd = function(a) {
	if (simpleXrm.validAtt(a) ) {
		return simpleXrm.getAtt(a).getRequiredLevel();
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//setAttReqd() sets the required status of attribute 'a' to 'required'
//sample usage: simpleXrm.setAttReqd(companyname) 
//attribute 'companyname' is now business required

simpleXrm.setAttReqd = function(a) {
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).setRequiredLevel("required");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//setAttsReqd() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'required'
//sample usage: simpleXrm.setAttsReqd(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business required

simpleXrm.setAttsReqd = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.setAttReqd(arguments[i]);
	}
}

//clearAttReqd() sets the required status of attribute 'a' to 'none'
//sample usage: simpleXrm.clearAttReqd(companyname) 
//attribute 'companyname' is not business required

simpleXrm.clearAttReqd = function(a) {
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).setRequiredLevel("none");
	} else {
		console.log("Error: attribute " + a.toString() + " was not found.");
		throw new Error;
	}
}

//clearAttsReqd() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'none'
//sample usage: simpleXrm.clearAttsReqd(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are not business required

simpleXrm.clearAttsReqd = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.clearAttReqd(arguments[i]);
	}
}

//setAttRecommended() sets the required status of attribute 'a' to 'recommended'
//sample usage: simpleXrm.setAttRecommended(companyname) 
//attribute 'companyname' is now business recommended

simpleXrm.setAttRecommended = function(a) {
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).setRequiredLevel("recommended");
	} else {
		console.log("Error: attribute " + a.toString() + " was not found.");
		throw new Error;
	}
}

//setAttsRecommended() sets the required status of all attributes 'a1', 'a2', etc. passed as arguments
//to the function to 'recommended'
//sample usage: simpleXrm.setAttsRecommended(companyname,firstname,lastname,fullname) 
//attributes 'companyname', 'firstname', 'lastname', and 'fullname' are now business recommended

simpleXrm.setAttsRecommended = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.setAttRecommended(arguments[i]);
	}
}

//fireOnChange() mirrors the SDK implementation of Xrm.Page.getAttribute().fireOnChange()
//sample usage: simpleXrm.fireOnChange(companyname)
//triggers scripts registered on the change event of 'companyname' if it is included in the attributes collection

simpleXrm.fireOnChange = function(a) {
	if (simpleXrm.validAtt(a) ) {
		simpleXrm.getAtt(a).fireOnChange();
	} else {
		console.log("Error: attribute " + a.toString() + " was not found.");
		throw new Error;
	}
}

//fireChanges() triggers the onChange events of all attributes 'a1', 'a2', etc.
//passed as arguments to the function 
//sample usage: simpleXrm.fireChanges(companyname,firstname,lastname,fullname) 
//scripts running onChange for attributes 'companyname', 'firstname', 'lastname', and 'fullname' will now run

simpleXrm.fireChanges = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.fireOnChange(arguments[i]);
	}
}


//validCtrl() checks the form for control 'c'
//sample usage: simpleXrm.validCtrl(companyname) 
//returns true if 'companyname' is present on the form
//(note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)

simpleXrm.validCtrl = function(c) {
	if (simpleXrm.valid(c)){
		return(simpleXrm.valid(Xrm.Page.getControl(a.toString())));
	} else {
		throw new Error("Error: control " + c.toString() + " was not found or is invalid.");
	}
}

//getCtrl() gets the object for control 'c'
//sample usage: simpleXrm.getCtrl(companyname) 
//returns a control object if 'companyname' is present on the form
//(note second control for attribute 'companyname' is 'companyname1', third is 'companyname2', etc.)

simpleXrm.getCtrl = function(a) {
	if (simpleXrm.validCtrl(a)) {
		return Xrm.Page.getControl(a.toString());
	} else {
		throw new Error("Error: control " + a.toString() + " was not found or is invalid.");
	}
}

//getAllCtrls() gets all control objects for attribute 'a'
//sample usage: simpleXrm.getAllCtrls(companyname) 
//returns an array of control objects if 'companyname' is present on the form
//['companyname','companyname1','companyname2'...]

simpleXrm.getAllCtrls = function(a) {
	if (simpleXrm.validAtt(a)) {
		simpleXrm.getAtt(a).controls.get();
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//showCtrl() shows the control 'c'
//sample usage: simpleXrm.showCtrl(companyname) 
//changes visibility of the first control for attribute 'companyname' to visible

simpleXrm.showCtrl = function(c) {
	if (simpleXrm.validCtrl(c)) {
		simpleXrm.getCtrl(c).setVisible(true);
	} else {
		throw new Error("Error: control " + c.toString() + " was not found or is invalid.");
	}
}

//showCtrls() shows all controls 'c1, c2, c3' passed as arguments
//sample usage: simpleXrm.showCtrls(companyname,firstname,lastname,fullname) 
//changes visibility of the first control for attributes 'companyname', 'firstname',
//'lastname', and 'fullname' to visible
//super handy! show as many or as few fields as you want in a single function call.

simpleXrm.showCtrls = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.showCtrl(arguments[i]);
	}
}


//hideCtrl() hides the control 'c'
//sample usage: simpleXrm.hideCtrl(companyname) 
//changes visibility of the first control for attribute 'companyname' to hidden

simpleXrm.hideCtrl = function(c) {
	if (simpleXrm.validCtrl(c)) {
		simpleXrm.getCtrl(c).setVisible(false);
	} else {
		throw new Error("Error: control " + c.toString() + " was not found or is invalid.");
	}
}

//hideCtrls() shows all controls 'c1, c2, c3' passed as arguments
//sample usage: simpleXrm.hideCtrls(companyname,firstname,lastname,fullname) 
//changes visibility of the first control for attributes 'companyname', 'firstname',
//'lastname', and 'fullname' to hidden
//super handy! hide as many or as few fields as you want in a single function call.

simpleXrm.hideCtrls = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.hideCtrl(arguments[i]);
	}
}

//showAllCtrls() shows all controls for attribute 'a'
//sample usage: simpleXrm.showAllCtrls(companyname) 
//changes visibility of all controls for attribute 'companyname' to visible

simpleXrm.showAllCtrls = function(a) {
	if(simpleXrm.validAtt(a)) {
		simpleXrm.getAllCtrls(a).forEach(
			function (control, index) {
				control.setVisible(true);
			}
		);
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//hideAllCtrls() hides all controls for attribute 'a'
//sample usage: simpleXrm.hideAllCtrls(companyname) 
//changes visibility of all controls for attribute 'companyname' to hidden


simpleXrm.hideAllCtrls = function(a) {
	if(simpleXrm.validAtt(a)) {
		simpleXrm.getAllCtrls(a).forEach(
			function (control, index) {
				control.setVisible(false);
			}
		);
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//lockCtrl() locks the control 'c'
//sample usage: simpleXrm.lockCtrl(companyname) 
//locks the first control for attribute 'companyname'

simpleXrm.lockCtrl = function(c) {
	if (simpleXrm.validCtrl(c)) {
		simpleXrm.getCtrl(c).setDisabled(true);
	} else {
		throw new Error("Error: control " + c.toString() + " was not found or is invalid.");
	}
}

//lockCtrls() locks all controls 'c1', 'c2', 'c3' passed as arguments to the function
//sample usage: simpleXrm.lockCtrls(companyname, firstname, lastname) 
//locks the first control for attributes 'companyname', 'firstname', and 'lastname'

simpleXrm.lockCtrls = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.lockCtrl(arguments[i]);
	}
}

//unlockCtrl()  unlocks the control 'c'
//sample usage: simpleXrm.unlockCtrl(companyname) 
//unlocks the first control for attribute 'companyname'

simpleXrm.unlockCtrl = function(c) {
	if (simpleXrm.validCtrl(c)) {
		simpleXrm.getCtrl(c).setDisabled(false);
	} else {
		throw new Error("Error: control " + c.toString() + " was not found or is invalid.");
	}
}

//unlockCtrls()  unlocks all controls 'c1', 'c2', 'c3' passed as arguments to the function
//sample usage: simpleXrm.unlockCtrls(companyname, firstname, lastname) 
//unlocks the first control for attributes 'companyname', 'firstname', and 'lastname'

simpleXrm.unlockCtrls = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.unlockCtrl(arguments[i]);
	}
}

//lockAllCtrls() locks all controls for attribute 'a'
//sample usage: simpleXrm.lockAllCtrls(companyname) 
//locks all controls for attribute 'companyname'

simpleXrm.lockAllCtrls = function(a) {
	if(simpleXrm.validAtt(a)) {
		simpleXrm.getAllCtrls(a).forEach(
			function (control, i) {
				control.setDisabled(true);
			}
		);
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//unlockAllCtrls() unlocks all controls for attribute 'a'
//sample usage: simpleXrm.unlockAllCtrls(companyname) 
//unlocks all controls for attribute 'companyname'

simpleXrm.unlockAllCtrls = function(a) {
	if(simpleXrm.validAtt(a)) {
		simpleXrm.getAllCtrls(a).forEach(
			function (control, i) {
				control.setDisabled(false);
			}
		);
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//relabelCtrl() changes the label for control 'c' to value 'v' (requires string in quotes)
//sample usage: simpleXrm.relabelCtrl(companyname, "Account Name") 
//changes the label for the first control for attribute 'companyname' to "Account Name"

simpleXrm.relabelCtrl = function(c, v) {
	if (simpleXrm.validCtrl(c) && simpleXrm.valid(v)) {
		simpleXrm.getCtrl(c).setLabel(v);
	} else if (!simpleXrm.validCtrl(c)) {
		console.log("Error: control " + c.toString() + " was not found.");
		throw new Error;
	} else if (!simpleXrm.valid(v)) {
		throw new Error("Error: target value " + v.toString() + " was not found or is invalid.");
	} else {
		throw new Error("Error: an unexpected error has occurred; please contact your administrator.");
	}
}

//relabelAllCtrls() changes the label for all controls for attribute 'a' to value 'v' (requires string in quotes)
//sample usage: simpleXrm.relabelAllCtrls(companyname, "Account Name") 
//changes the label for all controls for attribute 'companyname' to "Account Name"

simpleXrm.relabelAllCtrls = function(a, v) {
	if(simpleXrm.validAtt(a) && simpleXrm.valid(v)) {
		simpleXrm.getAllCtrls(a).forEach(
			function (control, i) {
				control.setLabel(v);
			}
		);
	} else if (!simpleXrm.validAtt(a)) {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	} else if (!simpleXrm.valid(v)) {
		throw new Error("Error: target value " + v.toString() + " was not found or is invalid.");
	} else {
		throw new Error("Error: an unexpected error has occurred; please contact your administrator.");
	}
}

//validTab() checks the form for tab 't'
//sample usage: simpleXrm.validTab('tab_2') 
//returns true if two tabs are present on the form and the second tab's name has not been modified

simpleXrm.validTab = function(t) {
	if (simpleXrm.valid(t)) {
		return simpleXrm.valid(Xrm.Page.ui.tabs.get(t.toString()));
	} else {
		throw new Error("Error: target tab " + t.toString() + " was not found or is invalid.");
	}
}

//getTab() returns the object for tab 't'
//sample usage: simpleXrm.getTab('tab_2') 
//returns the object tab_2

simpleXrm.getTab = function(t) {
	if (simpleXrm.validTab(t)) {
		return Xrm.Page.ui.tabs.get(t.toString());
	} else {
		throw new Error("Error: target tab " + t.toString() + " was not found or is invalid.");
	}
}

//getAllTabs() returns the objects for all tabs
//sample usage: simpleXrm.getAllTabs() 
//returns an array [tab, tab_2, tab_3,...]

simpleXrm.getAllTabs = function() {
	return Xrm.Page.ui.tabs.get();
}

//showTab() shows tab 't'
//sample usage: simpleXrm.showTab(tab_2) 
//changes the visibility of tab_2 to visible

simpleXrm.showTab = function(t) {
	if (simpleXrm.validTab(t)) {
		simpleXrm.getTab(t).setVisible(true);
	} else {
		throw new Error("Error: target tab " + t.toString() + " was not found or is invalid.");
	}
}

//showTabS() shows all tabs 't1', 't2', 't3' passed as arguments to the function
//sample usage: simpleXrm.showTabs(tab_1,tab_2,tab_4) 
//changes the visibility of tab_1, tab_2, and tab_4_ to visible

simpleXrm.showTabs = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.showTab(arguments[i]);
	}
}

//hideTab() hides tab 't'
//sample usage: simpleXrm.hideTab(tab_2) 
//changes the visibility of tab_2 to hidden

simpleXrm.hideTab = function(t) {
	if (simpleXrm.validTab(t)) {
		simpleXrm.getTab(t).setVisible(false);
	} else {
		throw new Error("Error: target tab " + t.toString() + " was not found or is invalid.");
	}
}

//hideTabs() hides all tabs 't1', 't2', 't3' passed as arguments to the function
//sample usage: simpleXrm.hideTabs(tab_1,tab_2,tab_4) 
//changes the visibility of tab_1, tab_2, and tab_4_ to hidden

simpleXrm.hideTabs = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.hideTab(arguments[i]);
	}
}

//validSection() checks the form for section 's'
//sample usage: simpleXrm.validSection(tab_2_section_1) 
//returns true if two tabs are present on the form, the second tab's name has not been modified,
//and the tab's first section's name has not been modified

simpleXrm.validSection = function(s) {
	if (simpleXrm.valid(s)) {
		return simpleXrm.valid(
			simpleXrm.getAllTabs.forEach(
				function (tab, i) {
					tab.sections.get(s.toString());
				}
			);
		);
	} else {
		throw new Error("Error: target section " + s.toString() + " was not found or is invalid.");
	}
}

//getSection() returns the object for section 's'
//sample usage: simpleXrm.getSection(tab_2_section_1) 
//returns the object tab_2_section_1

simpleXrm.getSection = function (s) {
	if (simpleXrm.validSection(s)) {
		return simpleXrm.getAllTabs.forEach(
			function (tab, i) {
				tab.sections.get(s.toString());
			}
		);
	} else {
		throw new Error("Error: target section " + s.toString() + " was not found or is invalid.");
	}
}

//showSection() shows section 's'
//sample usage: simpleXrm.showSection(tab_2_section_1) 
//changes the visibility of tab_2_section_1 to visible

simpleXrm.showSection = function (s) {
	if (simpleXrm.validSection(s)) {
		simpleXrm.getSection(s).setVisible(true);
	} else {
		throw new Error("Error: target section " + s.toString() + " was not found or is invalid.");
	}
}

//showSections() shows all sections 's1', 's2', 's3' passed as arguments to the function
//sample usage: simpleXrm.showSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) 
//changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to visible

simpleXrm.showSections = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.showSection(arguments[i]);
	}
}

//hideSection() hides section 's'
//sample usage: simpleXrm.hideSection(tab_2_section_1) 
//changes the visibility of tab_2_section_1 to hidden

simpleXrm.hideSection = function (s) {
	if (simpleXrm.validSection(s)) {
		simpleXrm.getSection(s).setVisible(false);
	} else {
		throw new Error("Error: target section " + s.toString() + " was not found or is invalid.");
	}
}

//hideSections() hides all sections 's1', 's2', 's3' passed as arguments to the function
//sample usage: simpleXrm.hideSections(tab_1_section_3,tab_2_section_1,tab_4_section_2) 
//changes the visibility of tab_1_section_3, tab_2_section_1, and tab_4_section_2 to hidden

simpleXrm.hideSections = function() {
	for(i=0; i < arguments.length; i++) {
		simpleXrm.hideSection(arguments[i]);
	}
}
