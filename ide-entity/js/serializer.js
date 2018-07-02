function createModel(graph) {
	var model = [];
	model.push('<model>\n');
	model.push(' <entities>\n');
	var parent = graph.getDefaultParent();
	var childCount = graph.model.getChildCount(parent);

	for (var i=0; i<childCount; i++) {
		var child = graph.model.getChildAt(parent, i);
		
		if (!graph.model.isEdge(child)) {
			child.value.dataName = child.value.dataName ? child.value.dataName : JSON.stringify(child.value.name).replace(/\W/g, '').toUpperCase();
			child.value.dataCount = child.value.dataCount ? child.value.dataCount : 'SELECT COUNT(*) FROM ' + JSON.stringify(child.value.name).replace(/\W/g, '').toUpperCase();
			child.value.title = child.value.title ? child.value.title : child.value.name;
			child.value.tooltip = child.value.tooltip ? child.value.tooltip : child.value.name;
			child.value.menuKey = child.value.menuKey ? child.value.menuKey : JSON.stringify(child.value.name).replace(/\W/g, '').toLowerCase();
			child.value.menuLabel = child.value.menuLabel ? child.value.menuLabel : child.value.name;
			model.push('  <entity name="'+_.escape(child.value.name)+
				'" dataName="'+_.escape(child.value.dataName)+
				'" dataCount="'+_.escape(child.value.dataCount)+
				'" dataQuery="'+_.escape(child.value.dataQuery)+
				'" type="'+_.escape(child.value.type ? child.value.type : 'primary')+
				'" title="'+_.escape(child.value.title)+
				'" tooltip="'+_.escape(child.value.tooltip)+
				'" icon="'+_.escape(child.value.icon)+
				'" menuKey="'+_.escape(child.value.menuKey)+
				'" menuLabel="'+_.escape(child.value.menuLabel)+
				'" menuIndex="'+_.escape(child.value.menuIndex)+
				'" layoutType="'+_.escape(child.value.layoutType)+
				'" perspectiveName="'+_.escape(child.value.perspectiveName)+
				'" perspectiveIcon="'+_.escape(child.value.perspectiveIcon)+
				'" perspectiveOrder="'+_.escape(child.value.perspectiveOrder)+
				'">\n');
			
			var propertyCount = graph.model.getChildCount(child);
			if (propertyCount > 0) {
				for (var j=0; j<propertyCount; j++) {
					var property = graph.model.getChildAt(child, j).value;
					
					property.dataName = property.dataName ? property.dataName : JSON.stringify(property.name).replace(/\W/g, '').toUpperCase();
					
					model.push('    <property name="'+_.escape(property.name)+
						'" dataName="'+_.escape(property.dataName)+
						'" dataType="'+_.escape(property.dataType)+'"');
					if (property.dataLength !== null) {
						model.push(' dataLength="'+_.escape(property.dataLength)+'"');
					}
					if (property.dataNotNull) {
						model.push(' dataNullable="false"');
					}
					if (property.dataPrimaryKey) {
						model.push(' dataPrimaryKey="true"');
					}
					if (property.dataAutoIncrement) {
						model.push(' dataAutoIncrement="true"');
					}
					if (property.dataUnique) {
						model.push(' dataUnique="true"');
					}
					if (property.dataDefaultValue !== null) {
						model.push(' dataDefaultValue="'+_.escape(property.dataDefaultValue)+'"');
					}
					if (property.dataPrecision !== null) {
						model.push(' dataPrecision="'+_.escape(property.dataPrecision)+'"');
					}
					if (property.dataScale !== null) {
						model.push(' dataScale="'+_.escape(property.dataScale)+'"');
					}
					if (property.relationshipType !== null) {
						model.push(' relationshipType="'+_.escape(property.relationshipType ? property.relationshipType : 'ASSOCIATION')+'"');
					}
					if (property.relationshipCardinality !== null) {
						model.push(' relationshipCardinality="'+_.escape(property.relationshipCardinality ? property.relationshipCardinality : '1_n')+'"');
					}
					if (property.relationshipName !== null) {
						model.push(' relationshipName="'+_.escape(property.relationshipName)+'"');
					}
					if (property.widgetType !== null) {
						model.push(' widgetType="'+_.escape(property.widgetType)+'"');
					}
					if (property.widgetLength !== null) {
						model.push(' widgetLength="'+_.escape(property.widgetLength)+'"');
					}
					if (property.widgetLabel !== null) {
						model.push(' widgetLabel="'+_.escape(property.widgetLabel)+'"');
					}
					if (property.widgetShortLabel !== null) {
						model.push(' widgetShortLabel="'+_.escape(property.widgetShortLabel)+'"');
					}
					if (property.widgetPattern !== null) {
						model.push(' widgetPattern="'+_.escape(property.widgetPattern)+'"');
					}
					if (property.widgetFormat !== null) {
						model.push(' widgetFormat="'+_.escape(property.widgetFormat)+'"');
					}
					if (property.widgetSection !== null) {
						model.push(' widgetSection="'+_.escape(property.widgetSection)+'"');
					}
					if (property.widgetService !== null) {
						model.push(' widgetService="'+_.escape(property.widgetService)+'"');
					}
					if (property.widgetIsMajor) {
						model.push(' widgetIsMajor="true"');
					}
					
					model.push('></property>\n');
				}
			}
			model.push('  </entity>\n');
		} else {
			var relationName = child.name ? child.name : child.source.parent.value.name+'_'+ child.target.parent.value.name;
			model.push('  <relation name="'+_.escape(child.source.parent.value.name)+'_' 
				+_.escape(child.target.parent.value.name)+'" type="relation" ');
			model.push('entity="'+_.escape(child.source.parent.value.name)+'" ');
			model.push('relationName="'+_.escape(relationName)+'" ');
			model.push('property="'+_.escape(child.source.value.name)+'" '+
				'referenced="'+_.escape(child.target.parent.value.name)+'" '+
				'referencedProperty="'+_.escape(child.target.value.name)+'">\n');
			model.push('  </relation>\n');
		}
	}
	model.push(' </entities>\n');
	
	var enc = new mxCodec(mxUtils.createXmlDocument());
	var node = enc.encode(graph.getModel());
	var mxGraph = mxUtils.getXml(node);
	model.push(' '+mxGraph);
	model.push('\n</model>');
	
	return model.join('');
}

