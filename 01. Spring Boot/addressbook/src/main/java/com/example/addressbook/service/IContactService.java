package com.example.addressbook.service;

import java.util.List;

import com.example.addressbook.model.Contact;

public interface IContactService {
    Contact addContact(Contact request);
    Contact updateContact(Long id, Contact contact);
    Contact getContact(Long id);
    void deleteContact(Long id);
    List<Contact> getContacts();
}
