"use strict"

//Importation de urlHelper pour fetch, Pokemons pour faire la modèle, ViewPokedex pour faire le view.
import { urlHelper } from "./modulePokedex.js";
import { Pokemons } from "./pokemon.js";
import { ViewPokedex } from "./viewPokedex.js";

class Controller{
    model; 
    view;
    constructor(){
        this.model = new Pokemons(urlHelper.getAllPokemon()); //Au début, on met directement les pokémons de type PokemonMin dans la nouveau modèle (créé). 
        this.view = new ViewPokedex(this); //Construire le view et rendre ses fonctions accessibles pour ses events.
        this.view.updatePokemons(this.model.data_pokemon); //Affecte les données en vue

        this.view.bindUpdatePokemons(this.updatePokemons);
        this.view.bindSelectPokemon(this.selectPokemon);
        this.view.bindChangeShinyOrNormal(this.changeShinyOrNormal);
        this.view.bindnextOrPrecedent(this.nextOrPrecedent);
    }

    updatePokemons = input => {
        if(input.value.length > 0) return this.model.data_filter(input.value);
        return this.model.data_pokemon;
    }

    selectPokemon = (id) => {
        urlHelper.getPokemonSpecified(id).then(pokemon => {
            this.view.changeCardPokemon(pokemon);
            this.model.setPokemonSelected(pokemon);
        });
    }

    nextOrPrecedent = (i) => {
        urlHelper.getPokemonSpecified(this.model.pokemonSelected.id+i).then(pokemon => {
            this.view.changeCardPokemon(pokemon);
            this.model.setPokemonSelected(pokemon);
        });
    }

    changeShinyOrNormal = checked => {
        return (checked) ? this.model.pokemonSelected.urlImageShiny : this.model.pokemonSelected.urlImage;
    }

}

export{Controller};


const controller = new Controller();