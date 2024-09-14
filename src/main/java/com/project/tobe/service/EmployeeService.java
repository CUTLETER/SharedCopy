package com.project.tobe.service;

import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.security.EmployeeDetails;

import java.util.List;

public interface EmployeeService {
  Employee getUserById(String id);
  EmployeeDetails login(EmployeeDTO dto);
  public List<EmployeeDTO> getAllList();
  public List<EmployeeDTO> getPickList(EmployeeSearchDTO dto);
  public void employeeRegistTest( List<EmployeeTestDTO> dto);
  public void employeeUpdateTest(EmployeeTestDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
  public boolean employeeIdCheck(EmployeeDTO dto);
}
