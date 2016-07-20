package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(UserPokemon.class)
public class UserPokemonRestEventHandler {

  private static final Logger log =
      LoggerFactory.getLogger(UserPokemonRestEventHandler.class);

  @HandleAfterCreate
  public void newPokemon(UserPokemon userPokemon) {
    log.info("REST HandleAfterCreate: " + userPokemon);
  }

  @HandleAfterSave
  public void updatePokemon(UserPokemon userPokemon) {
    log.info("REST HandleAfterSave: " + userPokemon);
  }

  @HandleAfterDelete
  public void deletePokemon(UserPokemon userPokemon) {
    log.info("REST HandleAfterDelete: " + userPokemon);
  }

}
