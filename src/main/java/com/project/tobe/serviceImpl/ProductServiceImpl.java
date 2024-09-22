package com.project.tobe.serviceImpl;

import com.project.tobe.entity.Product;
import com.project.tobe.repository.ProductRepository;
import com.project.tobe.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> getProductList() {
        return productRepository.findByProductYnEquals('Y');
    }
}
