import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    fixture.componentRef.setInput('task', {
      id: 1,
      title: 'Tarea de prueba',
      completed: false,
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
