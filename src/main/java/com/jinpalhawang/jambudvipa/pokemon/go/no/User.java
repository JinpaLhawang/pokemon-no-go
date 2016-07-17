package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class User {

  private @Id ObjectId id;
  private String name;
  private List<UserPokemon> backpack;

  private @SuppressWarnings("unused") User() {}

  public User(String name, List<UserPokemon> backpack) {
    this.name = name;
    this.backpack = backpack;
  }

  public ObjectId getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public List<UserPokemon> getBackpack() {
    return backpack;
  }

  public void setId(ObjectId id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setBackpack(List<UserPokemon> backpack) {
    this.backpack = backpack;
  }

  @Override
  public String toString() {
    return "User [id=" + id + ", name=" + name + ", backpack=" + backpack + "]";
  }

}
