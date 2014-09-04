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
		getAtt(a).setValue(v);
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
		getAtt(a).setSubmitMode("always");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//sendAttNever() excludes the current value of 'a' in the XML form data submitted to the server
//sample usage: simpleXrm.sendAttNever(companyname) will not send the value of companyname to the server
//regardless of whether the field value was modified ('dirty')

simpleXrm.sendAttNever = function(a) {
	if (simpleXrm.validAtt(a) ) {
		getAtt(a).setSubmitMode("never");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//sendAttChanges() will only include the value of 'a' in the XML form data submitted to the server if 'a' was updated/modified
//sample usage: simpleXrm.sendAttChanges(companyname) will send the value of companyname to the server
//only if/when the field value was modified ('dirty')

simpleXrm.sendAttChanges = function(a) {
	if (simpleXrm.validAtt(a) ) {
		getAtt(a).setSubmitMode("dirty");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//getAttReqd() returns the required status of attribute 'a'
//sample usage: simpleXrm.getAttReqd(companyname) 
//returns 'required', 'recommended', or 'none' depending on the requirement level of the attribute

simpleXrm.getAttReqd = function(a) {
	if (simpleXrm.validAtt(a) ) {
		return getAtt(a).getRequiredLevel();
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//setAttReqd() sets the required status of attribute 'a' to 'required'
//sample usage: simpleXrm.setAttReqd(companyname) 
//attribute 'companyname' is now business required

simpleXrm.setAttReqd = function(a) {
	if (simpleXrm.validAtt(a) ) {
		getAtt(a).setRequiredLevel("required");
	} else {
		throw new Error("Error: attribute " + a.toString() + " was not found or is invalid.");
	}
}

//clearAttReqd() sets the required status of attribute 'a' to 'none'
//sample usage: simpleXrm.clearAttReqd(companyname) 
//attribute 'companyname' is no longer business required

simpleXrm.clearAttReqd = function(a) {
	if (simpleXrm.validAtt(a) ) {
		getAtt(a).setRequiredLevel("none");
	} else {
		console.log("Error: attribute " + a.toString() + " was not found.");
		throw new Error;
	}
}

//setAttRecommended() sets the required status of attribute 'a' to 'recommended'
//sample usage: simpleXrm.setAttRecommended(companyname) 
//attribute 'companyname' is now  business recommended

simpleXrm.setAttRecommended = function(a) {
	if (simpleXrm.validAtt(a) ) {
		getAtt(a).setRequiredLevel("recommended");
	} else {
		console.log("Error: attribute " + a.toString() + " was not found.");
		throw new Error;
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