import { PriorityQueue } from "./PriorityQueue";

/** A directed weighted edge of the graph (an entry of an adjacency list) */
export interface GraphEdge {
  to: string;
  weight: number;
}

export interface RouteStep {
  visited: string;
  relaxed: string;
  newDistance: number;
  improved: boolean;
}

export interface DijkstraResult {
  reachable: boolean;
  path: string[];
  distance: number;
  visitedOrder: string[];
  distances: Record<string, number>;
  steps: RouteStep[];
}

/**
 * GRAPH using an ADJACENCY LIST.
 * Key = location name, Value = array of { to, weight } edges.
 * Space: O(V + E). Finding all neighbours of a vertex: O(degree).
 */
export class Graph {
  private adjacency = new Map<string, GraphEdge[]>();

  /** Add a location (vertex). Returns false if it already exists. */
  addLocation(name: string): boolean {
    const key = name.trim();
    if (key.length === 0 || this.adjacency.has(key)) return false;
    this.adjacency.set(key, []);
    return true;
  }

  hasLocation(name: string): boolean {
    return this.adjacency.has(name);
  }

  /** Add a route (edge). Two-way roads are stored as two directed edges. */
  addRoute(from: string, to: string, weight: number, bidirectional = true): boolean {
    const a = from.trim();
    const b = to.trim();
    if (!this.adjacency.has(a) || !this.adjacency.has(b)) return false;
    if (weight <= 0) return false;
    this.adjacency.get(a)!.push({ to: b, weight });
    if (bidirectional) this.adjacency.get(b)!.push({ to: a, weight });
    return true;
  }

  removeRoute(from: string, to: string): boolean {
    const a = from.trim();
    const b = to.trim();
    if (!this.adjacency.has(a) || !this.adjacency.has(b)) return false;
    const outA = this.adjacency.get(a)!;
    const idxA = outA.findIndex((e) => e.to === b);
    if (idxA >= 0) outA.splice(idxA, 1);
    const outB = this.adjacency.get(b)!;
    const idxB = outB.findIndex((e) => e.to === a);
    if (idxB >= 0) outB.splice(idxB, 1);
    return idxA >= 0 || idxB >= 0;
  }

  locations(): string[] {
    return [...this.adjacency.keys()];
  }

  neighbors(name: string): GraphEdge[] {
    return this.adjacency.get(name) ?? [];
  }

  degree(name: string): number {
    return this.neighbors(name).length;
  }

  routes(): { from: string; to: string; weight: number }[] {
    const out: { from: string; to: string; weight: number }[] = [];
    for (const [from, edges] of this.adjacency) {
      for (const e of edges) out.push({ from, to: e.to, weight: e.weight });
    }
    return out;
  }

  uniqueRoutes(): { from: string; to: string; weight: number }[] {
    const seen = new Set<string>();
    const out: { from: string; to: string; weight: number }[] = [];
    for (const [from, edges] of this.adjacency) {
      for (const e of edges) {
        const key = [from, e.to].sort().join("~");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ from, to: e.to, weight: e.weight });
      }
    }
    return out;
  }

  size(): number {
    return this.adjacency.size;
  }

  /**
   * DIJKSTRA'S SHORTEST PATH ALGORITHM (greedy).
   * Uses a min-heap priority queue -> O((V + E) log V).
   * Every step is recorded so the UI can explain the relaxation process.
   */
  dijkstra(source: string, destination: string): DijkstraResult {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const visited = new Set<string>();
    const visitedOrder: string[] = [];
    const steps: RouteStep[] = [];
    const pq = new PriorityQueue<{ name: string; dist: number }>((a, b) => a.dist - b.dist);

    for (const city of this.adjacency.keys()) {
      distances[city] = Infinity;
      previous[city] = null;
    }
    if (!this.adjacency.has(source) || !this.adjacency.has(destination)) {
      return { reachable: false, path: [], distance: Infinity, visitedOrder: [], distances, steps };
    }
    distances[source] = 0;
    pq.enqueue({ name: source, dist: 0 });

    while (!pq.isEmpty()) {
      const current = pq.dequeue()!;
      if (visited.has(current.name)) continue;
      visited.add(current.name);
      visitedOrder.push(current.name);

      if (current.name === destination) break;

      for (const edge of this.neighbors(current.name)) {
        if (visited.has(edge.to)) continue;
        const candidate = distances[current.name] + edge.weight;
        const improved = candidate < distances[edge.to];
        steps.push({
          visited: current.name,
          relaxed: edge.to,
          newDistance: candidate,
          improved,
        });
        if (improved) {
          distances[edge.to] = candidate;
          previous[edge.to] = current.name;
          pq.enqueue({ name: edge.to, dist: candidate });
        }
      }
    }

    if (distances[destination] === Infinity) {
      return { reachable: false, path: [], distance: Infinity, visitedOrder, distances, steps };
    }

    const path: string[] = [];
    let walker: string | null = destination;
    while (walker !== null) {
      path.unshift(walker);
      walker = previous[walker];
    }
    return { reachable: true, path, distance: distances[destination], visitedOrder, distances, steps };
  }

  /** Breadth First Search — fewest number of stops (ignores distance). Used for the viva comparison. */
  bfs(source: string, destination: string): string[] {
    if (!this.adjacency.has(source) || !this.adjacency.has(destination)) return [];
    const visited = new Set<string>([source]);
    const previous: Record<string, string | null> = { [source]: null };
    const queue: string[] = [source];
    while (queue.length > 0) {
      const current = queue.shift() as string;
      if (current === destination) break;
      for (const edge of this.neighbors(current)) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          previous[edge.to] = current;
          queue.push(edge.to);
        }
      }
    }
    if (!visited.has(destination)) return [];
    const path: string[] = [];
    let walker: string | null = destination;
    while (walker !== null) {
      path.unshift(walker);
      walker = previous[walker];
    }
    return path;
  }

  pathDistance(path: string[]): number {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.neighbors(path[i]).find((e) => e.to === path[i + 1]);
      if (!edge) return -1;
      total += edge.weight;
    }
    return total;
  }
}
