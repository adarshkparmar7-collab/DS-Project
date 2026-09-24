import { Graph, type DijkstraResult } from "./ds/Graph";
import { LinkedList } from "./ds/LinkedList";
import { PriorityQueue } from "./ds/PriorityQueue";
import { Queue } from "./ds/Queue";
import { Stack } from "./ds/Stack";
import { binarySearch, bubbleSort, fuzzyMatch, linearSearch, quickSort } from "./ds/SearchSort";

export type TransportType = "Bus" | "Train" | "Taxi" | "Metro";
export type PriorityLevel = "Emergency" | "Senior Citizen" | "Regular";
export type SortKey = "distance" | "time" | "price";

export interface Passenger {
  id: number;
  name: string;
  source: string;
  destination: string;
}

export interface TransportRequest {
  id: number;
  passenger: string;
  source: string;
  destination: string;
  priority: PriorityLevel;
  note: string;
}

export interface TripRecord {
  id: number;
  passenger: string;
  source: string;
  destination: string;
  distance: number;
  path: string[];
  transportType: TransportType;
  fare: number;
  travelTime: number;
  priority: PriorityLevel | "Queue";
  timestamp: string;
}

export interface RouteSearch {
  source: string;
  destination: string;
  distance: number;
  path: string[];
}

export interface TransportOption {
  id: string;
  name: string;
  type: TransportType;
  source: string;
  destination: string;
  distance: number;
  path: string[];
  timeMinutes: number;
  price: number;
}

export interface LogEntry {
  id: number;
  time: string;
  text: string;
  kind: "info" | "success" | "warn" | "error";
}

export const PRIORITY_RANK: Record<PriorityLevel, number> = {
  Emergency: 1,
  "Senior Citizen": 2,
  Regular: 3,
};

const TYPE_PROFILE: Record<TransportType, { speed: number; base: number; perKm: number }> = {
  Bus: { speed: 55, base: 30, perKm: 1.6 },
  Train: { speed: 88, base: 45, perKm: 1.15 },
  Taxi: { speed: 72, base: 80, perKm: 5.4 },
  Metro: { speed: 62, base: 20, perKm: 0.9 },
};

const OPERATORS: Record<TransportType, string[]> = {
  Bus: ["Shree Ram Travels", "GSRTC Volvo", "Patel Roadways"],
  Train: ["Intercity Express", "Shatabdi Express", "Duronto Express"],
  Taxi: ["City Cabs", "Rajwadi Travels", "Quick Ride Taxi"],
  Metro: ["Metro Link Express", "Mega Metro", "Rapid Metro"],
};

export const HUB = "Ahmedabad";

const now = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

/**
 * The Smart Transport Planner engine.
 * Every feature of the console menu is a method of this class, exactly like the
 * Java version (SmartTransportPlanner.java).
 */
export class SmartTransportPlanner {
  graph = new Graph();
  passengerQueue = new Queue<Passenger>();
  requestQueue = new PriorityQueue<TransportRequest>(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.id - b.id,
  );
  history = new LinkedList<TripRecord>();
  recentRoutes = new Stack<RouteSearch>();
  options: TransportOption[] = [];
  log: LogEntry[] = [];
  private logId = 1;
  private nextPassengerId = 101;
  private nextRequestId = 1;
  private nextTripId = 1;

  constructor() {
    this.loadSampleData();
  }

