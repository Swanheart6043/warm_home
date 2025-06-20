CC = arm-none-linux-gnueabi-gcc
CFLAGS = -Wall -I./src
SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build
TARGET = $(BUILD_DIR)/warm_home_app
TEST_TARGET = $(BUILD_DIR)/warm_home_app_test

# 搜索src目录下所有.cpp文件
SRCS = $(wildcard $(SRC_DIR)/*.c) 
OBJS = $(patsubst $(SRC_DIR)/%.c, $(BUILD_DIR)/%.o, $(SRCS))

# 测试源文件
TEST_SRCS = $(TEST_DIR)/main.c
TEST_OBJS = $(patsubst $(TEST_DIR)/%.c, $(BUILD_DIR)/test_%.o, $(TEST_SRCS))

# 默认目标
all: $(TARGET)

# 测试目标
test: $(TEST_TARGET)

# 链接目标
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^ -lpthread

# 链接测试目标
$(TEST_TARGET): $(TEST_OBJS)
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -o $@ $^ -lpthread

# 编译每个 .c 文件到 .o
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# 编译test目录下的 .c 文件到 .o（添加test_前缀避免冲突）
$(BUILD_DIR)/test_%.o: $(TEST_DIR)/%.c
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# 清理编译生成的文件
clean:
	rm -rf $(BUILD_DIR)

.PHONY: all test clean
