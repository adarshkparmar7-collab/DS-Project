import EdgeJava from "../../java/Edge.java?raw";
import RouteJava from "../../java/Route.java?raw";
import DijkstraResultJava from "../../java/DijkstraResult.java?raw";
import GraphJava from "../../java/Graph.java?raw";
import QueueJava from "../../java/Queue.java?raw";
import PriorityQueueJava from "../../java/PriorityQueueCustom.java?raw";
import StackJava from "../../java/Stack.java?raw";
import LinkedListJava from "../../java/LinkedList.java?raw";
import PassengerJava from "../../java/Passenger.java?raw";
import TransportRequestJava from "../../java/TransportRequest.java?raw";
import TripRecordJava from "../../java/TripRecord.java?raw";
import TransportOptionJava from "../../java/TransportOption.java?raw";
import SearchSortJava from "../../java/SearchSort.java?raw";
import MainJava from "../../java/SmartTransportPlanner.java?raw";
import ReadmeMarkdown from "../../java/README.md?raw";
import SampleOutputText from "../../java/sample-output.txt?raw";
import BatScript from "../../java/compile-and-run.bat?raw";
import ShScript from "../../java/compile-and-run.sh?raw";

export interface JavaFile {
  name: string;
  purpose: string;
  ds: string;
  code: string;
}

/**
 * The .java files really exist in the /java folder of this repository and are
 * imported here as raw text, so the browser always shows the exact source
 * that compiles with `javac *.java`.
 */
export const JAVA_FILES: JavaFile[] = [
  {
    name: "SmartTransportPlanner.java",
    purpose: "MAIN CLASS — the 15 option Scanner menu, sample data and session summary",
    ds: "All data structures",
    code: MainJava,
  },
  {
    name: "Graph.java",
    purpose: "Graph using an adjacency list, Dijkstra's shortest path algorithm and BFS",
    ds: "Graph + Dijkstra",
    code: GraphJava,
  },
  {
    name: "Edge.java",
    purpose: "One entry of the adjacency list — neighbour city and edge weight",
    ds: "Graph",
    code: EdgeJava,
  },
  {
    name: "Route.java",
    purpose: "One two-way road listed only once (used by the transport catalogue)",
    ds: "Graph",
    code: RouteJava,
  },
  {
    name: "DijkstraResult.java",
    purpose: "Holds the path, the total distance and the order of visited vertices",
    ds: "Dijkstra",
    code: DijkstraResultJava,
  },
  {
    name: "Queue.java",
    purpose: "Custom FIFO queue — enqueue, dequeue, peekFront, display",
    ds: "Queue",
    code: QueueJava,
  },
  {
    name: "PriorityQueueCustom.java",
    purpose: "Custom priority queue for Emergency / Senior Citizen / Regular requests",
    ds: "Priority Queue",
    code: PriorityQueueJava,
  },
  {
    name: "Stack.java",
    purpose: "Custom LIFO stack for the recently searched routes",
    ds: "Stack",
    code: StackJava,
  },
  {
    name: "LinkedList.java",
    purpose: "Custom singly linked list with ListNode — addLast, removeLast, reverse",
    ds: "Linked List",
    code: LinkedListJava,
  },
  {
    name: "Passenger.java",
    purpose: "Passenger entity stored inside the FIFO queue",
    ds: "Entity",
    code: PassengerJava,
  },
  {
    name: "TransportRequest.java",
    purpose: "Priority request entity implementing Comparable",
    ds: "Entity",
    code: TransportRequestJava,
  },
  {
    name: "TripRecord.java",
    purpose: "Trip history node data — Rahul | Ahmedabad | Rajkot | 215 km | Bus",
    ds: "Entity",
    code: TripRecordJava,
  },
  {
    name: "TransportOption.java",
    purpose: "Bus / Train / Taxi / Metro service used by searching and sorting",
    ds: "Entity",
    code: TransportOptionJava,
  },
  {
    name: "SearchSort.java",
    purpose: "Linear search, binary search, quick sort, bubble sort and comparators",
    ds: "Searching + Sorting",
    code: SearchSortJava,
  },
];

export const EXTRA_FILES: JavaFile[] = [
  {
    name: "README.md",
    purpose: "How to compile and run, file list, complexity table and viva notes",
    ds: "Documentation",
    code: ReadmeMarkdown,
  },
  {
    name: "sample-output.txt",
    purpose: "A complete sample session of the console program",
    ds: "Sample output",
    code: SampleOutputText,
  },
  {
    name: "compile-and-run.bat",
    purpose: "One-click compile + run for Windows (javac *.java / java SmartTransportPlanner)",
    ds: "Build script",
    code: BatScript,
  },
  {
    name: "compile-and-run.sh",
    purpose: "One-click compile + run for Linux and macOS",
    ds: "Build script",
    code: ShScript,
  },
];

export const ALL_FILES: JavaFile[] = [...JAVA_FILES, ...EXTRA_FILES];

export const JAVA_RUN_COMMANDS = ["javac *.java", "java SmartTransportPlanner"];

/** Counts the number of lines of a source file (blank lines excluded). */
export function countLines(code: string): number {
  return code.split("\n").filter((line) => line.trim().length > 0).length;
}
