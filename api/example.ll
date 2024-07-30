; ModuleID = 'example.c'
source_filename = "example.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

; Function Attrs: noinline nounwind optnone uwtable
define dso_local i32 @test(i32 noundef %a, i32 noundef %b) #0 !dbg !10 {
entry:
  %a.addr = alloca i32, align 4
  %b.addr = alloca i32, align 4
  %x = alloca i32, align 4
  %y = alloca i32, align 4
  store i32 %a, i32* %a.addr, align 4
  call void @llvm.dbg.declare(metadata i32* %a.addr, metadata !15, metadata !DIExpression()), !dbg !16
  store i32 %b, i32* %b.addr, align 4
  call void @llvm.dbg.declare(metadata i32* %b.addr, metadata !17, metadata !DIExpression()), !dbg !18
  call void @llvm.dbg.declare(metadata i32* %x, metadata !19, metadata !DIExpression()), !dbg !20
  call void @llvm.dbg.declare(metadata i32* %y, metadata !21, metadata !DIExpression()), !dbg !22
  store i32 1, i32* %x, align 4, !dbg !23
  store i32 1, i32* %y, align 4, !dbg !24
  %0 = load i32, i32* %a.addr, align 4, !dbg !25
  %1 = load i32, i32* %b.addr, align 4, !dbg !27
  %cmp = icmp sgt i32 %0, %1, !dbg !28
  br i1 %cmp, label %if.then, label %if.else, !dbg !29

if.then:                                          ; preds = %entry
  %2 = load i32, i32* %x, align 4, !dbg !30
  %inc = add nsw i32 %2, 1, !dbg !30
  store i32 %inc, i32* %x, align 4, !dbg !30
  %3 = load i32, i32* %y, align 4, !dbg !32
  %inc1 = add nsw i32 %3, 1, !dbg !32
  store i32 %inc1, i32* %y, align 4, !dbg !32
  %4 = load i32, i32* %x, align 4, !dbg !33
  %5 = load i32, i32* %y, align 4, !dbg !34
  %cmp2 = icmp eq i32 %4, %5, !dbg !35
  call void @svf_assert(i1 noundef zeroext %cmp2), !dbg !36
  br label %if.end, !dbg !37

if.else:                                          ; preds = %entry
  %6 = load i32, i32* %x, align 4, !dbg !38
  %inc3 = add nsw i32 %6, 1, !dbg !38
  store i32 %inc3, i32* %x, align 4, !dbg !38
  %7 = load i32, i32* %x, align 4, !dbg !40
  %cmp4 = icmp eq i32 %7, 2, !dbg !41
  call void @svf_assert(i1 noundef zeroext %cmp4), !dbg !42
  br label %if.end

if.end:                                           ; preds = %if.else, %if.then
  ret i32 0, !dbg !43
}

; Function Attrs: nofree nosync nounwind readnone speculatable willreturn
declare void @llvm.dbg.declare(metadata, metadata, metadata) #1

declare void @svf_assert(i1 noundef zeroext) #2

; Function Attrs: noinline nounwind optnone uwtable
define dso_local i32 @main() #0 !dbg !44 {
entry:
  %retval = alloca i32, align 4
  %a = alloca i32, align 4
  %b = alloca i32, align 4
  store i32 0, i32* %retval, align 4
  call void @llvm.dbg.declare(metadata i32* %a, metadata !47, metadata !DIExpression()), !dbg !48
  store i32 1, i32* %a, align 4, !dbg !48
  call void @llvm.dbg.declare(metadata i32* %b, metadata !49, metadata !DIExpression()), !dbg !50
  store i32 2, i32* %b, align 4, !dbg !50
  %0 = load i32, i32* %a, align 4, !dbg !51
  %1 = load i32, i32* %b, align 4, !dbg !52
  %call = call i32 @test(i32 noundef %0, i32 noundef %1), !dbg !53
  ret i32 0, !dbg !54
}

attributes #0 = { noinline nounwind optnone uwtable "frame-pointer"="all" "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }
attributes #1 = { nofree nosync nounwind readnone speculatable willreturn }
attributes #2 = { "frame-pointer"="all" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-cpu"="x86-64" "target-features"="+cx8,+fxsr,+mmx,+sse,+sse2,+x87" "tune-cpu"="generic" }

!llvm.dbg.cu = !{!0}
!llvm.module.flags = !{!2, !3, !4, !5, !6, !7, !8}
!llvm.ident = !{!9}

