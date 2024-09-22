package com.project.tobe.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum UserRole {

    S("대표"),
    A("부장"),
    B("과장"),
    C("대리"),
    D("사원");

  private String value;
}