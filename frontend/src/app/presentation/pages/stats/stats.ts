import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
})
export class StatsComponent implements OnInit {
  readonly taskService = inject(TaskService);

  ngOnInit(): void {
    // Si se entra directo a /stats, también pide GET /api/v1/tasks
    if (this.taskService.tasks().length === 0 && !this.taskService.loading()) {
      void this.taskService.load();
    }
  }
}
