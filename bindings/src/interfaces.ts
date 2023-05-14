export type RayLibType = "void" | "const char *" | "bool" | "float" | "unsigned char" | "void *" | "int" | "usigned int" | "Texture" | "Rectangle" | "Image" | "Rectangle *" | "GylphInfo *" | "Texture2D" | "Vector3" | "Vector2" | "float *" | "unsigned char *" | "unsigned short *" | "unsigned int *" | "Shader" | "MaterialMap *" | "float[4]" | "Vector3"

export interface RayLibDefine {
    name: string,
    type: "GUARD" | "INT" | "STRING" | "MACRO" | "UNKNOWN" | "FLOAT" | "FLOAT_MATH" | "COLOR",
    value: string,
    description: string
}

export interface RayLibFieldDescription {
    type: RayLibType,
    name: string,
    description: string
}

export interface RayLibStruct {
    name: string,
    description: string,
    fields: RayLibFieldDescription[]
}

export interface RayLibEnumValue {
    name: string,
    value: number,
    description: string
}

export interface RayLibEnum {
    name: string,
    description: string,
    values: RayLibEnumValue[]
}

export interface RayLibParamDescription {
    type: RayLibType | string,
    name: string
}

export interface RayLibFunction {
    name: string,
    description: string,
    returnType: RayLibType | string,
    params?: RayLibParamDescription[]
}

export interface RayLibAlias {
    type: string
    name: string,
    description: string,
}

export interface RayLibApi {
    aliases: RayLibAlias[],
    defines: RayLibDefine[],
    structs: RayLibStruct[],
    enums: RayLibEnum[],
    functions: RayLibFunction[]
}