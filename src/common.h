#ifndef COMMON_H
#define COMMON_H
#ifdef __cplusplus
extern "C"
{
#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int app_init_quickjs(int argc, char** argv);
int app_update_quickjs();
int app_dispose_quickjs();

#ifdef __cplusplus
}
#endif
#endif