#include <stdio.h>
#include <stdlib.h>
#include "LinkList.h"
#include "LinkStack.h"

void testPush(LinkStackPointer linkStack) {
    int input = 0;
    while(1) {
        scanf("%d", &input);
        if (input == -1) {
            printf("\n");
            break;
        }
        linkStack_push(linkStack, input);
    }
    linkStack_traverse(linkStack);
    printf("\n");
}

void testPop(LinkStackPointer linkStack) {
    while(linkStack->topIndex != -1) {
        int result = linkStack_pop(linkStack);
        printf("%d\n", result);
    }
    printf("\n");
}

int main() {
    LinkStackPointer linkStack = linkStack_create(NULL, 0);
    testPush(linkStack);
    testPop(linkStack);
    linkStack_destroyed(&linkStack);
    printf("%p\n", linkStack);
    return 0;
}