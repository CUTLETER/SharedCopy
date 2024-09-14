package com.project.tobe.repository;

import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Price;

import java.util.List;

public interface PriceCustomRepository {
    List<Price> getPriceByDTO(PriceDTO dto);
    List<PriceProductCustomerDTO> getPriceJoinByDTO(PriceDTO dto);

    void updatePrice(PriceDTO dto);
    void updateOldPrice(Price price);
}
