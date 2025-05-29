#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "../lib/cjson/cJSON.h"

// 通用响应函数，利用cJSON构造并输出
void respond_json(int code, cJSON *data_obj, bool success) {
    // 构造最外层对象
    cJSON *root = cJSON_CreateObject();
    if (!root) {
        // 内存分配失败
        fprintf(stderr, "Failed to create JSON root\n");
        return;
    }

    // 添加 fields
    cJSON_AddNumberToObject(root, "code", code);
    if (data_obj) {
        // data 是一个对象或数组
        cJSON_AddItemToObject(root, "data", data_obj);
    } else {
        // data = null
        cJSON_AddNullToObject(root, "data");
    }
    cJSON_AddBoolToObject(root, "success", success);

    // 设置HTTP响应头
    printf("Content-Type: application/json\r\n\r\n");

    // 打印 JSON 字符串
    char *json_str = cJSON_PrintUnformatted(root);
    if (json_str) {
        printf("%s", json_str);
        free(json_str);
    }

    // 清理
    cJSON_Delete(root);
}

int handle_get() {
    cJSON *data = cJSON_CreateObject();
    cJSON_AddStringToObject(data, "led1", "on");
    cJSON_AddStringToObject(data, "led2", "on");
    respond_json(0, data, true);
}

int handle_post() {
    // 获取POST数据长度
    char* content_length_str = getenv("CONTENT_LENGTH");
    int content_length = content_length_str ? atoi(content_length_str) : 0;
    if (content_length <= 0) {
        respond_json(-1, NULL, false);
        return -1;
    }

    // 读取POST数据
    char* input = (char *)malloc(content_length + 1);
    if (input == NULL) {
        respond_json(-1, NULL, false);
        return -1;
    }
    fread(input, content_length, 1, stdin);
    input[content_length] = '\0';
    
    // 解析JSON
    cJSON* json = cJSON_Parse(input);
    free(input);
    if (json == NULL) {
        respond_json(-1, NULL, false);
        return -1;
    }

    // 处理具体的命令
    cJSON *operate = cJSON_GetObjectItemCaseSensitive(json, "operate");
    if (!cJSON_IsString(operate)) {
        respond_json(-1, NULL, false);
        return -1;
    }

    // 这里执行您的硬件操作
    // hardware_operation(operate->valuestring);
    
    // shu chu
    respond_json(0, NULL, true);
    
    cJSON_Delete(json);
}

int main() {    
    const char* method = getenv("REQUEST_METHOD");
    if (method == NULL) {
        respond_json(-1, "request method error", false);
        return -1;
    }
    
    if (strcmp(method, "GET") == 0) {
        handle_get();
        return 0;
    }
    
    if (strcmp(method, "POST") == 0) {
        handle_post();
        return 0;
    }
    
    return 0;
}