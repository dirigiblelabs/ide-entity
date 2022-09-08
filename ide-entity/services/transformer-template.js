const transformer = require("ide-entity/template/transform-edm");

exports.generate = function (model, parameters) {
    let workspaceName = parameters.workspaceName;
    let projectName = parameters.projectName;
    let filePath = parameters.filePath;
    let fileName = filePath.substring(0, filePath.indexOf(".edm"));
    return [{
        path: `${fileName}.model`,
        content: transformer.transform(workspaceName, projectName, filePath)
    }]
};

exports.getTemplate = function () {
    let template = {
        "name": "Entity Data to JSON Model Transformer",
        "description": "Model transformer template",
        "extension": "edm",
        "sources": [
            {
                "location": "/ide-entity/template/source.model.template",
                "action": "generate",
                "rename": "{{projectName}}.model",
                "engine": "javascript",
                "handler": "/ide-entity/template/transformer.js"
            }],
        "parameters": []
    };
    return template;
}