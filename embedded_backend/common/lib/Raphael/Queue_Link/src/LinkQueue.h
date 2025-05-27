typedef struct {
    linkListPointer front;
    int rear;
}LinkQueue, *LinkQueuePointer;

LinkQueuePointer linkQueue_create();

int linkQueue_destroyed(LinkQueuePointer*);

int linkQueue_isEmpty(LinkQueuePointer);

int linkQueue_enQueue(LinkQueuePointer, int);

int linkQueue_deQueue(LinkQueuePointer);

int linkQueue_traverse(LinkQueuePointer);