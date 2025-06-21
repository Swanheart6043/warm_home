#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include "../include/common.h"
#include "../../embedded_common/include/led.h"

void led(MessageBody msg_body) {
	printf("\n");
	printf("led\n");
	if(!msg_body.operate) {
		printf("msg_body cannot be empty\n");
		return;
	}

	if (msg_body.which < 2 || msg_body.which > 5) {
		printf("Led number is invalid\n");
		return;
	}

	int fd = open("/dev/led", O_RDONLY);
	if (fd == -1) {
		printf("open /dev/led failed\n");
		return;
	}
	ioctl(fd, msg_body.operate ? LED_ON : LED_OFF, msg_body.which);

	close(fd);
	fd = -1;
	return;
}
