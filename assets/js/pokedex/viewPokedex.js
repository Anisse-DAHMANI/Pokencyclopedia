"use strict"

//Importation de la classe Controller
import{Controller} from "./controllerPokedex.js";
// Cela nous permet d'appeler une fonction sans erreur grâce à sa reconnaissance pour lui faire une event dans un cas

class ViewPokedex{
    app; //Vue app
    controller; //son Controleur
    skills_item; //Liste des compétences (En réalité, ce sont les statistiques.)
    inputSearch; //Entrée de la chaîne des caractères pour la recherche
    buttonSearch;
    checkBoxShiny; //CheckBox pour afficher Normal/Shiny
    constructor(controller){
        
        //EARLY

        //PREPARATION : Travail avec DOM pour le rendering de statistiques
        const skills_bar = document.querySelector(".skills-bars");
        skills_bar.style.opacity = "100%";
        skills_bar.style.height = "250px";
        this.skills_item = document.querySelectorAll(".skills-item");
        this.skills_item.forEach((item, i) => {               
            item.style.width = "100px";                
            item.style.left = i * 100 + "px";
        });
        //FIN DE PREPARATION

        //INITIALISATION
        this.inputSearch = document.querySelector("#inputSearch");
        this.checkBoxShiny = document.querySelector("#checkboxShiny");
        this.buttonSearch = document.querySelector("#buttonSearch");

        document.querySelector("#close").addEventListener("click", (event)=>{ //Ajouter le pouvoir de fermer le fenetre avec le bouton
            document.querySelector("#card-pokemon-detail").classList.add("hide");
        })

        if(controller instanceof Controller) this.controller = controller;
        //FIN DE INITIALISATION
        //EARLY

        // FRAMEWORK VUEJS : Preparer les composants

        //Pour les TYPES qui sont dans UN mini carte de pokémon donc dans le composant "my-pokemon"
        Vue.component('my-type', {
            props: ["type"],
            template: `
                <span class="type" :class="type.type"></span>
            `
        })  
        
        //Pour UN mini carte de pokémons
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
        
            data :function () { //Gestion des types 
                const types_object = [];
                this.pokemon.types.forEach(t => {
                    types_object.push({type:t});
                });
                return {
                    types : types_object
                }},
        
            methods : {
                afficher : function(){ //Appeler le controleur lors de notre clic sur la mini carte du pokémon.
                    this.changeCard(this.pokemon.id);
                    document.querySelector("#card-pokemon-detail").classList.remove("hide"); // On affiche la grande carte du pokémon choisi.
                    
                },
        
                getImgUrl() {
                    return this.pokemon.urlImage; // Obtenir l'url pour la balise img
                },

                changeCard : (id)=>{
                    this.handlerGetPokemon(id); //afin d'utiliser handler() ! 
                }

            }
        
        }) 
        
        this.app = new Vue({
            el:'#app', //Trouve un divqui a ce ID pour mettre les composants en relation dans les fils de ce div.
            data : {
                pokemons : null //Initialisation par vide. On attend le retour de fetch.
            },
        })
    }

    //Change l'affichage de la grande carte de pokémon lors d'une selection.
    changeCardPokemon(pokemon){

        //// TRAITEMENTS POUR LES STATS
        const stats = pokemon.stats;
        document.querySelector("#attack").dataset.percent = stats.attack;
        document.querySelector("#attack_special").dataset.percent = stats["special-attack"];
        document.querySelector("#defense_special").dataset.percent = stats["special-defense"]; 
        document.querySelector("#defense").dataset.percent = stats.defense;
        document.querySelector("#speed").dataset.percent = stats.speed;

        let maxScore = 0;

        //GESTION DE SCORE
        this.skills_item.forEach((item) => {    
            if(parseFloat(item.querySelector("span").dataset.percent) > maxScore) maxScore = item.querySelector("span").dataset.percent;
        });

        this.skills_item.forEach((item) => {    
            const score = (parseFloat(item.querySelector("span").dataset.percent)/maxScore)*100;           
            item.style.height = score + "%";
            item.querySelector("span").innerHTML = score.toFixed(1) + "%";
        });

        //ADD TYPES SPANS
        let str_type = "Type(s) : ";
        pokemon.types.forEach(type => str_type+= "<span class=\"type "+type+"\"></span>");
        document.querySelector("#types").innerHTML = str_type;

        //CHANGEMENT
        document.querySelector("#namePokemon").innerHTML = pokemon.name;
        document.querySelector("#idPokemon").innerHTML = "#" + pokemon.id;
        document.querySelector("#descriptionPokemon").innerHTML = pokemon.description;
        document.querySelector("#height").innerHTML = "Height : " + pokemon.height/10 + "m";
        document.querySelector("#weight").innerHTML = "Weight : " + pokemon.weight/10 + "kg";
        document.querySelector("#habitat").innerHTML = "Habitat : " + pokemon.habitat;
        document.querySelector("#shape").innerHTML = "Shape : " + pokemon.shape;

        document.querySelector("#pokemonImage").setAttribute("src", pokemon.urlImage);
        this.checkBoxShiny.checked = false; //anti bug avec shiny
        ////FIN DE TRAITEMENTS POUR LES STATS
    }

    //Change Shiny en Normal ou bien Normal en Shiny.
    changeShinyOrNormal(urlImage){
        document.querySelector("#pokemonImage").setAttribute("src", urlImage)
    }

    //Ajouter l'écouteur de clic/entrer, dans le cas, on récupere les pokémons grâce à le retour de handler. 
    bindUpdatePokemons(handler){
        this.inputSearch.addEventListener("keyup", (event) => {
            if(event.keyCode === 13 ) {
                this.updatePokemons(handler(this.inputSearch));
            }

        });
        this.buttonSearch.addEventListener("click", (event) =>{
            this.updatePokemons(handler(this.inputSearch));
        })

    }

    bindChangeShinyOrNormal(handler){
        this.checkBoxShiny.addEventListener("click", (event)=>{
            this.changeShinyOrNormal(handler(this.checkBoxShiny.checked));
        })
    }

    updatePokemons(pokemons){
        this.app.pokemons = pokemons;
    }

    bindSelectPokemon(handler){
        //this.handlerGetPokemon = (id) => {return handler(id)}
        this.handlerGetPokemon = (id) => {return handler(id)};
    }

    bindnextOrPrecedent(handler){
        document.querySelector("#suivant").addEventListener("click", (event) =>{
            handler(1);  
        });

        document.querySelector("#precedent").addEventListener("click", (event) =>{
            handler(-1);  
        })
    }

    handlerGetPokemon(){
    }

}

export{ViewPokedex}; // On exporte au contrôleur pour qu'il puisse le construire lors de son intialisation.