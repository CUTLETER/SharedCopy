package com.project.tobe.service;

import com.project.tobe.dto.AuthorityDto;
import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.dto.EmployeeSearchDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.security.EmployeeDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeService {
  Employee getUserById(String id);
  EmployeeDetails login(EmployeeDTO dto);
  public List<EmployeeDTO> getAllList();
  public Page<EmployeeDTO> getPickList(EmployeeDTO dto, Pageable pageable);
  public void employeeRegistTest( List<EmployeeTestDTO> dto);
  public void employeeUpdateMaster(EmployeeTestDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
  public boolean employeeIdCheck(EmployeeDTO dto);
  public void employeePwChange(EmployeeDTO dto);
  public AuthorityDto mypageAll(String employeeId);
  public void employeeDeletePick(String employeeId);
  public void employeeUpdateMypage(EmployeeDTO dto);
  public void employeeUpdateMypagePw(EmployeeDTO dto);
  public EmployeeDTO employeeUserSession(String id);

    List<EmployeeDTO> getManagerList(String id);
}
