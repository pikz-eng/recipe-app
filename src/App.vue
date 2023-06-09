<template>
    <div id="app">
        <h1>{{ title }}</h1>
        <div class="recipe-app-input-group">
            <div class="input-group">
                <input @keydown="search" class="form-control" v-model="searchInput" type="text"
                       placeholder="Insert the ingredients"
                       @keydown.enter="search" required>

                <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="search">Search
                </button>
            </div>
            <p v-if="!inputValid" class="error-message error-text">{{ inputErrorMessage }}</p>
        </div>

        <div class="container-fluid">
            <h2 v-if="recipes.length > 0">Recipes:</h2>
            <div class="row">
                <div v-if="recipes.length > 0" class="col-12 col-md-6 col-lg-3 col-xl-3" v-for="recipe in recipes"
                     :key="recipe.id">
                    <div class="card text-center mb-3">
                        <img :src="recipe.image" class="card-img-top" alt="Recipe Image">
                        <div class="card-body">
                            <h5 class="card-title" :title="recipe.title">{{ recipe.title }}</h5>
                            <button class="btn btn-primary p-2" @click="getRecipeInformation(recipe.id)">Informations
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="searchInput && !loading">
                    <h2>No recipes found.</h2>
                </div>
            </div>
        </div>

        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-if="selectedRecipe" id="myModal" class="modal" tabindex="-1" data-bs-toggle="modal"
             data-bs-target="#myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ selectedRecipe.title }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Amount: {{ selectedRecipe.amount }}</p>
                        <p>Unit: {{ selectedRecipe.unit }}</p>
                        <p>Original Name: {{ selectedRecipe.originalName }}</p>
                        <p>Summary: <span v-html="selectedRecipe.summary"></span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                @click="closeModal">Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {debounce} from 'lodash';

export default {
    name: 'App',
    data() {
        return {
            title: 'Recipe-App',
            searchInput: '',
            recipes: [],
            selectedRecipe: {},
            inputValid: true,
            inputErrorMessage: '',
            loading: false,
        };
    },
    methods: {

        search: debounce(function () {
            if (this.searchInput.length < 2) {
                this.inputValid = false;
                this.inputErrorMessage = 'The input must contain at least 2 characters';
                return;
            }

            const containsNumbers = /\d/.test(this.searchInput);
            if (containsNumbers) {
                this.inputValid = false;
                this.inputErrorMessage = 'The input cannot contain digits';
                return;
            }
            this.inputValid = true;
            this.inputErrorMessage = '';
            this.loading = true;
            axios
                .get('https://api.spoonacular.com/recipes/findByIngredients', {
                    params: {
                        ingredients: this.searchInput,
                        apiKey: 'b942af6e9ba143c4a7ebaccc6013bcb0',
                        number: 44,
                    },
                })
                .then(response => {
                    this.recipes = response.data;
                    this.loading = false;
                    console.log('Recipe:', this.recipes);
                    setTimeout(() => {
                        const cards = document.querySelectorAll('.card');
                        cards.forEach(card => {
                            card.classList.add('show');
                        });
                    }, 100);
                })
                .catch(error => {
                    console.error('Error searching ingredients:', error);
                });
        }, 1000),
        getRecipeInformation(recipeId) {
            this.loading = true;
            if (this.selectedRecipe.id === recipeId) {
                this.selectedRecipe = {};
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
                    const selectedRecipe = response.data;
                    const ingredient = response.data.extendedIngredients[0];
                    selectedRecipe.amount = ingredient.amount;
                    selectedRecipe.originalName = ingredient.originalName;
                    selectedRecipe.unit = ingredient.unit;
                    console.log('Selected Recipe:', selectedRecipe);
                    this.selectedRecipe = selectedRecipe;
                    this.loading = false;

                    const myModal = new bootstrap.Modal(document.querySelector('#myModal'));
                    myModal.show();
                })
                .catch(error => {
                    console.error('Error fetching recipe details:', error);
                    this.loading = false;
                });
        },
        closeModal() {
            const myModal = new bootstrap.Modal(document.querySelector('#myModal'));
            myModal.hide();
        }
    }
};
</script>
