package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.ArrayList;

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

    // USER
    userRepo.deleteAll();
    userRepo.insert(new User("JinpaLhawang", new ArrayList<UserPokemon>()));
    userRepo.insert(new User("Raoul", new ArrayList<UserPokemon>()));
  }

}
