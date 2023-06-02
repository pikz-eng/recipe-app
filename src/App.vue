<template>
    <div id="app">
        <h1>{{ title }}</h1>
        <div>
            <input class="input-container" v-model="searchInput" type="text" placeholder="insert the ingredients">
            <button class="search-button-animation" @click="search">Search</button>
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
                        <p>Unit: {{ selectedRecipe.unit}}</p>
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


<script src="./app.js"></script>


