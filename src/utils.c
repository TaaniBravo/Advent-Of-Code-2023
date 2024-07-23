#include "utils.h"

char **read_file(char *filename, int *buf_out) {
  FILE *file;
  char buffer[256];
  char **lines = malloc(1000 * sizeof(char *));

  if (lines == NULL) {
    perror("Error allocating memory for lines array");
    exit(EXIT_FAILURE);
  }

  // Open a file in read mode
  file = fopen(filename, "r");
  if (file == NULL) {
    perror("Error opening file");
    exit(EXIT_FAILURE);
  }

  // Read lines from the file and store them in the array
  *line_count = 0;
  while (fgets(buffer, 256, file) != NULL) {
    if (*line_count >= 1000) {
      fprintf(stderr, "Max # of lines exceeded\n");
    }

    // Allocate memory for each line and copy the buffer
    lines[*line_count] = malloc(strlen(buffer) + 1);
    if (lines[*line_count] == NULL) {
      perror("Error allocationg memory for line");
      free_lines(lines, *line_count);
      fclose(file);
      return NULL;
    }
    strcpy(lines[*line_count], buffer);

    (*line_count)++;
  }

  fclose(file);

  return lines;
}

void free_lines(char **lines, int line_count) {
  for (int i = 0; i < line_count; i++) {
    free(lines[i]);
  }
  free(lines);
}
