./build/SqStack:./build/main.o ./build/SqStack.o ./lib/libSqList.a
	gcc ./build/main.o ./build/SqStack.o -L./lib -lSqList -o ./build/SqStack
./build/main.o:./src/main.c
	gcc -c ./src/main.c -o ./build/main.o
./build/SqStack.o:./src/SqStack.c
	gcc -c ./src/SqStack.c -o ./build/SqStack.o