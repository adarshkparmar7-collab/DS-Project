@echo off
REM ---------------------------------------------------------------
REM  Smart Transport Planner Using Data Structures
REM  Compile and run script for Windows
REM  Usage:  double click this file, or run it from a command prompt
REM ---------------------------------------------------------------
cd /d "%~dp0"

echo =====================================================
echo   Smart Transport Planner - compiling Java sources
echo =====================================================

javac *.java

if errorlevel 1 (
    echo.
    echo  COMPILATION FAILED. Please check that the JDK is installed
    echo  and that "javac" is available on the PATH.
    echo.
    pause
    exit /b 1
)

echo Compilation successful.
echo =====================================================
echo   Starting the program ...
echo =====================================================
echo.

java SmartTransportPlanner

echo.
pause
