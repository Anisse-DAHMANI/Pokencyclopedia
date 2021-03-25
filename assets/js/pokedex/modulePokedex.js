"use strict"

import {PokemonMin, Pokemon} from "./pokemon.js";


function capitalize(s){
    if (typeof s !== 'string') return ''
    const str = s.charAt(0).toUpperCase() + s.slice(1);
    return str.replace(/(^|[\s-])\S/g, function (match) {
        return match.toUpperCase().replace(/-/g, ' ');
    });
}

function getTypesArray(p){
    const types_array = [];
    p.types.forEach(type => {
        types_array.push(type.type.name)
    });
    return types_array;
}

function getStats(p){
    const stats = {};
    p.stats.forEach(stat => {
        stats[stat.stat.name] = stat["base_stat"]
    })
    return stats;
}

function getInfosFromPokemon(id){
    return new Promise((resolve, reject) => {
        const url = "https://pokeapi.co/api/v2/pokemon/"+id;
        fetch(url).
        then((response) => response.json()).
        then(data => {
            const urlImage = data.sprites.front_default;
            const urlImageShiny = data.sprites.front_shiny;
            const name = data.name;
            const types = getTypesArray(data);
            const height = data.height;
            const weight = data.weight;
            const stats = getStats(data);
            resolve({id:id, urlImage:urlImage, urlImageShiny:urlImageShiny, name:name, types:types, height:height, weight:weight, stats:stats});
        }).
        catch(error => reject(error));
    })
}


function getInfosFromSpecies(id){
    return new Promise((resolve, reject) => {
    const url = "https://pokeapi.co/api/v2/pokemon-species/"+id;
    fetch(url).
    then((response) => response.json()).
    then(data => {
            resolve(data);
            //resolve([data.flavor_text_entries[0].flavor_text.replace(/(\r\n|\n|\r)/gm," "), (data.habitat == null) ? "Unknown" : data.habitat.name, data.shape.name]);
        });
    })
}

const urlHelper = {

    getAllPokemon(){
        const urls = [];
        const data_pokemon = [];
    
        for (let index = 1; index < 899; index++) {
        urls.push("https://pokeapi.co/api/v2/pokemon/" + index);
        }
    
    
        Promise.all(urls.map(url => 
            fetch(url)
            .then(response => response.json())
            .then(responseJson => responseJson)
            .catch(error => console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message))
            ))
            .then(data => {
                data.forEach(p => {
                    if(p !== undefined){
                        const types_array = getTypesArray(p);
                        data_pokemon.push(new PokemonMin(p.id, p.sprites.front_default, capitalize(p.name), types_array));
                    }
                });
                console.log(data);
                document.querySelector("#loading").classList.add("hide");
                document.querySelector("#inputPokemon").classList.remove("hide");
            })
        return data_pokemon;
    },

    getPokemonSpecified(id){
        
        return new Promise((resolve, reject) => {
            getInfosFromPokemon(id).then(dataP => {
                getInfosFromSpecies(id).then(dataS => {

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
                    const pokemon = new Pokemon(id, urlImage, urlImageShiny, name, types, height, weight, description, habitat, shape, stats);
                    resolve(pokemon);
                })
            });
        })
    }
}


export{urlHelper}