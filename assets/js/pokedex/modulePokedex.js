"use strict"

////Importation des classes. Cela nous permet de retourner les objets au contrôleur en spécifiant son type par ces classes.
import {PokemonMin, Pokemon} from "./pokemon.js";

//Rendre majuscules le premier lettre et les lettres après "-" et supprime "-". 
function capitalize(s){
    if (typeof s !== 'string') return ''
    const str = s.charAt(0).toUpperCase() + s.slice(1);
    return str.replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase().replace(/-/g, ' ');
    });
}

//Traitement des types
function getTypesArray(p){
    const types_array = [];
    p.types.forEach(type => {
        types_array.push(type.type.name)
    });
    return types_array;
}

//Traitement des stats
function getStats(p){
    const stats = {};
    p.stats.forEach(stat => {
        stats[stat.stat.name] = stat["base_stat"]
    })
    return stats;
}

//Permet d'obtenir des données d'un pokémon ID de https://pokeapi.co/api/v2/pokemon/ID
function getInfosFromPokemon(id){
    //lors d'appel de fonction, on fait donc la promise
    return new Promise((resolve, reject) => {

        //URL
        const url = "https://pokeapi.co/api/v2/pokemon/"+id;

        //EN train de fetch les données à partir de ce URL.
        fetch(url).
        then((response) => response.json()). //Mettre les données en JSON
        then(data => {
            // TRAITEMENT DES DONNEES
            const urlImage = data.sprites.front_default;
            const urlImageShiny = data.sprites.front_shiny;
            const name = capitalize(data.name);
            const types = getTypesArray(data);
            const height = data.height;
            const weight = data.weight;
            const stats = getStats(data);
            // FIN DE TRAITEMENT DES DONNEES

            resolve({id:id, urlImage:urlImage, urlImageShiny:urlImageShiny, name:name, types:types, height:height, weight:weight, stats:stats}); // Retourne l'object dans une variable lors l'utilisation de then
        }).
        catch(error => reject(error)); //DAns le cas d'erreur.
    })
}

//Permet d'obtenir des données d'un pokémon ID de https://pokeapi.co/api/v2/pokemon-species/ID
function getInfosFromSpecies(id){
    //lors d'appel de fonction, on fait donc la promise
    return new Promise((resolve, reject) => {
        // URL
        const url = "https://pokeapi.co/api/v2/pokemon-species/"+id;
        //EN train de fetch les données à partir de ce URL.
        fetch(url).
        then((response) => response.json()).
        then(data => {
            resolve(data); //Pas besoin de traitement. On le retourne directement.
        });
    })
}

const urlHelper = { //On exporte ce variable pour que la contrôleur puisse utiliser ces fonctions comme si ici c'est une vrai module pour le jeu des promises et fetchs

    //Fonction permet de retourner les pokémons (sans trop de détail). Donc c'est de la type PokemonMin
    getAllPokemon(){
        const urls = []; //Init l'array des urls.
        const data_pokemon = []; //Init l'array des pokémons PokemonMin
    
        for (let index = 1; index < 899; index++) { //Pour de 1 à 899, ajouter l'url à l'array des urls
        urls.push("https://pokeapi.co/api/v2/pokemon/" + index);
        }

        //Pour tous les urls, obtenir les données de Pokemons #ID par l'url https://pokeapi.co/api/v2/pokemon/
        Promise.all(urls.map(url => 
            fetch(url)
            .then(response => response.json()) //Mettre les données en JSON
            .then(responseJson => responseJson)
            .catch(error => console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message)) // Dans le cas d'erreur
            ))
            .then(data => {
                //Pour tous les pokémons trouvés à partir d'url, faire
                data.forEach(p => {
                    if(p !== undefined){ //Oui il pourrait y arriver que cela fait 404. Ce qui rend undefined le retour (Pourtant, j'ai essayé de copier et coller l'url qui m'a emmené au erreur 404. Je me suis trouvé sur le bon Json sans erreur)
                        const types_array = getTypesArray(p); //Traitement des types.
                        data_pokemon.push(new PokemonMin(p.id, p.sprites.front_default, capitalize(p.name), types_array)); //Ajouter le pokémon créé en type PokemonMin
                    }
                });
                document.querySelector("#loading").classList.add("hide");

            })
        return data_pokemon; //On retourne tous les pokémons créés.
    },

    getPokemonSpecified(id){
        //lors d'appel de fonction, on fait donc la promise
        return new Promise((resolve, reject) => {
            getInfosFromPokemon(id).then(dataP => { // Ici, on obtient dataP. Ce sont les données du pokémon ID de la partie "pokemon" grâce à son resolve.
                getInfosFromSpecies(id).then(dataS => { //De même pour la partie "pokemon-species"
                    //TRAITEMENT DES DONNEES
                    const urlImage = dataP.urlImage;
                    const urlImageShiny = dataP.urlImageShiny;
                    const name = dataP.name;
                    const types = dataP.types;
                    const height = dataP.height;
                    const weight = dataP.weight;
                    const stats = dataP.stats;
                    const description = dataS.flavor_text_entries[0].flavor_text.replace(/(\r\n|\n|\r)/gm," ").replace(//, " ");
                    const habitat = (dataS.habitat == null) ? "Unknown" : capitalize(dataS.habitat.name);
                    const shape = capitalize(dataS.shape.name);
                    //FIN DE TRAITEMENT DES DONNEES

                    //Creation de pokemon (avec de détails donc en type Pokemon).
                    const pokemon = new Pokemon(id, urlImage, urlImageShiny, name, types, height, weight, description, habitat, shape, stats);
                    resolve(pokemon); //On retourne le pokémon selectionné.
                })
            });
        })
    }
}

//EXPORTATION Pour que le contrôleur puisse utiliser cela.
export{urlHelper}