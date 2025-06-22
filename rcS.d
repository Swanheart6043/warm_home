#!/bin/sh
echo "Loading LED driver..."
insmod /warm_home/led.ko
if [ $? -eq 0 ]; then
    echo "LED driver loaded successfully"
else
    echo "Failed to load LED driver"
fi

echo "Loading Buzzer driver..."
insmod /warm_home/buzzer.ko
if [ $? -eq 0 ]; then
    echo "Buzzer driver loaded successfully"
else
    echo "Failed to load Buzzer driver"
fi

echo "Touch control.txt..."
touch /tmp/control.txt

echo "Touch evn.txt..."
touch /tmp/env.txt

echo "Loading App..."
./warm_home/warm_home_app

echo "Loading Backend..."
./boa/boa

# 编辑 /etc/init.d/rcS 或创建新的启动脚本
# vi /etc/init.d/rcS
# 设置可执行权限
# chmod +x /etc/init.d/led-driver