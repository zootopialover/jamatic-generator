import { SourceFile, VariableDeclarationKind } from "ts-morph"
import { ModelNames } from "./model-util"

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

exports.createNexusSchema = function (schemaFile: SourceFile) {
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

exports.createNexusModels = function (schemaFile: SourceFile) {
    let sb = StringBuilder.from()

    for (const name of ModelNames) {
        const data = require('../../source/api/data/' + name)
        const attributes = data.default.attributes

        sb.append('const ').append(name).append(' = ').appendLine('objectType({')
        sb.append('name: ').append("'").append(name).append("'").appendLine(',')
        sb.appendLine('definition(t) {')
        sb.appendLine("t.nonNull.int('id')")

        if (data.default.skipTimestamps != undefined || data.default.skipTimestamps == false) {
            sb.appendLine("t.nonNull.field('createdAt', { type: 'DateTime' })")
            sb.appendLine("t.nonNull.field('updatedAt', { type: 'DateTime' })")
        }

        for (let ele in attributes) {
            const props = attributes[ele];
            const required: boolean = props.validation == undefined || (props.validation.required != undefined && props.validation.required)

            sb.append('t.')
            if (required) sb.append('nonNull.')

            switch (props.type) {
                case 'integer': {
                    sb.append('int').append("('").append(ele).appendLine("')")
                    break
                }
                case 'relation': {
                    let foreignModel = props.relation;
                    if (foreignModel.endsWith('[]')) {
                        foreignModel = foreignModel.slice(0, -2)
                        sb.append('list.nonNull.')
                    }
                    sb.append('field').append("('").append(ele).appendLine("', {")
                    sb.append('type: ').append("'").append(foreignModel).appendLine("',")
                    sb.appendLine('resolve: (parent, _, context: Context) => {')
                    sb.append('return context.prisma.').append(name.toLowerCase())
                    sb.append('.findUnique({ where: { id: parent.id || undefined }}).').append(ele).appendLine('()')
                    sb.appendLine('}')
                    sb.appendLine('})')
                    break
                }
                default: {
                    sb.append(props.type).append("('").append(ele).appendLine("')")
                }
            }
        }

        sb.appendLine('}')
        sb.appendLine('})')
    }
    console.log(sb.toString())
    schemaFile.addStatements([
        sb.toString()
    ])
};
