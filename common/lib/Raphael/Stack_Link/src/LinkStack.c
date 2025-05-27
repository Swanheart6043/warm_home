#include <stdio.h>
#include <stdlib.h>
#include "LinkList.h"
#include "LinkStack.h"

LinkStackPointer linkStack_create(int* initialArray, int initialLength) {
    LinkStackPointer linkStack = (LinkStackPointer)malloc(sizeof(LinkStack));
    if (linkStack == NULL) {
        printf("Create linkStack error\n");
        return NULL;
    }
    LinkListPointer linkList = linkList_create(initialArray, initialLength);
    if (linkList == NULL) {
        printf("Create linkStack error\n");
        free(linkStack);
        return NULL;
    }
    linkStack->length = 0;
    linkStack->topIndex = -1;
    linkStack->data = linkList;
    return linkStack;
}

int linkStack_destroyed(LinkStackPointer* linkStack) {
    if (*linkStack == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    linkList_destroyed(&((*linkStack)->data));
    (*linkStack)->data = NULL;
    free(*linkStack);
    *linkStack = NULL;
    return 0;
}

int linkStack_isEmpty(LinkStackPointer linkStack) {
    if (linkStack == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    return linkStack->topIndex == -1 ? 1 : 0;
}

int linkStack_push(LinkStackPointer linkStack, int value) {
    if (linkStack == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    linkList_push(linkStack->data, value);
    linkStack->topIndex++;
    linkStack->length++;
    return 0;
}

int linkStack_pop(LinkStackPointer linkStack) {
    if (linkStack == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    if (linkStack_isEmpty(linkStack) == 1) {
        printf("The stack is empty,can no pop\n");
        return -1;
    }
    int popValue = linkList_pop(&(linkStack->data));
    linkStack->topIndex--;
    linkStack->length--;
    return popValue;
}

int linkStack_traverse(LinkStackPointer linkStack) {
	if (linkStack == NULL || linkStack->data == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	linkList_traverse(linkStack->data);
	return 0;
}
