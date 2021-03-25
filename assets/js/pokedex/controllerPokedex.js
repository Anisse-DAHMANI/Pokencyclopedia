"use strict"

import { urlHelper } from "./modulePokedex.js";
import { Pokemons } from "./pokemon.js";
import { ViewPokedex } from "./viewPokedex.js";

class Controller{
    model;
    view;
    constructor(){
        this.model = new Pokemons(urlHelper.getAllPokemon());
        this.view = new ViewPokedex(this);
        this.view.app.pokemons = this.model.data_pokemon;

        const input = this.view.inputSearch;
        input.addEventListener("input", (event) => {
            if(input.value.length > 0) this.view.app.pokemons = this.model.data_filter(input.value);
            else this.view.app.pokemons = this.model.data_pokemon;
        });

        const checkBoxShiny = this.view.checkBoxShiny;
        checkBoxShiny.addEventListener("click", (event)=>{
            let url;
            (checkBoxShiny.checked) ? url = this.model.pokemonSelected.urlImageShiny : url = this.model.pokemonSelected.urlImage;
            this.view.changeShinyOrNormal(url);
        })
    }

    selectPokemon(id){
        urlHelper.getPokemonSpecified(id).then(pokemon => {
            this.view.changeCardPokemon(pokemon);
            this.model.setPokemonSelected(pokemon);
        });
    }
}

export{Controller};


const controller = new Controller();