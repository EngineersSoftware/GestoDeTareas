import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../core/task.model';

@Component({
  selector: 'app-task-card',
  imports: [FormsModule],
  templateUrl: './task-card.html',
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly busy = input(false);

  // La card no habla con Spring. Emite el id/título y el dashboard llama a TaskService.
  readonly toggleCompletion = output<number>();
  readonly deleteTask = output<number>();
  readonly titleUpdated = output<string>();

  readonly editing = signal(false);
  readonly editTitle = signal('');

  startEdit(): void {
    this.editTitle.set(this.task().title);
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.editTitle.set('');
  }

  saveEdit(): void {
    const title = this.editTitle().trim();
    if (!title || title === this.task().title) {
      this.cancelEdit();
      return;
    }
    this.titleUpdated.emit(title);
    this.editing.set(false);
  }
}
