package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterDeleteEvent;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.jinpalhawang.jambudvipa.pokemon.go.no.WebSocketConfiguration;

@Component
public class WildPokemonMongoEventHandler
    extends AbstractMongoEventListener<WildPokemon> {

  @Autowired
  private SimpMessagingTemplate websocket;

  @Override
  public void onAfterSave(AfterSaveEvent<WildPokemon> event) {
    this.websocket.convertAndSend(
        WebSocketConfiguration.MESSAGE_PREFIX + "/newWildPokemon", "");
  }

  @Override
  public void onAfterDelete(AfterDeleteEvent<WildPokemon> event) {
    this.websocket.convertAndSend(
        WebSocketConfiguration.MESSAGE_PREFIX + "/deleteWildPokemon", "");
  }

}
