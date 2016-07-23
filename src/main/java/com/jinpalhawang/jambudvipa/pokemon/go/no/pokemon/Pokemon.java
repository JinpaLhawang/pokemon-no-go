package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon;

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
public class Pokemon {

  private @Id String id;
  private @NonNull Integer number;
  private @NonNull String name;
  private @NonNull String type;
  private @NonNull String candyToEvolve;
  private @NonNull Integer numCandyToEvolve;

}
