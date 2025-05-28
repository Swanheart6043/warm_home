# 变量定义
CC = gcc
CFLAGS = -Wall -I./src
SRC_DIR = src
BUILD_DIR = build
TARGET = $(BUILD_DIR)/app

# 搜索 src 目录下所有 .c 文件
SRCS = $(wildcard $(SRC_DIR)/*.c)
OBJS = $(patsubst $(SRC_DIR)/%.c, $(BUILD_DIR)/%.o, $(SRCS))

# 默认目标
all: $(TARGET)

# 链接目标
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

# 编译每个 .c 文件到 .o
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# 清理编译生成的文件
clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean