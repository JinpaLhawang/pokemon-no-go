package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface WildPokemonRepository extends MongoRepository<WildPokemon, String> {

  public List<WildPokemon> findByIdIn(List<String> ids);

  public List<WildPokemon> findByTaggedByUserNot(@Param("userId") String userId, Pageable pageable);

}
