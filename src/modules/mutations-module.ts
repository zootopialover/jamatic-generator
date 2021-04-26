import { Project, SourceFile, SyntaxKind } from "ts-morph";
import { ExtractObjectName } from "./model-util"

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
            const objName = ExtractObjectName(fileName);
            if (objName != undefined) {
                if (fileName.startsWith("delete")) {
                    const fileData: SourceFile = project.addSourceFileAtPath("./src/templates/mutation/deleteById.ts")
                    let modifiedData: string = fileData.getText().replace(/_ObjectName_/g, objName);
                    writeToFile(schemaFile, modifiedData)
                } else if (fileName.startsWith("something")) {
                    // do something, add more blocks like this to to add automatic support for more mutation operations
                } else {
                    console.log('Skipping unhandled file ', file.getBaseName(), ' at path : ', file.getFilePath())
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