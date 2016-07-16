package com.jinpalhawang.jambudvipa.pokemon.go.no;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

  private final PokemonRepository repository;

  @Autowired
  public DatabaseLoader(PokemonRepository repository) {
    this.repository = repository;
  }

  @Override
  public void run(String... args) throws Exception {

    repository.deleteAll();

    repository.save(new Pokemon(1, "Bulbasaur", "Grass/Poison", 14, 10, "Bulbasaur Candy", 25));
    repository.save(new Pokemon(13, "Weedle", "Bug/Poison", 50, 26, "Weedle Candy", 15));
    repository.save(new Pokemon(14, "Kakuna", "Bug/Poison", 50, 28, "Weedle Candy", 50));

    List<ObjectId> ids = new ArrayList<ObjectId>();

    System.out.println("\nPokemons found with findAll():");
    for (Pokemon pokemon : repository.findAll()) {
      System.out.println(pokemon);
      ids.add(pokemon.getId());
    }

    System.out.println("\nPokemons found with findByIdIn(ids):");
    ids.remove(0);
    System.out.println(repository.findByIdIn(ids));

    System.out.println();
  }

}
