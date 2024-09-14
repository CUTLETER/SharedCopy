package com.project.tobe.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class AuthorityDto {

  private String authority_name;
  private String authority_grade;

}
