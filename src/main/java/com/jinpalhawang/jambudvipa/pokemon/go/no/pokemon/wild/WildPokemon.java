package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import java.util.List;

import org.joda.time.DateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.jinpalhawang.jambudvipa.pokemon.go.no.JsonJodaDateTimeSerializer;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

// TODO: Change to reference Pokemon instead of replicating all Pokemon fields.
// TODO: Add Location/Environment
@Document
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class WildPokemon {

  private @Id String id;
  private @NonNull Integer number;
  private @NonNull String name;
  private @NonNull String type;
  private @NonNull String candyToEvolve;
  private @NonNull Integer numCandyToEvolve;
  private DateTime spawnDate = DateTime.now();
  private DateTime despawnDate = spawnDate.plusMinutes(30);
  private boolean available = true;
  private @NonNull List<String> taggedByUser;

  @JsonSerialize(using = JsonJodaDateTimeSerializer.class)
  public DateTime getSpawnDate() {
    return spawnDate;
  }

  @JsonSerialize(using = JsonJodaDateTimeSerializer.class)
  public DateTime getDespawnDate() {
    return despawnDate;
  }

}
