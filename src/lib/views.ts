export type ViewKey =
  | "dashboard"
  | "network"
  | "route"
  | "queue"
  | "priority"
  | "history"
  | "recent"
  | "options"
  | "search"
  | "console"
  | "code"
  | "docs"
  | "viva"
  | "exit";

export interface MenuItem {
  n: number | null;
  label: string;
  view: ViewKey;
  icon: string;
  ds: string;
  group: "Transport Planner Menu" | "Project Material" | "Overview";
}

export const MENU_ITEMS: MenuItem[] = [
  { n: null, label: "Dashboard", view: "dashboard", icon: "📊", ds: "live overview", group: "Overview" },
  { n: null, label: "Java Console", view: "console", icon: "⌨️", ds: "Scanner menu", group: "Overview" },
  { n: 1, label: "Add Location", view: "network", icon: "📍", ds: "Graph · vertex", group: "Transport Planner Menu" },
  { n: 2, label: "Add Route", view: "network", icon: "🛣️", ds: "Graph · edge", group: "Transport Planner Menu" },
  {
    n: 3,
    label: "Display Network",
    view: "network",
    icon: "🕸️",
    ds: "Adjacency list",
    group: "Transport Planner Menu",
  },
  { n: 4, label: "Find Shortest Route", view: "route", icon: "🧭", ds: "Dijkstra", group: "Transport Planner Menu" },
  {
    n: 5,
    label: "Route Distance",
    view: "route",
    icon: "🎫",
    ds: "Dijkstra result",
    group: "Transport Planner Menu",
  },
  { n: 6, label: "Add Passenger", view: "queue", icon: "🧍", ds: "Queue · enqueue", group: "Transport Planner Menu" },
  {
    n: 7,
    label: "Passenger Queue",
    view: "queue",
    icon: "👥",
    ds: "Queue · FIFO",
    group: "Transport Planner Menu",
  },
  {
    n: 8,
    label: "Process Passenger",
    view: "queue",
    icon: "🚍",
    ds: "Queue · dequeue",
    group: "Transport Planner Menu",
  },
  {
    n: 9,
    label: "Add Transport Request",
    view: "priority",
    icon: "🚨",
    ds: "Priority Queue",
    group: "Transport Planner Menu",
  },
  {
    n: 10,
    label: "Process Priority Request",
    view: "priority",
    icon: "⚡",
    ds: "Min-heap",
    group: "Transport Planner Menu",
  },
  { n: 11, label: "Search Location", view: "search", icon: "🔎", ds: "Linear / Binary", group: "Transport Planner Menu" },
  {
    n: 12,
    label: "Sort Transport Options",
    view: "options",
    icon: "🚉",
    ds: "Quick / Bubble sort",
    group: "Transport Planner Menu",
  },
  { n: 13, label: "View Recent Routes", view: "recent", icon: "🥞", ds: "Stack · LIFO", group: "Transport Planner Menu" },
  {
    n: 14,
    label: "Trip History",
    view: "history",
    icon: "🔗",
    ds: "Linked List",
    group: "Transport Planner Menu",
  },
  { n: 15, label: "Exit", view: "exit", icon: "🚪", ds: "terminate", group: "Transport Planner Menu" },
  { n: null, label: "Java Files (.java)", view: "code", icon: "☕", ds: "14 classes", group: "Project Material" },
  { n: null, label: "Documentation", view: "docs", icon: "📚", ds: "16 sections", group: "Project Material" },
  { n: null, label: "Viva Q&A", view: "viva", icon: "🎓", ds: "15 questions", group: "Project Material" },
];

export const VIEW_TITLES: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Live overview of the transport network and every data structure" },
  network: { title: "Transport Network", subtitle: "Graph using an adjacency list — add locations and routes" },
  route: { title: "Shortest Route", subtitle: "Dijkstra's algorithm with a min-heap priority queue" },
  queue: { title: "Passenger Queue", subtitle: "FIFO queue — enqueue, display and process passengers" },
  priority: { title: "Priority Requests", subtitle: "Priority queue — Emergency → Senior Citizen → Regular" },
  history: { title: "Trip History", subtitle: "Custom singly linked list of completed trips" },
  recent: { title: "Recent Routes", subtitle: "Stack (LIFO) of the recently searched routes" },
  options: { title: "Transport Options", subtitle: "Sorting (quick / bubble) and filtering of transport services" },
  search: { title: "Search", subtitle: "Linear search and binary search across the records" },
  console: { title: "Console", subtitle: "The original Java menu, running in the browser" },
  code: {
    title: "Java Project Files",
    subtitle: "14 real .java files in the java/ folder — download them, then javac *.java",
  },
  docs: { title: "Project Documentation", subtitle: "Introduction to conclusion — the complete project report" },
  viva: { title: "Viva Questions", subtitle: "Important questions and answers for the practical exam" },
  exit: { title: "Program Terminated", subtitle: "Menu option 15 — Exit" },
};
