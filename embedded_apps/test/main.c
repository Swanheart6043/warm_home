#include <stdio.h>
#include <stdlib.h>
#include <sys/ipc.h>
#include <sys/msg.h>
#include <string.h>
#include "../../embedded_common/include/message.h"

int main() {
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
    
    MessageBody body;
    strncpy(body.operate, "on", sizeof(body.operate) - 1);
    body.operate[sizeof(body.operate) - 1] = '\0';
    body.which = 1;
    Message msg = { .type = 3, .body = body };
    int result = msgsnd(msgid, &msg, sizeof(msg.body), 0);
    if (result == -1) {
        printf("msgsnd cannot be == -1\n");
        return -1;
    }

    return 0;
}