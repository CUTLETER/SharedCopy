package com.project.tobe.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class Criteria {
    // 화면에 전달할 값들을 가지고 다니는 클래스
    private int page;
    private int amount; // 조회하는 데이터 개수

    // 검색 키워드
    private String searchType;
    private String searchName; // 제목

    public Criteria() {
        this.page = 1;
        this.amount = 10;
    }

    public Criteria(int page, int amount) {
        this.page = page;
        this.amount = amount;
    }

    // offset - limit 함수에 앞에 전달될 값
    public int getPageStart() {
        return (page - 1) * amount;
    }
}
