type ResourceType = 'texture' | 'image' | 'shader' | 'font'

const resourceList = new Map<string, Resource>()

interface Resource {
    refcount: number,
    id: string,
    resource: any
    unload: (t: any) => void
}

function loadResourceFunc<T>(loader: (filename: string) => T, unloader: (resource: T) => void){
    return (filename: string) => {
        if(resourceList.has(filename)){
            const res = resourceList.get(filename)
            res!.refcount++
            return <T>res?.resource
        } else {
            const resource = loader(filename)
            resourceList.set(filename, {
                refcount: 1,
                id: filename,
                resource: resource,
                unload: unloader
            })
            return resource
        }
    }
}
export const resourceUnload = (id: string) => {
    const res = resourceList.get(id)
    if(res){
        res.refcount--
        if(res.refcount === 0){
            res.unload(res.resource)
            resourceList.delete(id)
        }
    }
}
export const resourceUnloadAll = () => {
    for (const res of resourceList.entries()) {
        res[1].unload(res[1].resource)
    }
}
export const textureLoad = loadResourceFunc<Texture>(loadTexture,unloadTexture)
export const fontLoad = loadResourceFunc<Font>((id: string) => {
    const split = id.split(':')
    return loadFontEx(split[0], parseInt(split[1])!*getWindowScaleDPI().x)
},unloadFont)