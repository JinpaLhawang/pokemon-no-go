package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

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
public class WildPokemonMongoEventHandler
    extends AbstractMongoEventListener<WildPokemon> {

  private static final Logger log =
      LoggerFactory.getLogger(WildPokemonMongoEventHandler.class);

  @Autowired
  private SimpMessagingTemplate websocket;

  @Override
  public void onAfterSave(AfterSaveEvent<WildPokemon> event) {
    log.info("AfterSaveEvent: " + event.getSource());
    this.websocket.convertAndSend(
        WebSocketConfiguration.MESSAGE_PREFIX + "/newWildPokemon", "");
  }

  @Override
  public void onAfterDelete(AfterDeleteEvent<WildPokemon> event) {
    log.info("AfterDeleteEvent: " + event.getSource());
    this.websocket.convertAndSend(
        WebSocketConfiguration.MESSAGE_PREFIX + "/deleteWildPokemon", "");
  }

}
