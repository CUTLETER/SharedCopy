package com.project.tobe.serviceimpl;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.repository.PriceRepository;
import com.project.tobe.service.PriceService;
import com.project.tobe.util.constants.YesNo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceServiceImpl implements PriceService {
    @Autowired
    private PriceRepository priceRepository;

    @Override
    public List<Price> getAllPrice() {
        return priceRepository.findByActivatedEquals(YesNo.Y);
    }

    @Override
    public List<Price> getPriceByDTO(PriceSearchDTO dto) {
        return priceRepository.getPriceByDTO(dto);
    }
}
