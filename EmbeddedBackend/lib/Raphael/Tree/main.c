#include <stdio.h>
#include <stdlib.h>

typedef struct N {
    int data;
    Node* left;
    Node* right;
}Node, *NodePointer;


NodePointer createTree() {
    NodePointer result = (NodePointer)malloc(sizeof(Node));
    if (result == NULL) {
        return NULL;
    }
    return result;
}

int main() {
    createTree();
    return 0;
}
