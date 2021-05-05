import { SourceFile, VariableDeclarationKind } from "ts-morph";

const StringBuilder = require('node-stringbuilder')

exports.insertImportStatements = function (schemaFile: SourceFile) {

    schemaFile.addImportDeclaration({
        namedImports: [
            "intArg",
            "makeSchema",
            "nonNull",
            "objectType",
            "stringArg",
            "inputObjectType",
            "arg",
            "asNexusMethod",
            "enumType"
        ],
        moduleSpecifier: "nexus"
    })

    schemaFile.addImportDeclaration({
        namedImports: [
            "DateTimeResolver"
        ],
        moduleSpecifier: "graphql-scalars"
    })

    schemaFile.addImportDeclaration({
        namedImports: [
            "Context"
        ],
        moduleSpecifier: "./context"
    })
}

exports.insertDateTime = function (schemaFile: SourceFile) {
    schemaFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
            {
                name: "DateTime",
                initializer: "asNexusMethod(DateTimeResolver, 'date')"
            }
        ]
    })
}

exports.insertSortOrderEnumType = function (schemaFile: SourceFile) {
    schemaFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: false,
        declarations: [
            {
                name: "SortOrder",
                initializer: "enumType({ name: 'SortOrder', members: ['asc', 'desc'] })"
            }
        ]
    })
}

exports.createNexusSchema = function(schemaFile: SourceFile) {
    let sb = StringBuilder.from()
    sb.appendLine('makeSchema({')
    sb.appendLine('types: [')

    const variableStatements = schemaFile.getVariableDeclarations();
    variableStatements.forEach(element => {
        sb.append(element.getName()).appendLine(',')
    });

    sb.appendLine('],')
    sb.appendLine("outputs: {schema: __dirname + '/../schema.graphql',typegen: __dirname + '/generated/nexus.ts'},")
    sb.appendLine("contextType: {module: require.resolve('./context'),export: 'Context'},")
    sb.appendLine("sourceTypes: {modules: [{module: '@prisma/client',alias: 'prisma'}]},")
    sb.appendLine("})");

    schemaFile.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
            {
                name: "schema",
                initializer: sb.toString()
            }
        ]
    })

}
