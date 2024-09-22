package com.project.tobe.controller;


import com.project.tobe.dto.*;
import com.project.tobe.dto.EmployeeDTO;
import com.project.tobe.entity.Employee;
import com.project.tobe.security.EmployeeDetails;
import com.project.tobe.service.EmployeeService;
import com.project.tobe.util.PageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

//  @Autowired
//  private EmployeeRepository employeeRepository;

  @Autowired
  @Qualifier("employeeService")
  private EmployeeService employeeService;

//    @GetMapping("/employeeOne")
//    public Employee employeeOne() {
//        Employee e = new Employee("hyeju11"	,"asdf1234",	"임혜주",	"010-1111-1111"	,"asdf@gamil.com"	,"서울"	,"11111-1111111" , LocalDate.parse("2020-01-01", DateTimeFormatter.ISO_LOCAL_DATE),	(long)120000	,"master",	"S");
//        return e;
//        }

  @GetMapping("/employeeALL")
  public List<EmployeeDTO> employeeALL() {
    List<EmployeeDTO> emploList = employeeService.getAllList();
    return employeeService.getAllList();
  }




  @PostMapping("/employeeSearch")
  public PageVO<EmployeeDTO> employeePick(@RequestBody EmployeeDTO dto) {
    Pageable pageable = PageRequest.of(dto.getPage() - 1, dto.getAmount());

    Page<EmployeeDTO> page = employeeService.getPickList(dto, pageable);

    System.out.println(new PageVO<>(page).toString());

    return new PageVO<>(page);
  }


  @PostMapping("/employeeRegist")
  public void employeeRegistTest(@RequestBody List<EmployeeTestDTO> dto) {
    employeeService.employeeRegistTest(dto);
  }


  @PostMapping("/employeeIdCheck")
  public boolean employeeIdCheck(@RequestBody EmployeeDTO dto) {
    return employeeService.employeeIdCheck(dto);
  }

  @PostMapping("/employeeUpdate")
  public void employeeUpdateMaster(@RequestBody EmployeeTestDTO dto) {
    employeeService.employeeUpdateMaster(dto);
  }

  @PostMapping("/employeeDelete")
  public void employeeDeleteTest(@RequestBody List<String> employeeIds) {
    employeeService.employeeDeleteTest(employeeIds);
  }

  @PostMapping("/employeeDeletePick")
  public void employeeDeletePick(@RequestBody String employeeId) {
    System.out.println("컨");
    employeeService.employeeDeletePick(employeeId);
  }


  @PostMapping("/employeePwChange")
  public void employeePwChange(@RequestBody EmployeeDTO dto) {
    employeeService.employeePwChange(dto);
  }

  @GetMapping("/user-info")
  public ResponseEntity<?> employeeUserInfo(Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

    EmployeeDetails user = (EmployeeDetails)authentication.getPrincipal(); //인증객체 안에 principal값을 얻으면 유저객체가 나옵니다.

    // 사용자 이름과 권한을 반환
    Map<String, Object> response = new HashMap<>();
    response.put("userId", user.getUsername());
    response.put("grade", user.getUserAuthorityGrade());

    return ResponseEntity.ok(response);
  }
}
