typedef int Item;

typedef struct {
	Item* list;
	int length;
	int maxLength;
	int lastIndex;
}SqList, *SqLink;

SqLink sqList_create(Item*, int);

int sqList_destroyed(SqLink*);

int sqList_getLength(SqLink);

int sqList_isFull(SqLink);

int sqList_isEmpty(SqLink);

int sqList_push(SqLink, int);

int sqList_pop(SqLink);

int sqList_shift(SqLink, int);

int sqList_unShift(SqLink);

int sqList_insert(SqLink, int, int);

int sqList_remove(SqLink, int);

int sqList_update(SqLink, Item, int);

int sqList_traverse(SqLink);

int sqList_find(SqLink, Item);

int sqList_findIndex(SqLink, Item);

int sqList_removeDuplicate(SqLink);

int sqList_merge(SqLink, SqLink);

int sqList_clear(SqLink);
