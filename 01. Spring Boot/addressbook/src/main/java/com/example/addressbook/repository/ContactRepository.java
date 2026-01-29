package com.example.addressbook.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.addressbook.model.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {

}
