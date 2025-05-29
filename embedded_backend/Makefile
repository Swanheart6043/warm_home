CC = gcc
CJSON_INC = ../embedded_common/include
CJSON_LIB = ../embedded_common/lib
CFLAGS = -Wall -Wextra -O2 -I$(CJSON_INC)
LDFLAGS = -L$(CJSON_LIB) -lcjson
SOURCES = ./src/led.c
TARGET = ./build/led.cgi

$(TARGET): $(SOURCES)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCES) $(LDFLAGS)
