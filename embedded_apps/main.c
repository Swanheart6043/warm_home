#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include "include.h"

int main() {
    pthread_t pthread_led_tid;
    pthread_t pthread_buzzer_tid;
    
    pthread_create(&pthread_led_tid, NULL, (void*)led_thread, NULL);
    pthread_create(&pthread_buzzer_tid, NULL, (void*)buzzer_thread, NULL);

    pthread_cancel(pthread_led_tid);
    pthread_cancel(pthread_buzzer_tid);
    sleep(1);
    return 0;
}