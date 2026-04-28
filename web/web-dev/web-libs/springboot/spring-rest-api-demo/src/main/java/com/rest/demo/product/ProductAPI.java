package com.rest.demo.product;

import com.rest.demo.product.Product;
import com.rest.demo.product.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductAPI  {

    private final ProductService service;

    public ProductAPI(ProductService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    // GET by id
    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {


        Product product =  service.getById(id);
         
         ProductResponse productResponse = ProductResponse.builder()
            .name(product.getName())
            .price(product.getPrice())
            .id(product.getId())
            .build();
        return productResponse;
    }

    // CREATE
    @PostMapping
    public ProductResponse create(@RequestBody ProductRequest dto) {
        
         Product product = Product.builder()
            .name(dto.getName())
            .price(dto.getPrice())
            .build();

         Product productCreated =  service.create(product);
         
         ProductResponse productResponse = ProductResponse.builder()
            .name(productCreated.getName())
            .price(productCreated.getPrice())
            .id(productCreated.getId())
            .build();

    return productResponse;
}

    // UPDATE
    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @RequestBody ProductUpdateRequest productUpdateRequest) {

        Product product = Product.builder()
            .name(productUpdateRequest.getName())
            .price(productUpdateRequest.getPrice())
            .build();

        Product productUpdated =  service.update(productUpdateRequest.getId(), product );

        ProductResponse productResponse = ProductResponse.builder()
            .name(productUpdated.getName())
            .price(productUpdated.getPrice())
            .id(productUpdated.getId())
            .build();


        return productResponse;
        
      
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
