package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

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
@RepositoryEventHandler(UserPokemon.class)
public class UserPokemonEventHandler {

  private final SimpMessagingTemplate websocket;
  private final EntityLinks entityLinks;

  @Autowired
  public UserPokemonEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
    this.websocket = websocket;
    this.entityLinks = entityLinks;
  }

  @HandleAfterCreate
  public void newPokemon(UserPokemon userPokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/newUserPokemon", getPath(userPokemon));
  }

  @HandleAfterSave
  public void updatePokemon(UserPokemon userPokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/updateUserPokemon", getPath(userPokemon));
  }

  @HandleAfterDelete
  public void deletePokemon(UserPokemon userPokemon) {
    this.websocket.convertAndSend(MESSAGE_PREFIX + "/deleteUserPokemon", getPath(userPokemon));
  }

  private String getPath(UserPokemon userPokemon) {
    return this.entityLinks.linkForSingleResource(userPokemon.getClass(), userPokemon.getId())
        .toUri().getPath();
  }

}
