/**
 * Debe coincidir con el JSON que serializa el backend (clase Java Task).
 * Spring envía: { "id": number, "title": string, "completed": boolean }
 */
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}
