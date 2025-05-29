CC = gcc
CJSON_INC = ./lib/cjson
CJSON_LIB = ./lib/cjson
CFLAGS = -Wall -Wextra -O2 -I$(CJSON_INC)
SOURCES = ./src/led.c ./lib/cjson/cJSON.c
TARGET = ./build/led.cgi

$(TARGET): $(SOURCES)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCES)
