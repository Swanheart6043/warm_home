# 暖宅
一个智能家居项目

# 市场可行性分析

# 商业定位
消费电子 分享经济

# 商业计划
见脑图

# 项目架构
见docs目录中的architecture中的架构图

# 代码结构
doc - 文档  
embedded_apps - 嵌入式应用层  
embedded_backend - 嵌入式后端  
embedded_common - 嵌入式公共代码  
embedded_drivers - 嵌入式驱动  
embedded_server - boa源码  
web_frontend - web前端页面  
web_frontend_mini_program - 小程序(后续支持)  
web_backend - web java后端服务器(后续支持)  

# 项目技术栈
嵌入式：c/c++ boa cjson 多线程 消息队列 共享内存 zeebig IIC ADC PWM 串口 视频流  
web前端：react antd vite axios  
web后端：java spring  

# 操作手册
见docs目录

# 问题总结
### cgi中使用JSON
安装cjson

### cgi中的缺少引用也不会报错，只会变成502看不出是什么引起
把所有警告弄好

### cgi中不能放while无限循环去接收消息
让前端去轮询

### cgi中无法使用websoket，给前端推送环境信息，且前端不是由cgi实现
使用轮询方式，后续优化将cgi换掉

### JSON通信响应格式不统一
创建统一格式的函数

### 各个端需要数据格式不一样
由服务端cgi层去转格式，前端不转，app层不转，驱动层更不可能转

### cgi如何给独立的前端传输视频？
不用cgi，前端去请求视频流服务

### 硬件控制页，首次进去看不到硬件的状态，不知道硬件开了没
使用管道

### 编译器不同，对c99语法的支持会有问题
全部c代码都不使用随用随定义，c++代码可以写

### Makefile中增加平台判断
增加makefile变量

### embedded_backend改造
换成cpp，使用现代web服务器路由

### 增加qt

### 增加数据库

### c语言缺少一些方便的库
- 打印结构体
- 打印字符串
- 打印森林数组
