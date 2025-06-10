#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/msg.h>
#include "../include/common.h"
#include "../../embedded_common/include/message.h"

pthread_t led_tid;
pthread_t buzzer_tid;
pthread_t collection_tid;

void match_msg(long type, MessageBody body) {
    if (!type) return;
    
    printf("msgrcv type: %ld\n", type);
    printf("msgrcv operate: %ld\n", body.operate);
    printf("msgrcv which: %ld\n", body.which);
    
    int led_thread_running = 0;
    int buzzer_thread_running = 0;
    
    if (type == 1) {
        if (led_thread_running) {
            printf("Stopping led thread\n");
            pthread_join(led_tid, body.operate);
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
    if (type == 2) {
        if (buzzer_tid) {
            pthread_join(buzzer_tid, NULL);
        }
        int buzzer_thread_result = pthread_create(&buzzer_tid, NULL, (void*)buzzer_thread, NULL);
        if (buzzer_thread_result != 0) {
            perror("Failed to create buzzer thread");
        }
        printf ("pthread buzzer end\n");
    }
    if (type == 3) {
        if (led_thread_running) {
            printf("Stopping led thread\n");
            pthread_join(led_tid, body.operate);
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
    if (type == 4) {
        if (led_thread_running) {
            printf("Stopping led thread\n");
            pthread_join(led_tid, body.operate);
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
}

int main() {
    key_t key = ftok("/tmp/control.txt", 'g');
    int msg_id = msgget(key, IPC_CREAT|0666);
    if (key == -1 || msg_id == -1) perror("msgget failed");
    
    // Create some resident thread
    int collection_thread_result = pthread_create(&collection_tid, NULL, (void*)collection_thread, NULL);
    if (collection_thread_result == -1) perror("Failed to create collection thread");
    
    printf("App started, waiting commands...\n");

    // Listen messages
    while(1) {
        Message msg;
        msgrcv(msg_id, &msg, sizeof(msg.body), 0, 0);
        match_msg(msg.type, msg.body);
        // 短暂休眠10ms，避免CPU占用过高
        usleep(10000);
    }
    return 0;
}