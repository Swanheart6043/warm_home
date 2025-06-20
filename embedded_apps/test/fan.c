#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <string.h>
#include <termios.h>
#include "../include/common.h"

int main() {
	int fd = open_port("/dev/ttyUSB0");
	set_com_config(fd, 115200, 8, 'N', 1);
    int result = write(fd, "00", 2);
	if (result == -1) {
		printf("Write /dev/ttyUSB0 failed\n");
		return -1;
	}
	close(fd);
	fd = -1;
    return 0;
}
