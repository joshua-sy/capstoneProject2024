#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// void overflowFunction1() {
//     char buffer1[20]; // Buffer that can hold 19 characters + null terminator
//     printf("Enter a string for buffer 1: ");
//     gets(buffer1); // Unsafe, no bounds checking
//     printf("Buffer 1 contents: %s\n", buffer1);
// }

// void overflowFunction2() {
//     char *buffer2 = (char *)malloc(10); // Allocate a buffer of 10 bytes
//     if (buffer2 == NULL) {
//         perror("malloc failed");
//         return;
//     }
//     printf("Enter a string for buffer 2: ");
//     gets(buffer2); // Unsafe, no bounds checking
//     printf("Buffer 2 contents: %s\n", buffer2);
//     free(buffer2);
// }

void overflowFunction3() {
    char buffer3[15]; // Buffer that can hold 14 characters + null terminator
    printf("Enter a string for buffer 3: ");
    fgets(buffer3, sizeof(buffer3) + 5, stdin); // Intentional overflow in size
    buffer3[strcspn(buffer3, "\n")] = 0; // Remove newline character
    printf("Buffer 3 contents: %s\n", buffer3);
}

void overflowFunction4() {
    char buffer3[15]; // Buffer that can hold 14 characters + null terminator
    printf("Enter a string for buffer 3: ");
    fgets(buffer3, sizeof(buffer3) + 5, stdin); // Intentional overflow in size
    buffer3[strcspn(buffer3, "\n")] = 0; // Remove newline character
    printf("Buffer 3 contents: %s\n", buffer3);
}

int main() {
    // overflowFunction1();
    // overflowFunction2();
    overflowFunction3();
    overflowFunction4();
    return 0;
}