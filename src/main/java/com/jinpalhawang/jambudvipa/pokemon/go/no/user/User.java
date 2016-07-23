package com.jinpalhawang.jambudvipa.pokemon.go.no.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Document
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class User {

  private @Id String id;
  private @NonNull String name;
  private @NonNull Integer level;
  private @NonNull Integer experiencePoints;
  private @NonNull Integer stardust;

  public void increaseExperiencePoints(final Integer amount) {
    this.experiencePoints = experiencePoints + amount;
  }

}
