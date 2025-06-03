CC = gcc
CJSON_INC = ../embedded_common/lib/cjson
CJSON_LIB = ../embedded_common/lib/cjson
CFLAGS = -Wall -Wextra -O2 -I$(CJSON_INC)
SOURCES = ./src/control_lamp.c ./src/tools/format_response.c ../embedded_common/lib/cjson/cJSON.c
TARGET = ./build/control_lamp.cgi

$(TARGET): $(SOURCES)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCES)
