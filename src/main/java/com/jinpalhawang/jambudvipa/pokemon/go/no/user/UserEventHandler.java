package com.jinpalhawang.jambudvipa.pokemon.go.no.user;

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
public class UserEventHandler extends AbstractMongoEventListener<User> {

  private static final Logger log =
      LoggerFactory.getLogger(UserEventHandler.class);

  @Autowired
  private SimpMessagingTemplate websocket;

  @Override
  public void onAfterSave(AfterSaveEvent<User> event) {
    log.info("MongoDB User AfterSaveEvent: " + event.getSource());
    this.websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX + "/updateUser", "");
  }

  @Override
  public void onAfterDelete(AfterDeleteEvent<User> event) {
    log.info("MongoDB User AfterDeleteEvent: " + event.getSource());
    this.websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX + "/deleteUser", "");
  }

}
