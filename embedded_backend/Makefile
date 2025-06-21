CC = arm-none-linux-gnueabi-gcc
CFLAGS = -Wall -I./include -I./src/utils -I./src/cjson
SRC_DIR = src
UTILS_DIR = src/utils
CJSON_DIR = src/cjson
BUILD_DIR = build

# 搜索src目录下的.c文件（排除utils和cjson子目录）
MAIN_SRCS = $(filter-out $(UTILS_DIR)/%.c $(CJSON_DIR)/%.c, $(wildcard $(SRC_DIR)/*.c))
# 搜索公共库文件
UTILS_SRCS = $(wildcard $(UTILS_DIR)/*.c)
CJSON_SRCS = $(wildcard $(CJSON_DIR)/*.c)

# 生成CGI目标文件名（去掉.c扩展名，添加.cgi）
CGI_TARGETS = $(patsubst $(SRC_DIR)/%.c, $(BUILD_DIR)/%.cgi, $(MAIN_SRCS))

# 生成公共库的对象文件
UTILS_OBJS = $(patsubst $(UTILS_DIR)/%.c, $(BUILD_DIR)/utils_%.o, $(UTILS_SRCS))
CJSON_OBJS = $(patsubst $(CJSON_DIR)/%.c, $(BUILD_DIR)/cjson_%.o, $(CJSON_SRCS))
COMMON_OBJS = $(UTILS_OBJS) $(CJSON_OBJS)

# 默认目标：编译所有CGI文件
all: $(CGI_TARGETS)

# 为每个CGI目标创建规则
$(BUILD_DIR)/%.cgi: $(SRC_DIR)/%.c $(COMMON_OBJS)
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -o $@ $< $(COMMON_OBJS)

# 编译utils目录下的源文件
$(BUILD_DIR)/utils_%.o: $(UTILS_DIR)/%.c
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# 编译cjson目录下的源文件
$(BUILD_DIR)/cjson_%.o: $(CJSON_DIR)/%.c
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# 清理编译生成的文件
clean:
	rm -rf $(BUILD_DIR)

# 显示将要编译的目标文件（调试用）
show-targets:
	@echo "Main sources: $(MAIN_SRCS)"
	@echo "Utils sources: $(UTILS_SRCS)"
	@echo "Cjson sources: $(CJSON_SRCS)"
	@echo "CGI targets: $(CGI_TARGETS)"
	@echo "Common objects: $(COMMON_OBJS)"

# 部署CGI文件到web服务器目录
deploy: all
	sudo cp $(BUILD_DIR)/*.cgi ~/nfs/4412/boa/cgi-bin/
	@echo "CGI files deployed to ~/nfs/4412/boa/cgi-bin/"

.PHONY: all clean show-targets deploy