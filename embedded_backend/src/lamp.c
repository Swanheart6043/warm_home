#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"
#include "../../embedded_common/include/message.h"
#include "../../embedded_common/include/led.h"

int main() {
    printf("Content-Type: application/json\r\n\r\n");

    // 判断请求方式
    const char* method = getenv("REQUEST_METHOD");
    if (strcmp(method, "POST") != 0) {
        format_response(-1, cJSON_CreateString("请求方式错误"), false);
        return -1;
    }
    // 获取Post数据长度
    char* content_length_str = getenv("CONTENT_LENGTH");
    int content_length = content_length_str ? atoi(content_length_str) : 0;
    if (content_length <= 0) {
        format_response(-1, cJSON_CreateString("请求参数不能为空"), false);
        return -1;
    }
    // 读取Post数据
    char* input = (char *)malloc(content_length + 1);
    if (input == NULL) {
        format_response(-1, cJSON_CreateString("参数不正确"), false);
        return -1;
    }
    fread(input, content_length, 1, stdin);
    input[content_length] = '\0';
    // 解析JSON
    cJSON* json = cJSON_Parse(input);
    free(input);
    if (json == NULL) {
        format_response(-1, cJSON_CreateString("参数不正确"), false);
        cJSON_Delete(json);
        return -1;
    }
    // 判断JSON
    cJSON *isOpen = cJSON_GetObjectItemCaseSensitive(json, "isOpen");
    cJSON *which = cJSON_GetObjectItemCaseSensitive(json, "which");
    if (!cJSON_IsBool(isOpen)) {
        format_response(-1, cJSON_CreateString("参数不正确"), false);
        cJSON_Delete(json);
        return -1;
    }
    if (!cJSON_IsNumber(which)) {
        format_response(-1, cJSON_CreateString("参数不正确"), false);
        cJSON_Delete(json);
        return -1;
    }

    // 通知应用层
    key_t key = ftok("/tmp/control.txt", 'g');
    int msgid = msgget(key, IPC_CREAT|0666);
    if (key == -1 || msgid == -1) {
        format_response(-11, cJSON_CreateString("服务器异常"), false);
        cJSON_Delete(json);
        return -1;
    }
    MessageBody body;
    strncpy(body.operate, cJSON_IsTrue(isOpen) ? "1" : "0", sizeof(body.operate) - 1);
    body.operate[sizeof(body.operate) - 1] = '\0';
    body.which = which->valueint;
    Message msg = { .type = 1, .body = body };
    int result = msgsnd(msgid, &msg, sizeof(msg.body), 0);
    if (result == -1) {
        format_response(-1, cJSON_CreateString("服务器异常"), false);
        cJSON_Delete(json);
        return -1;
    }
    
    format_response(0, cJSON_CreateString("操作成功"), true);
    cJSON_Delete(json);
    return 0;
}
