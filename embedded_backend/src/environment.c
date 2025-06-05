#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdbool.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"

int main() {
    const char* method = getenv("REQUEST_METHOD");   
    
    // 设置HTTP响应头
    printf("Content-Type: application/json\r\n\r\n");
    if (method == NULL) {
        format_response(-1, NULL, false);
        return -1;
    }
    if (strcmp(method, "GET") != 0) {
        format_response(-1, NULL, false);
        return -1;
    }

    // key_t key = ftok("/tmp/env.txt", 65);
    // int msg_id = msgget(key, IPC_CREAT|0666);
    // if (msg_id == -1) {
    //     format_response(-1, NULL, false);
    //     return -1;
    // }
    // struct Message { long type; char text[5] }msg;
    // ssize_t result = msgrcv(msg_id, &msg, sizeof(msg) - sizeof(long), 3, IPC_NOWAIT);
    // if (!result) {
    //     format_response(-1, NULL, false);
    //     return -1;
    // }
    // if (!msg.type) {
    //     format_response(0, NULL, true);   
    //     return -1; 
    // }
    // cJSON* json_string  = cJSON_CreateString(msg.text);
    // format_response(2, json_string, true);
    
    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, 0666);
    char* buf = shmat(shmid, NULL, 0);
    cJSON* json_string  = cJSON_CreateString(buf);
    format_response(2, json_string, true);

    return 0;
}