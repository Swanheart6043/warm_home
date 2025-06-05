// #include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <sys/msg.h>
#include <sys/shm.h>
#include <string.h>
#include <pthread.h>
// #include "../../embedded_common/lib/cjson/cJSON.h"

int get_adc();
int get_accelerator();
int get_gyroscope();
int get_zeebig();

void* collection_thread() {
    long threadId = pthread_self();
    
    int adc_data = get_adc();
    int accelerator_data = get_accelerator();
    int gyroscope_data = get_gyroscope();
    int zeebig_data = get_zeebig();

    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, IPC_CREAT|0666);
    char* content = shmat(shmid, NULL, 0);
    // bzero(content,512);
    strcpy(content, "a");
    printf("shmat: %s\n", content);
}

int get_adc() {
    return 0;
}

int get_accelerator() {
    return 0;
}

int get_gyroscope() {
    return 0;
}

int get_zeebig() {
    return 0;
}
