"use strict"

import{Controller} from "./controllerPokedex.js";

class ViewPokedex{
    app;
    controller;
    skills_item;
    inputSearch;
    checkBoxShiny;
    constructor(controller){
        const skills_bar = document.querySelector(".skills-bars");
        skills_bar.style.opacity = "100%";
        skills_bar.style.height = "250px";
        this.skills_item = document.querySelectorAll(".skills-item");
        this.skills_item.forEach((item, i) => {               
            item.style.width = "100px";                
            item.style.left = i * 100 + "px";
        });

        this.inputSearch = document.querySelector("#inputSearch");
        this.checkBoxShiny = document.querySelector("#checkboxShiny");

        if(controller instanceof Controller) this.controller = controller;

        Vue.component('my-type', {
            props: ["type"],
            template: `
                <span class="type" :class="type.type"></span>
            `
        })  
        
        
        Vue.component('my-pokemon', {
            props: ['pokemon'],
            template: `
                <div @click="afficher" class="card-panel grey lighten-5 z-depth-1 card-pokemon">
                    <div class="col">
                        <div class="row s3 center">
                            <img :src="getImgUrl()" alt="Photo de pokemon">
                        </div>
                        <div class="row s1 center">
                            <span>#{{ pokemon.id }}</span>
                        </div>
                        <div class="row s1 center">
                            <h6>{{ pokemon.name }}</h6>
                        </div>
                        <div class="row s1 center">
                            <my-type v-for="type_item in types" v-bind:type="type_item"></my-type>
                        </div>
                    </div>
                </div>
            `,
        
            data :function () {
                const types_object = [];
                this.pokemon.types.forEach(t => {
                    types_object.push({type:t});
                });
                return {
                    types : types_object
            }},
        
            methods : {
                afficher : function() {
                    controller.selectPokemon(this.pokemon.id);
                    document.querySelector("#card-pokemon-detail").classList.remove("hide");
                },
        
                getImgUrl() {
                    return this.pokemon.urlImage;
                },

            }
        
        }) 
        
        this.app = new Vue({
            el:'#app',
            data : {
                pokemons : null
            },
        })
    }

    changeCardPokemon(pokemon){
        const stats = pokemon.stats;
        document.querySelector("#attack").dataset.percent = stats.attack;
        document.querySelector("#attack_special").dataset.percent = stats["special-attack"];
        document.querySelector("#defense_special").dataset.percent = stats["special-defense"]; 
        document.querySelector("#defense").dataset.percent = stats.defense;
        document.querySelector("#speed").dataset.percent = stats.speed;

        let maxScore = 0;

        this.skills_item.forEach((item) => {    
            if(parseFloat(item.querySelector("span").dataset.percent) > maxScore) maxScore = item.querySelector("span").dataset.percent;
        });

        this.skills_item.forEach((item) => {    
            const score = (parseFloat(item.querySelector("span").dataset.percent)/maxScore)*100;           
            item.style.height = score + "%";
            item.querySelector("span").innerHTML = score.toFixed(1) + "%";
        });

        let str_type = "Type(s) : ";
        pokemon.types.forEach(type => str_type+= "<span class=\"type "+type+"\"></span>");
        document.querySelector("#types").innerHTML = str_type;

        document.querySelector("#idPokemon").innerHTML = "#" + pokemon.id;
        document.querySelector("#descriptionPokemon").innerHTML = pokemon.description;
        document.querySelector("#height").innerHTML = "Height : " + pokemon.height + "m";
        document.querySelector("#weight").innerHTML = "Weight : " + pokemon.weight + "kg";
        document.querySelector("#habitat").innerHTML = "Habitat : " + pokemon.habitat;
        document.querySelector("#shape").innerHTML = "Shape : " + pokemon.shape;

        document.querySelector("#pokemonImage").setAttribute("src", pokemon.urlImage);
    }

    changeShinyOrNormal(urlImage){
        document.querySelector("#pokemonImage").setAttribute("src", urlImage)
    }

}

export{ViewPokedex};