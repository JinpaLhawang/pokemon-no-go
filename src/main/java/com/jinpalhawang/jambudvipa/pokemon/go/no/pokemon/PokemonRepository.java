package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PokemonRepository extends MongoRepository<Pokemon, String> {

  public List<Pokemon> findByIdIn(List<String> ids);

}
