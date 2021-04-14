import { Project } from "ts-morph";

const StringBuilder = require('node-stringbuilder');
var sb = StringBuilder.from();
const dbSchemas = new Project();
dbSchemas.addSourceFilesAtPaths("./source/api/data/*.ts");

dbSchemas.getSourceFiles().forEach((file) => {
  var modelName = file.getBaseNameWithoutExtension()
  var data = require('./source/api/data/' + modelName);
  var attributes = data.default.attributes;
  
  sb.append('model').append(' ').append(modelName).append(' ').appendLine('{');
  sb.append('id').append(' ').append('Int').append(' ').append('@id').append(' ').appendLine('@default(autoincrement())');

  if(data.default.skipTimestamps != undefined || data.default.skipTimestamps == false) {
    sb.append('createdAt').append(' ').append('DateTime').append(' ').appendLine('@default(now())');
    sb.append('updatedAt').append(' ').append('DateTime').append(' ').appendLine('@updatedAt');
  }
  
  for(let ele in attributes) {
    var props = attributes[ele];
    sb.append(ele).append(' ');
    
    switch(props.type) {
      case 'string' : {
        sb.append('String');
        if(props.validation != undefined) {
          if(props.validation.required == undefined || props.validation.required == false) sb.append('?');
        }
        if(props.unique != undefined) sb.append(' ').append('@unique');
        if(props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
        sb.appendLine();
        break;
      }
      case 'boolean' : {
        sb.append('Boolean');
        if(props.validation != undefined) {
          if(props.validation.required == undefined || props.validation.required == false) sb.append('?');
        }
        if(props.unique != undefined) sb.append(' ').append('@unique');
        if(props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
        sb.appendLine();
        break;
      }
      case 'integer' : {
        sb.append('Int');
        if(props.validation != undefined) {
          if(props.validation.required == undefined || props.validation.required == false) sb.append('?');
        }
        if(props.unique != undefined) sb.append(' ').append('@unique');
        if(props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
        sb.appendLine();
        break;
      }
      case 'relation' : {
        sb.append(props.relation);
        if(props.validation != undefined) {
          if(props.validation.required == undefined || props.validation.required == false) sb.append('?');
        }
        sb.append(' ').append('@relation');
        if(props.foreignKey != undefined) {
          sb.appendLine('(fields: [' + props.foreignKey + '], references: [id])');
          sb.append(props.foreignKey).append(' ').append('Int')
        }
        sb.appendLine();
        break;
      }
      default : {
        sb.append(props.type);
        if(props.validation != undefined) {
          if(props.validation.required == undefined || props.validation.required == false) sb.append('?');
        }
        if(props.unique != undefined) sb.append(' ').append('@unique');
        if(props.default != undefined) sb.append(' ').append('@default(' + props.default + ')');
        sb.appendLine();
      }
    }
  }
  
  sb.appendLine('}').appendLine('');
  
});

console.log(sb);

var fs = require('fs');
var logStream = fs.createWriteStream('./destination/prisma/schema.prisma', {flags: 'w'});
// use {flags: 'a'} to append and {flags: 'w'} to erase and write a new file
logStream.write(sb.toString());
logStream.end('');

