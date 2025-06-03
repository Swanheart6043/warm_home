#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <sys/msg.h>
#include "../../embedded_common/include/led.h"

void* fan_thread(char* params) {
    printf("Buzzer thread preparation\n");
    long threadId = pthread_self();
    printf("当前线程id: %lu\n", threadId);

    int fd = -1;
	int is_on = 0;

	if(!params) {
		printf("The parameter is invalid\n");
		return 1;
	}

	fd = open("/dev/led", O_RDONLY);
	if (fd < 0) {
		printf("open /dev/led failed\n");
		return 3;
	}

    is_on ? ioctl(fd, LED_ON) : ioctl(fd, LED_OFF);

	close(fd);
	fd = -1;

	pthread_exit(NULL);
}