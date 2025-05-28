#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include "Moment.h"

time_t moment(time_t* value) {
    return time(value);
}

int moment_format(time_t* value, char* text, char* form) {
    struct tm* date = localtime(value);

    if (strcmp(form, "YYYY-MM-DD") == 0) {
        sprintf(text, "%d-%d-%d", date->tm_year+1900, date->tm_mon+1, date->tm_mday);
        return 0;
    }
    
    if (strcmp(form, "YYYY-MM-DD HH:mm:ss") == 0) {
        sprintf(text, "%d-%d-%d %02d:%02d:%02d", date->tm_year+1900, date->tm_mon+1, date->tm_mday, date->tm_hour, date->tm_min, date->tm_sec);
        return 0;
    }
    
    return 0;
}

int moment_subtract() {

}

int moment_isBefore() {

}

int moment_isAfter() {

}