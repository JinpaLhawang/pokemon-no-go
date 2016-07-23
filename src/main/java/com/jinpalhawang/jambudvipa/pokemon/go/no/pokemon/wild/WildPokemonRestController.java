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

  @RequestMapping(value = "/api/{userName}/{wildPokemonId}/capture")
  public void capture(@PathVariable String userName, @PathVariable String wildPokemonId) {

    // Get User
    final User user = userRepo.findByName(userName);

    // Get Wild Pokemon
    final WildPokemon wildPokemon = wildPokemonRepo.findOne(wildPokemonId);
    log.info("User: " + userName + " capturing Wild Pokemon: " + wildPokemonId);

    // Delete Wild Pokemon
    wildPokemonRepo.delete(wildPokemon);

    // Insert User Pokemon
    final UserPokemon userPokemon = userPokemonRepo.insert(
        new UserPokemon(user.getName(),
            wildPokemon.getNumber(), wildPokemon.getName(), wildPokemon.getType(),
            wildPokemon.getCandyToEvolve(), wildPokemon.getNumCandyToEvolve(),
            wildPokemon.getId(),
            10, 10));
    log.info("User: " + userName + " caught User Pokemon: " + userPokemon);

    // Increase User Experience Points
    user.increaseExperiencePoints(100);

    // Save User
    userRepo.save(user);
  }

}
