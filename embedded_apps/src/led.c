#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <unistd.h>
#include <stdio.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include "../../embedded_common/include/led.h"

void handleClean(void* str){
    printf("%s\n", (char*)str);
}

void* led_thread() {
    long threadId = pthread_self();
    // hui shou xian cheng
    // pthread_detach(threadId);
    printf("当前线程id: %lu\n", threadId);
    
    pthread_setcancelstate(PTHREAD_CANCEL_DISABLE, NULL);
    sleep(1);
    printf("can cancel\n");
    pthread_setcancelstate(PTHREAD_CANCEL_ENABLE, NULL);

    // pthread_cleanup_push(handleClean, "hello");
    // pthread_cleanup_pop(1);
    // 相当于return，但是推荐用exit这个函数;
    // pthread_exit(NULL);

	int fd = -1;
	int onoff = 0;
	int no = 0;

	if(argc < 4) {
		printf("The argument is too few\n");
		return 1;
	}

	sscanf(argv[2],"%d", &onoff);
	sscanf(argv[3],"%d", &no);

	if (no < 2 || no > 5) {
		printf("len-no is invalid\n");
		return 2;
	}

	fd = open(argv[1], O_RDONLY);
	if (fd < 0) {
		printf("open %s failed\n",argv[1]);
		return 3;
	}

	if (onoff) {
		ioctl(fd,LED_ON,no);
	} else {
		ioctl(fd,LED_OFF,no);
	}

	close(fd);
	fd = -1;
	msgctl(msgid, IPC_RMID, NULL);
	return 0;
}
