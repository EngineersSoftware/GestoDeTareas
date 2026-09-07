package com.andresh.taskapp.infrastructure.persistence;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository 
public interface SpringDataTaskRepository extends JpaRepository<TaskEntity, Long> {
    

}
