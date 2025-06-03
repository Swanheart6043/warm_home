#include <stdio.h>
#include <stdbool.h>
#include "../../../embedded_common/lib/cjson/cJSON.h"

int format_response(int code, cJSON *data_obj, bool success) {
    cJSON *root = cJSON_CreateObject();
    if (!root) {
        fprintf(stderr, "Failed to create JSON root\n");
        return -1;
    }

    // 添加ziduan
    cJSON_AddNumberToObject(root, "code", code);
    
    // data是一个对象或数组
    data_obj ? cJSON_AddItemToObject(root, "data", data_obj) : cJSON_AddNullToObject(root, "data");
    
    cJSON_AddBoolToObject(root, "success", success);

    // 设置HTTP响应头
    printf("Content-Type: application/json\r\n\r\n");

    // shuchu JSON字符串
    char *json_str = cJSON_PrintUnformatted(root);
    if (json_str) {
        printf("%s", json_str);
        free(json_str);
    }

    cJSON_Delete(root);
    return 0;
}
