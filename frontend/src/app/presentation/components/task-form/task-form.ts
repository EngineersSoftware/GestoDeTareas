import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
})
export class TaskFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  // No llama al API. El dashboard escucha este evento y ejecuta TaskService.addTask().
  readonly taskCreated = output<string>();

  readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.taskCreated.emit(this.taskForm.getRawValue().title.trim());
    this.taskForm.reset();
  }
}
