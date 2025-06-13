#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <sys/msg.h>
#include "../../embedded_common/include/led.h"

void fan(char* operate) {
    printf("Fan thread preparation\n");
    long threadId = pthread_self();
    printf("当前线程id: %lu\n", threadId);

	int fd = -1;
	int is_on = 0;
	int which_led = 0;

	if(!operate) {
		printf("The parameter is invalid\n");
		return -1;
	}

	fd = open("/dev/led", O_RDONLY);
	if (fd == -1) {
		printf("open /dev/led failed\n");
		return -1;
	}

	if (is_on) {
		ioctl(fd, LED_ON, which_led);
	} else {
		ioctl(fd, LED_OFF, which_led);
	}

	close(fd);
	fd = -1;

	// 相当于return，但是推荐用exit这个函数;
    pthread_exit(NULL);
}