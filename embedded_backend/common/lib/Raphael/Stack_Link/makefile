./build/LinkStack:./build/main.o ./build/LinkStack.o ./lib/libLinkList.a
	gcc ./build/main.o ./build/LinkStack.o -L./lib -lLinkList -o ./build/LinkStack
./build/main.o:./src/main.c
	gcc -c ./src/main.c -o ./build/main.o
./build/LinkStack.o:./src/LinkStack.c
	gcc -c ./src/LinkStack.c -o ./build/LinkStack.o