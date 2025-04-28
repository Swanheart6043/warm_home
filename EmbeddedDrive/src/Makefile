ifeq ($(KERNELRELEASE),)

ifeq ($(ARCH),arm)
KERNELDIR ?= /home/linux/fs4412/linux-3.14
ROOTFS ?= /opt/4412/rootfs
else
KERNELDIR ?= /lib/modules/$(shell uname -r)/build
endif
PWD := $(shell pwd)


modules:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) modules

modules_install:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) modules INSTALL_MOD_PATH=$(ROOTFS) modules_install

clean:
	rm -rf  *.o  *.ko  .*.cmd  *.mod.*  modules.order  Module.symvers   .tmp_versions

else
CONFIG_MODULE_SIG=n
obj-m += myhello.o

obj-m += xtt.o
xtt-objs = test.o func.o

obj-m += testparam.o

obj-m += mychar_sema.o

obj-m += multimychar.o

obj-m += openonce_atomic.o

obj-m += openonce_spinlock.o

obj-m += mychar_mutex.o

obj-m += second.o

obj-m += leddrv.o

endif

