#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <sys/msg.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"

typedef struct {
    int key;
    char* name;
    bool checked;
} Item;

cJSON* format_array(Item list[], int length) {
    int i;
    cJSON* array = cJSON_CreateArray();
    if (array == NULL) return NULL;
    for (i = 0; i < length; ++i) {
        cJSON *obj = cJSON_CreateObject();
        if (obj == NULL) return NULL;
        cJSON_AddNumberToObject(obj, "key", list[i].key);
        cJSON_AddStringToObject(obj, "name", list[i].name);
        cJSON_AddBoolToObject(obj, "checked", list[i].checked);
        cJSON_AddItemToArray(array, obj);
    }
    return array;
}

int main() {
    // 设置HTTP响应头
    printf("Content-Type: application/json\r\n\r\n");

    const int method = getenv("REQUEST_METHOD");
    if (method == 0) {
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
    
    Item lamp_list[4] = {
        { 1, "led1", false }, 
        { 2, "led2", false }, 
        { 3, "led3", false }, 
        { 4, "led4", false }
    };
    Item speaker_list[1] = {
        { 1, "音箱", false }, 
    };
    Item fan_list[1] = {
        { 1, "风扇", false }, 
    };
    Item digital_tube_list[1] = {
        { 1, "数码管", false },
    };
    int lamp_list_length = sizeof(lamp_list) / sizeof(lamp_list[0]);
    int speaker_list_length = sizeof(speaker_list) / sizeof(speaker_list[0]);
    int fan_list_length = sizeof(fan_list) / sizeof(fan_list[0]);
    int digital_tube_list_length = sizeof(digital_tube_list) / sizeof(digital_tube_list[0]);

    cJSON* lamp = format_array(lamp_list, lamp_list_length);
    cJSON* speaker = format_array(speaker_list, speaker_list_length);
    cJSON* fan = format_array(fan_list, fan_list_length);
    cJSON* digital_tube = format_array(digital_tube_list, digital_tube_list_length);
    cJSON* data = cJSON_CreateObject();
    cJSON_AddItemToObject(data, "lamp", lamp);
    cJSON_AddItemToObject(data, "speakers", speaker);
    cJSON_AddItemToObject(data, "fan", fan);
    cJSON_AddItemToObject(data, "digitalTube", digital_tube);
    format_response(0, data, true);

    return 0;
}
