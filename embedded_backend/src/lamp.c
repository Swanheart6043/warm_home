#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"
#include "../../embedded_common/include/message.h"

int main() {
    printf("Content-Type: application/json\r\n\r\n");

    const char* method = getenv("REQUEST_METHOD");
    if (strcmp(method, "POST") != 0) {
        format_response(-1, cJSON_CreateString("请求方式错误"), false);
        return -1;
    }
    
    // 获取POST数据长度
    char* content_length_str = getenv("CONTENT_LENGTH");
    int content_length = content_length_str ? atoi(content_length_str) : 0;
    if (content_length <= 0) {
        format_response(-1, cJSON_CreateString("请求参数不能为空"), false);
        return -1;
    }
    // 读取POST数据
    char* input = (char *)malloc(content_length + 1);
    if (input == NULL) {
        format_response(-1, cJSON_CreateString("服务器异常"), false);
        return -1;
    }
    fread(input, content_length, 1, stdin);
    input[content_length] = '\0';
    
    // 解析JSON
    cJSON* json = cJSON_Parse(input);
    free(input);
    if (json == NULL) {
        format_response(-1, cJSON_CreateString("服务器异常"), false);
        cJSON_Delete(json);
        return -1;
    }
    // 处理具体的命令
    cJSON *operate = cJSON_GetObjectItemCaseSensitive(json, "operate"); 
    cJSON *whichLed = cJSON_GetObjectItemCaseSensitive(json, "whichLed");
    // format_response(-1, cJSON_CreateString(operate), false);
    // cJSON_Delete(json);
    // return -1;
    
    if (!cJSON_IsString(operate) || !cJSON_IsString(whichLed)) {
        format_response(-1, cJSON_CreateString("服务器异常"), false);
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
    MessageBody body = {
        .operate = operate,
        .which = whichLed,
    };
    Message msg = { 
        .type = 1,
        .body = body
    };
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
