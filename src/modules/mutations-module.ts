import { Project, SourceFile, SyntaxKind } from "ts-morph";

const StringBuilder = require('node-stringbuilder');


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
        console.log('Mutation file found : ', file.getBaseName());
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