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
    requestParams.adc = adc_data;
    requestParams.base1.CYROX = mpu6050_data.CYROX;
    requestParams.base1.CYROY = mpu6050_data.CYROY;
    requestParams.base1.CYROZ = mpu6050_data.CYROZ;
    requestParams.base1.AACX = mpu6050_data.AACX;
    requestParams.base1.AACY = mpu6050_data.AACY;
    requestParams.base1.AACZ = mpu6050_data.AACZ;
    requestParams.base2.A9_RESERVED_0 = reserved_data.A9_RESERVED_0;
    requestParams.base2.A9_RESERVED_1 = reserved_data.A9_RESERVED_1;
    requestParams.base3.temperature = zeebig_data.temperature;
    requestParams.base3.humidity = zeebig_data.humidity;
    printf("%f\n", requestParams.adc);
    printf("%f\n", requestParams.base1.CYROX);
    printf("%f\n", requestParams.base1.CYROY);
    printf("%f\n", requestParams.base1.CYROZ);
    printf("%f\n", requestParams.base1.AACX);
    printf("%f\n", requestParams.base1.AACY);
    printf("%f\n", requestParams.base1.AACZ);

    printf("Start sharing data...\n");
    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, IPC_CREAT|0666);
    char* content = shmat(shmid, NULL, 0);
    // bzero(content,512);
    strcpy(content, (char*)&requestParams);
    printf("content: %s\n", content);
    printf("The collection is complete\n");
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
