package com.project.tobe.controller;

import com.project.tobe.dto.PriceSearchDTO;
import com.project.tobe.entity.Price;
import com.project.tobe.entity.Product;
import com.project.tobe.service.PriceService;
import com.project.tobe.util.constants.URLConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.project.tobe.util.constants.URLConstants.*;

@RestController
@RequestMapping(PRICE_HOME)
public class PriceController {
    @Autowired
    private PriceService priceService;

    @GetMapping(PRICE_ALL)
    public Map<String, List<?>> getAllPrice() {
        List<Price> priceList = priceService.getAllPrice();
        List<Product> productList = new ArrayList<>();

        Map<String, List<?>> map = new HashMap<>();
        map.put("priceList", priceList);
        map.put("productList", productList);

        return map;
    }

    @PostMapping(value=SEARCH_PRICE , produces = "application/json", consumes = "application/json")
    public List<Price> searchPrice(@RequestBody PriceSearchDTO dto) {
        System.out.println(dto);
        return priceService.getPriceByDTO(dto);
    }
}
