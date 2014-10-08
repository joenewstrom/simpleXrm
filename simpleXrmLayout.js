// JavaScript source code
/// <reference path="pathto/script.js"/>

simpleXrmLayout = {}

simpleXrmLayout.cellXML = function (n, w) {
    /// <summary>simpleXrm.buildCellXml() returns a cell XML element for attribute 'n' and width 'w'.</summary>
    /// <param name="n" type="String">The name of the attribute to be shown in the column.</param>
    return "<cell name='" + n.toString() + "' width='" + w.toString() + "' />";
}

simpleXrmLayout.rowXML = function (a, c, n) {
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

simpleXrmLayout.gridXML = function (o, a, r, n, p, c) {
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

/* simpleXrmLayout.rowXML("new_entityId", [simpleXrmLayout.cellXML("new_entityname", 125),simpleXrmLayout.cellXML("new_field1", 95), simpleXrmLayout.cellXML("new_field2", 125)], "resultset")
 * returns layoutXml for a
 * 
 * 
 * 
 */