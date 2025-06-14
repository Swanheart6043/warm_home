typedef struct node {
    int data;
    struct node* next;
}LinkList, *LinkListPointer;

LinkListPointer linkList_create(int*, int);

int linkList_destroyed(LinkListPointer*);

int linkList_push(LinkListPointer, int);

int linkList_pop(LinkListPointer*);

int linkList_shift(LinkListPointer*, int);

int linkList_unShift(LinkListPointer*);

LinkListPointer linkList_findByIndex(LinkListPointer, int);

LinkListPointer linkList_findByValue(LinkListPointer, int);

int linkList_insert(LinkListPointer, int, int);

int linkList_remove(LinkListPointer, int);

int linkList_update(LinkListPointer, int, int);

int linkList_sort(LinkListPointer);

int linkList_traverse(LinkListPointer);

int linkList_isEmpty(LinkListPointer);

int linkList_getLength(LinkListPointer);