  // ---------------------------------------------------------------- sample data
  loadSampleData(): void {
    const cities = [
      "Ahmedabad",
      "Rajkot",
      "Surat",
      "Vadodara",
      "Bhavnagar",
      "Gandhinagar",
      "Jamnagar",
    ];
    cities.forEach((c) => this.graph.addLocation(c));

    const routes: [string, string, number][] = [
      ["Ahmedabad", "Rajkot", 215],
      ["Ahmedabad", "Vadodara", 110],
      ["Ahmedabad", "Gandhinagar", 30],
      ["Rajkot", "Jamnagar", 90],
      ["Rajkot", "Bhavnagar", 170],
      ["Vadodara", "Surat", 150],
      ["Vadodara", "Bhavnagar", 200],
      ["Surat", "Bhavnagar", 170],
    ];
    routes.forEach(([a, b, km]) => this.graph.addRoute(a, b, km));

    this.passengerQueue.enqueue({ id: 101, name: "Rahul", source: HUB, destination: "Rajkot" });
    this.passengerQueue.enqueue({ id: 102, name: "Priya", source: HUB, destination: "Surat" });
    this.passengerQueue.enqueue({ id: 103, name: "Sanjay", source: HUB, destination: "Jamnagar" });

    this.requestQueue.enqueue({
      id: 1,
      passenger: "Meena Desai",
      source: "Ahmedabad",
      destination: "Jamnagar",
      priority: "Emergency",
      note: "Medical emergency — ambulance escort",
    });
    this.requestQueue.enqueue({
      id: 2,
      passenger: "Kiran Shah",
      source: "Ahmedabad",
      destination: "Surat",
      priority: "Senior Citizen",
      note: "Wheelchair assistance",
    });
    this.requestQueue.enqueue({
      id: 3,
      passenger: "Amit Patel",
      source: "Rajkot",
      destination: "Bhavnagar",
      priority: "Regular",
      note: "Standard booking",
    });

    this.refreshOptions();

    this.addLog("Sample network loaded: 7 locations, 8 routes, 3 waiting passengers, 3 requests.", "info");
  }

  reset(): void {
    this.passengerQueue.clear();
    this.requestQueue.clear();
    this.history.clear();
    this.recentRoutes.clear();
    this.graph = new Graph();
    this.log = [];
    this.logId = 1;
    this.nextPassengerId = 101;
    this.nextRequestId = 1;
    this.nextTripId = 1;
    this.loadSampleData();
  }

  addLog(text: string, kind: LogEntry["kind"] = "info"): void {
    this.log.unshift({ id: this.logId++, time: now(), text, kind });
    if (this.log.length > 120) this.log.pop();
  }

  // -------------------------------------------------------------- 1. locations
  addLocation(name: string): { ok: boolean; message: string } {
    const clean = name.trim();
    if (clean.length < 2) {
      this.addLog(`Invalid location name "${name}".`, "error");
      return { ok: false, message: "Location name must have at least 2 characters." };
    }
    if (!this.graph.addLocation(clean)) {
      this.addLog(`Location "${clean}" already exists.`, "warn");
      return { ok: false, message: `"${clean}" already exists in the transport network.` };
    }
    this.refreshOptions();
    this.addLog(`Location added (graph vertex): ${clean}`, "success");
    return { ok: true, message: `Location "${clean}" added to the graph.` };
  }

  // ---------------------------------------------------------------- 2. routes
  addRoute(from: string, to: string, km: number): { ok: boolean; message: string } {
    if (!this.graph.hasLocation(from) || !this.graph.hasLocation(to)) {
      this.addLog(`Route rejected — unknown endpoint.`, "error");
      return { ok: false, message: "Both locations must exist. Add the location first." };
    }
    if (from === to) {
      return { ok: false, message: "Source and destination cannot be the same location." };
    }
    if (!Number.isFinite(km) || km <= 0) {
      this.addLog(`Route rejected — invalid distance ${km}.`, "error");
      return { ok: false, message: "Distance must be a positive number." };
    }
    if (!this.graph.addRoute(from, to, km)) {
      return { ok: false, message: "Route could not be added." };
    }
    this.refreshOptions();
    this.addLog(`Route added (graph edge): ${from} ↔ ${to} = ${km} km`, "success");
    return { ok: true, message: `Route ${from} ↔ ${to} (${km} km) added to the adjacency list.` };
  }

  removeRoute(from: string, to: string): boolean {
    const ok = this.graph.removeRoute(from, to);
    if (ok) {
      this.refreshOptions();
      this.addLog(`Route removed: ${from} ↔ ${to}`, "warn");
    }
    return ok;
  }

  // ---------------------------------------------------- 4/5. Dijkstra routing
  findShortestRoute(source: string, destination: string): DijkstraResult & { message: string } {
    if (!this.graph.hasLocation(source) || !this.graph.hasLocation(destination)) {
      this.addLog("Shortest route failed — unknown location.", "error");
      return {
        reachable: false,
        path: [],
        distance: Infinity,
        visitedOrder: [],
        distances: {},
        steps: [],
        message: "Source or destination is not present in the network.",
      };
    }
    const result = this.graph.dijkstra(source, destination);
    if (!result.reachable) {
      this.addLog(`No route exists between ${source} and ${destination}.`, "warn");
      return { ...result, message: `No connected route exists between ${source} and ${destination}.` };
    }
    const top = this.recentRoutes.peek();
    const isRepeat = top && top.source === source && top.destination === destination;
    if (!isRepeat) {
      this.recentRoutes.push({ source, destination, distance: result.distance, path: result.path });
    }
    this.addLog(
      `Dijkstra: ${source} → ${destination} = ${result.path.join(" → ")} (${result.distance} km)`,
      "success",
    );
    return { ...result, message: `Shortest route found: ${result.path.join(" → ")}` };
  }

