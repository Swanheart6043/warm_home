#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

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

    key_t key = ftok(".", 'A');
    int msgid = msgget(key, 0666 | IPC_CREAT);
    if (msgid == -1) {
        perror("msgget failed");
        return -1;
    }
    printf("Main thread started, waiting commands...\n");
    while(1) {
        msg_buffer_t msg;
        // 阻塞接收消息 (mtype=0 接收任何类型的消息)
        ssize_t ret = msgrcv(msgid, &msg, sizeof(msg) - sizeof(long), 0, 0);

        switch(msg.type) {
            case MSG_LED_CONTROL:
                if (pthread_create(&led_tid, NULL, (void*)led_thread, NULL) != 0) {
                    perror("Failed to create led thread");
                    return -1;
                }
                pthread_join(led_tid, NULL);
                printf ("pthread led end\n");
                break;
            case MSG_CAMERA_START:
                if (pthread_create(&buzzer_tid, NULL, (void*)buzzer_thread, NULL) != 0) {
                    perror("Failed to create buzzer thread");
                    return -1;
                }
                pthread_join(buzzer_tid, NULL);
                printf ("pthread buzzer end\n");
                break;
            default:
                printf("Unknown message type: %d\n", msg.type);
                break;
        }
        // 短暂休眠10ms，避免CPU占用过高
        usleep(10000);
    }
    return 0;
}