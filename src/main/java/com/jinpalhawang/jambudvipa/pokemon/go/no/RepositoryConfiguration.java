package com.jinpalhawang.jambudvipa.pokemon.go.no;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild.WildPokemon;

@Configuration
public class RepositoryConfiguration extends RepositoryRestConfigurerAdapter {

  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
    config.exposeIdsFor(WildPokemon.class);
  }

}
