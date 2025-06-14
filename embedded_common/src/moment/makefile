./build/Moment:./build/main.o ./build/Moment.o
	gcc ./build/main.o ./build/Moment.o -o ./build/Moment
./build/main.o:./src/main.c
	gcc -c ./src/main.c -o ./build/main.o
./build/Moment.o:./src/Moment.c
	gcc -c ./src/Moment.c -o ./build/Moment.o
lib:
	ar -cr ./build/libMoment.a ./build/Moment.o
clear:
	rm ./build/*.o