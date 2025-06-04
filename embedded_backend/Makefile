CC = gcc
CJSON_INC = ../embedded_common/lib/cjson
CJSON_LIB = ../embedded_common/lib/cjson
CFLAGS = -Wall -Wextra -O2 -I$(CJSON_INC)

BUILD_DIR = ./build
SRC_DIR = ./src
TOOLS_DIR = $(SRC_DIR)/tools
DEPLOY_DIR = /boa/cgi-bin

COMMON_SRCS = $(TOOLS_DIR)/format_response.c $(CJSON_LIB)/cJSON.c

CGIS = control.cgi control_lamp.cgi control_speakers.cgi control_fan.cgi control_lamp_special.cgi environment.cgi
TARGETS = $(addprefix $(BUILD_DIR)/, $(CGIS))

$(BUILD_DIR)/control.cgi: $(SRC_DIR)/control.c $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/control_lamp.cgi: $(SRC_DIR)/control_lamp.c $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/control_speakers.cgi: $(SRC_DIR)/control_speakers.c $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/control_fan.cgi: $(SRC_DIR)/control_fan.c $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/control_lamp_special.cgi: $(SRC_DIR)/control_lamp_special.c $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

$(BUILD_DIR)/environment.cgi: $(SRC_DIR)/environment.c $(COMMON_SRCS)
	$(CC) $(CFLAGS) -o $@ $^

all: $(TARGETS)

deploy: all
	@echo "Deploying CGI files to $(DEPLOY_DIR)..."
	cp $(TARGETS) $(DEPLOY_DIR)
	@echo "Done."

clean:
	rm -f $(TARGETS)
