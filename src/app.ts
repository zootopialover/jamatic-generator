import { Project, VariableDeclarationKind, SyntaxKind } from "ts-morph";


const project = new Project();
const prismaFile = project.createSourceFile('./destination/prisma/schema.prisma', '', { overwrite: true });
const schemaFile = project.createSourceFile('./destination/src/schema.ts', '', { overwrite: true });

const modelGenerator = require('./modules/db-module');
modelGenerator.insertClientBlock(prismaFile);
modelGenerator.insertDatabaseBlock(prismaFile);
modelGenerator.createPrismaModels('source/api/data', prismaFile);
project.save();
console.log("schema.prisma file created at './destination/prisma/schema.prisma'\n");


const schemaGenerator = require('./modules/schema-generator');
schemaGenerator.insertImportStatements(schemaFile);
schemaGenerator.insertDateTime(schemaFile);
schemaGenerator.insertSortOrderEnumType(schemaFile);

const queriesGenerator = require('./modules/queries-module');
queriesGenerator.openQueryBlock(schemaFile);
queriesGenerator.mergeQueries('source/api/graphql/queries', schemaFile);
queriesGenerator.closeQueryBlock(schemaFile);

const mutationGenerator = require('./modules/mutations-module');
mutationGenerator.openMutationBlock(schemaFile);
mutationGenerator.mergeMutations('source/api/graphql/mutations', schemaFile);
mutationGenerator.closeMutationBlock(schemaFile);

project.save();
console.log("schema.ts file created at './destination/src/schema.ts'");