import { Project, SourceFile, SyntaxKind } from "ts-morph"
import { OperationType, ExtractOperationMap } from "./model-util"

const StringBuilder = require('node-stringbuilder')
const fs = require('fs')

function writeToFile(file: SourceFile, data: string) {
    file.addStatements([
        data
    ])
}

exports.openQueryBlock = function (schemaFile: SourceFile) {
    let sb = StringBuilder.from();
    sb.append('const Query = objectType(').appendLine('{');
    sb.append('name:').append(' ').append('"Query"').appendLine(',');
    sb.append('definition(t)').append(' ').appendLine('{').appendLine('');

    schemaFile.addStatements([
        sb.toString()
    ])
}

exports.closeQueryBlock = function (schemaFile: SourceFile) {
    let sb = StringBuilder.from();
    sb.appendLine('}');
    sb.appendLine('})').appendLine('');

    schemaFile.addStatements([
        sb.toString()
    ])
}

exports.mergeQueries = function (sourceDir: string, schemaFile: SourceFile) {
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
            const operationMap = ExtractOperationMap(fileName)
            if (operationMap.size == 0) {
                console.log('Skipping unhandled file ', file.getBaseName(), ' at path : ', file.getFilePath())
            } else {
                switch (operationMap.get("type")) {
                    case OperationType.GET: {
                        const fileData: SourceFile = project.addSourceFileAtPath("./src/templates/query/getObject.ts")
                        let modifiedData: string = fileData.getText().replace(/_ObjectName_/g, operationMap.get("model") as string);
                        writeToFile(schemaFile, modifiedData)
                        break;
                    }
                    case OperationType.GET_BY: {
                        const fileData: SourceFile = project.addSourceFileAtPath("./src/templates/query/getObjectByColumn.ts")
                        break;
                    }
                    case OperationType.GET_ALL: {
                        const fileData: SourceFile = project.addSourceFileAtPath("./src/templates/query/getAllObject.ts")
                        let modifiedData: string = fileData.getText().replace(/_ObjectName_/g, operationMap.get("model") as string);
                        writeToFile(schemaFile, modifiedData)
                        break;
                    }
                    case OperationType.GET_ALL_BY: {
                        const fileData: SourceFile = project.addSourceFileAtPath("./src/templates/query/getAllObjectByColumn.ts")
                        break;
                    }
                }
            }
        } else {
            let sb = StringBuilder.from()
            let modifiedData: string = fileData.getText().replace(/jamatic.schema/g, 'context.prisma')
            sb.append("t.nonNull.field('" + fileName + "', ").append(modifiedData).appendLine(')')
            writeToFile(schemaFile, sb.toString())
        }
    });
};