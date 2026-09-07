import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task';
import { TaskCardComponent } from '../../components/task-card/task-card';
import { TaskFormComponent } from '../../components/task-form/task-form';

@Component({
  selector: 'app-task-dashboard',
  imports: [TaskCardComponent, TaskFormComponent],
  templateUrl: './task-dashboard.html',
})
export class TaskDashboardComponent implements OnInit {
  // La página no llama a HTTP directo: usa TaskService, que sí habla con Spring.
  readonly taskService = inject(TaskService);

  ngOnInit(): void {
    // Al abrir el tablero: GET /api/v1/tasks
    void this.taskService.load();
  }
}
