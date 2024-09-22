package com.project.tobe.serviceImpl;


import com.project.tobe.dto.AuthorityDto;
import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.dto.EmployeeTestDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.mapper.EmployeeMapper;
import com.project.tobe.repository.EmployeeRepository;
import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.service.EmployeeService;
import com.project.tobe.dto.RequestList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
  public Page<EmployeeDTO> getPickList(EmployeeDTO dto, Pageable pageable) {
    int total = employeeMapper.getPickListTotal(dto);

    RequestList<?> requestList = RequestList.builder()
            .data(dto)
            .pageable(pageable)
            .build();

    System.out.println(requestList);

    List<EmployeeDTO> list= employeeMapper.getPickList(requestList);

    return new PageImpl<>(list, pageable, total);
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

  @Override
  public void employeePwChange(EmployeeDTO dto) {
    if (dto.getEmployeePw() != null) {
      dto.setEmployeePw(bCryptPasswordEncoder.encode(dto.getEmployeePw()));
    }
    employeeMapper.employeePwChange(dto);
  }

  @Override
  public AuthorityDto mypageAll(String employeeId) {
    System.out.println(employeeMapper.mypageAll(employeeId).toString());
    return employeeMapper.mypageAll(employeeId);
  }




  // 수정
  @Override
  public void employeeUpdateMaster(EmployeeTestDTO dto) {
    System.out.println(dto.toString() + "야야야ㅑㅇ");
    if (dto.getAuthorityGrade().equals("S")) {
      dto.setEmployeeManagerId(null);
    }

    employeeMapper.employeeUpdateMaster(dto);
  }

//삭제
  @Override
  public void employeeDeleteTest(List<String> employeeIds) {

    employeeMapper.employeeDeleteTest(employeeIds);
  }
  @Override
  public void employeeDeletePick(String employeeId) {
    employeeMapper.employeeDeletePick(employeeId);
  }

  @Override
  public void employeeUpdateMypage(EmployeeDTO dto) {
    employeeMapper.employeeUpdateMypage(dto);
  }

  @Override
  public void employeeUpdateMypagePw(EmployeeDTO dto) {
    System.out.println("pw " + dto.getEmployeePw());
    if (dto.getEmployeePw() != null) {
      dto.setEmployeePw(bCryptPasswordEncoder.encode(dto.getEmployeePw()));
    }

    employeeMapper.employeeUpdateMypagePw(dto);
  }

  @Override
  public EmployeeDTO employeeUserSession(String id) {
    return employeeMapper.employeeUserSession(id);
  }

  @Override
    public List<EmployeeDTO> getManagerList(String id) {
        return employeeMapper.getManagerList(id);
    }


}
