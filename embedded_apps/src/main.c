#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/msg.h>
#include "../include/common.h"

int main() {
    pthread_t led_tid;
    pthread_t buzzer_tid;
    pthread_t collection_tid;

    // Create messages
    printf("Message queue preparation\n");
    int msg_id = msgget(ftok("/tmp/control.txt", 'g'), IPC_CREAT|0666);
    if (msg_id == -1) {
        perror("msgget failed");
        return -1;
    }
    printf("Message queue complete\n");
    
    // Create some resident thread
    int collection_thread_result = pthread_create(&collection_tid, NULL, (void*)collection_thread, NULL);
    if (collection_thread_result != 0) {
        perror("Failed to create collection thread");
    }
    
    printf("App started, waiting commands...\n");    
    while(1) {
        // Listen messages
        struct Message { long type; char text[100] }msg;
        ssize_t result = msgrcv(msg_id, &msg, sizeof(msg) - sizeof(long), 0, 0);
        if (msg.type) printf("msgrcv: %s\n", msg.text);
        int led_thread_running = 0;
        int buzzer_thread_running = 0;
        
        if (msg.type == 1) {
            pthread_join(led_tid, msg.text);
            led_thread_running = 0;
        }
        if (msg.type == 2) {
            if (led_thread_running) {
                printf("Stopping led thread\n");
                pthread_join(led_tid, msg.text);
                led_thread_running = 0;
            }
            int led_thread_result = pthread_create(&led_tid, NULL, (void*)led_thread, NULL);
            if (led_thread_result == 0) {
                printf ("Led thread started\n");
                led_thread_running = 1;
            } else {
                perror("Failed to create led thread");
            }
        }
        if (msg.type == 3) {
            if (buzzer_tid) {
                pthread_join(buzzer_tid, NULL);
            }
            int buzzer_thread_result = pthread_create(&buzzer_tid, NULL, (void*)buzzer_thread, NULL);
            if (buzzer_thread_result != 0) {
                perror("Failed to create buzzer thread");
            }
            printf ("pthread buzzer end\n");
        }
        if (msg.type == 4) {

        }
        if (msg.type == 5) {

        }
        // 短暂休眠10ms，避免CPU占用过高
        usleep(10000);
    }
    return 0;
}