package com.project.tobe.serviceimpl;


import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.mapper.EmployeeMapper;
import com.project.tobe.repository.EmployeeRepository;
import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

@Service("employeeService")
public class EmployeeServiceImpl implements EmployeeService {

  @Autowired
  EmployeeMapper employeeMapper;

  @Autowired
  EmployeeRepository repository;

  @Autowired
  BCryptPasswordEncoder bCryptPasswordEncoder;

  @Override
  public Employee getUserById(String id) {
    if (id == null) {
      return null;
    }

    Optional<Employee> employee = repository.findById(id);

    return employee.orElse(null);
  }

  @Override
  public EmployeeDetails login(EmployeeDTO dto) {
    if (dto == null) {
      return null;
    }

    Optional<Employee> employee = repository.findById(dto.getEmployeeId());

    if (employee.isEmpty()) {
      return null;
    }

    if (!employee.get().getEmployeePw().equals(dto.getEmployeePw())) {
      return null;
    }

    return new EmployeeDetails(employee.orElse(null));
  }


  // 전부 조회
  @Override
  public List<EmployeeDTO> getAllList() {
    return employeeMapper.getAllList();

  }

  // 검색 조회
  @Override
  public List<EmployeeDTO> getPickList(EmployeeSearchDTO dto) {
    return employeeMapper.getPickList(dto);
  }


  // 등록
  @Override
  public void employeeRegistTest( List<EmployeeTestDTO> dto) {

    List<EmployeeTestDTO> list = new LinkedList<>();

    for (EmployeeTestDTO employee : dto) {
      employee.setEmployeePw(bCryptPasswordEncoder.encode(employee.getEmployeePw()));
      if(employee.getAuthorityGrade().equals("S")){
        employee.setEmployeeManagerId(null);
      }
      list.add(employee);
    }

    employeeMapper.employeeRegistTest(list);
  }


  // 아이디 중복 검사
  @Override
  public boolean employeeIdCheck(EmployeeDTO dto) {
    int result = employeeMapper.employeeIdCheck(dto);
    System.out.println(result);
    return result > 0 ;
  }



  // 수정
  @Override
  public void employeeUpdateTest(EmployeeTestDTO dto) {

    if (dto.getEmployeePw() != null) {
      dto.setEmployeePw(bCryptPasswordEncoder.encode(dto.getEmployeePw()));
    }

    if (dto.getAuthorityGrade().equals("S")) {
      dto.setEmployeeManagerId(null);
    }

    employeeMapper.employeeUpdateTest(dto);
  }

//삭제
  @Override
  public void employeeDeleteTest(List<String> employeeIds) {

    employeeMapper.employeeDeleteTest(employeeIds);
  }




}
