#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

pthread_mutex_t mutex =  PTHREAD_MUTEX_INITIALIZER;

void* thread1(int* index) {
    for (int i = 0; i < 5; i++) {
        printf("xiancheng1\n");
        pthread_mutex_lock(&mutex);
        pthread_cond_signal();
        pthread_cond_broadcast();

        pthread_mutex_unlock(&mutex);
        sleep(1);
    }
    pthread_exit(NULL);
}

void* thread2(int* index) {
    for (int i = 0; i < 5; i++) {
        printf("xiancheng2\n");
        pthread_mutex_lock(&mutex);
        while (1) {
            pthread_cond_wait(, &mutex);
        }
        

        pthread_mutex_unlock(&mutex);
        sleep(1);
    }
    pthread_exit(NULL);
}

int main() {
    pthread_t tid1,tid2;
    pthread_create(&tid1, NULL, (void*)thread1, NULL);
    pthread_create(&tid2, NULL, (void*)thread2, NULL);
    while (1) { 

    }
    return 0;
}