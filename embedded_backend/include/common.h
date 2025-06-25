#ifndef COMMON_H
#define COMMON_H

#include "mongoose.h"

int control(char* request_method, size_t request_method_len, struct mg_connection *c);
int lamp();
int speakers();
int fan();
int env(void);

#endif