<<<<<<< HEAD
=======
clang -S -c -g -fno-discard-value-names -emit-llvm example.c -o example.ll
>>>>>>> main
./svf-ex example.ll
./mta example.ll
./saber example.ll
./ae -overflow example.ll