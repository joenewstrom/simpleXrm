/// <summary>
/// VERSION 1.5.1 - MIT License (see License File at https://github.com/joenewstrom/simpleXrm)
/// simpleXrm.js is a lightweight general purpose library intended to compress both the time and the volume of code required to author form scripts in Dynamics CRM using the javascript API as documented in the CRM 2013 SDK.
/// In order to use the library, simply reference the methods below in your form scripts libraries (including the simpleXrm namespace), and include the minified production version of simpleXrm.js to your form's libraries.
/// To avoid runtime errors, ensure that simpleXrm.js is loaded before all libraries that reference it by moving it above those libraries in the form libraries section of the form properties UI.
/// 
/// simpleXrmLayout: a series of functions that allow LayoutXML to be modeled as JavaScript Objects and copiling to XML at runtime
/// </summary>

var simpleXrmLayout = {
    layout: function (o) {
        var l = "";
        var r = "";
        l += "<grid";
        if (!!o.name) {
            l += " name='" + o.name + "'";
        } else {
            l += " name='resultset'";
        };
        if (o.icon) {
            l += " icon='1'";
        } else {
            l += " icon='0'";
        };
        if (!!o.jump) {
            l += " jump='" + o.jump + "'";
        };
        if (!!o.object) {
            l += " object='" + o.object.toString() + "'";
        };
        if (o.preview) {
            l += " preview='1'";
        } else {
            l += " preview='0'";
        };
        l += " select='1'";
        l += ">";
        r += "</grid>";
        if (!!o.row) {
            l += simpleXrmLayout.row(o.row)
        }
        return l + r;
    },
    row: function (o) {
        var l = "";
        var r = "";
        l += "<row ";
        r += "</row>"
        if (!!o.name) {
            l += "name='" + o.name + "' ";
        } else {
            l += "name='result' ";
        };
        if (!!o.id) {
            l += "id='" + o.id + "'";
        }
        l += ">";
        if (!!o.cells && o.cells.length > 0) {
            l += simpleXrmLayout.cells(o.cells);
        }
        return l + r;
    },
    cells: function (a) {
        var l = "";
        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                l += "<cell name='" + a[i].name + "' width='" + a[i].width.toString() + "' />";
            }
        }
        return l;
    }
}