  popRecentRoute(): RouteSearch | null {
    const removed = this.recentRoutes.pop();
    if (removed) {
      this.addLog(`Stack pop(): removed "${removed.source} → ${removed.destination}"`, "warn");
    }
    return removed;
  }

  // -------------------------------------------------------------- 6/7/8. queue
  addPassenger(name: string, destination: string, source = HUB): { ok: boolean; message: string; id?: number } {
    if (name.trim().length < 2) return { ok: false, message: "Passenger name is required." };
    if (!this.graph.hasLocation(destination)) {
      this.addLog(`Passenger not added — unknown destination "${destination}".`, "error");
      return { ok: false, message: `Destination "${destination}" is not in the network.` };
    }
    const passenger: Passenger = {
      id: this.nextPassengerId++,
      name: name.trim(),
      source: this.graph.hasLocation(source) ? source : HUB,
      destination,
    };
    this.passengerQueue.enqueue(passenger);
    this.addLog(
      `Queue enqueue(): #${passenger.id} ${passenger.name} (${passenger.source} → ${passenger.destination})`,
      "success",
    );
    return { ok: true, message: `Passenger #${passenger.id} ${passenger.name} added to the queue.`, id: passenger.id };
  }

  processPassenger(transportType: TransportType = "Bus"): { ok: boolean; message: string; record?: TripRecord } {
    const passenger = this.passengerQueue.dequeue();
    if (!passenger) {
      this.addLog("Queue empty — no passenger to process.", "warn");
      return { ok: false, message: "The passenger queue is empty." };
    }
    const route = this.graph.dijkstra(passenger.source, passenger.destination);
    const distance = route.reachable ? route.distance : 0;
    const profile = TYPE_PROFILE[transportType];
    const record: TripRecord = {
      id: this.nextTripId++,
      passenger: passenger.name,
      source: passenger.source,
      destination: passenger.destination,
      distance,
      path: route.path,
      transportType,
      fare: Math.round(profile.base + distance * profile.perKm),
      travelTime: Math.round((distance / profile.speed) * 60),
      priority: "Queue",
      timestamp: now(),
    };
    this.history.addLast(record);
    this.addLog(
      `Queue dequeue(): #${passenger.id} ${passenger.name} → trip #${record.id} stored in linked list`,
      "success",
    );
    return {
      ok: true,
      message: `Passenger #${passenger.id} ${passenger.name} boarded. Trip added to history.`,
      record,
    };
  }

  // --------------------------------------------- 9/10. priority transport queue
  addRequest(
    passenger: string,
    source: string,
    destination: string,
    priority: PriorityLevel,
    note = "Standard booking",
  ): { ok: boolean; message: string; id?: number } {
    if (passenger.trim().length < 2) return { ok: false, message: "Passenger name is required." };
    if (!this.graph.hasLocation(source) || !this.graph.hasLocation(destination)) {
      this.addLog("Request rejected — unknown location.", "error");
      return { ok: false, message: "Source and destination must both exist in the network." };
    }
    const request: TransportRequest = {
      id: this.nextRequestId++,
      passenger: passenger.trim(),
      source,
      destination,
      priority,
      note,
    };
    this.requestQueue.enqueue(request);
    this.addLog(
      `Priority queue enqueue(): #${request.id} ${request.passenger} [${priority}]`,
      "success",
    );
    return { ok: true, message: `${priority} request #${request.id} added to the priority queue.`, id: request.id };
  }

