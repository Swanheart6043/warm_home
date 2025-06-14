#include <stdio.h>
#include "LinkList.h"

void testPush(LinkListPointer linkList) {
    int input = 0;
    while(1) {
        scanf("%d", &input);
        if (input == -1) {
            printf("\n");
            break;
        }
        linkList_push(linkList, input);
    }
    linkList_traverse(linkList);
}

void testPop(LinkListPointer* linkList) {
    LinkListPointer tempPointer = *linkList;
    while(linkList_isEmpty(tempPointer) == 0) {
        tempPointer = tempPointer->next;
        int result = linkList_pop(linkList);
        printf("%d \n", result);
    }
    printf("\n");
}

void testShift(LinkListPointer* linkList) {
    int input = 0;
    while(1) {
        scanf("%d", &input);
        if (input == -1) {
            printf("\n");
            break;
        }
        linkList_shift(linkList, input);
    }
    linkList_traverse(*linkList);
}

void testUnShift(LinkListPointer* linkList) {
    LinkListPointer tempPointer = *linkList;
    while(linkList_isEmpty(tempPointer) == 0) {
        tempPointer = tempPointer->next;
        int result = linkList_unShift(linkList);
        printf("%d \n", result);
    }
    printf("\n");
}

int main() {
    LinkListPointer linkList = linkList_create(NULL, 0);
    testPush(linkList);
    testPop(&linkList);
    // testShift(&linkList);
    // testUnShift(&linkList);
    linkList_destroyed(&linkList);
    printf("%p\n", linkList);
    return 0;
}