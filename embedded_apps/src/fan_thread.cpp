#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <pthread.h>
#include "../include/common.h"
#include "../../embedded_common/include/led.h"
#include <string.h>
#include <unistd.h>

void* fan_thread(void* params) {
	MessageBody* msgBody = static_cast<MessageBody*>(params);
	if(!msgBody->operate) {
		printf("The parameter is invalid\n");
		return NULL;
	}
	int fd = open_port("/dev/ttyUSB0");
	if(fd == -1){
		printf("Open /dev/ttyUSB0 failed\n");
		return NULL;
	}	
	set_com_config(fd, 115200, 8, 'N', 1);
	const char* operate = strcmp(msgBody->operate, "on") == 0 ? "00" : "11";
	write(fd, operate, 2); 
	sleep(1);
	char buf[32];
	read(fd, &buf, sizeof(buf)); // read函数是阻塞的
	close(fd);
	fd = -1;
	delete msgBody;
    pthread_exit(NULL);
	return NULL;
}
