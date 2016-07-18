package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserPokemonRepository extends MongoRepository<UserPokemon, String> {

  public List<UserPokemon> findByIdIn(List<String> ids);

}
