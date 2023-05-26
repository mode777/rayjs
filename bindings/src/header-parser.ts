import { RayLibEnumValue, RayLibFieldDescription, RayLibParamDescription } from "./interfaces"
import { RayLibAlias, RayLibDefine, RayLibStruct, RayLibEnum, RayLibFunction } from "./interfaces"

export class HeaderParser {
    
    parseEnums(input: string): RayLibEnum[] {
        const matches = [...input.matchAll(/((?:\/\/.+\n)*)typedef enum {\n([^}]+)} ([^;]+)/gm)]
        return matches.map(groups => {
            return {
                description: this.parseComments(groups[1]),
                values: this.parseEnumValues(groups[2]),
                name: groups[3],
            }
        })
    }
    parseEnumValues(input: string): RayLibEnumValue[] {
        let lastNumber = 0
        return input.split('\n')
            .map(line => line.trim().match(/([^ ,]+)(?: = ([0-9]+))?,?(?: *)(?:\/\/ (.+))?/))
            .filter(x => x !== null && !x[0].startsWith("/"))
            .map(groups => {
                let val = lastNumber = groups![2] ? parseInt(groups![2]) : lastNumber
                lastNumber++
                return {
                    name: groups![1],
                    description: groups![3] || "",
                    value: val
                }
            })
        
    }
    parseComments(input: string){
        return input.split('\n').map(x => x.replace("// ","")).join('\n').trim()
    }
    parseFunctionDefinitions(input: string): RayLibFunction[] {
        const matches = [...input.matchAll(/^[A-Z]+API (.+?)(\w+)\(([^\)]+)\);(?:[^\/]+\/\/ (.+))?/gm)]
        return matches.map(groups => ({
            returnType: groups![1].trim(),
            name: groups![2],
            params: this.parseFunctionArgs(groups![3]),
            description: groups![4] || ""
        }))
    }
    parseFunctions(input: string): RayLibFunction[] {
        const matches = [...input.matchAll(/((?:\/\/ .+\n)*)[A-Z]+API\s+([\w<>]+)\s+([\w<>]+)\((.*)\)/gm)]
        console.log(matches[0])
        return matches.map(groups => ({
            returnType: groups![1].trim(),
            name: groups![2],
            params: this.parseFunctionArgs(groups![3]),
            description: groups![4] || ""
        }))
    }
    parseFunctionArgs(input: string): RayLibParamDescription[] {
        return input.split(',').filter(x => x !== 'void').map(arg => {
            arg = arg.trim().replace(" *", "* ")
            const frags = arg.split(' ')
            const name = frags.pop()
            const type = frags.join(' ').replace("*", " *")
            
            return { name: name || "", type: type.trim() }
        })
    }    
}