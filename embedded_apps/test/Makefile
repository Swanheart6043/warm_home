CC = arm-none-linux-gnueabi-gcc
CFLAGS = -I../../include -Wall -O2

TARGET = temperature_test fan_test

all:
	$(CC) $(CFLAGS) fan_test.c ../../src/common.c -o $(TARGET)

deploy:
	mv fan_test ~/nfs/4412

all:
	$(CC) $(CFLAGS) temperature_test.c ../../src/common.c -o $(TARGET)

deploy:
	mv temperature_test ~/nfs/4412