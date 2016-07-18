package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.jinpalhawang.jambudvipa.pokemon.go.no.WebSocketConfiguration;

@Component
public class UserPokemonMongoEventHandler
    extends AbstractMongoEventListener<UserPokemon> {

  @Autowired
  private SimpMessagingTemplate websocket;

  @Override
  public void onAfterSave(AfterSaveEvent<UserPokemon> event) {
    this.websocket.convertAndSend(
        WebSocketConfiguration.MESSAGE_PREFIX + "/newUserPokemon", "");
  }

}
