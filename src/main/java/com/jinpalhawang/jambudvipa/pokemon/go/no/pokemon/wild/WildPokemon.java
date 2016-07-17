package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// TODO: Change to reference Pokemon instead of replicating all Pokemon fields.
// TODO: Add Location/Environment
@Document
public class WildPokemon {

  private @Id ObjectId id;
  private Integer number;
  private String name;
  private String type;
  private String candyToEvolve;
  private Integer numCandyToEvolve;

  private @SuppressWarnings("unused") WildPokemon() {}

  public WildPokemon(
      Integer number,
      String name,
      String type,
      String candyToEvolve,
      Integer numCandyToEvolve) {
    this.number = number;
    this.name = name;
    this.type = type;
    this.candyToEvolve = candyToEvolve;
    this.numCandyToEvolve = numCandyToEvolve;
  }

  public ObjectId getId() {
    return id;
  }

  public Integer getNumber() {
    return number;
  }

  public String getName() {
    return name;
  }

  public String getType() {
    return type;
  }

  public String getCandyToEvolve() {
    return candyToEvolve;
  }

  public Integer getNumCandyToEvolve() {
    return numCandyToEvolve;
  }

  public void setId(ObjectId id) {
    this.id = id;
  }

  public void setNumber(Integer number) {
    this.number = number;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setType(String type) {
    this.type = type;
  }

  public void setCandyToEvolve(String candyToEvolve) {
    this.candyToEvolve = candyToEvolve;
  }

  public void setNumCandyToEvolve(Integer numCandyToEvolve) {
    this.numCandyToEvolve = numCandyToEvolve;
  }

  @Override
  public String toString() {
    return "WildPokemon [id=" + id + ", number=" + number + ", name=" + name + ", type=" + type + ", candyToEvolve="
        + candyToEvolve + ", numCandyToEvolve=" + numCandyToEvolve + "]";
  }

}
