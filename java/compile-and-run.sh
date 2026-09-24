#!/bin/bash
# ---------------------------------------------------------------
#  Smart Transport Planner Using Data Structures
#  Compile and run script for Linux / macOS
#  Usage:  chmod +x compile-and-run.sh && ./compile-and-run.sh
# ---------------------------------------------------------------
cd "$(dirname "$0")"

echo "====================================================="
echo "  Smart Transport Planner - compiling Java sources"
echo "====================================================="

javac *.java

if [ $? -ne 0 ]; then
    echo ""
    echo " COMPILATION FAILED. Please check that the JDK is installed"
    echo " and that 'javac' is available on the PATH."
    exit 1
fi

echo "Compilation successful."
echo "====================================================="
echo "  Starting the program ..."
echo "====================================================="
echo ""

java SmartTransportPlanner
