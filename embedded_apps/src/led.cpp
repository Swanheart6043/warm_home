#include <iostream>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <sys/msg.h>
#include <pthread.h>
#include "../include/common.h"
#include "../../embedded_common/include/led.h"

void led(MessageBody msgBody) {
	using namespace std;

	cout << endl;
	printf("Led thread preparation\n");
    pthread_t threadId = pthread_self();
    printf("当前线程id: %lu\n", threadId);

	int fd = -1;
	int is_on = 0;
	int which_led = 0;

	if(!msgBody.operate) {
		printf("The parameter is invalid\n");
		return;
	}
	if (msgBody.which < 2 || msgBody.which > 5) {
		printf("Led number is invalid\n");
		return;
	}

	fd = open("/dev/led", O_RDONLY);
	if (fd < 0) {
		printf("open /dev/led failed\n");
		return;
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
