#include <iostream>
#include <unstd.h>
// #include <fa>
#include "../include/common.h"

Mpu6050Data collection_mpu6050() {
    Mpu6050Data data;
    using namespace std;
    
    int fd = open("/dev/i2c");
    if (fd == -1) {
        cout << "Open /dev/i2c failed" << endl;
        data.CYROX = 0;
        data.CYROY = 0;
        data.CYROZ = 0; 
        data.AACX = 0; 
        data.AACY = 0;
        data.AACZ = 0;
        return data;
    }

    while(1) {
        sleep(2);
        // read accx

        // read accy

        // read accz

        // read temp

        // read gyrox

        // read gyroy

        // read gyroz
    }

    data.CYROX = -14;
    data.CYROY = 20;
    data.CYROZ = 40; 
    data.AACX = 642; 
    data.AACY = -34;
    data.AACZ = 5002;

    close(fd);
    fd = -1;
    return data;
}