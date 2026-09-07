import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Task } from '../task.model';

/**
 * Único punto del frontend que habla con el backend Spring.
 *
 * Cómo se conectan:
 * 1. Aquí se llama a rutas relativas: /api/v1/tasks
 * 2. ng serve usa proxy.conf.json y reenvía /api a http://localhost:8080
 * 3. Spring recibe la petición en TaskController (@RequestMapping("api/v1/tasks"))
 * 4. La respuesta JSON se guarda en el signal #tasks y la UI la pinta
 *
 * Mapa de métodos:
 *   load()        -> GET    /api/v1/tasks
 *   addTask()     -> POST   /api/v1/tasks
 *   toggleTask()  -> PATCH  /api/v1/tasks/{id}/toggle
 *   updateTitle() -> PUT    /api/v1/tasks/{id}
 *   deleteTask()  -> DELETE /api/v1/tasks/{id}
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);

  // Relativa a propósito: el proxy de Angular la manda al puerto 8080.
  // En el backend coincide con @RequestMapping("api/v1/tasks").
  private readonly baseUrl = '/api/v1/tasks';

  #tasks = signal<Task[]>([]);

  readonly tasks = this.#tasks.asReadonly();
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly busyId = signal<number | null>(null);

  readonly pendingTasks = computed(
    () => this.#tasks().filter((task) => !task.completed).length,
  );
  readonly completedTasks = computed(
    () => this.#tasks().filter((task) => task.completed).length,
  );
  readonly totalTasks = computed(() => this.#tasks().length);
  readonly progress = computed(() => {
    const total = this.totalTasks();
    if (total === 0) {
      return 0;
    }
    return Math.round((this.completedTasks() / total) * 100);
  });

  /** GET /api/v1/tasks  ->  TaskController.getAllTasks() */
  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const tasks = await firstValueFrom(this.http.get<Task[]>(this.baseUrl));
      this.#tasks.set(tasks);
    } catch {
      this.error.set(
        'No se pudo conectar con el backend. ¿Está corriendo en el puerto 8080?',
      );
    } finally {
      this.loading.set(false);
    }
  }

  /** POST /api/v1/tasks  body { title }  ->  TaskController.createTask() */
  async addTask(title: string): Promise<void> {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    this.error.set(null);
    try {
      const created = await firstValueFrom(
        this.http.post<Task>(this.baseUrl, { title: trimmed }),
      );
      this.#tasks.update((tasks) => [created, ...tasks]);
    } catch {
      this.error.set('No se pudo crear la tarea.');
    }
  }

  /** PATCH /api/v1/tasks/{id}/toggle  ->  TaskController.toggleTask() */
  async toggleTask(taskId: number): Promise<void> {
    this.busyId.set(taskId);
    this.error.set(null);
    try {
      const updated = await firstValueFrom(
        this.http.patch<Task>(`${this.baseUrl}/${taskId}/toggle`, {}),
      );
      this.replaceTask(updated);
    } catch {
      this.error.set('No se pudo actualizar el estado.');
    } finally {
      this.busyId.set(null);
    }
  }

  /** PUT /api/v1/tasks/{id}  body { title }  ->  TaskController.updateTask() */
  async updateTitle(taskId: number, title: string): Promise<void> {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    this.busyId.set(taskId);
    this.error.set(null);
    try {
      const updated = await firstValueFrom(
        this.http.put<Task>(`${this.baseUrl}/${taskId}`, { title: trimmed }),
      );
      this.replaceTask(updated);
    } catch {
      this.error.set('No se pudo editar la tarea.');
    } finally {
      this.busyId.set(null);
    }
  }

  /** DELETE /api/v1/tasks/{id}  ->  TaskController.deleteTask() */
  async deleteTask(taskId: number): Promise<void> {
    this.busyId.set(taskId);
    this.error.set(null);
    try {
      await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${taskId}`));
      this.#tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
    } catch {
      this.error.set('No se pudo eliminar la tarea.');
    } finally {
      this.busyId.set(null);
    }
  }

  private replaceTask(updated: Task): void {
    this.#tasks.update((tasks) =>
      tasks.map((task) => (task.id === updated.id ? updated : task)),
    );
  }
}
