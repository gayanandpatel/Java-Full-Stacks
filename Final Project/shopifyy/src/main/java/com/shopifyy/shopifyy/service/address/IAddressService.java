package com.shopifyy.shopifyy.service.address;

import java.util.List;

import com.shopifyy.shopifyy.dtos.AddressDto;
import com.shopifyy.shopifyy.model.Address;

public interface IAddressService {
    List<Address>  createAddress(List<Address> addressList, Long userId);
    List<Address> getUserAddresses(Long userId);
    Address getAddressById(Long addressId);
    void deleteAddress(Long addressId);
    Address updateAddress(Long id, Address address);

    List<AddressDto> convertToDto(List<Address> addressList);

    AddressDto convertToDto(Address address);
}
