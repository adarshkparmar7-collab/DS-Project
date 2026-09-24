import java.util.ArrayList;
import java.util.Comparator;

/**
 * SearchSort.java
 *
 * All the SEARCHING and SORTING algorithms of the project, written from
 * scratch as static utility methods.
 *
 *   searchLocations()    LINEAR SEARCH   O(n)
 *   searchTrips()        LINEAR SEARCH   O(n)   (searches the linked list)
 *   binarySearchByName() BINARY SEARCH   O(log n)  (list must be sorted)
 *   quickSort()          QUICK SORT      O(n log n) average
 *   bubbleSort()         BUBBLE SORT     O(n^2)
 */
public class SearchSort {

    // =====================================================================
    //                              SEARCHING
    // =====================================================================

    /**
     * LINEAR SEARCH over the location list.
     * The list is NOT sorted, so we must look at every element.
     * Works even when the user types only part of the name.
     */
    public static ArrayList<String> searchLocations(ArrayList<String> locations, String key) {
        ArrayList<String> result = new ArrayList<String>();
        if (key == null || key.trim().length() == 0) {
            return result;
        }
        String lowerKey = key.trim().toLowerCase();
        for (int i = 0; i < locations.size(); i++) {
            if (locations.get(i).toLowerCase().contains(lowerKey)) {
                result.add(locations.get(i));
            }
        }
        return result;
    }

    /**
     * LINEAR SEARCH over the trip history of the linked list.
     * A linked list cannot be accessed by index in O(1), so a linear scan is
     * the only possible way.
     */
    public static ArrayList<TripRecord> searchTrips(ArrayList<TripRecord> trips, String passengerName) {
        ArrayList<TripRecord> result = new ArrayList<TripRecord>();
        if (passengerName == null || passengerName.trim().length() == 0) {
            return result;
        }
        String key = passengerName.trim().toLowerCase();
        for (int i = 0; i < trips.size(); i++) {
            if (trips.get(i).getPassengerName().toLowerCase().contains(key)) {
                result.add(trips.get(i));
            }
        }
        return result;
    }

    /**
     * BINARY SEARCH by transport name.
     * IMPORTANT: the ArrayList must already be sorted by name (see byName()).
     * Every step halves the search range, so only log2(n) steps are needed.
     *
     * @return the index of the found element, or -1 when it is not present
     */
    public static int binarySearchByName(ArrayList<TransportOption> sortedOptions, String key) {
        int low = 0;
        int high = sortedOptions.size() - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            int compare = sortedOptions.get(mid).getName().compareToIgnoreCase(key);
            if (compare == 0) {
                return mid;                     // found
            } else if (compare < 0) {
                low = mid + 1;                  // answer is in the right half
            } else {
                high = mid - 1;                 // answer is in the left half
            }
        }
        return -1;                              // not found
    }

    // =====================================================================
    //                               SORTING
    // =====================================================================

    /**
     * QUICK SORT (recursive, divide and conquer).
     * The last element is used as the pivot. After partition(), the pivot is
     * at its final position and the two halves are sorted recursively.
     * A copy of the list is sorted, so the original is not modified.
     *
     * Average O(n log n)   |   worst case O(n^2)
     */
    public static ArrayList<TransportOption> quickSort(ArrayList<TransportOption> list,
                                                       Comparator<TransportOption> comparator) {
        ArrayList<TransportOption> copy = new ArrayList<TransportOption>(list);
        if (copy.size() > 1) {
            quickSortHelper(copy, 0, copy.size() - 1, comparator);
        }
        return copy;
    }

    private static void quickSortHelper(ArrayList<TransportOption> list, int low, int high,
                                        Comparator<TransportOption> comparator) {
        if (low < high) {
            int pivotIndex = partition(list, low, high, comparator);
            quickSortHelper(list, low, pivotIndex - 1, comparator);
            quickSortHelper(list, pivotIndex + 1, high, comparator);
        }
    }

    private static int partition(ArrayList<TransportOption> list, int low, int high,
                                 Comparator<TransportOption> comparator) {
        TransportOption pivot = list.get(high);
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (comparator.compare(list.get(j), pivot) <= 0) {
                i++;
                swap(list, i, j);
            }
        }
        swap(list, i + 1, high);
        return i + 1;
    }

    private static void swap(ArrayList<TransportOption> list, int first, int second) {
        TransportOption temporary = list.get(first);
        list.set(first, list.get(second));
        list.set(second, temporary);
    }

    /**
     * BUBBLE SORT. Kept only so it can be compared with quick sort.
     * Repeatedly swaps two neighbours that are in the wrong order.
     * O(n^2) in the worst case, O(n) when the list is already sorted.
     */
    public static ArrayList<TransportOption> bubbleSort(ArrayList<TransportOption> list,
                                                        Comparator<TransportOption> comparator) {
        ArrayList<TransportOption> copy = new ArrayList<TransportOption>(list);
        for (int i = 0; i < copy.size() - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < copy.size() - 1 - i; j++) {
                if (comparator.compare(copy.get(j), copy.get(j + 1)) > 0) {
                    swap(copy, j, j + 1);
                    swapped = true;
                }
            }
            if (!swapped) {
                break;                  // already sorted, stop early
            }
        }
        return copy;
    }

    // =====================================================================
    //                     COMPARATORS used by menu option 12
    // =====================================================================

    /** Sort by distance, smallest distance first. */
    public static Comparator<TransportOption> byDistance() {
        return new Comparator<TransportOption>() {
            public int compare(TransportOption first, TransportOption second) {
                return first.getDistance() - second.getDistance();
            }
        };
    }

    /** Sort by estimated travel time, fastest first. */
    public static Comparator<TransportOption> byTime() {
        return new Comparator<TransportOption>() {
            public int compare(TransportOption first, TransportOption second) {
                return first.getTimeMinutes() - second.getTimeMinutes();
            }
        };
    }

    /** Sort by ticket price, cheapest first. */
    public static Comparator<TransportOption> byPrice() {
        return new Comparator<TransportOption>() {
            public int compare(TransportOption first, TransportOption second) {
                return first.getPrice() - second.getPrice();
            }
        };
    }

    /** Sort alphabetically by operator name (needed before binary search). */
    public static Comparator<TransportOption> byName() {
        return new Comparator<TransportOption>() {
            public int compare(TransportOption first, TransportOption second) {
                return first.getName().compareToIgnoreCase(second.getName());
            }
        };
    }
}
