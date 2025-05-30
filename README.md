# 云控智家
一个只能家居项目

# 项目架构
见docs目录中的architecture中的架构图

# 代码结构
doc - 文档
embedded_apps - 嵌入式应用层  
embedded_backend - 嵌入式后端

# 项目技术栈
嵌入式：c/c++ boa cjson 消息队列 共享内存  
web后端：java spring  
web前端：react antd vite  

# 问题总结
### CGI中使用JSON
安装cjson

### JSON通信响应格式不统一
创建统一格式的函数

### CGI中无法使用websoket，给前端发消息，且前端不是由cgi实现
使用长轮询方式，后续优化将cgi换掉

### 硬件控制页，首次进去看不到硬件的状态，不知道硬件开了没
使用2个消息队列，一个请求队列，一个响应队列，分别对应get和post请求