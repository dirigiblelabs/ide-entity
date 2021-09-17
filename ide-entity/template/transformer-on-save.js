let transformer = require("ide-entity/template/transform-edm");
let workspaceManager = require("platform/v4/workspace");

let workspace = __context.get('workspace');
let project = __context.get('project');
let path = __context.get('path');

let modelPath = path.replace(".edm", ".model");
let content = transformer.transform(workspace, project, path);

if (content !== null) {
    let bytes = require("io/v4/bytes");
    input = bytes.textToByteArray(content);

    if (workspaceManager.getWorkspace(workspace)
        .getProject(project).getFile(path).exists()) {
        workspaceManager.getWorkspace(workspace)
            .getProject(project).createFile(modelPath, input);
    } else {
        workspaceManager.getWorkspace(workspace)
            .getProject(project).getFile(modelPath).setContent(input);
    }
}