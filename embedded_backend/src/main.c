#define _GNU_SOURCE
#include <stdio.h>
#include <string.h>
#include "common.h"

static int str_equal(struct mg_str s, const char *str) {
    return s.len == strlen(str) && memcmp(s.buf, str, s.len) == 0;
}

static void ev_handler(struct mg_connection *c, int ev, void *ev_data) {
    if (ev == MG_EV_HTTP_MSG) {
        struct mg_http_message *hm = (struct mg_http_message *) ev_data;
        
        if (str_equal(hm->uri, "/control")) {
            control(hm->method.buf, hm->method.len, c);
            return;
        }
        if (str_equal(hm->uri, "/api/data")) {
            if (!str_equal(hm->method, "POST")) {
                mg_http_reply(c, 405, "", "Method Not Allowed");
                return;
            }
            printf("收到POST数据: %.*s\n", (int)hm->body.len, hm->body.buf);
            mg_http_reply(c, 200, "Content-Type: application/json\r\n","{\"received\":true}");
            return;
        }
        if (str_equal(hm->uri, "/api/data")) {
            if (!str_equal(hm->method, "POST")) {
                mg_http_reply(c, 405, "", "Method Not Allowed");
                return;
            }
            printf("收到POST数据: %.*s\n", (int)hm->body.len, hm->body.buf);
            mg_http_reply(c, 200, "Content-Type: application/json\r\n","{\"received\":true}");
            return;
        }
        mg_http_reply(c, 404, "", "Not Found");
    }
}

int main() {
    struct mg_mgr mgr; // 事件管理器
    struct mg_connection *c; // 连接对象
    
    // 初始化管理器
    mg_mgr_init(&mgr);
    
    // 启动HTTP服务器，监听8080端口
    c = mg_http_listen(&mgr, "http://192.168.1.200:8080", ev_handler, NULL);
    if (c == NULL) {
        printf("无法启动服务器\n");
        return 1;
    }
    
    printf("服务器启动成功: http://localhost:8080\n");
    printf("测试地址:\n");
    printf("http://localhost:8080/hello\n");
    
    for (;;) {
        mg_mgr_poll(&mgr, 1000); // 轮询事件，超时1000ms
    }
    
    mg_mgr_free(&mgr);
    return 0;
}