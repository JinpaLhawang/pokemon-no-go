package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WildPokemonRepository extends MongoRepository<WildPokemon, ObjectId> {

  public List<WildPokemon> findByIdIn(List<ObjectId> ids);

}
