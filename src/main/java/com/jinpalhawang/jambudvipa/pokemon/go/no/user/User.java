package com.jinpalhawang.jambudvipa.pokemon.go.no.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class User {

  private @Id String id;
  private String name;
  private Integer level;
  private Integer experiencePoints;
  private Integer starDust;

  private @SuppressWarnings("unused") User() {}

  public User(
      String name,
      Integer level,
      Integer experiencePoints,
      Integer starDust) {
    this.name = name;
    this.level = level;
    this.experiencePoints = experiencePoints;
    this.starDust = starDust;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public Integer getLevel() {
    return level;
  }

  public Integer getExperiencePoints() {
    return experiencePoints;
  }

  public Integer getStarDust() {
    return starDust;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

  public void setExperiencePoints(Integer experiencePoints) {
    this.experiencePoints = experiencePoints;
  }

  public void setStarDust(Integer starDust) {
    this.starDust = starDust;
  }

  @Override
  public String toString() {
    return "User [id=" + id + ", name=" + name + ", level=" + level + ", experiencePoints=" + experiencePoints
        + ", starDust=" + starDust + "]";
  }

}
