#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"

int handle_get() {
    // tong zhi app
    // key_t key = ftok(".", 65);
    // int msgid = msgget(key, 0666 | IPC_CREAT);
    // if (msgid < 0) {
    //     perror("msgget");
    //     return -1;
    // }
    // struct message { long type; char text[100] }msg = { 1, "read" };
    // int result = msgsnd(msgid, &msg, strlen(msg.text)+1, 0);
    // if (result < 0) {
    //     perror("msgsnd");
    //     return -1;
    // }
    // res
    cJSON *data = cJSON_CreateObject();
    cJSON_AddStringToObject(data, "led1", "on");
    cJSON_AddStringToObject(data, "led2", "on");
    format_response(0, data, true);
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
    
    return 0;
}