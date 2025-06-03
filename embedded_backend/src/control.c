#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"

int main() {
    const char* method = getenv("REQUEST_METHOD");
    if (strcmp(method, "GET") != 0) {
        format_response(-1, NULL, false);
        return -1;
    }
    
    int msg_id = msgget(ftok("/tmp", 'g'), 0666 | IPC_CREAT);
    if (msg_id < 0) {
        perror("msgget");
        return -1;
    }
    struct message { long type; char text[5] }msg = { 1, "read" };
    int result = msgsnd(msg_id, &msg, strlen(msg.text)+1, 0);
    if (result < 0) {
        perror("msgsnd");
        return -1;
    }
    
    cJSON *data = cJSON_CreateObject();
    // lamp: [
    //   { key: '1', name: 'Led1', checked: false },
    //   { key: '2', name: 'Led2', checked: false },
    //   { key: '3', name: 'Led3', checked: false },
    //   { key: '4', name: 'Led4', checked: false },
    // ],
    // speakers: [
    //   { key: '1', name: '音箱', checked: false }
    // ],
    // fan: [
    //   { key: '1', name: '风扇', checked: false }
    // ],
    // digitalTube: [
    //   { key: '1', name: '数码管', checked: false }
    // ]
    cJSON_AddStringToObject(data, "lamp", "on");
    cJSON_AddStringToObject(data, "speakers", "on");
    cJSON_AddStringToObject(data, "fan", "on");
    cJSON_AddStringToObject(data, "digitalTube", "on");
    format_response(0, data, true);

    return 0;
}
