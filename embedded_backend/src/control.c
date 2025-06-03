#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"

struct Item {
    int key;
    char* name;
    bool checked;
};

cJSON* format_array(struct Item list[]) {
    cJSON *array = cJSON_CreateArray();
    if (array == NULL) {
        return NULL;
    }
    
    for (int i = 0; i < 4; ++i) {
        cJSON *obj = cJSON_CreateObject();
        if (obj == NULL) {
            return NULL;
        }
        cJSON_AddNumberToObject(obj, "key", list[i].key);
        cJSON_AddStringToObject(obj, "name", list[i].name);
        cJSON_AddBoolToObject(obj, "checked", list[i].checked);
        cJSON_AddItemToArray(array, obj);
    }

    return array;
}

int main() {
    const char* method = getenv("REQUEST_METHOD");
    if (method == NULL) {
        format_response(-1, NULL, false);
        return -1;
    }
    // if (strcmp(method, "GET") != 0) {
    //     format_response(-1, NULL, false);
    //     return -1;
    // }
    
    // int msg_id = msgget(ftok("/tmp", 'g'), 0666 | IPC_CREAT);
    // if (msg_id < 0) {
    //     perror("msgget");
    //     return -1;
    // }
    // struct message { long type; char text[5] }msg = { 1, "read" };
    // int result = msgsnd(msg_id, &msg, strlen(msg.text)+1, 0);
    // if (result < 0) {
    //     perror("msgsnd");
    //     return -1;
    // }
    
    cJSON *data = cJSON_CreateObject();
    struct Item lamp_list[4] = {
        { 1, "led1", false }, 
        { 2, "led2", false }, 
        { 3, "led3", false }, 
        { 4, "led4", false }
    };
    struct Item speaker_list[1] = {
        { 1, "音箱", false }, 
    };
    struct Item fan_list[1] = {
        { 1, "风扇", false }, 
    };
    struct Item digital_tube_list[1] = {
        { 1, "数码管", false },
    };
    cJSON* array = format_array(lamp_list);
    cJSON_AddItemToObject(data, "lamp", array);

    cJSON_AddStringToObject(data, "speakers", "on");
    cJSON_AddStringToObject(data, "fan", "on");
    cJSON_AddStringToObject(data, "digitalTube", "on");
    format_response(0, data, true);

    return 0;
}
