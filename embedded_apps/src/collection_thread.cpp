#include <pthread.h>
#include <iostream>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/shm.h>
#include "../../embedded_common/lib/cjson/cJSON.h"
#include "../../embedded_common/include/shared_memory.h"
#include "../include/common.h"

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
    int data;
    using namespace std;
    // int fd = open_port("/dev/ttyUSB0");
	// if(fd < 0){
    //     cout << "Open /dev/ttyUSB0 failed" << endl;
    //     reserved_data.A9_RESERVED_0 = 0;
    //     reserved_data.A9_RESERVED_1 = 0;
	//     return zeeBigData;
	// }
    return data;
}

Mpu6050Data get_mpu6050() {
    Mpu6050Data data;
    using namespace std;
    // int fd = open_port("/dev/ttyUSB0");
	// if(fd < 0){
    //     cout << "Open /dev/ttyUSB0 failed" << endl;
    //     reserved_data.A9_RESERVED_0 = 0;
    //     reserved_data.A9_RESERVED_1 = 0;
	//     return zeeBigData;
	// }
    data.CYROX = -14;
    data.CYROY = 20;
    data.CYROZ = 40; 
    data.AACX = 642; 
    data.AACY = -34;
    data.AACZ = 5002;
    return data;
}

ReservedData get_reserved() {
    ReservedData reserved_data;
    using namespace std;
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

ZeeBigData get_zeebig() {
    ZeeBigData zigbee_data;
    using namespace std;
    int fd = open_port("/dev/ttyUSB0");
	if(fd < 0){
        cout << "Open /dev/ttyUSB0 failed" << endl;
        zigbee_data.temperature = 00.00;
        zigbee_data.humidity = 00.00;
		return zigbee_data;
	}
	set_com_config(fd, 115200, 8, 'N', 1);
    char buf[32];
    read(fd, &buf, sizeof(buf)); // read函数是阻塞的
    zigbee_data.temperature = 10.00;
    zigbee_data.humidity = 20.00;
    return zigbee_data;
}
