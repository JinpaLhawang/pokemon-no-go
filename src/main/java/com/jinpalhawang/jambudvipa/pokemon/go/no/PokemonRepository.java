package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PokemonRepository extends MongoRepository<Pokemon, ObjectId> {

  public List<Pokemon> findByIdIn(List<ObjectId> ids);

}
