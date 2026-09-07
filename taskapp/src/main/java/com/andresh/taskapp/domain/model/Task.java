package com.andresh.taskapp.domain.model;

/**
 * Contrato JSON que viaja al frontend.
 * Jackson usa los getters: getId, getTitle, isCompleted
 * -> { "id": 1, "title": "...", "completed": false }
 * Ese JSON lo recibe Angular en core/task.model.ts
 */
public class Task {

    private Long id;
    private String title;
    private boolean completed;

    public Task() {
    }

    public Task(Long id, String title, boolean completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

}
