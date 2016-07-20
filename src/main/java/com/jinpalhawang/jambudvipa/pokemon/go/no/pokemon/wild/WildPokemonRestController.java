package com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user.UserPokemon;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user.UserPokemonRepository;
import com.jinpalhawang.jambudvipa.pokemon.go.no.user.User;
import com.jinpalhawang.jambudvipa.pokemon.go.no.user.UserRepository;

@RestController
public class WildPokemonRestController {

  private static final Logger log =
      LoggerFactory.getLogger(WildPokemonRestController.class);

  @Autowired
  private UserRepository userRepo;

  @Autowired
  private WildPokemonRepository wildPokemonRepo;

  @Autowired
  private UserPokemonRepository userPokemonRepo;

  @RequestMapping(value = "/api/{wildPokemonId}/capture")
  public void capture(@PathVariable String wildPokemonId) {

    final WildPokemon wildPokemon = wildPokemonRepo.findOne(wildPokemonId);
    log.info("Capturing Wild Pokemon: " + wildPokemon);

    wildPokemonRepo.delete(wildPokemon);

    final UserPokemon userPokemon = userPokemonRepo.insert(
        new UserPokemon(wildPokemon.getNumber(), wildPokemon.getName(),
            wildPokemon.getType(), wildPokemon.getCandyToEvolve(),
            wildPokemon.getNumCandyToEvolve(), 10, 10, true, false, false));
    log.info("Caught Wild Pokemon: " + userPokemon);

    final User user = userRepo.findByName("JinpaLhawang");
    user.getBackpack().add(userPokemon);
  }

}
