// #include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <sys/msg.h>
// #include "../../embedded_common/lib/cjson/cJSON.h"

int collection_adc();
int collection_accelerator();
int collection_gyroscope();
int collection_zeebig();

void* collection_thread() {
    long threadId = pthread_self();
    printf("当前线程caijixiancheng, id: %lu\n", threadId);
    
    int adc_data = collection_adc();
    int accelerator_data = collection_accelerator();
    int gyroscope_data = collection_gyroscope();
    int zeebig_data = collection_zeebig();

    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, IPC_CREAT|0666);
    char* content = shmat(shmid, NULL, 0);
    strcpy(content, "a");
    printf("%s\n", content);

    // key_t key = ftok("/tmp/env.txt", 65);
    // int msg_id = msgget(key, IPC_CREAT|0666);
    // printf("key: %d\n", key);
    // printf("msg_id: %d\n", msg_id);
    // struct message { long type; char text[5] }msg = { 3, "a" };
    // int result = msgsnd(msg_id, &msg, strlen(msg.text)+1, 0);
    // printf("%s\n", msg.text);
    
    printf("sead end\n");
}

int collection_adc() {
    return 0;
}

int collection_accelerator() {
    return 0;
}

int collection_gyroscope() {
    return 0;
}

int collection_zeebig() {
    return 0;
}
