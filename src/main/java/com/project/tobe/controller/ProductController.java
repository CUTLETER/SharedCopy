package com.project.tobe.controller;

import com.project.tobe.entity.Product;
import com.project.tobe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepository.findAllByOrderByProductNoDesc();
    }

    @PostMapping("/updateProductYn")
    public void updateProductYn(@RequestBody List<Long> productNos) {
        productRepository.updateProductYn(productNos);
    }

    @PostMapping("/addProduct")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PostMapping("/updateProduct")
    public Product updateProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping("/getProduct")
    public Product getProduct(@RequestParam Long productNo) {
        return productRepository.findById(productNo).get();
    }
}
