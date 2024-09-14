package com.project.tobe.config;

import org.springframework.boot.autoconfigure.security.reactive.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity //시큐리티 설정파일을 시큐리티 필터에 등록
public class SecurityConfig {


  @Bean
  public BCryptPasswordEncoder encoder() {
    return new BCryptPasswordEncoder();
  }



  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    //csrf토큰 사용x
    http.csrf().disable();

    //all페지이는 인증만되면 들어갑니다. user페이지에 대해서 user권한이 필요합니다. admin페이지에 대해서 admin권한이 필요합니다.
    //나머지 모든 요청은 요청을 허용합니다.
//		http.authorizeRequests( (authorize) -> authorize.antMatchers("/*.do").authenticated().anyRequest().permitAll() );


    http
        .formLogin().
        loginPage("/login.user")
        .usernameParameter("employeeId")
        .passwordParameter("employeePw")
        .loginProcessingUrl("/loginForm") //로그인 페이지를 가로채 시큐리티가 제공하는 클래스로 로그인을 연결합니다.
		    .defaultSuccessUrl("/main.do")
        .failureUrl("/login.user?err=true")
        .and()
        .logout()//로그인 성공시 이동될 URL을 적습니다
        .logoutUrl("/logout")
        .logoutSuccessUrl("/login.user")
        .invalidateHttpSession(true).deleteCookies("JSESSIONID");


    return http.build();
  }

}


