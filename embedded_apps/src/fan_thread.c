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
#include <stdlib.h>
#include <termios.h>

void* fan_thread(void* params) {
	MessageBody* msgBody = (MessageBody*)params;
	if(!msgBody->operate) {
		printf("Params cannot be empty\n");
		free(msgBody);
		return NULL;
	}

	printf("msgBody->operateT: %s\n", msgBody->operate);
    printf("msgBody->whichT: %d\n", msgBody->which);

	int fd = open_port("/dev/ttyUSB0");
	if(fd == -1){
		printf("Open /dev/ttyUSB0 failed\n");
		free(msgBody);
		return NULL;
	}

	set_com_config(fd, 115200, 8, 'N', 1);
	const char* operate = strcmp(msgBody->operate, "on") == 0 ? "00" : "11";
	int result = write(fd, operate, 2);
	if (result == -1) {
		printf("Write /dev/ttyUSB0 failed\n");
		free(msgBody);
		return NULL;
	}
	
	sleep(2);
	char buf[32];
	int readResult = read(fd, &buf, sizeof(buf)); // read函数是阻塞的
	if (readResult == -1) {
		printf("Read /dev/ttyUSB0 failed\n");
	}
	printf("%s\n", buf);

	close(fd);
	fd = -1;
	free(msgBody);
    pthread_exit(NULL);
	return NULL;
}
