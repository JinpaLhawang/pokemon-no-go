package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface UserPokemonRepository extends MongoRepository<UserPokemon, String> {

  public List<UserPokemon> findByIdIn(List<String> ids);

  public Page<UserPokemon> findByUserId(@Param("userId") String userId, Pageable pageable);

}
