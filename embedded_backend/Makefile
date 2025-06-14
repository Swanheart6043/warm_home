CC = g++
CJSON_INC = ../embedded_common/lib/cjson
CJSON_LIB = ../embedded_common/lib/cjson
CFLAGS = -Wall -Wextra -O2 -I$(CJSON_INC)

BUILD_DIR = ./build
SRC_DIR = ./src
TOOLS_DIR = $(SRC_DIR)/tools
DEPLOY_DIR = /boa/cgi-bin

COMMON_SRCS = $(TOOLS_DIR)/format_response.cpp $(CJSON_LIB)/cJSON.c

CGIS = control.cgi lamp.cgi speakers.cgi fan.cgi lamp_special.cgi env.cgi
TARGETS = $(addprefix $(BUILD_DIR)/, $(CGIS))

$(BUILD_DIR)/control.cgi: $(SRC_DIR)/control.cpp $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/lamp.cgi: $(SRC_DIR)/lamp.cpp $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/speakers.cgi: $(SRC_DIR)/speakers.cpp $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/fan.cgi: $(SRC_DIR)/fan.cpp $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/lamp_special.cgi: $(SRC_DIR)/lamp_special.cpp $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/env.cgi: $(SRC_DIR)/env.cpp $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

all: $(TARGETS)

deploy: all
	@echo "Deploying CGI files to $(DEPLOY_DIR)..."
	cp $(TARGETS) $(DEPLOY_DIR)
	@echo "Done."

clean:
	rm -f $(TARGETS)
