#include "../../embedded_common/include/message.h"
#include "../../embedded_common/include/shared_memory.h"

void led(MessageBody);
void* buzzer_thread(void*);
void* fan_thread(void*);
void* collection_thread(void*);
Mpu6050Data collection_mpu6050();
ZeeBigData collection_zeebig();
int set_com_config(int, int, int, char, int);
int open_port(char*);
void USB_UART_Config(char*, int);