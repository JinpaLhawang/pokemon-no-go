package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserPokemonRepository extends MongoRepository<UserPokemon, ObjectId> {

  public List<UserPokemon> findByIdIn(List<ObjectId> ids);

}
