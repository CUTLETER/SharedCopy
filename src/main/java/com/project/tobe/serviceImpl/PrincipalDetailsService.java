package com.project.tobe.serviceImpl;

import com.project.tobe.entity.Employee;
import com.project.tobe.repository.EmployeeRepository;
//import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.security.EmployeeDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

  private final EmployeeRepository employeeRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Employee employee = employeeRepository.findById(username)
        .orElseThrow(() -> {
          return new UsernameNotFoundException("해당 유저를 찾을 수 없습니다.");
        });
    return new EmployeeDetails(employee);
  }
}
