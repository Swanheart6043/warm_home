#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <sys/msg.h>
#include "../include/common.h"
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <signal.h>
#include <sys/prctl.h>

pthread_t buzzer_tid;
pthread_t fan_tid;
pthread_t collection_tid;
int buzzer_thread_running = 0;
int fan_thread_running = 0;

void daemonize() {
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork failed");
        exit(1);
    }
    // 父进程直接退出
    if (pid > 0) {
        exit(0);
    }
    // 子进程
    if (setsid() < 0) {
        perror("setsid failed");
        exit(1);
    }
    // 避免 reacquire tty
    signal(SIGHUP, SIG_IGN);

    // 再 fork 一次，确保不可再打开控制终端
    pid = fork();
    if (pid < 0) {
        perror("fork #2 failed");
        exit(1);
    }
    if (pid > 0) {
        exit(0);
    }

    // 切换到根目录，并重设 umask
    chdir("/");
    umask(0);

    // 重定向标准文件描述符
    // int fd = open("/dev/null", O_RDWR, 0);
    // if (fd != -1) {
    //     dup2(fd, STDIN_FILENO);
    //     dup2(fd, STDOUT_FILENO);
    //     dup2(fd, STDERR_FILENO);
    //     if (fd > 2) close(fd);
    // }
}

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
        int buzzer_thread_result = pthread_create(&buzzer_tid, NULL, buzzer_thread, &body);
        if (buzzer_thread_result == -1) {
            perror("Failed to create buzzer thread");
            return;
        }
        printf ("pthread buzzer end\n");
        buzzer_thread_running = 1;
        return;
    }
    if (type == 3) {
        printf("Fan\n");
        MessageBody* msgBody = malloc(sizeof(MessageBody));
        if (msgBody == NULL) {
            printf("Failed to allocate memory\n");
            return;
        }
        *msgBody = body;
        if (fan_thread_running) {
            pthread_join(fan_tid, NULL);
            fan_thread_running = 0;
        }
        int fan_thread_result = pthread_create(&fan_tid, NULL, fan_thread, msgBody);
        if (fan_thread_result == -1) {
            printf("Failed to create fan thread\n");
            fan_thread_running = 0;
            free(msgBody);
            return;
        }
        fan_thread_running = 1;
        return;
    }
    return;
}

int main() {
    // 先做守护化
    daemonize();

    // 初始化消息 
    key_t key = ftok("/tmp/control.txt", 'g');
    if (key == -1) {
        printf("key cannot be == -1\n");
        return -1;
    }
    int msgid = msgget(key, IPC_CREAT|0666);
    if (msgid == -1) {
        printf("msgid cannot be == -1\n");
        return -1;
    }
    
    // 创建常驻线程
    int collection_thread_result = pthread_create(&collection_tid, NULL, collection_thread, NULL);
    if (collection_thread_result == -1) {
        perror("Failed to create collection thread");
        return -1;
    }
    
    // 准备完成
    printf("\n");
    printf("App started, waiting commands...\n");

    // 监听消息
    while(1) {
        Message msg;
        msgrcv(msgid, &msg, sizeof(msg.body), 0, 0);
        match_msg(msg.type, msg.body);
        usleep(10000);
    }

    return 0;
}