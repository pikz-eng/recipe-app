<template>
    <div id="app">
        <h1>{{ title }}</h1>
        <div>
            <input class="input-container" v-model="searchInput" type="text" placeholder="insert the ingredients"
                   @keydown.enter="search" required>
            <button class="search-button-animation" @click="search">Search</button>
            <p v-if="!inputValid" class="error-message error-text" >{{ inputErrorMessage }}</p>
        </div>

        <div v-if="recipes.length > 0">
            <h2>Recipes:</h2>
            <ul>
                <li v-for="recipe in recipes" :key="recipe.id" @click="getRecipeInformation(recipe.id)">
                    <h3>{{ recipe.title }}</h3>
                    <img :src="recipe.image" alt="Recipe Image" width="200"/>
                    <div v-if="recipe.id === selectedRecipe.id">
                        <h2>Recipe Information:</h2>
                        <h3>{{ selectedRecipe.title }}
                            <span class="badge badge-secondary">New</span>
                        </h3>
                        <p>Amount: {{ selectedRecipe.amount }}</p>
                        <p>Unit: {{ selectedRecipe.unit }}</p>
                        <p>Original Name: {{ selectedRecipe.originalName }}</p>
                        <p>Summary:<span v-html="selectedRecipe.summary"></span></p>

                    </div>
                </li>
            </ul>
        </div>

        <div v-else-if="searchInput && !loading">
            <p>No recipes found.</p>
        </div>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import './components/style.css';

export default {
    name: 'App',
    data() {
        return {
            title: 'Recipe-App',
            searchInput: '',
            recipes: [],
            selectedRecipe: [],
            inputValid: true,
            inputErrorMessage: '',
            loading: false
        };
    },

    methods: {
        search() {
            if (this.searchInput.length < 2) {
                this.inputValid = false;
                this.inputErrorMessage = "The input must contain min 2 characters";
                return;
            }

            const containsNumbers = /\d/.test(this.searchInput);
            if (containsNumbers) {
                this.inputValid = false;
                this.inputErrorMessage = "The input cannot contain digits";
                return;
            }
            this.inputValid = true;
            this.inputErrorMessage = "";
            this.loading = true;
            axios
                .get('https://api.spoonacular.com/recipes/findByIngredients', {
                    params: {
                        ingredients: this.searchInput,
                        apiKey: 'b942af6e9ba143c4a7ebaccc6013bcb0',
                        number: 12
                    }
                })
                .then(response => {
                    this.recipes = response.data;
                    console.log('Recipe:', this.recipes);


                })
                .catch(error => {
                    console.error('Error to search ingredients:', error);
                });
        },
        getRecipeInformation(recipeId) {
            this.loading = true;
            if (this.selectedRecipe.id === recipeId) {
                this.selectedRecipe = [];
                this.loading = false;
                return;
            }
            axios
                .get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                    params: {
                        apiKey: 'b942af6e9ba143c4a7ebaccc6013bcb0',
                    }
                })
                .then(response => {
                    this.selectedRecipe = response.data;
                    this.selectedRecipe.amount = response.data.extendedIngredients[0].amount;
                    this.selectedRecipe.originalName = response.data.extendedIngredients[0].originalName;
                    this.selectedRecipe.unit = response.data.extendedIngredients[0].unit;
                    console.log('Selected Recipe:', this.selectedRecipe);
                    this.loading = false;
                })
                .catch(error => {
                    console.error('Error fetching recipe details:', error);
                    this.loading = false;
                });
        }
    }
};
</script>


