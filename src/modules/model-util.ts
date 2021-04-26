import { Project } from "ts-morph";

function modelNames() {
    let models: string[] = []
    const project = new Project()
    project.addSourceFilesAtPaths("./source/api/data/*.ts")
    project.getSourceFiles().forEach((file) => {
        models.push(file.getBaseNameWithoutExtension())
    })
    return models
}

export const ModelNames = modelNames()

export function ExtractObjectName(fileName: string) {
    const res = fileName.match(/([A-Z])\w+/g) 
    let exists: boolean = false
    let objName: string | undefined = res? res[0] : undefined
    if(objName != undefined) { 
        exists = ModelNames.includes(objName)
        if(!exists) {
            if(objName.endsWith('es')) {
                objName = objName.slice(0, -2)
                exists = ModelNames.includes(objName);
            } else if(objName.endsWith('s')) {
                objName = objName.slice(0, -1)
                exists = ModelNames.includes(objName)
            }
        }
        if(!exists){
            console.error('Model with name', objName, 'not found in imported Models')
        }
    } else {
        console.error('Could not extract model name from fileName :', fileName)
    }
    return exists ? objName : undefined
}
