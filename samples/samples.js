/// <reference path="..\prod\simpleXrmFull.min.js" />
var sampleScripts = { //name space for samples 
	onload: function () { //attach this function to the form onLoad event so the filter is always computed when the xrm_productid prelookup event is triggered
		simpleXrmFetch.addPreSearch("xrm_productid", 
			sampleScripts.filters.productFilter()
		);
	},
	fetch: {
		buildProductQuery: function () {
			var equipmentTypeId = simpleXrm.cleanGuid(simpleXrm.getLookupID("xrm_equipmenttypeid")); //returns equipment GUID
			var equipmentTypeName = simpleXrm.getLookupVal("xrm_equipmenttypeid");
			var productTypeCode = simpleXrm.getAttVal("xrm_producttypecode");
			var fetchQuery = {
				distinct : false,
				entity : "product",
				attributes : [{
						name : "productid"
					}, {
						name : "name"
					}, {
						name : "productnumber"
					}, {
						name : "price"
					}
				],
				order : [{
						attribute : "productnumber",
						descending : false
                }]
			};
			if (productTypeCode === "1" || productTypeCode === "2") {
				fetchQuery.filter = {
					type : "and",
					conditions : [{
							attribute : "producttypecode",
							operator : "eq",
							value : productTypeCode
						}
					]
				}
			} 
			if (equipmentTypeId) { //add link-entity node for equipment type
				if (!fetchQuery.filter) { //if the product type code didn't already create a filter, defining our fetch as a JS object allows us to easily create a filter node here
					fetchQuery.filter = {
						type : "and",
						conditions : []
					}
				};
				fetchQuery.filter.conditions.push({ //appends a new filter condition to the filter node
					attribute : "xrm_equipmenttypeid",
					operator : "eq",
					uiname : equipmentTypeName,
					uitype : "xrm_equipmenttypeid",
					value : equipmentTypeId
				});
			}
			var fetchXml = simpleXrmFetch.fetch(fetchQuery); //transpiles the fetch to XML (stored as a string in memory)
			return fetchXml;
		}
	},
    autofill: { //scope autofill functions
		loadProduct: function () { //attach to onChange event of xrm_producttypecode and xrm_equipmenttypeid
			var fetchXml = sampleScripts.fetch.buildProductQuery();
			simpleXrmSoap.fetch({
				fetch: fetchXml,
				callback: function () {
					if (simpleXrmSoap.parseOnReady(this)) {
						var results = simpleXrmSoap.normalizeResults(this);
						results = simpleXrmSoap.parseFetchResponse(results);
						if (results && results.length === 1) {
							var productId = results[0].id;
							//now if you wanted you could just pull the result from results[0].attributes but I'll demonstrate simpleXrmRest.query() instead
							simpleXrmRest.query({
								entity: "Product",
								guid: productId,
								select: "Name,CurrentCost", //could expand to include a price list item here and use simpleXrm.calcPriceListPrice() to calculate pricing in browser
								callback: function () {
									if (simpleXrmRest.parseOnReady(this)) {
										var result = simpleXrmRest.normalizeResults(this);
										if (result) {
											var product = [{
												entityType: "product",
												name: result.Name,
												id: productId
											}];
											var cost = simpleXrm.parseValue(result.CurrentCost);
											simpleXrm.setLookupVal("xrm_productid", product, true);
											simpleXrm.setAttVal("xrm_basecost", cost);
											simpleXrm.sendAttsAlways("xrm_productid", "xrm_basecost"); //make sure the updates you just made go through regardless of whether a field is locked
											//might invoke a pricing call here
										}
									}
								}
							})
						}
					}
				}
			})
		}
    },
    filters: {
        productFilter : function () { //filter by product type and associated equipment type
			var showCosts = simpleXrm.getAttVal("xrm_showcosts");
			var fetchXml = sampleScripts.fetch.buildProductQuery();
			//cells array for custom view
			var cells = [{
					name : "productnumber",
					width : "100"
				}, {
					name : "name",
					width : "200"
				}, {
					name : "price",
					width : "100"
				}
			];
			if (showCosts) { //conditionally add the cost row depending on whether cost sheet is showing
				fetchQuery.attributes.push({name: "currentcost"});
				cells.push({
					name : "xrm_basecost",
					width : "100"
				})
			};
			var layout = simpleXrmLayout.layout({
					name : "resultset",
					jump : "name",
					object : "1024",
					preview : false,
					row : {
						name : "result",
						id : "productid",
						cells : cells
					}
				});
			//this next part is a slick way to append
			var viewName = "Equipment Lookup View";
			if (equipmentType) {
				viewName = equipmentType + " " + viewName;
			};
			simpleXrmFetch.addCustomView({
				control : "xrm_productid",
				entityType : "product",
				viewDisplayName : viewName,
				fetchXml : fetchXml,
				layoutXml : layout,
				isDefault : true
			});
		}
    }
}
