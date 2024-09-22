package com.project.tobe.dto;

import lombok.*;
import org.springframework.data.domain.Pageable;

@Builder
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class RequestList<T> {
    private T data;
    private Pageable pageable;
}
