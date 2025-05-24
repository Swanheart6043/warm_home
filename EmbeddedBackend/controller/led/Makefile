CC = gcc
CFLAGS = -Wall -O2 -static
TARGET = led.cgi
SOURCES = led.c cJSON.c

$(TARGET): $(SOURCES)
	$(CC) $(CFLAGS) -o $(TARGET) $(SOURCES) -lm

strip:
	strip $(TARGET)

clean:
	rm -f $(TARGET)