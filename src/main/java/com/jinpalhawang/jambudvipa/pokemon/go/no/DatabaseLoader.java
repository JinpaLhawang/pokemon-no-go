package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.Pokemon;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.PokemonRepository;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user.UserPokemon;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.user.UserPokemonRepository;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild.WildPokemon;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild.WildPokemonRepository;
import com.jinpalhawang.jambudvipa.pokemon.go.no.user.User;
import com.jinpalhawang.jambudvipa.pokemon.go.no.user.UserRepository;

@Component
public class DatabaseLoader implements CommandLineRunner {

  private final PokemonRepository pokemonRepo;
  private final WildPokemonRepository wildPokemonRepo;
  private final UserRepository userRepo;
  private final UserPokemonRepository userPokemonRepo;

  @Autowired
  public DatabaseLoader(
      PokemonRepository pokemonRepo,
      WildPokemonRepository wildPokemonRepo,
      UserRepository userRepo,
      UserPokemonRepository userPokemonRepo) {
    this.pokemonRepo = pokemonRepo;
    this.wildPokemonRepo = wildPokemonRepo;
    this.userRepo = userRepo;
    this.userPokemonRepo = userPokemonRepo;
  }

  @Override
  public void run(String... args) throws Exception {

    // POKEMON
    pokemonRepo.deleteAll();

    pokemonRepo.save(new Pokemon(1, "Bulbasaur", "Grass/Poison", "Bulbasaur Candy", 25));
    pokemonRepo.save(new Pokemon(13, "Weedle", "Bug/Poison", "Weedle Candy", 15));
    pokemonRepo.save(new Pokemon(14, "Kakuna", "Bug/Poison", "Weedle Candy", 50));
    pokemonRepo.save(new Pokemon(19, "Rattata", "Normal", "Rattata Candy", 25));
    pokemonRepo.save(new Pokemon(20, "Raticate", "Normal", "", 0));

    System.out.println("\n\n\nPokemon found with findAll():");
    for (final Pokemon pokemon : pokemonRepo.findAll()) {
      System.out.println(pokemon);
    }

    // WILD POKEMON
    wildPokemonRepo.deleteAll();

    wildPokemonRepo.save(new WildPokemon(13, "Weedle", "Bug/Poison", "Weedle Candy", 15));
    wildPokemonRepo.save(new WildPokemon(19, "Rattata", "Normal", "Rattata Candy", 25));

    System.out.println("\n\n\nWild Pokemons found with findAll():");
    for (final WildPokemon wildPokemon : wildPokemonRepo.findAll()) {
      System.out.println(wildPokemon);
    }

    // USER POKEMON
    userPokemonRepo.deleteAll();

    final UserPokemon jinpaBulbasaur1 = userPokemonRepo.save(new UserPokemon(1, "Bulbasaur", "Grass/Poison", "Bulbasaur Candy", 25, 14, 10, true, false, false));
    final UserPokemon jinpaWeedle1 = userPokemonRepo.save(new UserPokemon(13, "Weedle", "Bug/Poison", "Weedle Candy", 15, 50, 26, true, false, false));
    final UserPokemon jinpaKaruna1 = userPokemonRepo.save(new UserPokemon(14, "Kakuna", "Bug/Poison", "Weedle Candy", 50, 50, 28, true, false, false));

    System.out.println("\n\n\nUser Pokemons found with findAll():");
    for (UserPokemon userPokemon : userPokemonRepo.findAll()) {
      System.out.println(userPokemon);
    }

    // USER
    userRepo.deleteAll();

    final List<UserPokemon> jinpaBackpack = new ArrayList<UserPokemon>();
    jinpaBackpack.add(jinpaBulbasaur1);
    jinpaBackpack.add(jinpaWeedle1);
    jinpaBackpack.add(jinpaKaruna1);

    userRepo.save(new User("JinpaLhawang", jinpaBackpack));

    System.out.println("\n\n\nUsers found with findAll():");
    for (final User user : userRepo.findAll()) {
      System.out.println(user);
    }

    System.out.println("\n\n\n");

  }

}
