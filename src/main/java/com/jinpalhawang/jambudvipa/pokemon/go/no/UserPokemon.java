package com.jinpalhawang.jambudvipa.pokemon.go.no;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// TODO: Change to reference WildPokemon instead of replicating all WildPokemon fields.
@Document
public class UserPokemon {

  private @Id ObjectId id;
  private Integer number;
  private String name;
  private String type;
  private String candyToEvolve;
  private Integer numCandyToEvolve;
  private Integer combatPoints;
  private Integer healthPoints;
  private boolean captured;
  private boolean evolved;
  private boolean transferred;

  private @SuppressWarnings("unused") UserPokemon() {}

  public UserPokemon(
      Integer number,
      String name,
      String type,
      String candyToEvolve,
      Integer numCandyToEvolve,
      Integer combatPoints,
      Integer healthPoints,
      boolean captured,
      boolean evolved,
      boolean transferred) {
    this.number = number;
    this.name = name;
    this.type = type;
    this.candyToEvolve = candyToEvolve;
    this.numCandyToEvolve = numCandyToEvolve;
    this.combatPoints = combatPoints;
    this.healthPoints = healthPoints;
    this.captured = captured;
    this.evolved = evolved;
    this.transferred = transferred;
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

  public Integer getCombatPoints() {
    return combatPoints;
  }

  public Integer getHealthPoints() {
    return healthPoints;
  }

  public boolean isCaptured() {
    return captured;
  }

  public boolean isEvolved() {
    return evolved;
  }

  public boolean isTransferred() {
    return transferred;
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

  public void setCombatPoints(Integer combatPoints) {
    this.combatPoints = combatPoints;
  }

  public void setHealthPoints(Integer healthPoints) {
    this.healthPoints = healthPoints;
  }

  public void setCaptured(boolean captured) {
    this.captured = captured;
  }

  public void setEvolved(boolean evolved) {
    this.evolved = evolved;
  }

  public void setTransferred(boolean transferred) {
    this.transferred = transferred;
  }

  @Override
  public String toString() {
    return "UserPokemon [id=" + id + ", number=" + number + ", name=" + name + ", type=" + type + ", candyToEvolve="
        + candyToEvolve + ", numCandyToEvolve=" + numCandyToEvolve + ", combatPoints=" + combatPoints
        + ", healthPoints=" + healthPoints + ", captured=" + captured + ", evolved=" + evolved + ", transferred="
        + transferred + "]";
  }

}
