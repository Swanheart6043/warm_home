typedef struct {
    char* operate;
    unsigned short which;
} MessageBody;

typedef struct { 
    long type; 
    MessageBody body;
} Message;
