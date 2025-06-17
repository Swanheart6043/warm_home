#include <iostream>
#include "../include/common.h"

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