package com.project.tobe.dto;


import lombok.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class EmployeeTestDTO {

  private String employeeId;
  private String employeePw;
  private String employeeName;
  private String employeeTel;
  private String employeeEmail;
  private String employeeAddr;
  private String residentNum;
  private LocalDate hireDate;
  private Long salary;
  private String employeeManagerId;
  private String authorityGrade;
  private String emplYn;
}
