#include <iostream>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include "../include/common.h"
#include "../../embedded_common/include/led.h"

void led(MessageBody msgBody) {
	using namespace std;
	cout << endl;
	cout << "Led" << endl;
	
	if(!msgBody.operate) {
		cout << "The parameter is invalid" << endl;
		return;
	}

	if (msgBody.which < 2 || msgBody.which > 5) {
		cout << "Led number is invalid" << endl;
		return;
	}

	int fd = open("/dev/led", O_RDONLY);
	if (fd == -1) {
		cout << "open /dev/led failed" << endl;
		return;
	}
	ioctl(fd, msgBody.operate ? LED_ON : LED_OFF, which_led);

	close(fd);
	fd = -1;
	return;
}
