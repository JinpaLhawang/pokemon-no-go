package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import static com.jinpalhawang.jambudvipa.pokemon.go.no.WebSocketConfiguration.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(UserPokemon.class)
public class UserPokemonRestEventHandler {

  private static final Logger log =
      LoggerFactory.getLogger(UserPokemonRestEventHandler.class);

  private final SimpMessagingTemplate websocket;
  private final EntityLinks entityLinks;

  @Autowired
  public UserPokemonRestEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
    this.websocket = websocket;
    this.entityLinks = entityLinks;
  }

  @HandleAfterCreate
  public void newPokemon(UserPokemon userPokemon) {
    log.info("HandleAfterCreate: " + userPokemon);
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/newUserPokemon", getPath(userPokemon));
  }

  @HandleAfterSave
  public void updatePokemon(UserPokemon userPokemon) {
    log.info("HandleAfterSave: " + userPokemon);
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/updateUserPokemon", getPath(userPokemon));
  }

  @HandleAfterDelete
  public void deletePokemon(UserPokemon userPokemon) {
    log.info("HandleAfterDelete: " + userPokemon);
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/deleteUserPokemon", getPath(userPokemon));
  }

  private String getPath(UserPokemon userPokemon) {
    return this.entityLinks.linkForSingleResource(userPokemon.getClass(), userPokemon.getId())
        .toUri().getPath();
  }

}
