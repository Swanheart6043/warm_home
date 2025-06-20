#include "../../embedded_common/include/message.h"
#include "../../embedded_common/include/shared_memory.h"

void led(MessageBody);
void* buzzer_thread(void*);
void* fan_thread(void*);
void* collection_thread(void*);
Mpu6050Data mpu6050();
ZeeBigData temperature();
int set_com_config(int, int, int, char, int);
int open_port(char*);
void USB_UART_Config(char*, int);