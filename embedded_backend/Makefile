CC = gcc
CFLAGS = -Wall -O2 -static
TARGET = ./build/led.cgi
SOURCES = ./src/led.c ./src/cJSON.c

$(TARGET): $(SOURCES)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCES) -lm
