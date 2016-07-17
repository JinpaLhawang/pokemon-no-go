package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon;

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
@RepositoryEventHandler(Pokemon.class)
public class PokemonEventHandler {

  private final SimpMessagingTemplate websocket;
  private final EntityLinks entityLinks;

  @Autowired
  public PokemonEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
    this.websocket = websocket;
    this.entityLinks = entityLinks;
  }

  @HandleAfterCreate
  public void newPokemon(Pokemon pokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/newPokemon", getPath(pokemon));
  }

  @HandleAfterSave
  public void updatePokemon(Pokemon pokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/updatePokemon", getPath(pokemon));
  }

  @HandleAfterDelete
  public void deletePokemon(Pokemon pokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/deletePokemon", getPath(pokemon));
  }

  private String getPath(Pokemon pokemon) {
    return this.entityLinks.linkForSingleResource(pokemon.getClass(), pokemon.getId())
        .toUri().getPath();
  }

}
