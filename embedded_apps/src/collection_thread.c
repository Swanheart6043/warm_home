#include <pthread.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/shm.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../include/common.h"

float get_adc();
ReservedData get_reserved();

void* collection_thread(void* params) {
    printf("\n");
    printf("Start collection thread...\n");
    pthread_t threadId = pthread_self();

    RequestData requestParams;
    key_t key = ftok("/tmp/env.txt", 65);
    int shmid = shmget(key, 512, IPC_CREAT|0666);
    RequestData* content = (RequestData*)shmat(shmid, NULL, 0);
    bzero(content,512);
    strcpy((char*)content, (char*)&requestParams);
    
    float adc_data = get_adc();
    Mpu6050Data mpu6050_data = mpu6050();
    ZeeBigData zeebig_data = temperature();
    ReservedData reserved_data = get_reserved();
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
    int data;
    // int fd = open_port("/dev/ttyUSB0");
	// if(fd < 0){
    //     cout << "Open /dev/ttyUSB0 failed" << endl;
    //     reserved_data.A9_RESERVED_0 = 0;
    //     reserved_data.A9_RESERVED_1 = 0;
	//     return zeeBigData;
	// }
    return data;
}

ReservedData get_reserved() {
    ReservedData reserved_data;
    // int fd = open_port("/dev/ttyUSB0");
	// if(fd < 0){
    //     cout << "Open /dev/ttyUSB0 failed" << endl;
    //     reserved_data.A9_RESERVED_0 = 0;
    //     reserved_data.A9_RESERVED_1 = 0;
	//     return zeeBigData;
	// }
    reserved_data.A9_RESERVED_0 = 0;
    reserved_data.A9_RESERVED_1 = 0;
    return reserved_data;
}