!0 = distinct !DICompileUnit(language: DW_LANG_C99, file: !1, producer: "Ubuntu clang version 14.0.0-1ubuntu1.1", isOptimized: false, runtimeVersion: 0, emissionKind: FullDebug, splitDebugInlining: false, nameTableKind: None)
!1 = !DIFile(filename: "example.c", directory: "/media/samiksha/Windows/Users/samik/Desktop/capstoneProject2024/api", checksumkind: CSK_MD5, checksum: "d897aecb1fa57f27a3941d1c5394b195")
!2 = !{i32 7, !"Dwarf Version", i32 5}
!3 = !{i32 2, !"Debug Info Version", i32 3}
!4 = !{i32 1, !"wchar_size", i32 4}
!5 = !{i32 7, !"PIC Level", i32 2}
!6 = !{i32 7, !"PIE Level", i32 2}
!7 = !{i32 7, !"uwtable", i32 1}
!8 = !{i32 7, !"frame-pointer", i32 2}
!9 = !{!"Ubuntu clang version 14.0.0-1ubuntu1.1"}
!10 = distinct !DISubprogram(name: "test", scope: !1, file: !1, line: 8, type: !11, scopeLine: 8, flags: DIFlagPrototyped, spFlags: DISPFlagDefinition, unit: !0, retainedNodes: !14)
!11 = !DISubroutineType(types: !12)
!12 = !{!13, !13, !13}
!13 = !DIBasicType(name: "int", size: 32, encoding: DW_ATE_signed)
!14 = !{}
!15 = !DILocalVariable(name: "a", arg: 1, scope: !10, file: !1, line: 8, type: !13)
!16 = !DILocation(line: 8, column: 14, scope: !10)
!17 = !DILocalVariable(name: "b", arg: 2, scope: !10, file: !1, line: 8, type: !13)
!18 = !DILocation(line: 8, column: 21, scope: !10)
!19 = !DILocalVariable(name: "x", scope: !10, file: !1, line: 9, type: !13)
!20 = !DILocation(line: 9, column: 9, scope: !10)
!21 = !DILocalVariable(name: "y", scope: !10, file: !1, line: 9, type: !13)
!22 = !DILocation(line: 9, column: 11, scope: !10)
!23 = !DILocation(line: 10, column: 6, scope: !10)
!24 = !DILocation(line: 10, column: 11, scope: !10)
!25 = !DILocation(line: 12, column: 9, scope: !26)
!26 = distinct !DILexicalBlock(scope: !10, file: !1, line: 12, column: 9)
!27 = !DILocation(line: 12, column: 13, scope: !26)
!28 = !DILocation(line: 12, column: 11, scope: !26)
!29 = !DILocation(line: 12, column: 9, scope: !10)
!30 = !DILocation(line: 13, column: 10, scope: !31)
!31 = distinct !DILexicalBlock(scope: !26, file: !1, line: 12, column: 16)
!32 = !DILocation(line: 14, column: 10, scope: !31)
!33 = !DILocation(line: 15, column: 21, scope: !31)
!34 = !DILocation(line: 15, column: 26, scope: !31)
!35 = !DILocation(line: 15, column: 23, scope: !31)
!36 = !DILocation(line: 15, column: 9, scope: !31)
!37 = !DILocation(line: 16, column: 5, scope: !31)
!38 = !DILocation(line: 17, column: 10, scope: !39)
!39 = distinct !DILexicalBlock(scope: !26, file: !1, line: 16, column: 12)
!40 = !DILocation(line: 18, column: 21, scope: !39)
!41 = !DILocation(line: 18, column: 23, scope: !39)
!42 = !DILocation(line: 18, column: 9, scope: !39)
!43 = !DILocation(line: 20, column: 5, scope: !10)
!44 = distinct !DISubprogram(name: "main", scope: !1, file: !1, line: 23, type: !45, scopeLine: 23, spFlags: DISPFlagDefinition, unit: !0, retainedNodes: !14)
!45 = !DISubroutineType(types: !46)
!46 = !{!13}
!47 = !DILocalVariable(name: "a", scope: !44, file: !1, line: 24, type: !13)
!48 = !DILocation(line: 24, column: 9, scope: !44)
!49 = !DILocalVariable(name: "b", scope: !44, file: !1, line: 25, type: !13)
!50 = !DILocation(line: 25, column: 9, scope: !44)
!51 = !DILocation(line: 26, column: 10, scope: !44)
!52 = !DILocation(line: 26, column: 12, scope: !44)
!53 = !DILocation(line: 26, column: 5, scope: !44)
!54 = !DILocation(line: 27, column: 5, scope: !44)
