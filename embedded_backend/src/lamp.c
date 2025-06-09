#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"

int main() {
    const char* method = getenv("REQUEST_METHOD");
    // 设置HTTP响应头
    printf("Content-Type: application/json\r\n\r\n");
    if (strcmp(method, "POST") != 0) {
        format_response(-1, NULL, false);
        return -1;
    }
    
    // 获取POST数据长度
    char* content_length_str = getenv("CONTENT_LENGTH");
    int content_length = content_length_str ? atoi(content_length_str) : 0;
    if (content_length <= 0) {
        format_response(-1, NULL, false);
        return -1;
    }
    // 读取POST数据
    char* input = (char *)malloc(content_length + 1);
    if (input == NULL) {
        format_response(-1, NULL, false);
        return -1;
    }
    fread(input, content_length, 1, stdin);
    input[content_length] = '\0';
    
    // 解析JSON
    cJSON* json = cJSON_Parse(input);
    free(input);
    if (json == NULL) {
        format_response(-1, NULL, false);
        return -1;
    }
    // 处理具体的命令
    cJSON *operate = cJSON_GetObjectItemCaseSensitive(json, "operate");
    if (!cJSON_IsString(operate)) {
        format_response(-1, NULL, false);
        return -1;
    }

    // send msg
    key_t key = ftok("/tmp", 'g');
    int msgid = msgget(key, IPC_CREAT|0666);
    if (key == -1 || msgid == -1) {
        format_response(-1, cJSON_CreateString("fu wu qi yi chang"), false);
        cJSON_Delete(json);
        return -1;
    }
    struct message { long type; char text[5] } msg = { 2, "on 1" };
    int result = msgsnd(msgid, &msg, strlen(msg.text)+1, 0);
    if (result < 0) {
        format_response(-1, cJSON_CreateString("fu wu qi yi chang"), false);
        cJSON_Delete(json);
        return -1;
    }
    
    format_response(0, cJSON_CreateString("fu wu qi yi chang"), true);
    cJSON_Delete(json);
    return 0;
}
