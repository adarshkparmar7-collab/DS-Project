/**
 * Vite allows importing any file as a plain string by adding "?raw" to the
 * import path. We use it so the code viewer in the browser shows exactly the
 * same content as the .java files of this project.
 */
declare module "*?raw" {
  const content: string;
  export default content;
}
