import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TaskService } from './task';

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load tasks from the backend', async () => {
    const loadPromise = service.load();
    const request = http.expectOne('/api/v1/tasks');
    request.flush([{ id: 1, title: 'Probar API', completed: false }]);
    await loadPromise;

    expect(service.tasks()).toEqual([{ id: 1, title: 'Probar API', completed: false }]);
    expect(service.pendingTasks()).toBe(1);
  });
});
