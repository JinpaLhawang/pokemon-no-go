package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

// TODO: Change to reference WildPokemon instead of replicating all WildPokemon fields.
@Document
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class UserPokemon {

  private @Id String id;
  private @NonNull String userId;
  private @NonNull Integer number;
  private @NonNull String name;
  private @NonNull String type;
  private @NonNull String candyToEvolve;
  private @NonNull Integer numCandyToEvolve;
  private @NonNull String wildPokemonId;
  private @NonNull Integer combatPoints;
  private @NonNull Integer healthPoints;
  private boolean captured = true;
  private boolean evolved = false;
  private boolean transferred = false;
}
