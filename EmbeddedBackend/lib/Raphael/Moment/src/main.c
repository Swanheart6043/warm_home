#include <stdio.h>
#include <time.h>
#include "Moment.h"

int main() {
    char text[20] = "";
    time_t seconds = time(NULL);
    time_t date = moment(&seconds);
    moment_format(&date, text, "YYYY-MM-DD HH:mm:ss");
    printf("%s\n", text);
    return 0;
}