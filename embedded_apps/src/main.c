#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
// #include <sys/ipc.h>
#include <sys/msg.h>

void* led_thread();
void* buzzer_thread();
void* fan_thread();
void* digital_tube_thread();
void* camera_thread();
void* adc_thread();
void* accelerator_thread();
void* gyroscope_thread();

int main() {
    pthread_t led_tid;
    pthread_t buzzer_tid;

    key_t key = ftok("/tmp", 'g');
    int msg_id = msgget(key, IPC_CREAT|IPC_EXCL|0666);
    if (msg_id == -1) {
        perror("msgget failed");
        return -1;
    }

    printf("App started, waiting commands\n");
    printf(".............................\n");
    
    while(1) {
        struct Message { long type; char text[100] }msg;
        ssize_t result = msgrcv(msg_id, &msg, sizeof(msg) - sizeof(long), 0, 0);

        if (msg.type) {
            printf("msgrcv %s\n", msg.text);
        }
        
        int led_thread_running = 0;
        int buzzer_thread_running = 0;
        if (msg.type == 1) {
            if (led_thread_running) {
                printf("Stopping led thread\n");
                pthread_join(led_tid, NULL);
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
        if (msg.type == 2) {
            if (buzzer_tid) {
                pthread_join(buzzer_tid, NULL);
            }
            int buzzer_thread_result = pthread_create(&buzzer_tid, NULL, (void*)buzzer_thread, NULL);
            if (buzzer_thread_result != 0) {
                perror("Failed to create buzzer thread");
            }
            printf ("pthread buzzer end\n");
        }
        
        // 短暂休眠10ms，避免CPU占用过高
        usleep(10000);
    }
    return 0;
}