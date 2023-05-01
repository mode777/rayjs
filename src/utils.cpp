#include "common.h"

// Function to read a file into a string
char* app_read_file(const char* filename, size_t* out_size) {
    FILE* file = fopen(filename, "rb");
    if (!file) {
        fprintf(stderr, "Failed to open file: %s\n", filename);
        return NULL;
    }

    // Get the file size
    fseek(file, 0, SEEK_END);
    long size = ftell(file);
    if(out_size) *out_size = (size_t)size;
    rewind(file);

    // Allocate a buffer to hold the file contents
    char* buffer = (char*) malloc(size + 1);
    if (!buffer) {
        fprintf(stderr, "Failed to allocate memory for file contents\n");
        fclose(file);
        return NULL;
    }

    // Read the file contents into the buffer
    size_t bytesRead = fread(buffer, 1, size, file);
    buffer[bytesRead] = '\0';

    // Clean up
    fclose(file);

    return buffer;
}