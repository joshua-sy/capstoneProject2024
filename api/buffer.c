#include <stdio.h>
#include <string.h>

void vulnerable_function() {
    char buffer[10]; // Small buffer size
    printf("Enter a string: ");
    gets(buffer); // Unsafe function that does not check buffer size
    printf("You entered: %s\n", buffer);
}

int main() {
    vulnerable_function();
    return 0;
}