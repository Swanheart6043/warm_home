#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include "../include/common.h"
#include "../../embedded_common/include/led.h"

void led(MessageBody msgBody) {
	printf("\n");
	printf("Led\n");
	
	if(!msgBody.operate) {
		printf("The parameter is invalid\n");
		return;
	}

	if (msgBody.which < 2 || msgBody.which > 5) {
		printf("Led number is invalid\n");
		return;
	}

	int fd = open("/dev/led", O_RDONLY);
	if (fd == -1) {
		printf("open /dev/led failed\n");
		return;
	}
	ioctl(fd, msgBody.operate ? LED_ON : LED_OFF, msgBody.which);

	close(fd);
	fd = -1;
	return;
}
