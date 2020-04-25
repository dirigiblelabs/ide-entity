exports.transform = function(workspaceName, projectName, filePath) {

    if (!filePath.endsWith('.edm')) {
        return null;
    }

    var workspaceManager = require("workspace/v4/manager");
    var contents = workspaceManager.getWorkspace(workspaceName)
        .getProject(projectName).getFile(filePath).getContent();

    var bytes = require("io/v4/bytes");
    contents = bytes.byteArrayToText(contents);

    var xml = require("utils/v4/xml");
    var raw = JSON.parse(xml.toJson(contents));

    var root = {};
    root.model = {};
    root.model.entities = [];
    if (raw.model) {
        if (raw.model.entities) {
            if (raw.model.entities.entity) {
                if (Array.isArray(raw.model.entities.entity)) {
                    raw.model.entities.entity.forEach(entity => {root.model.entities.push(transformEntity(entity))});
                } else {
                    root.model.entities.push(transformEntity(raw.model.entities.entity));
                }
                if (Array.isArray(raw.model.entities.relation)) {
                    raw.model.entities.relation.forEach(relation => {transformRelation(relation, root.model.entities)});
                } else if (raw.model.entities.relation) {
                    transformRelation(raw.model.entities.relation, root.model.entities);
                }
            } else {
                console.error("Invalid source model: 'entity' element is null");
            }
        } else {
            console.error("Invalid source model: 'entities' element is null");
        }
    } else {
        console.error("Invalid source model: 'model' element is null");
    }

    return JSON.stringify(root);

    function transformEntity(raw) {
        var entity = {};
        entity.properties = [];
        for(var propertyName in raw) {
            if (propertyName !== 'property') {
                entity[propertyName.substring(1, propertyName.length)] = raw[propertyName];
            }
        }
        if (Array.isArray(raw.property)) {
            raw.property.forEach(property => {entity.properties.push(transformProperty(property))});
        } else {
            entity.properties.push(transformProperty(raw.property))
        }
        return entity;
    }

    function transformProperty(raw) {
        var property = {};
        for(var propertyName in raw) {
            property[propertyName.substring(1, propertyName.length)] = raw[propertyName];
        }
        return property;
    }

    function transformRelation(relation, entities) {
        entities.forEach(entity => {
            if (entity.name === relation['-entity']) {
                entity.properties.forEach(property => {
                    if (property.name === relation['-property']) {
                        property.relationshipName = relation['-name'];
                        property.relationshipEntityName = relation['-referenced'];
                        property.relationshipEntityPerspectiveName = relation['-relationshipEntityPerspectiveName'];
                    }
                });
            }
        });
    }
}