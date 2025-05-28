#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../../../common/include/cJSON.h"

int handleGet() {

}

int handlePost() {
    
}

int main() {
    char *content_length_str;
    int content_length = 0;
    char *input = NULL;
    cJSON *json = NULL;
    cJSON *response = NULL;
    char *response_str = NULL;
    
    // 设置HTTP响应头
    printf("Content-Type: application/json\r\n\r\n");
    
    // 获取POST数据长度
    content_length_str = getenv("CONTENT_LENGTH");
    if (content_length_str != NULL) {
        content_length = atoi(content_length_str);
    }
    if (content_length <= 0) {
        printf("{\"error\":\"No data received\"}\n");
        return 1;
    }
    
    // 读取POST数据
    input = (char *)malloc(content_length + 1);
    if (input == NULL) {
        printf("{\"error\":\"Memory allocation failed\"}\n");
        return 1;
    }
    fread(input, content_length, 1, stdin);
    input[content_length] = '\0';
    
    // 解析JSON
    json = cJSON_Parse(input);
    if (json == NULL) {
        printf("{\"error\":\"Invalid JSON\"}\n");
        free(input);
        return 1;
    }
    
    // 处理具体的命令
    cJSON *command = cJSON_GetObjectItemCaseSensitive(json, "command");
    if (cJSON_IsString(command)) {
        // 这里执行您的硬件操作
        // hardware_operation(command->valuestring);
        
        // 创建响应
        response = cJSON_CreateObject();
        cJSON_AddStringToObject(response, "status", "success");
        cJSON_AddStringToObject(response, "message", "Command executed");
        cJSON_AddStringToObject(response, "received_command", command->valuestring);
    } else {
        response = cJSON_CreateObject();
        cJSON_AddStringToObject(response, "status", "error");
        cJSON_AddStringToObject(response, "message", "Command field missing");
    }
    
    // 输出响应
    response_str = cJSON_Print(response);
    printf("%s", response_str);
    
    // 清理内存
    free(input);
    free(response_str);
    cJSON_Delete(json);
    cJSON_Delete(response);
    
    return 0;
}