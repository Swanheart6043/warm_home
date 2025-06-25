#ifndef COMMON_H
#define COMMON_H

#include "mongoose.h"

int control(struct mg_connection *c);
int lamp(void);
int speakers(void);
int fan(void);
int env(void);

#endif