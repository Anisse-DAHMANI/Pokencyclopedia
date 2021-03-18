"use strict"

  
fetch("https://pokeapi.co/api/v2/pokemon-species/charmander")
.then(response => response.json())
.then(result => console.log(result))
.catch(error => console.log('error', error));

fetch("https://pokeapi.co/api/v2/pokemon/4")
.then(response => response.json())
.then(result => console.log(result))
.catch(error => console.log('error', error));