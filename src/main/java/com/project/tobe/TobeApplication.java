package com.project.tobe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing  // jpa 오디팅 기능 활성화 (jpa가 자동으로 변수 입력)
public class TobeApplication {

	public static void main(String[] args) {
		SpringApplication.run(TobeApplication.class, args);
	}

}
