#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() {
    void* addr = mmap(NULL, 100, PROT_READ|PROT_WRITE, MAP_SHARED|MAP_ANONYMOUS, -1, 0);
    if(addr == MAP_FAILED) {
        return -1;
    }

    int pid = fork();
    if (pid == -1) {
        return -1;
    }
    if (pid > 0) {
        memcpy(addr, "123", 3);
        sleep(5);
    } else {
        sleep(1);
        printf("%s\n", (char*)addr);
    }

    munmap(addr, 100);
    return 0;
}