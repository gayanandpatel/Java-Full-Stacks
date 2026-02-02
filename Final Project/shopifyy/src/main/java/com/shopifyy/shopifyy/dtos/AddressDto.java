package com.shopifyy.shopifyy.dtos;

import lombok.Data;

@Data
public class AddressDto {
    private Long id;
    private String country;
    private String state;
    private String city;
    private String street;
    private String postalCode;
    private String mobileNumber;

    private String addressType;
}

