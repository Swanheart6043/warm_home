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

int set_com_config(int, int, int, char, int);
int open_port(char*);
void USB_UART_Config(char*, int);

void* fan_thread(void* params) {
    pthread_t threadId = pthread_self();
	printf("Fan thread preparation\n");
    printf("当前线程id: %lu\n", threadId);
	MessageBody* msgBody = static_cast<MessageBody*>(params);
	
	if(!msgBody->operate) {
		printf("The parameter is invalid\n");
		return NULL;
	}

	int fd = open_port("/dev/ttyUSB0");
	if(fd < 0){
		printf("open failed\n");
		return NULL;
	}
	
	set_com_config(fd, 115200, 8, 'N', 1);
	write(fd, strcmp(msgBody->operate, "on") == 0 ? "1" : "0", 1); 
	sleep(2);
	char buf[32];
	read(fd, &buf, sizeof(buf)); // read函数是阻塞的

	close(fd);
	fd = -1;
	delete msgBody;
    pthread_exit(NULL);
}
