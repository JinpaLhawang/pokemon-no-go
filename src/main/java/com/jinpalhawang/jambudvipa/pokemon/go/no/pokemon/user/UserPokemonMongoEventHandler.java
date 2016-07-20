package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterDeleteEvent;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.jinpalhawang.jambudvipa.pokemon.go.no.WebSocketConfiguration;

@Component
public class UserPokemonMongoEventHandler
    extends AbstractMongoEventListener<UserPokemon> {

  private static final Logger log =
      LoggerFactory.getLogger(UserPokemonMongoEventHandler.class);

  @Autowired
  private SimpMessagingTemplate websocket;

  @Override
  public void onAfterSave(AfterSaveEvent<UserPokemon> event) {
    log.info("MongoDB AfterSaveEvent: " + event.getSource());
    this.websocket.convertAndSend(
        WebSocketConfiguration.MESSAGE_PREFIX + "/newUserPokemon", "");
  }

  @Override
  public void onAfterDelete(AfterDeleteEvent<UserPokemon> event) {
    log.info("MongoDB AfterDeleteEvent: " + event.getSource());
    this.websocket.convertAndSend(
        WebSocketConfiguration.MESSAGE_PREFIX + "/deleteUserPokemon", "");
  }

}
