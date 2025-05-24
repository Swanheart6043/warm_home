typedef struct {
    SqLink data;
    int maxLength;
    int length;
    int topIndex;
}SqStack, *SqStackPointer;

SqStackPointer sqStack_create(Item*, int);

int sqStack_destroyed(SqStackPointer*);

int sqStack_isFull(SqStackPointer);

int sqStack_isEmpty(SqStackPointer);

int sqStack_push(SqStackPointer, int);

int sqStack_pop(SqStackPointer);

int sqStack_traverse(SqStackPointer);