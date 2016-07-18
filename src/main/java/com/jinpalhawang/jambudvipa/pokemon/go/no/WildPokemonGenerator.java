package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.Pokemon;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.PokemonRepository;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild.WildPokemon;
import com.jinpalhawang.jambudvipa.pokemon.go.no.pokemon.wild.WildPokemonRepository;

@Component
public class WildPokemonGenerator implements CommandLineRunner {

  private final PokemonRepository pokemonRepo;
  private final WildPokemonRepository wildPokemonRepo;

  private final Random random = new Random();

  @Autowired
  public WildPokemonGenerator(
      PokemonRepository pokemonRepo,
      WildPokemonRepository wildPokemonRepo) {
    this.pokemonRepo = pokemonRepo;
    this.wildPokemonRepo = wildPokemonRepo;
  }

  @Override
  public void run(String... args) throws Exception {

    // POKEMON
    pokemonRepo.deleteAll();

    pokemonRepo.insert(new Pokemon(1, "Bulbasaur", "Grass/Poison", "Bulbasaur Candy", 25));
    pokemonRepo.insert(new Pokemon(13, "Weedle", "Bug/Poison", "Weedle Candy", 12));
    pokemonRepo.insert(new Pokemon(16, "Pidgey", "Normal/Flying", "Pidgey Candy", 12));
    pokemonRepo.insert(new Pokemon(19, "Rattata", "Normal", "Rattata Candy", 25));

    System.out.println("\n\n\nPokemon found with findAll():");
    for (final Pokemon pokemon : pokemonRepo.findAll()) {
      System.out.println(pokemon);
    }

    // WILD POKEMON
    wildPokemonRepo.deleteAll();

    // BEGIN SPAWNING!
    while (true) {
      Thread.sleep(10000);
      if (random.nextInt(10) > 6) {
        final List<Pokemon> pokemons = pokemonRepo.findAll();
        final Pokemon pokemon = pokemons.get(random.nextInt(pokemons.size()));
        System.out.println("Spawning random Pokemon...");
        System.out.println(pokemon);
        wildPokemonRepo.insert(new WildPokemon(pokemon.getNumber(),
            pokemon.getName(), pokemon.getType(), pokemon.getCandyToEvolve(),
            pokemon.getNumCandyToEvolve()));
      }
    }
  }

}
