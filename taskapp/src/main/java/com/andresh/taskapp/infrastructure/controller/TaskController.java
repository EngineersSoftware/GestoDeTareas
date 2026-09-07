package com.andresh.taskapp.infrastructure.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andresh.taskapp.application.usecase.TaskUseCase;
import com.andresh.taskapp.domain.model.Task;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

/**
 * Puerta de entrada HTTP del backend.
 *
 * El frontend Angular (http://localhost:4200) llama a estas rutas a través de
 * TaskService (baseUrl = /api/v1/tasks). En desarrollo, proxy.conf.json
 * reenvía /api -> http://localhost:8080, así que:
 *
 *   Angular  GET /api/v1/tasks
 *        ->  proxy
 *        ->  Spring  GET http://localhost:8080/api/v1/tasks
 *
 * Jackson convierte automáticamente esta clase Task (Java) a JSON
 * { id, title, completed }, que es el mismo contrato que frontend/src/app/core/task.model.ts
 */
@RestController
@RequestMapping("api/v1/tasks")
@CrossOrigin(origins = "http://localhost:4200") // Permite que el navegador en el puerto 4200 llame a este API
public class TaskController {

    private final TaskUseCase taskUseCase;

    public TaskController(TaskUseCase taskUseCase) {
        this.taskUseCase = taskUseCase;
    }

    /** Body que envía el frontend en POST: { "title": "..." } */
    public record TaskRequest(@NotBlank String title) {
    }

    /** Body que envía el frontend en PUT: { "title": "...", "completed": true } */
    public record TaskUpdateRequest(String title, Boolean completed) {
    }

    /** Frontend: TaskService.load() -> GET /api/v1/tasks */
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskUseCase.findAll());
    }

    /** Disponible para leer una tarea por id: GET /api/v1/tasks/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskUseCase.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Frontend: TaskService.addTask() -> POST /api/v1/tasks  body { title } */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request) {
        Task createdTask = taskUseCase.createTask(request.title());
        return ResponseEntity.status(201).body(createdTask);
    }

    /** Frontend: TaskService.updateTitle() -> PUT /api/v1/tasks/{id}  body { title } */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskUpdateRequest request) {
        return taskUseCase.updateTask(id, request.title(), request.completed())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Frontend: TaskService.toggleTask() -> PATCH /api/v1/tasks/{id}/toggle */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Task> toggleTask(@PathVariable Long id) {
        return taskUseCase.toggleCompleted(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Frontend: TaskService.deleteTask() -> DELETE /api/v1/tasks/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskUseCase.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

}
