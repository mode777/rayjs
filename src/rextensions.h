
#ifndef REXTENSIONS_H
#define REXTENSIONS_H

#include "raylib.h"

#define REXTAPI

REXTAPI void SetModelMaterial(Model *model, int materialIndex, Material material); // Replace material in slot materialIndex (Material is NOT unloaded)
REXTAPI Material GetModelMaterial(Model *model, int materialIndex); // Get material in slot materialIndex
REXTAPI Mesh GetModelMesh(Model *model, int meshIndex); // Get a single mesh from a model
REXTAPI void SetShaderLocation(Shader *shader, int constant, int location); // Set shader constant in shader locations array
REXTAPI Color ImageReadPixel(Image *image, int x, int y); // Read a single pixel from an image
REXTAPI Mesh MeshCopy(Mesh mesh); // Make a deep-copy of an existing mesh
REXTAPI Mesh MeshMerge(Mesh a, Mesh b); // Create a new mesh that contains combined attributes of two meshes

#endif

#if defined(REXTENSIONS_IMPLEMENTATION)

void SetModelMaterial(Model *model, int materialIndex, Material material)
{
    if(model->materialCount <= materialIndex) return;
    model->materials[materialIndex] = material;
}

Material GetModelMaterial(Model *model, int materialIndex)
{
    Material mat;
    if(model->materialCount <= materialIndex) return mat;
    return model->materials[materialIndex];
}

Texture GetMaterialTexture(Material *material, int mapType){
    return material->maps[mapType].texture;
}

Mesh GetModelMesh(Model *model, int meshIndex){
    Mesh m = { 0 };
    if(model->meshCount <= meshIndex) return m;
    return model->meshes[meshIndex];
}

#define CPY_ATTRIBS(ATTRB, SIZ) if(mesh.ATTRB != NULL) m.ATTRB = memcpy(malloc(mesh.vertexCount * sizeof(SIZ)), (const void *)mesh.ATTRB, mesh.vertexCount * sizeof(SIZ)) 

Mesh MeshCopy(Mesh mesh){
    Mesh m = { 0 };
    m.vertexCount = mesh.vertexCount;
    m.triangleCount = mesh.triangleCount;
    CPY_ATTRIBS(vertices, Vector3);
    CPY_ATTRIBS(texcoords, Vector2);
    CPY_ATTRIBS(texcoords2, Vector2);
    CPY_ATTRIBS(normals, Vector3);
    CPY_ATTRIBS(tangents, Vector4);
    CPY_ATTRIBS(colors, Color);
    if(mesh.indices != NULL) m.indices = memcpy(malloc(mesh.triangleCount * 3 * sizeof(unsigned short)), (const void *)mesh.indices, (mesh.triangleCount*3) * sizeof(unsigned short));
    
    CPY_ATTRIBS(animVertices, Vector3);
    CPY_ATTRIBS(animNormals, Vector3);
    CPY_ATTRIBS(boneIds, Color);
    CPY_ATTRIBS(boneWeights, Vector4);

    // NOTE: Vaoid and Vbos are not copied as the resulting mesh has yet to be uploaded
    
    return m;
}

#undef CPY_ATTRIBS

#define MERGE_ATTRIBS(ATTRB, SIZ) if(a.ATTRB != NULL && b.ATTRB != NULL) { void * ptr = m.ATTRB = malloc(m.vertexCount * sizeof(SIZ));  memcpy(ptr, (const void *)a.ATTRB, a.vertexCount * sizeof(SIZ)); memcpy(ptr + (a.vertexCount*sizeof(SIZ)), (const void *)b.ATTRB, b.vertexCount * sizeof(SIZ)); } 

Mesh MeshMerge(Mesh a, Mesh b){
    Mesh m = { 0 };
    m.vertexCount = a.vertexCount + b.vertexCount;
    m.triangleCount = a.triangleCount + b.triangleCount;

    MERGE_ATTRIBS(vertices, Vector3);
    MERGE_ATTRIBS(vertices, Vector3);
    MERGE_ATTRIBS(texcoords, Vector2);
    MERGE_ATTRIBS(texcoords2, Vector2);
    MERGE_ATTRIBS(normals, Vector3);
    MERGE_ATTRIBS(tangents, Vector4);
    MERGE_ATTRIBS(colors, Color);
    if(a.indices && b.indices){
        m.indices = malloc(m.triangleCount * 3 * sizeof(unsigned short));
        memcpy((void *)m.indices, a.indices, sizeof(unsigned short) * a.triangleCount * 3);
        int offset = a.vertexCount;
        int aLen = a.triangleCount*3;
        for (size_t i = aLen; i < m.triangleCount*3; i++)
        {
            m.indices[i] = b.indices[i-aLen] + offset;
        }
    }   
    MERGE_ATTRIBS(animVertices, Vector3);
    MERGE_ATTRIBS(animNormals, Vector3);
    MERGE_ATTRIBS(boneIds, Color);
    MERGE_ATTRIBS(boneWeights, Vector4);

    // NOTE: The resulting mesh has yet to be uploaded

    return m;
}

#undef MERGE_ATTRIBS

void SetShaderLocation(Shader *shader, int constant, int location){
    shader->locs[constant] = location;
}

Color ImageReadPixel(Image *image, int x, int y){
    int sizeOfPixel = GetPixelDataSize(image->width, image->height, image->format) / (image->width*image->height);
    return GetPixelColor((void *)((unsigned char *)image->data) + (sizeOfPixel*(image->width*y+x)),image->format);
}

#endif