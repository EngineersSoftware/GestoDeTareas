package com.andresh.taskapp.domain.repository;

import java.util.List;
import java.util.Optional;

import com.andresh.taskapp.domain.model.Task;

public interface TaskRepositoryPort {

    List<Task> findAll();
    Optional<Task> findById(Long id);
    Task save(Task task);
    void deleteById(Long id);

}
