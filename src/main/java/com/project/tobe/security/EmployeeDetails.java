package com.project.tobe.security;

import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.dto.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class EmployeeDetails implements UserDetails {

  private Employee employee;
  private EmployeeDTO employeedto;

  public EmployeeDetails(Employee employee) {
    this.employee = employee;
  }

  // 권한 관련 작업을 하기 위한 role return
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    Collection<GrantedAuthority> authorities = new ArrayList<>();

    try {
      UserRole role = UserRole.valueOf(employee.getAuthorityGrade());  // authorityGrade를 UserRole Enum으로 변환
      authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));  // ROLE_ 접두사 붙이기
    } catch (IllegalArgumentException e) {
      // authorityGrade 값이 UserRole Enum에 정의되어 있지 않은 경우의 처리
      System.err.println("Invalid authorityGrade value: " + employee.getAuthorityGrade());
    }

    return authorities;
  }

  // get Password 메서드
  @Override
  public String getPassword() {
    return employee.getEmployeePw();
  }

  // get Username 메서드 (생성한 User은 loginId 사용)
  @Override
  public String getUsername() {
    return employee.getEmployeeId();
  }

  public String getNickname() {
    System.out.println(employee.toString());
    System.out.println(employee.getEmployeeName());
    return employee.getEmployeeName();
  }


  public String getUserAuthorityGrade() {
    return employee.getAuthorityGrade();
  }

//  public String getUserAuthorityName() {
//    System.out.println(employeedto.getAuthorityName());
//    return employeedto.getAuthorityName();
//  }


  // 계정이 만료 되었는지 (true: 만료X)
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  // 계정이 잠겼는지 (true: 잠기지 않음)
  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  // 비밀번호가 만료되었는지 (true: 만료X)
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  // 계정이 활성화(사용가능)인지 (true: 활성화)
  @Override
  public boolean isEnabled() {
    return true;
  }
}
