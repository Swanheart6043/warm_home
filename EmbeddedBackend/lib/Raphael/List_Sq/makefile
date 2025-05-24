./build/SqList:./build/main.o ./build/SqList.o
	gcc ./build/main.o ./build/SqList.o -o ./build/SqList
./build/main.o:./src/main.c
	gcc -c ./src/main.c -o ./build/main.o
./build/SqList.o:./src/SqList.c
	gcc -c ./src/SqList.c -o ./build/SqList.o
lib:
	ar -cr ./build/libSqList.a ./build/SqList.o
clear:
	rm ./build/*.o