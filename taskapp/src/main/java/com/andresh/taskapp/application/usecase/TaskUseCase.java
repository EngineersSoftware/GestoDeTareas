package com.andresh.taskapp.application.usecase;

import com.andresh.taskapp.domain.repository.TaskRepositoryPort;
import java.util.List;
import java.util.Optional;
import com.andresh.taskapp.domain.model.Task;

public class TaskUseCase {

    private final TaskRepositoryPort taskRepositoryPort;

    public TaskUseCase(TaskRepositoryPort taskRepositoryPort) {
        this.taskRepositoryPort = taskRepositoryPort;
    }

    public List<Task> findAll() {
        return taskRepositoryPort.findAll();
    }

    public Optional<Task> findById(Long id) {
        return taskRepositoryPort.findById(id);
    }

    public Task createTask(String title){
        Task newTask = new Task(null, title.trim(), false);
        return taskRepositoryPort.save(newTask);
    }

    public Optional<Task> updateTask(Long id, String title, Boolean completed) {
        return taskRepositoryPort.findById(id).map(task -> {
            if (title != null && !title.isBlank()) {
                task.setTitle(title.trim());
            }
            if (completed != null) {
                task.setCompleted(completed);
            }
            return taskRepositoryPort.save(task);
        });
    }

    public Optional<Task> toggleCompleted(Long id) {
        return taskRepositoryPort.findById(id).map(task -> {
            task.setCompleted(!task.isCompleted());
            return taskRepositoryPort.save(task);
        });
    }

    public void deleteTask(Long id){
        taskRepositoryPort.deleteById(id);
    }

}
