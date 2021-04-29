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

export enum OperationType {
    GET, GET_BY, GET_ALL, GET_ALL_BY, DELETE
}

export function ExtractOperationMap(fileName: string) {

    let operationMap: Map<string, OperationType | string> = new Map()

    if (fileName.startsWith("getAll") && fileName.includes("By")) {
        const array: string[] = fileName.replace("getAll", "").split("By")
        operationMap.set("type", OperationType.GET_ALL_BY)
        operationMap.set("model", array[0])
        operationMap.set("column", array[1])
    }
    else if (fileName.startsWith("getAll")) {
        operationMap.set("type", OperationType.GET_ALL)
        operationMap.set("model", fileName.replace("getAll", ""))
    }
    else if (fileName.startsWith("get") && fileName.includes("By")) {
        const array: string[] = fileName.replace("get", "").split("By")
        operationMap.set("type", OperationType.GET_BY)
        operationMap.set("model", array[0])
        operationMap.set("column", array[1])
    }
    else if (fileName.startsWith("get")) {
        operationMap.set("type", OperationType.GET)
        operationMap.set("model", fileName.replace("get", ""))
    }
    else if (fileName.startsWith("delete")) {
        operationMap.set("type", OperationType.DELETE)
        operationMap.set("model", fileName.replace("delete", ""))
    }

    if (operationMap.size == 0) {
        console.error('Could not extract model name from fileName :', fileName)
    } else if (!ModelNames.includes(operationMap.get("model") as string)) {
        console.error('Model with name', operationMap.get("model"), 'not found in imported Models')
    }

    return operationMap
}
