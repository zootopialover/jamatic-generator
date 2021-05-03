import { SourceFile, VariableDeclarationKind } from "ts-morph";

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
