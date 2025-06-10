// #include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <sys/msg.h>
#include <sys/shm.h>
#include <string.h>
#include <pthread.h>
#include "../../embedded_common/lib/cjson/cJSON.h"

typedef struct {
    float CYROX;
    float CYROY;
    float CYROZ;
    float AACX;
    float AACY;
    float AACZ;
} Mpu6050Data;

typedef struct {
    float A9_RESERVED_0;
    float A9_RESERVED_1;
} ReservedData;

typedef struct {
    float temperature;
    float humidity;
} ZeeBigData;

typedef struct {
    float adc;
    Mpu6050Data base1;
    ReservedData base2;
    ZeeBigData base3;
} RequestData;

void collection_thread();
float get_adc();
Mpu6050Data get_mpu6050();
ReservedData get_reserved();
ZeeBigData get_zeebig();

void collection_thread() {
    printf("\n");
    long threadId = pthread_self();
    printf("Start collection thread..., id: %ld", threadId);

    float adc_data = get_adc();
    Mpu6050Data mpu6050_data = get_mpu6050();
    ReservedData reserved_data = get_reserved();
    ZeeBigData zeebig_data = get_zeebig();
    printf("Start building data...\n");

    RequestData requestParams;
    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, IPC_CREAT|0666);
    RequestData* content = (RequestData*)shmat(shmid, NULL, 0);
    // bzero(content,512);
    strcpy(content, &requestParams);
    
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
