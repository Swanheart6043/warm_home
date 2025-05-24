./build/LinkList:./build/main.o ./build/LinkList.o
	gcc ./build/main.o ./build/LinkList.o -o ./build/LinkList
./build/main.o:./src/main.c
	gcc -c ./src/main.c -o ./build/main.o
./build/LinkList.o:./src/LinkList.c
	gcc -c ./src/LinkList.c -o ./build/LinkList.o
lib:
	ar -cr ./build/libLinkList.a ./build/LinkList.o
clear:
	rm ./build/*.o