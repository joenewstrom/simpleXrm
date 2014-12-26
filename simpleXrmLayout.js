/// <reference path="C:\DynamicsCRM\Scripts\simpleXrm.js"/>

var simpleXrmLayout = {
    layout: function (o) {
        var l = "";
        var r = "";
        l += "<grid ";
        if (!!o.name) {
            l += "name='" + o.name + "' ";
        } else {
            l += "name='resultset' ";
        }
        if (!!o.object) {
            l += "object='" + o.object.toString() + "' ";
        }
        if (!!o.jump) {
            l += "jump='" + o.jump + "' "
        }
        l += "select='1' ";
        if (o.icon) {
            l += "icon='1' ";
        } else {
            l += "icon='0' ";
        };
        if (o.preview) {
            l += "preview='1'";
        } else {
            l += "preview='0'";
        };
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