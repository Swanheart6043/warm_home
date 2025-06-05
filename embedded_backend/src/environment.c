#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <stdbool.h>
#include <sys/shm.h>
#include <string.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/format_response.h"

struct Item {
    char* name;
    float count;
};

cJSON* format_array(struct Item list[]) {
    cJSON *array = cJSON_CreateArray();
    
    int i;
    int length = sizeof(list) / sizeof(struct Item);
    if (array == NULL) {
        return NULL;
    }
    
    for (i = 0; i < length; ++i) {
        cJSON *obj = cJSON_CreateObject();
        if (obj == NULL) return NULL;
        cJSON_AddStringToObject(obj, "name", list[i].name);
        cJSON_AddNumberToObject(obj, "count", list[i].count);
        cJSON_AddItemToArray(array, obj);
    }

    return array;
}

int main() {
    printf("Content-Type: application/json\r\n\r\n");

    const char* method = getenv("REQUEST_METHOD");   
    if (method == NULL) {
        format_response(-1, NULL, false);
        return -1;
    }
    if (strcmp(method, "GET") != 0) {
        format_response(-1, NULL, false);
        return -1;
    }
    
    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, 0666);
    char* content = shmat(shmid, NULL, 0);
    // bzero(content,512);
    // cJSON* json_string  = cJSON_CreateString(content);
    
    struct Item a9_list[9] = {
        { 'Adc', 9.00 },
        { 'CYROX', -14 },
        { 'CYROY', 20 },
        { 'CYROZ', 40 },
        { 'AACX', 642 },
        { 'AACY', -34 },
        { 'AACZ', 5002 },
        { 'A9-RESERVED-0', 0 },
        { 'A9-RESERVED-1', 0 },
    };
    struct Item zeebig_list[2] = {
        { name: 'Temperature', count: 10.00 },
        { name: 'Humidity', count: 20.00 },
    };
    cJSON* a9 = format_array(a9_list);
    cJSON* zeebig = format_array(zeebig_list);
    
    cJSON *data = cJSON_CreateObject();
    cJSON_AddItemToObject(data, "a9", a9);
    cJSON_AddItemToObject(data, "zeebig", zeebig);
    
    format_response(0, data, true);
    return 0;
}