#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

FILE* fp = NULL;
pthread_mutex_t mutex =  PTHREAD_MUTEX_INITIALIZER;

void* thread1(int* index) {
    for (int i = 0; i < 5; i++) {
        printf("xiancheng1\n");
        char text[] = "hello1\n";
        pthread_mutex_lock(&mutex);
        for (int j = 0; j < strlen(text); j++) {
            fputc(text[j], fp);
            fflush(fp);
        }
        pthread_mutex_unlock(&mutex);
        sleep(1);
    }
    pthread_exit(NULL);
}

void* thread2(int* index) {
    for (int i = 0; i < 5; i++) {
        printf("xiancheng2\n");
        char text[] = "hello2\n";
        pthread_mutex_lock(&mutex);
        for (int j = 0; j < strlen(text); j++) {
            fputc(text[j], fp);
            fflush(fp);
        }
        pthread_mutex_unlock(&mutex);
        sleep(1);
    }
    pthread_exit(NULL);
}

int main() {
    pthread_t tid1,tid2;
    fp = fopen("./a.txt", "a+");
    if (fp == NULL) {
        perror("when fopen");
        return -1;
    }
    pthread_create(&tid1, NULL, (void*)thread1, NULL);
    pthread_create(&tid2, NULL, (void*)thread2, NULL);
    while (1) { }
    return 0;
}