#include<stdio.h>
#include<stdlib.h>
#include"LinkList.h"
#include"LinkQueue.h"

LinkQueuePointer linkQueue_create() {
    LinkQueuePointer linkQueue = (LinkQueuePointer)malloc(sizeof(LinkQueue));
    if (linkQueue == NULL) {
        printf("Create linkQueue failed\n");
        return NULL;
    }
    linkListPointer linkList = (linkListPointer)linkList_create(NULL, 0);
    if (linkList == NULL) {
        printf("Create linkQueue failed\n");
        return NULL;
    }
    linkQueue->front = linkList;
    linkQueue->rear = -1;
    return linkQueue;
}

int linkQueue_destroyed(LinkQueuePointer* linkQueue) {
    if (*linkQueue == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    linkList_destroyed(&((*linkQueue)->front));
    (*linkQueue)->front = NULL;
    free(*linkQueue);
    *linkQueue = NULL;
    return 0;
}

int linkQueue_isEmpty(LinkQueuePointer linkQueue) {
    if (linkQueue == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    return linkQueue->rear == -1 ? 1 : 0;
}

int linkQueue_enQueue(LinkQueuePointer linkQueue, int value) {
    if (linkQueue == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    linkList_push(linkQueue->front, value);
    linkQueue->rear++;
    return 0;
}

int linkQueue_deQueue(LinkQueuePointer linkQueue) {
    if (linkQueue == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    if (linkQueue_isEmpty(linkQueue) == 1) {
        printf("The stack is empty,can no pop\n");
        return -1;
    }
    int unShiftValue = linkList_unShift(&(linkQueue->front));
    linkQueue->rear--;
    return unShiftValue;
}

int linkQueue_traverse(LinkQueuePointer linkQueue) {
    if (linkQueue == NULL || linkQueue->front == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	linkList_traverse(linkQueue->front);
	return 0;
}
