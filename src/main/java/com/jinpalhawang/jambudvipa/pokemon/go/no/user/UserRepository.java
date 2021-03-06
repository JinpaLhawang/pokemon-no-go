package com.jinpalhawang.jambudvipa.pokemon.go.no.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends MongoRepository<User, String> {

  public User findByName(@Param("name") String name);

}
