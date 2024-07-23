CC = gcc
TARGET = $(patsubst src/%.c, bin/%, $(SRC))
SRC = $(wildcard src/day*.c)
OBJ = $(patsubst src/%.c, obj/%.o, $(SRC))


default: $(TARGET)

clean:
	rm -f obj/* bin/*

$(TARGET): $(OBJ)
	$(CC) -g3 -o $@ $?

obj/%.o: src/%.c
	$(CC) -c $< -o $@ -Iinclude


