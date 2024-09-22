package com.project.tobe.mapper;

import com.project.tobe.dto.AuthorityDto;
import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.dto.RequestList;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmployeeMapper {

  public List<EmployeeDTO> getAllList();
  public List<EmployeeDTO> getPickList(EmployeeDTO dto);
  public List<EmployeeDTO> getPickList(RequestList<?> requestList);
  int getPickListTotal(EmployeeDTO dto);
  public void employeeRegistTest( List<EmployeeTestDTO> dto);
  public void employeeUpdateMaster(EmployeeTestDTO dto);
  public void employeeUpdateUser(EmployeeTestDTO dto);
  public void employeeDeleteTest(List<String> employeeIds);
  public int employeeIdCheck(EmployeeDTO dto);
  public AuthorityDto mypageAll(String employeeId);
  public void employeePwChange(EmployeeDTO dto);
  public AuthorityDto sessionAuth(String id);
  public void employeeDeletePick(String employeeId);
  public void employeeUpdateMypage(EmployeeDTO dto);
  public void employeeUpdateMypagePw(EmployeeDTO dto);
  public EmployeeDTO employeeUserSession(String id);
    List<EmployeeDTO> getManagerList(String id);
}