  processRequest(): { ok: boolean; message: string; record?: TripRecord } {
    const request = this.requestQueue.dequeue();
    if (!request) {
      this.addLog("Priority queue empty — nothing to process.", "warn");
      return { ok: false, message: "The priority request queue is empty." };
    }
    const route = this.graph.dijkstra(request.source, request.destination);
    const distance = route.reachable ? route.distance : 0;
    const type: TransportType = request.priority === "Emergency" ? "Taxi" : "Train";
    const profile = TYPE_PROFILE[type];
    const record: TripRecord = {
      id: this.nextTripId++,
      passenger: request.passenger,
      source: request.source,
      destination: request.destination,
      distance,
      path: route.path,
      transportType: type,
      fare: Math.round(profile.base + distance * profile.perKm),
      travelTime: Math.round((distance / profile.speed) * 60),
      priority: request.priority,
      timestamp: now(),
    };
    this.history.addLast(record);
    this.addLog(
      `Priority queue dequeue(): ${request.passenger} [${request.priority}] served first`,
      "success",
    );
    return { ok: true, message: `${request.priority} request of ${request.passenger} processed.`, record };
  }

  // ------------------------------------------------------ 11. searching records
  searchLocations(term: string): string[] {
    return linearSearch(this.graph.locations(), (city) => fuzzyMatch(term, city));
  }

  searchHistory(passenger: string): TripRecord[] {
    return linearSearch(this.history.toArray(), (t) => fuzzyMatch(passenger, t.passenger));
  }

  /** Binary search over the alphabetically sorted operator names */
  searchOptionsByName(name: string): TransportOption[] {
    const sorted = quickSort(this.options, (a, b) => a.name.localeCompare(b.name));
    return binarySearch(sorted, name, (o) => o.name);
  }

  searchOptions(term: string): TransportOption[] {
    const clean = term.trim();
    if (clean.length === 0) return this.options;
    return linearSearch(this.options, (o) =>
      fuzzyMatch(clean, o.name) ||
      fuzzyMatch(clean, o.type) ||
      fuzzyMatch(clean, o.source) ||
      fuzzyMatch(clean, o.destination),
    );
  }

  // --------------------------------------------------------- 12. sorting options
  sortOptions(key: SortKey, algorithm: "quick" | "bubble" = "quick"): TransportOption[] {
    const compare =
      key === "distance"
        ? (a: TransportOption, b: TransportOption) => a.distance - b.distance
        : key === "time"
          ? (a: TransportOption, b: TransportOption) => a.timeMinutes - b.timeMinutes
          : (a: TransportOption, b: TransportOption) => a.price - b.price;
    return algorithm === "quick" ? quickSort(this.options, compare) : bubbleSort(this.options, compare);
  }

  // -------------------------------------------------- transport option catalogue
  refreshOptions(): void {
    const list: TransportOption[] = [];
    const cities = this.graph.locations();
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const a = cities[i];
        const b = cities[j];
        const route = this.graph.dijkstra(a, b);
        if (!route.reachable) continue;
        const km = route.distance;
        const types: TransportType[] = ["Bus", "Taxi"];
        if (km >= 60) types.push("Train");
        if (km <= 120) types.push("Metro");
        types.forEach((type, idx) => {
          const profile = TYPE_PROFILE[type];
          list.push({
            id: `${a}-${b}-${type}`,
            name: `${OPERATORS[type][(i + j + idx) % OPERATORS[type].length]} (${type})`,
            type,
            source: a,
            destination: b,
            distance: km,
            path: route.path,
            timeMinutes: Math.round((km / profile.speed) * 60),
            price: Math.round(profile.base + km * profile.perKm),
          });
          // reverse direction option so every search direction is covered
          list.push({
            id: `${b}-${a}-${type}`,
            name: `${OPERATORS[type][(i + j + idx + 1) % OPERATORS[type].length]} (${type})`,
            type,
            source: b,
            destination: a,
            distance: km,
            path: [...route.path].reverse(),
            timeMinutes: Math.round((km / profile.speed) * 60),
            price: Math.round(profile.base + km * profile.perKm),
          });
        });
      }
    }
    this.options = list;
  }

  // ------------------------------------------------------------------- helpers
  stats() {
    const routes = this.graph.uniqueRoutes();
    const totalKm = routes.reduce((sum, r) => sum + r.weight, 0);
    return {
      locations: this.graph.size(),
      routes: routes.length,
      totalKm,
      waiting: this.passengerQueue.size(),
      requests: this.requestQueue.size(),
      trips: this.history.size(),
      recent: this.recentRoutes.size(),
      options: this.options.length,
    };
  }

  cheapestOption(source: string, destination: string): TransportOption | null {
    const matches = linearSearch(
      this.options,
      (o) => o.source === source && o.destination === destination,
    );
    if (matches.length === 0) return null;
    return quickSort(matches, (a, b) => a.price - b.price)[0];
  }
}
