package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import java.util.List;

import org.joda.time.DateTime;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;

public interface WildPokemonRepository extends MongoRepository<WildPokemon, String> {

  public List<WildPokemon> findByIdIn(List<String> ids);

  public List<WildPokemon> findByTaggedByUserNot(@Param("userId") String userId, Pageable pageable);

  public List<WildPokemon> findByDespawnDateGreaterThan(
      @Param("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) DateTime date);

  @Query(value = "{ 'despawnDate': { '$gt': ?0 }, 'taggedByUser': { '$ne': ?1 } }")
  public List<WildPokemon> findByDespawnDateGreaterThanAndTaggedByUserNot(
      @Param("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) DateTime date,
      @Param("userId") String userId);

  public List<WildPokemon> findByAvailableIsTrue();

  public List<WildPokemon> findByAvailableIsTrueAndTaggedByUserNot(@Param("userId") String userId, Pageable pageable);

}
