package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface WildPokemonRepository extends MongoRepository<WildPokemon, String> {

  public List<WildPokemon> findByIdIn(List<String> ids);

}
