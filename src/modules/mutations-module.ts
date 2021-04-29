import { Project, SourceFile, SyntaxKind } from "ts-morph";
import { ExtractOperationMap, OperationType } from "./model-util"

const StringBuilder = require('node-stringbuilder');

function writeToFile(file: SourceFile, data: string) {
    file.addStatements([
        data
    ])
}

exports.openMutationBlock = function (schemaFile: SourceFile) {
    let sb = StringBuilder.from();
    sb.append('const Mutation = objectType(').appendLine('{');
    sb.append('name:').append(' ').append('"Mutation"').appendLine(',');
    sb.append('definition(t)').append(' ').appendLine('{').appendLine('');

    schemaFile.addStatements([
        sb.toString()
    ])
}

exports.closeMutationBlock = function (schemaFile: SourceFile) {
    let sb = StringBuilder.from();
    sb.appendLine('}');
    sb.appendLine('})').appendLine('');

    schemaFile.addStatements([
        sb.toString()
    ])
}

exports.mergeMutations = function (sourceDir: string, schemaFile: SourceFile) {
    const project = new Project();
    project.addSourceFilesAtPaths(sourceDir + "/*.ts");
    project.getSourceFiles().forEach((file) => {
        const fileName: string = file.getBaseNameWithoutExtension();

        const fileData = file.forEachDescendant((node, traversal) => {
            if (node.getKind() == SyntaxKind.ObjectLiteralExpression) {
                return node;
            }
            return undefined;
        });

        if (fileData == undefined) {
            const operationMap = ExtractOperationMap(fileName);
            if (operationMap.size == 0) {
                console.log('Skipping unhandled file ', file.getBaseName(), ' at path : ', file.getFilePath())
            } else {
                const objName : string = operationMap.get("model") as string
                const objNameLowerCased : string = (operationMap.get("model") as string).toLowerCase()
                switch (operationMap.get("type")) {
                    case OperationType.DELETE: {
                        const fileData: SourceFile = project.addSourceFileAtPath("./src/templates/mutation/deleteObject.ts")
                        let modifiedData: string = fileData.getText()
                        .replace(/_ObjectName_/g, objName)
                        .replace(/_ObjectNameLowerCased_/g, objNameLowerCased);
                        writeToFile(schemaFile, modifiedData)
                        break;
                    }
                }
            }
        } else {
            let sb = StringBuilder.from();
            let modifiedData: string = fileData.getText().replace(/jamatic.schema/g, 'context.prisma');
            sb.append("t.nonNull.field('" + file.getBaseNameWithoutExtension() + "', ").append(modifiedData).appendLine(')');
            writeToFile(schemaFile, sb.toString())
        }
    });
};