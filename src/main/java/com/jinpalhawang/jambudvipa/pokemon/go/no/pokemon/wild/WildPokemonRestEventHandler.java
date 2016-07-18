package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import static com.jinpalhawang.jambudvipa.pokemon.go.no.WebSocketConfiguration.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(WildPokemon.class)
public class WildPokemonEventHandler {

  private final SimpMessagingTemplate websocket;
  private final EntityLinks entityLinks;

  @Autowired
  public WildPokemonEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
    this.websocket = websocket;
    this.entityLinks = entityLinks;
  }

  @HandleAfterCreate
  public void newWildPokemon(WildPokemon wildPokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/newWildPokemon", getPath(wildPokemon));
  }

  @HandleAfterSave
  public void updateWildPokemon(WildPokemon wildPokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/updateWildPokemon", getPath(wildPokemon));
  }

  @HandleAfterDelete
  public void deleteWildPokemon(WildPokemon wildPokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/deleteWildPokemon", getPath(wildPokemon));
  }

  private String getPath(WildPokemon wildPokemon) {
    return this.entityLinks.linkForSingleResource(wildPokemon.getClass(), wildPokemon.getId())
        .toUri().getPath();
  }

}
