"use strict"

class PokemonMin{ //Pokemon sans détail (histoire d'optimiser RAM (éviter de prendre trop de mo pour un page)).
    id;
    name;
    urlImage;
    types;

    constructor(id, urlImage, name, types){
        this.id = id;
        this.urlImage = urlImage;
        this.name = name;
        this.types = types;
    }
}

class Pokemons{
    data_pokemon;
    pokemonSelected;
    constructor(data){
        this.data_pokemon = data;
        this.pokemonSelected = null;
    }

    data_filter(value){
        return this.data_pokemon.filter(pokemon => pokemon.name.toUpperCase().includes(value.toUpperCase()))
    }

    setPokemonSelected(pokemon){
        this.pokemonSelected=pokemon;
    }

}

class Pokemon{
    id;
    name;
    urlImage;
    urlImageShiny;
    types;
    height;
    weight;
    description;
    habitat;
    shape;
    stats;
    constructor(id, urlImage, urlImageShiny, name, types, height, weight, description, habitat, shape,stats){
        this.id = id;
        this.urlImage = urlImage;
        this.urlImageShiny = urlImageShiny;
        this.name = name;
        this.types = types;
        this.height = height;
        this.weight = weight;
        this.description = description;
        this.habitat = habitat;
        this.shape = shape;
        this.stats = stats;
    }
}

export{PokemonMin, Pokemons, Pokemon};