package com.purdue.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
@SpringBootApplication
public class RabbitBackApplication extends SpringBootServletInitializer{
	private SpringApplicationBuilder builder;

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		this.builder = builder;
		return builder.sources(RabbitBackApplication.class);
	}
	public static void main(String[] args) {
		SpringApplication.run(RabbitBackApplication.class, args);
	}

}
