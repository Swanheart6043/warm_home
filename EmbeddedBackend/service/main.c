#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

void handleClean(void* str){
    printf("%s\n", (char*)str);
}

void* thread(int* index) {
    long threadId = pthread_self();
    // hui shou xian cheng
    // pthread_detach(threadId);
    printf("当前索引: %d\n", *index);
    printf("当前线程id: %lu\n", threadId);
    
    pthread_setcancelstate(PTHREAD_CANCEL_DISABLE, NULL);
    sleep(1);
    printf("can cancel\n");
    pthread_setcancelstate(PTHREAD_CANCEL_ENABLE, NULL);

    pthread_cleanup_push(handleClean, "hello");
    pthread_cleanup_pop(1);
    // 相当于return，但是推荐用exit这个函数;
    pthread_exit(NULL);
}

int main() {
    pthread_t tidList[10];
    for (int i = 0; i < 10; i++) {
        pthread_create(&tidList[i], NULL, (void*)thread, &i);
        // 防止主进程结束太快，阻塞顺序输出
        sleep(1);
    }
    pthread_cancel(tidList[5]);
    sleep(1);
    return 0;
}