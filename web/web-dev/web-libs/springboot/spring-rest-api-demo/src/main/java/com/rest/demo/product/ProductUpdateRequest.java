package com.rest.demo.product;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductUpdateRequest {
    private Long id;
    private String name;
    private double price;
}
