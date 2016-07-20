package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(WildPokemon.class)
public class WildPokemonRestEventHandler {

  private static final Logger log =
      LoggerFactory.getLogger(WildPokemonRestEventHandler.class);

  @HandleAfterCreate
  public void newWildPokemon(WildPokemon wildPokemon) {
    log.info("REST HandleAfterCreate: " + wildPokemon);
  }

  @HandleAfterSave
  public void updateWildPokemon(WildPokemon wildPokemon) {
    log.info("REST HandleAfterSave: " + wildPokemon);
  }

  @HandleAfterDelete
  public void deleteWildPokemon(WildPokemon wildPokemon) {
    log.info("REST HandleAfterDelete: " + wildPokemon);
  }

}
