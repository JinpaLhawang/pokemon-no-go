package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

  private final PokemonRepository pokemonRepository;
  private final WildPokemonRepository wildPokemonRepository;

  @Autowired
  public DatabaseLoader(PokemonRepository pokemonRepository, WildPokemonRepository wildPokemonRepository) {
    this.pokemonRepository = pokemonRepository;
    this.wildPokemonRepository = wildPokemonRepository;
  }

  @Override
  public void run(String... args) throws Exception {

    pokemonRepository.deleteAll();
    wildPokemonRepository.deleteAll();

    pokemonRepository.save(new Pokemon(1, "Bulbasaur", "Grass/Poison", 14, 10, "Bulbasaur Candy", 25));
    pokemonRepository.save(new Pokemon(13, "Weedle", "Bug/Poison", 50, 26, "Weedle Candy", 15));
    pokemonRepository.save(new Pokemon(14, "Kakuna", "Bug/Poison", 50, 28, "Weedle Candy", 50));

    wildPokemonRepository.save(new WildPokemon(19, "Rattata", "Normal", 10, 10, "Rattata Candy", 25));
    wildPokemonRepository.save(new WildPokemon(20, "Raticate", "Normal", 50, 14, null, null));

    List<ObjectId> pokemonIds = new ArrayList<ObjectId>();

    System.out.println("\nPokemons found with findAll():");
    for (Pokemon pokemon : pokemonRepository.findAll()) {
      System.out.println(pokemon);
      pokemonIds.add(pokemon.getId());
    }

    System.out.println("\nPokemons found with findByIdIn(pokemonIds):");
    pokemonIds.remove(0);
    System.out.println(pokemonRepository.findByIdIn(pokemonIds));

    System.out.println();

    List<ObjectId> wildPokemonIds = new ArrayList<ObjectId>();

    System.out.println("\nWild Pokemons found with findAll():");
    for (WildPokemon wildPokemon : wildPokemonRepository.findAll()) {
      System.out.println(wildPokemon);
      wildPokemonIds.add(wildPokemon.getId());
    }

    System.out.println("\nWild Pokemons found with findByIdIn(wildPokemonIds):");
    wildPokemonIds.remove(0);
    System.out.println(wildPokemonRepository.findByIdIn(wildPokemonIds));

    System.out.println();
  }

}
