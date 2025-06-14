#include <iostream>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <sys/shm.h>
#include <string.h>
#include <pthread.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../../embedded_common/include/shared_memory.h"

float get_adc();
Mpu6050Data get_mpu6050();
ReservedData get_reserved();
ZeeBigData get_zeebig();

void* collection_thread(void* params) {
    using namespace std;

    printf("\n");
    pthread_t threadId = pthread_self();
    cout << "Start collection thread..." << endl;
    cout << "id: " << threadId << endl;

    float adc_data = get_adc();
    Mpu6050Data mpu6050_data = get_mpu6050();
    ReservedData reserved_data = get_reserved();
    ZeeBigData zeebig_data = get_zeebig();

    RequestData requestParams;
    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, IPC_CREAT|0666);
    RequestData* content = (RequestData*)shmat(shmid, NULL, 0);
    bzero(content,512);
    strcpy((char*)content, (char*)&requestParams);
    
    content->adc = adc_data;
    content->base1.CYROX = mpu6050_data.CYROX;
    content->base1.CYROY = mpu6050_data.CYROY;
    content->base1.CYROZ = mpu6050_data.CYROZ;
    content->base1.AACX = mpu6050_data.AACX;
    content->base1.AACY = mpu6050_data.AACY;
    content->base1.AACZ = mpu6050_data.AACZ;
    content->base2.A9_RESERVED_0 = reserved_data.A9_RESERVED_0;
    content->base2.A9_RESERVED_1 = reserved_data.A9_RESERVED_1;
    content->base3.temperature = zeebig_data.temperature;
    content->base3.humidity = zeebig_data.humidity;
}

float get_adc() {
    return 9.00;
}

Mpu6050Data get_mpu6050() {
    // ioctl
    // ioctl
    Mpu6050Data mpu6050Data = {
        .CYROX = -14, 
        .CYROY = 20,
        .CYROZ = 40, 
        .AACX = 642, 
        .AACY = -34, 
        .AACZ = 5002,
    };
    return mpu6050Data;
}

ReservedData get_reserved() {
    // ioctl
    // ioctl
    ReservedData reserved_data = {
        .A9_RESERVED_0 = 0,
        .A9_RESERVED_1 = 0,
    };
    return reserved_data;
}

ZeeBigData get_zeebig() {
    // ioctl
    // ioctl
    ZeeBigData ZeeBigData = {
        .temperature = 10.00,
        .humidity = 20.00,
    };
    return ZeeBigData;
}
