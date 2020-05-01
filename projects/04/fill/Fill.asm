// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
    @SCREEN
    D=A
    @arr
    M=D
    @8192 
    D=A
    @n // -> screen length = 8192
    M=D
    @color
    M=0
    @current_index
    M=0
(LOOP)
    @KBD
    D=M
    @CLEAR_COLOR
    D;JEQ // if KBD = 0

    @SET_COLOR
    0;JMP // Goto LOOP
(SET_COLOR)
    @color
    D=M
    @LOOP
    D;JLT // if current color already black

    @color
    M=-1
    @PAINT
    0;JMP // Goto PAINT
(CLEAR_COLOR)
    @color
    D=M
    @LOOP
    D;JEQ // if current color already white

    @color
    M=0
    @PAINT
    0;JMP // Goto PAINT
(PAINT)
    @i
    M=0 // reset i
(PAINT_LOOP)
    @i
    D=M
    @n
    D=D-M
    @LOOP // if i==n, exit
    D;JEQ

    // current index = color
    @arr
    D=M
    @i
    D=D+M
    @current_index
    M=D
    @color 
    D=M 
    @current_index
    A=M
    M=D

    // i++
    @i
    M=M+1
    @PAINT_LOOP
    0;JMP