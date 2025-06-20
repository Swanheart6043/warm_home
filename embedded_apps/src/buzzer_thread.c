#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <pthread.h>
#include "../include/common.h"
#include "../../embedded_common/include/led.h"

void* buzzer_thread(void* params) {
    printf("Buzzer thread preparation\n");
    pthread_t threadId = pthread_self();
    printf("当前线程id: %lu\n", threadId);

    int fd = -1;
	int is_on = 0;
	MessageBody* msgBody = (MessageBody*)params;

	if(!msgBody->operate) {
		printf("The parameter is invalid\n");
		return NULL;
	}

	fd = open("/dev/buzzer", O_RDONLY);
	if (fd < 0) {
		printf("open /dev/buzzer failed\n");
		return NULL;
	}

    is_on ? ioctl(fd, LED_ON) : ioctl(fd, LED_OFF);

	close(fd);
	fd = -1;
	pthread_exit(NULL);
}