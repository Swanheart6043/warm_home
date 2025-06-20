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
    int writeResult = write(fd, "22", 2);
	if (writeResult == -1) {
		printf("Write /dev/ttyUSB0 failed\n");
		return -1;
	}
    sleep(1);
	char buf[32];
    int readResult = read(fd, &buf, sizeof(buf));
    if (readResult == -1) {
        printf("Read /dev/ttyUSB0 failed\n");
		return -1;
    }
	printf("%s\n", buf);

	close(fd);
	fd = -1;
    return 0;
}
