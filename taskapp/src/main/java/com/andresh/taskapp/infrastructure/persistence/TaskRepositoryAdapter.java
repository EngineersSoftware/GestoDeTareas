package com.andresh.taskapp.infrastructure.persistence;

import org.springframework.stereotype.Component;
import com.andresh.taskapp.domain.repository.TaskRepositoryPort;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.andresh.taskapp.domain.model.Task;

@Component
public class TaskRepositoryAdapter implements TaskRepositoryPort {

    private final SpringDataTaskRepository repository;

    public TaskRepositoryAdapter(SpringDataTaskRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Task> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Task> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = new TaskEntity(task.getId(), task.getTitle(), task.isCompleted());
        TaskEntity savedEntity = repository.save(entity);
        return new Task(savedEntity.getId(), savedEntity.getTitle(), savedEntity.isCompleted());
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    private Task toDomain(TaskEntity entity) {
        return new Task(entity.getId(), entity.getTitle(), entity.isCompleted());
    }

}
