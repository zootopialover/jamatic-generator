import { Project } from "ts-morph";


const project = new Project()

const prismaFile = project.createSourceFile('./destination/prisma/schema.prisma', '', { overwrite: true })
const modelGenerator = require('./modules/db-module')
modelGenerator.insertClientBlock(prismaFile)
modelGenerator.insertDatabaseBlock(prismaFile)
modelGenerator.createPrismaModels('source/api/data', prismaFile)
project.save()
console.log("schema.prisma file created at './destination/prisma/schema.prisma'\n")

const schemaFile = project.createSourceFile('./destination/src/schema.ts', '', { overwrite: true })
const schemaGenerator = require('./modules/schema-generator')
const queriesGenerator = require('./modules/queries-module')
const mutationGenerator = require('./modules/mutations-module')
schemaGenerator.insertImportStatements(schemaFile)
schemaGenerator.insertDateTime(schemaFile)
schemaGenerator.insertSortOrderEnumType(schemaFile)
schemaGenerator.createNexusModels(schemaFile)
queriesGenerator.openQueryBlock(schemaFile)
queriesGenerator.mergeQueries('source/api/graphql/queries', schemaFile)
queriesGenerator.closeQueryBlock(schemaFile)
mutationGenerator.openMutationBlock(schemaFile)
mutationGenerator.mergeMutations('source/api/graphql/mutations', schemaFile)
mutationGenerator.closeMutationBlock(schemaFile)
schemaGenerator.createNexusSchema(schemaFile)
project.save()
console.log("\nschema.ts file created at './destination/src/schema.ts'");