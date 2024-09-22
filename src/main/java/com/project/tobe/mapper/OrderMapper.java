package com.project.tobe.mapper;
import com.project.tobe.dto.*;
import com.querydsl.core.types.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface OrderMapper {
    List<OrderHDTO> getOrder(OrderSearchDTO criteria); //jsy 조건조회
    List<PriceDTO> getPrice(@Param("iocn") Integer iocn, @Param("delDate") String delDate); //jsy 주문등록 판매가 가져오기
    void registOrderH(OrderHDTO hdto); //jsy 주문 등록하기 - 헤더
    void registOrderB(List<OrderBDTO> list); //jsy 주문 등록하기 - 바디
    String getMyName(String myId); //이름 얻기


    /*유선화 START*/
    OrderHDTO getOrderDetail(Long orderNo); // 상세 조회
    int updateApproval(@Param("orderNo") Long orderNo,
                       @Param("confirmStatus") String confirmStatus,
                       @Param("confirmChangeDate") LocalDate confirmChangeDate,
                       @Param("remarks") String remarks);
    void updateOrderHeader(OrderUp1DTO orderUp1DTO);
    void deleteOrderDetails(Long orderNo);
    void insertOrderDetail(@Param("orderNo") Long orderNo, @Param("detail") OrderUp2DTO detail);
    void insertBack1(OrderUp1DTO orderUp1DTO);
    void insertBack2(@Param("orderBList") List<OrderUp2DTO> orderBList, @Param("orderNo") Long orderNo);
    int updateTempOrder(OrderHDTO orderHDTO);
    int insertOrderDetails(List<OrderBDTO> orderBList);
    int deleteOrder(@Param("orderNo") Long orderNo);
    /*유선화 END*/
}
