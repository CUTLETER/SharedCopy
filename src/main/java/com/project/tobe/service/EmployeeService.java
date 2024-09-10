package com.project.tobe.service;

import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.entity.Employee;

import java.util.List;

public interface EmployeeService {

  public List<Employee> getAllList();
  public List<Employee> getPickList(EmployeeSearchDTO dto);
}
