clang -g -c -S -fno-discard-value-names -emit-llvm example.c -o example.ll
./svf-ex example.ll
./mta example.ll
./saber example.ll
./ae example.ll