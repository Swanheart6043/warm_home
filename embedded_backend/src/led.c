#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include <linux/msg.h>
#include "../lib/cjson/cJSON.h"

// 通用响应函数，利用cJSON构造并输出
void format_response(int code, cJSON *data_obj, bool success) {
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
    // tong zhi app
    key_t key = ftok(".", 65);
    int msgid = msgget(key, 0666 | IPC_CREAT);
    if (msgid < 0) {
        perror("msgget");
        return -1;
    }
    struct message {
        long type;
        char text[MSGMAX];
    }msg = { 1, "read" };
    int result = msgsnd(msgid, &msg, strlen(msg.text)+1, 0);
    if (result < 0) {
        perror("msgsnd");
        return -1;
    }
    // res
    cJSON *data = cJSON_CreateObject();
    cJSON_AddStringToObject(data, "led1", "on");
    cJSON_AddStringToObject(data, "led2", "on");
    format_response(0, data, true);
}

int handle_post() {
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

    // tong zhi app
    key_t key = ftok(".", 65);
    int msgid = msgget(key, 0666 | IPC_CREAT);
    if (msgid < 0) {
        perror("msgget");
        return -1;
    }
    struct msgbuf message = NULL
    message.mtype = 1;
    strncpy(message.mtext, text, MAX_TEXT - 1);
    message.mtext[MAX_TEXT - 1] = '\0';
    if (msgsnd(msgid, &message, strlen(message.mtext)+1, 0) < 0) {
        perror("msgsnd");
        return -1;
    }
    
    // shu chu
    format_response(0, NULL, true);
    // remove
    cJSON_Delete(json);
}

int main() {    
    const char* method = getenv("REQUEST_METHOD");
    if (method == NULL) {
        format_response(-1, NULL, false);
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