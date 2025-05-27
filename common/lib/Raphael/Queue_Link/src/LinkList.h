typedef struct node {
    int data;
    struct node* next;
}linkList, *linkListPointer;

linkListPointer linkList_create(int*, int);

int linkList_destroyed(linkListPointer*);

int linkList_push(linkListPointer, int);

int linkList_pop(linkListPointer*);

int linkList_shift(linkListPointer*, int);

int linkList_unShift(linkListPointer*);

linkListPointer linkList_findByIndex(linkListPointer, int);

linkListPointer linkList_findByValue(linkListPointer, int);

int linkList_insert(linkListPointer, int, int);

int linkList_remove(linkListPointer, int);

int linkList_update(linkListPointer, int, int);

int linkList_sort(linkListPointer);

int linkList_traverse(linkListPointer);

int linkList_isEmpty(linkListPointer);

int linkList_getLength(linkListPointer);