CC = g++
CFLAGS = -Wall -I./src
SRC_DIR = src
BUILD_DIR = build
TARGET = $(BUILD_DIR)/app

# 搜索src目录下所有.cpp文件
SRCS = $(wildcard $(SRC_DIR)/*.cpp) 
OBJS = $(patsubst $(SRC_DIR)/%.cpp, $(BUILD_DIR)/%.o, $(SRCS))

# 默认目标
all: $(TARGET)

# 链接目标
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

# 编译每个.cpp文件到.o
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# 清理编译生成的文件
clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean