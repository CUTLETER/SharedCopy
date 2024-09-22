package com.project.tobe.config;

import com.project.tobe.dto.UserRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

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
    //http.authorizeRequests( (authorize) -> authorize.antMatchers("/*.do").authenticated().anyRequest().permitAll() );



    http
        .authorizeRequests()
//        .antMatchers("/login.user").permitAll() // 로그인 페이지는 인증 없이 접근 허용
//        .antMatchers("/employee.do").hasAnyRole(UserRole.S.toString(), UserRole.A.toString()) // "/employee.do" 경로는 "A","S" 역할을 가진 사용자만 접근 가능
//        .antMatchers("/*.do").authenticated() // ".do"로 끝나는 모든 요청은 인증된 사용자만 접근 가능
        .anyRequest().permitAll()
        .and()
        .formLogin()
        .loginPage("/login.user")
        .usernameParameter("employeeId")
        .passwordParameter("employeePw")
        .loginProcessingUrl("/loginForm") //로그인 페이지를 가로채 시큐리티가 제공하는 클래스로 로그인을 연결합니다.
		    .defaultSuccessUrl("/main.do")
        .failureUrl("/login.user?err=true")
        .and()
        .logout()//로그인 성공시 이동될 URL을 적습니다
        .logoutUrl("/logout")
        .logoutSuccessUrl("/login.user")
        .invalidateHttpSession(true).deleteCookies("JSESSIONID")
        .and()
			  .exceptionHandling()
        .accessDeniedPage("/accessDenied"); //accessDenied

//    http
//        .authorizeRequests()
//        .antMatchers("/login.user").permitAll() // 로그인 페이지는 인증 없이 접근 허용
//        .antMatchers("/employee.do").hasAnyRole(UserRole.S.toString(), UserRole.A.toString()) // "/employee.do" 경로는 "A","S" 역할을 가진 사용자만 접근 가능
//        .antMatchers("/*.do").authenticated()
////        .anyRequest().permitAll()
//        .and()
//        .formLogin()
//        .loginPage("/login.user")
//        .usernameParameter("employeeId")
//        .passwordParameter("employeePw")
//        .loginProcessingUrl("/loginForm") //로그인 페이지를 가로채 시큐리티가 제공하는 클래스로 로그인을 연결합니다.
//		    .defaultSuccessUrl("/main.do")
//        .failureUrl("/login.user?err=true")
//        .and()
//        .logout()//로그인 성공시 이동될 URL을 적습니다
//        .logoutUrl("/logout")
//        .logoutSuccessUrl("/login.user")
//        .invalidateHttpSession(true).deleteCookies("JSESSIONID")
//        .and()
//			  .exceptionHandling()
//        .accessDeniedPage("/accessDenied"); //accessDenied

    return http.build();
  }

}


