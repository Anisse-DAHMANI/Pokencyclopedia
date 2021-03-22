"use strict"

const urls = [];
const data_pokemon = [];


for (let index = 1; index < 898; index++) {
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
                
                const types_array = [];
                
                p.types.forEach(type => {
                    types_array.push(type.type.name)
                });

                const capitalize = (s) => {
                    if (typeof s !== 'string') return ''
                    const str = s.charAt(0).toUpperCase() + s.slice(1);
                    return str.replace(/(^|[\s-])\S/g, function (match) {
                        return match.toUpperCase();
                    });
                }

                const pokemon = {id: p.id, urlImage: p.sprites.front_default, name: capitalize(p.name), types:types_array};
                data_pokemon.push(pokemon);
            }
        });

        document.getElementById("app").classList.remove("hide");
        document.getElementsByClassName("lds-ring")[0].classList.add("hide");
        
    })


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
            console.log(this.pokemon);
        },

        getImgUrl() {
            console.log(this.pokemon.urlImage);
            return this.pokemon.urlImage;
        }
    }

}) 

const app = new Vue({
    el:'#app',
    data : {
        pokemons : data_pokemon,
    },

})