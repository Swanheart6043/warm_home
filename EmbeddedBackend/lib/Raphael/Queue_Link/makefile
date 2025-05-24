./build/LinkQueue:./build/main.o ./build/LinkQueue.o ./lib/libLinkList.a
	gcc ./build/main.o ./build/LinkQueue.o -L./lib -lLinkList -o ./build/LinkQueue
./build/main.o:./src/main.c
	gcc -c ./src/main.c -o ./build/main.o
./build/LinkQueue.o:./src/LinkQueue.c
	gcc -c ./src/LinkQueue.c -o ./build/LinkQueue.o