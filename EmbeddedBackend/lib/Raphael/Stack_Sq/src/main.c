#include <stdio.h>
#include <stdlib.h>
#include "SqList.h"
#include "SqStack.h"

void testPush(SqStackPointer sqStack) {
    sqStack_push(sqStack, 1);
    sqStack_push(sqStack, 2);
    sqStack_push(sqStack, 3);
    sqStack_traverse(sqStack);
    printf("\n");
}

void testPop(SqStackPointer sqStack) {
    while (sqStack->topIndex != -1) {
        int result = sqStack_pop(sqStack);
        printf("%d\n", result);
    }
    printf("\n");
}

int main() {
    SqStackPointer sqStack = sqStack_create(NULL, 10);
    testPush(sqStack);
    testPop(sqStack);
    sqStack_destroyed(&sqStack);
    printf("%p\n", sqStack);
    return 0;
}