#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "SqList.h"

SqLink sqList_create(Item* initialArray, int maxLength) {
	if (maxLength == 0) {
        printf("The maxLength can not be 0\n");
        return NULL;
    }
	SqLink sqList = (SqLink)malloc(sizeof(SqLink));
	if (sqList == NULL) {
		printf("The sqList create failed\n");
		return NULL;
	}
	Item* list = (Item*)malloc(sizeof(Item) * maxLength);
	if (list == NULL) {
		printf("The sqList create failed\n");
		free(sqList);
		return NULL;
	}
	sqList->list = list;
	sqList->maxLength = maxLength;
	sqList->length = 0;
	sqList->lastIndex = -1;
	if (initialArray != NULL) {
		memset(sqList->list, 0, sizeof(initialArray));
	} else {
		memset(sqList->list, 0, sizeof(SqLink));
	}
	return sqList;
}

int sqList_destroyed(SqLink* sqList) {
	if (*sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	free(*sqList);
	*sqList = NULL;
	return 0;
}

int sqList_getLength(SqLink sqList) {
	return 0;
}

int sqList_isFull(SqLink sqList) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	return -1;
}

int sqList_isEmpty(SqLink sqList) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	return 1;
}

int sqList_push(SqLink sqList, int value) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	sqList->list[sqList->length] = value;
	sqList->lastIndex++;
	sqList->length++;
	return 0;
}

int sqList_pop(SqLink sqList) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	int result = sqList->list[sqList->length-1];
	sqList->list[sqList->length-1] = 0;
	sqList->lastIndex--;
	sqList->length--;
	return result;
}

int sqList_shift(SqLink sqList, int value) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	// move
	// TODO
	// ...
	sqList->list[0] = value;
	sqList->lastIndex++;
	sqList->length++;
	return 0;
}

int sqList_unShift(SqLink sqList) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	int result = sqList->list[0];
	sqList->list[0] = 0;
	sqList->lastIndex--;
	sqList->length--;
	// move
	// TODO
	// ...
	return result;
}

int sqList_traverse(SqLink sqList) {
	if (sqList == NULL || sqList->list == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	for (int i = 0; i < sqList->length; i++) {
		printf("%d\n", sqList->list[i]);
	}
	return 0;
}

int sqList_insert(SqLink sqList, int value, int index) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	if (index < 0 || index > sqList->length) {
		printf("The index is invalid\n");
		return -1;
	}
	sqList->list[index] = value;
	sqList->lastIndex++;
	sqList->length++;
	return 0;
}

int sqList_remove(SqLink sqList, int index) {
	if (sqList == NULL) {
		return -1;
	}
	for (int i = index; i < sqList->length; i++) {
		sqList->list[i] = i == sqList->length - 1 ? 0 : sqList->list[i+1];
	}
	sqList->length--;
	sqList->lastIndex--;
	return 0;
}

int sqList_update(SqLink sqList, Item value, int index) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	if (index < 0 || index > sqList->length) {
		printf("The index is invalid\n");
		return -1;
	}
	sqList->list[index] = value;
	return 0;
}

int sqList_find(SqLink sqList, Item value) {
	return 1;
}

int sqList_findIndex(SqLink sqList, Item value) {
	return 1;
}

int sqList_removeDuplicate(SqLink sqList) {
	if (sqList == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	for (int i = 1; i < sqList->length; i++) {
		int item = sqList->list[i];
		for (int j = i-1; j >= 0; j--) {
			int subItem = sqList->list[j];
			if (item == subItem) {
				sqList_remove(sqList, i);
				i--;		
			}
		}
	}
	return 0;
}

int sqList_merge(SqLink sqListA, SqLink sqListB) {
	if (sqListA == NULL || sqListA == NULL) {
		printf("The parameter is invalid\n");
		return -1;
	}
	// Check length when listA max length lt arrayB length
	int remainingLength = sqListA->maxLength - sqListA->length;
	if (remainingLength < sqListB->length) {
		printf("The listA remaining length is less than the length of the listB");
		return -1;
	}
	// to merge
	for (int i = 0; i < sqListB->length; i++) {
		sqList_push(sqListA, sqListB->list[i]);
	}
	return 0;
}

int sqList_clear(SqLink sqList) {
	return 0;
}