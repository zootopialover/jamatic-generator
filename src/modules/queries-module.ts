import { Project, SourceFile, SyntaxKind } from "ts-morph";

const StringBuilder = require('node-stringbuilder');
const fs = require('fs');

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
        console.log('Query file found : ', file.getBaseName());
        const fileData = file.forEachDescendant((node, traversal) => {
            if (node.getKind() == SyntaxKind.ObjectLiteralExpression) {
                return node;
            }
            return undefined;
        });
        let modifiedData: string = fileData ? fileData.getText().replace(/jamatic.schema/g, 'context.prisma') : '';
        //console.log(modifiedData);

        if(modifiedData.length > 0) {
            let sb = StringBuilder.from();

            sb.append("t.nonNull.field('" + file.getBaseNameWithoutExtension() + "', ");
            sb.append(modifiedData);
            sb.appendLine(')').appendLine('');
        
            schemaFile.addStatements([
                sb.toString()
            ])
        }
    });
};