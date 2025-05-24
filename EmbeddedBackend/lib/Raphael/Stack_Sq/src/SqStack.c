#include <stdio.h>
#include <stdlib.h>
#include "SqList.h"
#include "SqStack.h"

SqStackPointer sqStack_create(Item* initialArray, int maxLength) {
    SqStackPointer sqStack = (SqStackPointer)malloc(sizeof(SqStack));
    if (sqStack == NULL) {
        printf("Create sqStack error\n");
        return NULL;
    }
    SqLink sqList = sqList_create(initialArray, maxLength);
    if (sqList == NULL) {
        printf("Create sqStack error\n");
        free(sqStack);
        return NULL;
    }
    sqStack->maxLength = maxLength;
    sqStack->length = 0;
    sqStack->topIndex = -1;
    sqStack->data = sqList;
    return sqStack;
}

int sqStack_destroyed(SqStackPointer* sqStack) {
    if (sqStack == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    sqList_destroyed(&((*sqStack)->data));
    (*sqStack)->data = NULL;
    free(*sqStack);
    *sqStack = NULL;
    return 0;
}

int sqStack_isFull(SqStackPointer sqStack) {
    if (sqStack == NULL) {
        return -1;
    }
    return sqStack->topIndex == sqStack->maxLength ? 1 : 0;
}

int sqStack_isEmpty(SqStackPointer sqStack) {
    if (sqStack == NULL) {
        return -1;
    }
    return sqStack->topIndex == -1 ? 1 : 0;
}

int sqStack_push(SqStackPointer sqStack, int value) {
    if (sqStack == NULL) {
        printf("The params is \n");
        return -1;
    }
    if (sqStack_isFull(sqStack) == 1) {
        printf("The stack is full,can no push\n");
        return -1;
    }
    sqList_push(sqStack->data, value);
    sqStack->topIndex++;
    sqStack->length++;
    return 0;
}

int sqStack_pop(SqStackPointer sqStack) {
    if (sqStack == NULL) {
        printf("The params is \n");
        return -1;
    }
    if (sqStack_isEmpty(sqStack) == 1) {
        printf("The stack is empty,can no pop\n");
        return -1;
    }
    int result = sqList_pop(sqStack->data);
    sqStack->topIndex--;
    sqStack->length--;
    return result;
}

int sqStack_traverse(SqStackPointer sqStack) {
	if (sqStack == NULL || sqStack->data == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	sqList_traverse(sqStack->data);
	return 0;
}
