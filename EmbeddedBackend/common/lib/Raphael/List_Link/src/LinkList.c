#include <stdio.h>
#include <stdlib.h>
#include "LinkList.h"

LinkListPointer linkList_create(int* initialArray, int initialLength) {
    LinkListPointer linkList = (LinkListPointer)malloc(sizeof(LinkList));
    if (linkList == NULL) {
        return NULL;
    }
    linkList->data = -1;
    linkList->next = NULL;
    if (initialArray != NULL && initialLength != 0) {
        for (int i = 0; i < initialLength; i++) {
            linkList_push(linkList, initialArray[i]);
        }
    }
    return linkList;
}

int linkList_destroyed(LinkListPointer* linkList) {
    if (linkList == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    LinkListPointer tempPointer = NULL;
    while ((*linkList)->next != NULL) {
        tempPointer = *linkList;
        *linkList = (*linkList)->next;
        free(tempPointer);
    }
    free(*linkList);
    *linkList = NULL;
    return 0;
}

int linkList_push(LinkListPointer linkList, int value) {
    if (linkList == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    LinkListPointer pointer = linkList;
    while(pointer->next != NULL) {
        pointer = pointer->next;
    }
    LinkListPointer item = (LinkListPointer)malloc(sizeof(linkList));
    if (item == NULL) {
        printf("The linkList push is failed\n");
        return -1;
    }
    item->data = -1;
    item->next = NULL;
    pointer->data = value;
    pointer->next = item;
    return 0;
}

int linkList_pop(LinkListPointer* linkList) {
    if (*linkList == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    LinkListPointer previousPointer = *linkList;
    LinkListPointer currentPointer = *linkList;
    int data = 0;
    while(currentPointer->next != NULL && currentPointer->next->data != -1) {
        previousPointer = currentPointer;
        currentPointer = currentPointer->next;
    }
    data = currentPointer->data;
    previousPointer->next = currentPointer->next;
    if (currentPointer == *linkList) {
        *linkList = currentPointer->next;
    }
    free(currentPointer);
    currentPointer = NULL;
    previousPointer = NULL;
    return data;
}

int linkList_shift(LinkListPointer* linkList, int value) {
    if (*linkList == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    LinkListPointer pointer = *linkList;
    LinkListPointer item = (LinkListPointer)malloc(sizeof(*linkList));
    if (item == NULL) {
        printf("The linkList push is failed\n");
        return -1;
    }
    item->data = value;
    item->next = *linkList;
    *linkList = item;
    return 0;
}

int linkList_unShift(LinkListPointer* linkList) {
    if (*linkList == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    int data = (*linkList)->data;
    LinkListPointer pointer = *linkList;
    *linkList = (*linkList)->next;
    free(pointer);
    pointer = NULL;
    return data;
}

LinkListPointer linkList_findByIndex(LinkListPointer linkList, int index) {
    if (linkList == NULL) {
        return NULL;
    }
    LinkListPointer tempPointer = linkList;
    int count = 0;
    while(tempPointer->next != NULL) {
        tempPointer = tempPointer->next;
        count++;
        if (count >= index) {
            return tempPointer;
        }
    }
    if (index > count) {
        return NULL;
    }
    return tempPointer;
}

LinkListPointer linkList_findByValue(LinkListPointer linkList, int value) {
    if (linkList == NULL) {
        return NULL;
    }
    LinkListPointer tempPointer = linkList;
    while(tempPointer->next != NULL) tempPointer = tempPointer->next;
    return tempPointer;
}

int linkList_insert(LinkListPointer p, int value, int index) {
    if (p == NULL) {
        return -1;
    }
    return 0;
}

int linkList_remove(LinkListPointer linkList, int index) {
    if (linkList == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    LinkListPointer result = linkList_findByIndex(linkList, index - 1);
    if (result == NULL) {
        printf("Can not find target\n");
        return -1;
    }
    if (result->next == NULL) {
        printf("The link list is empty\n");
        return -1;
    }
    LinkListPointer current = result->next;
    result->next = current->next;
    free(current);
    current = NULL;
    return 0;
}

int linkList_update(LinkListPointer p, int value, int index) {
    if (p == NULL) {
        return -1;
    }
    return 0;
}

int linkList_sort(LinkListPointer linkList) {
    if (linkList == NULL) {
        printf("The parameter is invalid\n");
        return -1;
    }
    LinkListPointer p = linkList;
    LinkListPointer q = linkList;
    int temp = 0;
    while (p->next != NULL) {
        while(q->next != NULL) {
            if (q->data < p->data) {
                temp = p->data;
                p->data = q->data;
                q->data = temp;
            }
            q = q->next;
        }
        p = p->next;    
        q = p;
    }
    return 0;
}

int linkList_traverse(LinkListPointer linkList) {
    if (linkList == NULL) {
        printf("The link list does not exist\n");
        return -1;
    }
    if (linkList->next ==  NULL) {
        printf("[]\n");
        return 0;
    }
    LinkListPointer tempPointer = linkList;
    while(tempPointer->next != NULL) {
        printf("{ ");
        printf("%d", tempPointer->data);
        printf(", ");
        printf("%p", tempPointer->next);
        printf(" }");
        printf("\n");
        tempPointer = tempPointer->next;
    }
    return 0;
}

int linkList_isEmpty(LinkListPointer linkList) {
    return linkList->next == NULL ? 1 : 0;
}

int linkList_getLength(LinkListPointer linkList) {
    int count = 0;
    LinkListPointer tempPointer = linkList;
    while(linkList_isEmpty(tempPointer) == 0) {
        count++;
        tempPointer = tempPointer->next;
    }
    return count;
}
