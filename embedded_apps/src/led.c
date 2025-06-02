#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <sys/msg.h>
#include "../../embedded_common/include/led.h"

void handleClean(void* str){
    printf("%s\n", (char*)str);
}

void* led_thread(char* params) {
    long threadId = pthread_self();
    // pthread_detach(threadId);
    printf("当前线程id: %lu\n", threadId);
    
    // pthread_setcancelstate(PTHREAD_CANCEL_DISABLE, NULL);
    sleep(1);
    printf("can cancel\n");
    // pthread_setcancelstate(PTHREAD_CANCEL_ENABLE, NULL);

    // pthread_cleanup_push(handleClean, "hello");
    // pthread_cleanup_pop(1);
    // 相当于return，但是推荐用exit这个函数;
    // pthread_exit(NULL);

	int fd = -1;
	int is_on = 0;
	int which_led = 0;

	if(params < 4) {
		printf("The argument is too few\n");
		return 1;
	}

	if (which_led < 2 || which_led > 5) {
		printf("len-no is invalid\n");
		return 2;
	}

	fd = open("/dev/led", O_RDONLY);
	if (fd < 0) {
		printf("open /dev/led failed\n");
		return 3;
	}

	if (is_on) {
		ioctl(fd,LED_ON,which_led);
	} else {
		ioctl(fd,LED_OFF,which_led);
	}

	close(fd);
	fd = -1;
	return 0;
}
