package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user.UserPokemon;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user.UserPokemonRepository;
import com.jinpalhawang.jambudvipa.pokemon.go.no.user.User;
import com.jinpalhawang.jambudvipa.pokemon.go.no.user.UserRepository;

@Component
public class DatabaseLoader implements CommandLineRunner {

  private final UserRepository userRepo;
  private final UserPokemonRepository userPokemonRepo;

  @Autowired
  public DatabaseLoader(
      UserRepository userRepo,
      UserPokemonRepository userPokemonRepo) {
    this.userRepo = userRepo;
    this.userPokemonRepo = userPokemonRepo;
  }

  @Override
  public void run(String... args) throws Exception {

    // USER POKEMON
    userPokemonRepo.deleteAll();

    final UserPokemon jinpaBulbasaur = userPokemonRepo.insert(
        new UserPokemon(1, "Bulbasaur", "Grass/Poison", "Bulbasaur Candy",
            25, 14, 10, true, false, false));

    System.out.println("\n\n\nUser Pokemons found with findAll():");
    for (UserPokemon userPokemon : userPokemonRepo.findAll()) {
      System.out.println(userPokemon);
    }

    // USER
    userRepo.deleteAll();

    final List<UserPokemon> jinpaBackpack = new ArrayList<UserPokemon>();
    jinpaBackpack.add(jinpaBulbasaur);

    userRepo.insert(new User("JinpaLhawang", jinpaBackpack));

    System.out.println("\n\n\nUsers found with findAll():");
    for (final User user : userRepo.findAll()) {
      System.out.println(user);
    }

    System.out.println("\n\n\n");

  }

}
