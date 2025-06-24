#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include "../include/cJSON.h"
#include "../include/format_response.h"
#include "../../embedded_common/include/shared_memory.h"

typedef struct {
    char* name;
    float count;
} Item;

cJSON* format_array_env(Item list[], int length) {
    int i;
    cJSON *array = cJSON_CreateArray();
    if (array == NULL) return NULL;
    for (i = 0; i < length; ++i) {
        cJSON *obj = cJSON_CreateObject();
        if (obj == NULL) return NULL;
        cJSON_AddStringToObject(obj, "name", list[i].name);
        cJSON_AddNumberToObject(obj, "count", list[i].count);
        cJSON_AddItemToArray(array, obj);
    }
    return array;
}

int env() {
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
    if (key == -1 || shmid == -1) {
        format_response(-1, NULL, false);
        return -1;
    }
    RequestData* content = (RequestData*)shmat(shmid, NULL, 0);
    // bzero(content,512);
    
    Item a9_list[9] = {
        { "Adc", content->adc },
        { "CYROX", content->base1.CYROX },
        { "CYROY", content->base1.CYROX },
        { "CYROZ", content->base1.CYROX },
        { "AACX", content->base1.AACX },
        { "AACY", content->base1.AACY },
        { "AACZ", content->base1.AACZ },
        { "A9-RESERVED-0", content->base2.A9_RESERVED_0 },
        { "A9-RESERVED-1", content->base2.A9_RESERVED_1 },
    };
    Item zeebig_list[2] = {
        { "Temperature", content->base3.temperature },
        { "Humidity", content->base3.humidity },
    };
    int a9_list_length = sizeof(a9_list) / sizeof(a9_list[0]);
    int zeebig_list_length = sizeof(zeebig_list) / sizeof(zeebig_list[0]);
    cJSON* a9 = format_array_env(a9_list, a9_list_length);
    cJSON* zeebig = format_array_env(zeebig_list, zeebig_list_length);
    
    cJSON* data = cJSON_CreateObject();
    cJSON_AddItemToObject(data, "a9", a9);
    cJSON_AddItemToObject(data, "zeebig", zeebig);
    format_response(0, data, true);

    shmdt((void*)shmid);
    return 0;
}