package com.andresh.taskapp.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.andresh.taskapp.application.usecase.TaskUseCase;
import com.andresh.taskapp.domain.repository.TaskRepositoryPort;

@Configuration 
public class BeanConfig {

    @Bean 
    public TaskUseCase taskUseCase(TaskRepositoryPort taskRepositoryPort){
        return new TaskUseCase(taskRepositoryPort);
    }

}
