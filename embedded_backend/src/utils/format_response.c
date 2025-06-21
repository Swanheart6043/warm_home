#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "../../include/cJSON.h"

int format_response(int code, cJSON *data_obj, bool success) {
    cJSON *root = cJSON_CreateObject();

    if (!root) {
        fprintf(stderr, "Failed to create JSON root\n");
        return -1;
    }

    cJSON_AddNumberToObject(root, "code", code);
    
    if (data_obj) {
        cJSON_AddItemToObject(root, "data", data_obj);
    } else {
        cJSON_AddNullToObject(root, "data");
    }
    
    cJSON_AddBoolToObject(root, "success", success);

    char *json_str = cJSON_PrintUnformatted(root);
    if (json_str) {
        printf("%s", json_str);
        free(json_str);
    }

    cJSON_Delete(root);
    return 0;
}
