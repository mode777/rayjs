import { RayLibApi, RayLibFunction, RayLibStruct } from "./interfaces"

export class ApiFunction{
    constructor(private api: RayLibFunction){
        api.params = api.params || []
    }

    get name() { return this.api.name }
    get argc() { return this.api.params?.length || 0 }
    get params() { return this.api.params || [] }
    get returnType() { return this.api.returnType }
    get description() { return this.api.description }
}

export class ApiStruct{
    constructor(private api: RayLibStruct){

    }

    get name() { return this.api.name }
    get fields() { return this.api.fields || [] }
}

export class ApiDescription{
    
    constructor(private api: RayLibApi){
    }

    getAliases(name: string) {
        return this.api.aliases.filter(x => x.type === name).map(x => x.name)
    }

    getFunction(name: string){
        const f = this.api.functions.find(x => x.name === name) 
        if(!f) return null
        return new ApiFunction(f)
    }

    getStruct(name: string){
        const s = this.api.structs.find(x => x.name === name)
        if(!s) return null
        return new ApiStruct(s)
    }
}