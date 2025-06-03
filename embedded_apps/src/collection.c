#include <sys/msg.h>
#include "../../embedded_common/include/led.h"

void collection_adc();
void collection_accelerator();
void collection_gyroscope();
void collection_zeebig();

void* collection_thread() {
    printf("Collection thread preparation\n");
    long threadId = pthread_self();
    printf("当前线程id: %lu\n", threadId);

    collection_adc();
    collection_accelerator();
    collection_gyroscope();
    collection_zeebig();

    int shmid = shmget(ftok("/tmp", "g"), 512, IPC_CREAT|0666);
}

void collection_adc() {

}

void collection_accelerator() {

}

void collection_gyroscope() {

}

void collection_zeebig() {

}
