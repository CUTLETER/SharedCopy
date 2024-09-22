package com.project.tobe.repository;

import com.project.tobe.dto.PriceProductCustomerDTO;
import com.project.tobe.dto.PriceDTO;
import com.project.tobe.entity.Customer;
import com.project.tobe.entity.Price;
import com.project.tobe.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PriceCustomRepository {
    Page<PriceProductCustomerDTO> getPriceJoinByDTO(PriceDTO dto, Pageable pageable);

    void updatePrice(PriceDTO dto);
    void updateOldPrice(Price price);
    List<Price> getPriceList(Customer customer, Product product);
}
