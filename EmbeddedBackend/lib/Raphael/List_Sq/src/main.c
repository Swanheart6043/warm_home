#include <stdio.h>
#include "SqList.h"

int testCreate() {
	SqLink sqList = sqList_create(NULL, 100);
	if (sqList == NULL) {
		return 0;
	}
	if (sqList->list == NULL ) {
		return 0;
	}
	return 1;
}

int testDestroyed() {
	SqLink sqList = sqList_create(NULL, 100);
	sqList_destroyed(&sqList);
	printf("%p\n", sqList);
	if (sqList != NULL) {
		return 0;
	}
	return 1;
}

void testPush() {
	SqLink sqList = sqList_create(NULL, 100);
	sqList_push(sqList, 1);
	sqList_push(sqList, 2);
	sqList_push(sqList, 3);
	sqList_traverse(sqList);
	printf("\n");
	sqList_destroyed(&sqList);
	printf("%p\n", sqList);
}

void testPop(SqLink sqList) {
	while (sqList->length != 0) {
		int result = sqList_pop(sqList);
		printf("%d\n", result);
	}
	printf("\n");
}

void testShift(SqLink sqList) {
	sqList_shift(sqList, 1);
	sqList_shift(sqList, 2);
	sqList_shift(sqList, 3);
	sqList_traverse(sqList);
	printf("\n");
}

void testUnShift(SqLink sqList) {
	while (sqList->length != 0) {
		int result = sqList_unShift(sqList);
		printf("%d\n", result);
	}
	printf("\n");
}

void testRemoveDuplicate() {
	SqLink sqList = sqList_create(NULL, 100);
	sqList_push(sqList, 1);
	sqList_push(sqList, 1);
	sqList_push(sqList, 1);
	sqList_push(sqList, 2);
	sqList_push(sqList, 3);
	sqList_push(sqList, 4);
	sqList_push(sqList, 4);
	sqList_push(sqList, 5);
	sqList_push(sqList, 6);
	sqList_removeDuplicate(sqList);
	sqList_traverse(sqList);
	sqList_destroyed(&sqList);
}

void testSqListMerge() {
	SqLink sqListA = sqList_create(NULL, 100);
	SqLink sqListB = sqList_create(NULL, 100);
	sqList_push(sqListA, 1);
	sqList_push(sqListA, 2);
	sqList_push(sqListA, 3);
	sqList_push(sqListA, 4);
	sqList_push(sqListB, 4);
	sqList_push(sqListB, 5);
	sqList_push(sqListB, 6);
	sqList_push(sqListB, 7);
	sqList_merge(sqListA, sqListB);
	sqList_removeDuplicate(sqListA);
	for (int i = 0; i < sqListA->length; i++) {
		printf("%d", sqListA->list[i]);
	}
	printf(" ");
	for (int i = 0; i < sqListB->length; i++) {
		printf("%d", sqListB->list[i]);
	}
	printf("\n");
	sqList_destroyed(&sqListA);
	sqList_destroyed(&sqListB);
}

int main() {
	testRemoveDuplicate();
	printf("\n");
	testSqListMerge();
	return 0;
}
