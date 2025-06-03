#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"

int handleGetReflash() {
    
}

int handleGetRequest() {

}

int main() {
    const char* method = getenv("REQUEST_METHOD");
    if (strcmp(method, "GET") != 0) {
        format_response(-1, NULL, false);
        return -1;
    }
    
    return 0;
}