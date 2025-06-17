#include "../../embedded_common/include/message.h"

void led(MessageBody);
void* buzzer_thread(void*);
void* fan_thread(void*);
void* collection_thread(void*);
int set_com_config(int fd, int baud_rate, int data_bits, char parity, int stop_bits);
int open_port(char* com_port);
void USB_UART_Config(char* path, int baud_rate);