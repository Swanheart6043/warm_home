#include<stdio.h>
#include <stdlib.h>
#include "LinkList.h"
#include"LinkQueue.h"

void testEnQueue(LinkQueuePointer linkQueue) {
    int input = 0;
    while(1) {
        scanf("%d", &input);
        if (input == -1) {
            printf("\n");
            break;
        }
        linkQueue_enQueue(linkQueue, input);
    }
    linkQueue_traverse(linkQueue);
    printf("\n");
}

void testDeQueue(LinkQueuePointer linkQueue) {
    while(linkQueue->rear != -1) {
        int result = linkQueue_deQueue(linkQueue);
        printf("%d\n", result);
    }
    printf("\n");
}

int main() {
    LinkQueuePointer linkQueue = linkQueue_create();
    testEnQueue(linkQueue);
    testDeQueue(linkQueue);
    linkQueue_destroyed(&linkQueue);
    printf("%p\n", linkQueue);
    return 0;
}