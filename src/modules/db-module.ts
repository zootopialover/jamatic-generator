import { SourceFile } from "ts-morph"
import { ModelNames } from "./model-util"

const StringBuilder = require('node-stringbuilder')


exports.insertClientBlock = function (prismaFile: SourceFile) {
  let sb = StringBuilder.from();
  
  sb.append('generator').append(' ').append('client').append(' ').appendLine('{');
  sb.append('provider').append(' ').append('=').append(' ').appendLine('"prisma-client-js"');
  sb.append('binaryTargets').append(' ').append('=').append(' ').appendLine('["native", "rhel-openssl-1.0.x"]');
  sb.appendLine('}').appendLine('');

  prismaFile.addStatements([
    sb.toString()
  ])
};

exports.insertDatabaseBlock = function (prismaFile: SourceFile) {
  let sb = StringBuilder.from();

  sb.append('datasource').append(' ').append('db').append(' ').appendLine('{');
  sb.append('provider').append(' ').append('=').append(' ').appendLine('"sqlite"');
  sb.append('url').append(' ').append('=').append(' ').appendLine('"file:./dev.db"');
  sb.appendLine('}').appendLine('');

  prismaFile.addStatements([
    sb.toString()
  ])
};

exports.createPrismaModels = function (sourcePath: string, prismaFile: SourceFile) {
  let sb = StringBuilder.from();

  for (const name of ModelNames) {
    const data = require('../../source/api/data/' + name);
    const attributes = data.default.attributes;

    sb.append('model').append(' ').append(name).append(' ').appendLine('{');
    sb.append('id').append(' ').append('Int').append(' ').append('@id').append(' ').appendLine('@default(autoincrement())');

    if (data.default.skipTimestamps != undefined || data.default.skipTimestamps == false) {
      sb.append('createdAt').append(' ').append('DateTime').append(' ').appendLine('@default(now())');
      sb.append('updatedAt').append(' ').append('DateTime').append(' ').appendLine('@updatedAt');
    }

    for (let ele in attributes) {
      var props = attributes[ele];
      sb.append(ele).append(' ');  
      switch (props.type) {
        case 'string': {
          sb.append('String');
          if (props.validation != undefined) {
            if (props.validation.required == undefined || props.validation.required == false) sb.append('?');
          }
          if (props.unique != undefined) sb.append(' ').append('@unique');
          if (props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
          sb.appendLine();
          break;
        }
        case 'boolean': {
          sb.append('Boolean');
          if (props.validation != undefined) {
            if (props.validation.required == undefined || props.validation.required == false) sb.append('?');
          }
          if (props.unique != undefined) sb.append(' ').append('@unique');
          if (props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
          sb.appendLine();
          break;
        }
        case 'integer': {
          sb.append('Int');
          if (props.validation != undefined) {
            if (props.validation.required == undefined || props.validation.required == false) sb.append('?');
          }
          if (props.unique != undefined) sb.append(' ').append('@unique');
          if (props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
          sb.appendLine();
          break;
        }
        case 'relation': {
          sb.append(props.relation);
          if (props.validation != undefined) {
            if (props.validation.required == undefined || props.validation.required == false) sb.append('?');
          }
          sb.append(' ').append('@relation');
          if (!String(props.relation).includes("[]")) {
            const foreignKey = ele.toLowerCase().trim() + 'Id';
            sb.appendLine('(fields: [' + foreignKey + '], references: [id])');
            sb.append(foreignKey).append(' ').append('Int')
          }
          sb.appendLine();
          break;
        }
        default: {
          sb.append(props.type);
          if (props.validation != undefined) {
            if (props.validation.required == undefined || props.validation.required == false) sb.append('?');
          }
          if (props.unique != undefined) sb.append(' ').append('@unique');
          if (props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
          sb.appendLine();
        }
      }
    }
    sb.appendLine('}');
  }

  prismaFile.addStatements([
    sb.toString()
  ])
};
