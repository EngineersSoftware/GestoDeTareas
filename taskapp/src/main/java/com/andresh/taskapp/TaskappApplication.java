package com.andresh.taskapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskappApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskappApplication.class, args);
		System.out.println("!El Backend de TaskApp esta corriendo!");
	}

}
