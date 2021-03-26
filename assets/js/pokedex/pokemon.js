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

//MODELE - Ici, on stocke ici les pokémons obtenus ET un pokémon selectionné par fetch, clic grâce au contrôleur.
class Pokemons{
    data_pokemon; //Pour les pokémons de PokemonMin pour faire les minis-cartes.
    pokemonSelected; //Pour le pokémon sélectionné
    constructor(data){
        this.data_pokemon = data; //Stocke les pokémons de PokemonMin
        this.pokemonSelected = null; //Parce qu'au début, on n'a pas encore selectionné.
    }

    data_filter(value){ //retourne les pokémons dont son nom qui est partiellement égal au input de notre site.
        return this.data_pokemon.filter(pokemon => pokemon.name.toUpperCase().includes(value.toUpperCase()))
    }

    setPokemonSelected(pokemon){
        this.pokemonSelected=pokemon; //Stocke/Change le pokémon selectionné
    }

}


//Pas besoin d'expliquer MAIS ce classe est fait POUR la gestion d'un pokémon selectionné.
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

//Export pour que les fonctions de la module peut transformer les objets en PokemonMin ou Pokemon. C'est pour que le contrôleur puisse créer une modèle en utiliser "Pokemons" aussi.
export{PokemonMin, Pokemons, Pokemon};