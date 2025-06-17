#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/msg.h>
#include "../include/common.h"

pthread_t buzzer_tid;
pthread_t fan_tid;
pthread_t collection_tid;
int buzzer_thread_running = 0;
int fan_thread_running = 0;

void match_msg(long type, MessageBody body) {
    if (!type) {
        return;
    }
    if (type == 1) {
        led(body);
        return;
    }
    if (type == 2) {
        if (buzzer_thread_running) {
            printf("Stopping buzzer thread\n");
            pthread_join(buzzer_tid, NULL);
            buzzer_thread_running = 0;
        }
        MessageBody* body_pointer = new MessageBody(body);
        int buzzer_thread_result = pthread_create(&buzzer_tid, NULL, buzzer_thread, body_pointer);
        if (buzzer_thread_result == -1) {
            perror("Failed to create buzzer thread");
            return;
        }
        printf ("pthread buzzer end\n");
        buzzer_thread_running = 1;
        return;
    }
    if (type == 3) {
        if (fan_thread_running) {
            printf("Stopping buzzer thread\n");
            pthread_join(fan_tid, NULL);
            fan_thread_running = 0;
        }
        MessageBody* body_pointer = new MessageBody(body);
        int fan_thread_result = pthread_create(&fan_tid, NULL, fan_thread, body_pointer);
        if (fan_thread_result == -1) {
            perror("Failed to create buzzer thread");
            return;
        }
        printf ("pthread buzzer end\n");
        fan_thread_running = 1;
        return;
    }
    return;
}

int main() {
    key_t key = ftok("/tmp/control.txt", 'g');
    int msg_id = msgget(key, IPC_CREAT|0666);
    if (key == -1 || msg_id == -1) perror("msgget failed");
    
    int collection_thread_result = pthread_create(&collection_tid, NULL, collection_thread, NULL);
    if (collection_thread_result == -1) perror("Failed to create collection thread");
    
    printf("App started, waiting commands...\n");

    while(1) {
        Message msg;
        msgrcv(msg_id, &msg, sizeof(msg.body), 0, 0);
        match_msg(msg.type, msg.body);
        usleep(10000);
    }

    return 0;
}