#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define LINE_LENGTH 1000

char *concat(const char *s1, const char *s2) {
  // +1 for the null-terminator
  char *result = malloc(strlen(s1) + strlen(s2));

  if (result == NULL) {
    fprintf(stderr, "Unable to allocate memory for concat");
    exit(EXIT_FAILURE);
  }

  strcpy(result, s1);
  strcat(result, s2);

  return result;
}

int parseDigitDay1(char *line) {
  char digit[2];
  int left = 0;
  int right = strlen(line) - 1;
  bool left_found = false;
  bool right_found = false;

  while (left <= right || !left_found || !right_found) {
    if (isdigit(line[left])) {
      digit[0] = line[left];
      left_found = true;
    }

    if (isdigit(line[right]) && !right_found) {
      digit[1] = line[right];
      right_found = true;
    }

    if (!left_found) {
      left++;
    }
    if (!right_found) {
      right--;
    }
    if (left_found && right_found) {
      break;
    }
  }

  return atoi(digit);
}

int parseDigitDay2(char *line) {
  // print
  return 0;
}

int main(int argc, char *argv[]) {
  if (argc < 2) {
    fprintf(stderr, "Provide filename\n");
    fprintf(stderr, "Usage: %s <filename> \n", argv[0]);
    exit(EXIT_FAILURE);
  }

  char *filename = argv[1];
  FILE *fptr = fopen(filename, "r");

  if (fptr == NULL) {
    perror("fopen");
    exit(EXIT_FAILURE);
  }

  int day_1_solution = 0;
  int day_2_solution = 0;
  char buf[LINE_LENGTH];
  while (fgets(buf, LINE_LENGTH, fptr) != NULL) {
    day_1_solution += parseDigitDay1(buf);
    day_2_solution += parseDigitDay2(buf);
  }

  printf("Day 1 Solution: %d\n", day_1_solution);

  exit(EXIT_SUCCESS);
}
