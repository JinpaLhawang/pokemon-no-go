package com.jinpalhawang.jambudvipa.pokemon.go.no;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class PokemonNoGoRestController {

  @RequestMapping(value = "/")
  public String index() {
    return "index";
  }

}