function createModelJson(graph) {
	var root = {};
	root.model = {};
	root.model.entities = [];
	var parent = graph.getDefaultParent();
	var childCount = graph.model.getChildCount(parent);
	var compositions = {};
	
	for (var i=0; i<childCount; i++) {
		var child = graph.model.getChildAt(parent, i);
		if (graph.model.isEdge(child)) {
			// Relationship Properties
			var relationName = child.name ? child.name : child.source.parent.value.name+'_'+ child.target.parent.value.name;
			child.source.value.relationshipName = _.escape(relationName);
			child.source.value.relationshipEntityName = _.escape(child.target.parent.value.name);
			child.source.value.relationshipEntityPerspectiveName = _.escape(child.target.parent.value.perspectiveName);
			child.source.value.widgetDropDownKey = _.escape(child.source.value.widgetDropDownKey ? child.source.value.widgetDropDownKey : child.target.value.name);
			child.source.value.widgetDropDownValue = _.escape(child.source.value.widgetDropDownValue ? child.source.value.widgetDropDownValue : child.target.value.name);
			
			if (child.source.value.relationshipType === 'COMPOSITION') {
				var composition = {};
				composition.entityName = _.escape(child.source.parent.value.name);
				composition.entityProperty = _.escape(child.source.value.name);
				composition.localProperty = _.escape(child.target.value.name);
				if (!compositions[child.target.parent.value.name]) {
					compositions[child.target.parent.value.name] = [];
				}
				compositions[child.target.parent.value.name].push(composition);
			}
		}
	}

	for (var i=0; i<childCount; i++) {
		var child = graph.model.getChildAt(parent, i);
		if (!graph.model.isEdge(child)) {
			var entity = {};
			entity.name = _.escape(child.value.name);
			entity.dataName = _.escape(child.value.dataName ? child.value.dataName : JSON.stringify(child.value.name).replace(/\W/g, '').toUpperCase());
			entity.dataCount = _.escape(child.value.dataCount ? child.value.dataCount : 'SELECT COUNT(*) FROM ' + JSON.stringify(child.value.name).replace(/\W/g, '').toUpperCase());
			entity.dataQuery = _.escape(child.value.dataQuery);
			entity.type = _.escape(child.value.type ? child.value.type : "PRIMARY");
			entity.title = _.escape(child.value.title ? child.value.title : child.value.name);
			entity.tooltip = _.escape(child.value.tooltip ? child.value.tooltip : child.value.name);
			entity.icon = _.escape(child.value.icon);
			entity.menuKey = _.escape(child.value.menuKey ? child.value.menuKey : JSON.stringify(child.value.name).replace(/\W/g, '').toLowerCase());
			entity.menuLabel = _.escape(child.value.menuLabel ? child.value.menuLabel : child.value.name);
			entity.menuIndex = child.value.menuIndex ? child.value.menuIndex : 100;
			entity.layoutType = child.value.layoutType;
			entity.perspectiveName = _.escape(child.value.perspectiveName);
			entity.perspectiveIcon = _.escape(child.value.perspectiveIcon);
			entity.perspectiveOrder = _.escape(child.value.perspectiveOrder);
			entity.properties = [];
			
			if (compositions[entity.name]) {
				entity.compositions = compositions[entity.name];
			}
			
			var propertyCount = graph.model.getChildCount(child);
			if (propertyCount > 0) {
				for (var j=0; j<propertyCount; j++) {
					var childProperty = graph.model.getChildAt(child, j).value;
					var property = {};
					
					// General
					property.name = _.escape(childProperty.name);
					
					// Data Properties
					property.dataName = _.escape(childProperty.dataName ? childProperty.dataName : JSON.stringify(childProperty.name).replace(/\W/g, '').toUpperCase());
					property.dataType = childProperty.dataType;
					property.dataLength = childProperty.dataLength;
					property.dataDefaultValue = _.escape(childProperty.dataDefaultValue);
					property.dataPrimaryKey = childProperty.dataPrimaryKey ? childProperty.dataPrimaryKey : "false";
					property.dataAutoIncrement = childProperty.dataAutoIncrement ? childProperty.dataAutoIncrement : "false";
					property.dataNotNull = childProperty.dataNotNull ? childProperty.dataNotNull : "false";
					property.dataUnique = childProperty.dataUnique ? childProperty.dataUnique : "false";
					property.dataPrecision = childProperty.dataPrecision;
					property.dataScale = childProperty.dataScale;
					
					// Relationship Properties
					property.relationshipType = childProperty.relationshipType;
					property.relationshipCardinality = childProperty.relationshipCardinality;
					property.relationshipName = _.escape(childProperty.relationshipName);
					property.relationshipEntityName = _.escape(childProperty.relationshipEntityName);
					property.relationshipEntityPerspectiveName = _.escape(childProperty.relationshipEntityPerspectiveName);
					
					// Widget Properties
					property.widgetType = childProperty.widgetType;
					property.widgetLength = childProperty.widgetLength;
					property.widgetLabel = _.escape(childProperty.widgetLabel ? childProperty.widgetLabel : childProperty.name);
					property.widgetShortLabel = _.escape(childProperty.widgetShortLabel ? childProperty.widgetShortLabel : childProperty.name);
					property.widgetPattern = _.escape(childProperty.widgetPattern);
					property.widgetFormat = _.escape(childProperty.widgetFormat);
					property.widgetSection = _.escape(childProperty.widgetSection);
					property.widgetService = _.escape(childProperty.widgetService);
					property.widgetIsMajor = childProperty.widgetIsMajor ? childProperty.widgetIsMajor : "false";
					property.widgetDropDownKey = _.escape(childProperty.widgetDropDownKey);
					property.widgetDropDownValue = _.escape(childProperty.widgetDropDownValue);
					
					entity.properties.push(property);
				}
			}

			root.model.entities.push(entity);
		}
	}
	
	var serialized = JSON.stringify(root, null, 4);
	
	return serialized;
}