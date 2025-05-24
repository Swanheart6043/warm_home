typedef struct {
    LinkListPointer data;
    int length;
    int topIndex;
}LinkStack, *LinkStackPointer;

LinkStackPointer linkStack_create(int*, int);

int linkStack_destroyed(LinkStackPointer*);

int linkStack_isEmpty(LinkStackPointer);

int linkStack_push(LinkStackPointer, int);

int linkStack_pop(LinkStackPointer);

int linkStack_traverse(LinkStackPointer);
