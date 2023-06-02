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
            loading: false
        };
    },
    mounted() {
        const input = document.querySelector('input');
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.search();
            }
        });

        const savedRecipes = localStorage.getItem('recipes');
        const savedSearchInput = localStorage.getItem('searchInput');
        if (savedRecipes && savedSearchInput) {
            this.recipes = JSON.parse(savedRecipes);
            this.searchInput = savedSearchInput;
        }
    },
    methods: {
        search() {
            this.loading = true;
            axios
                .get('https://api.spoonacular.com/recipes/findByIngredients', {
                    params: {
                        ingredients: this.searchInput,
                        apiKey: '7bdf08411f7b4f11bd50b890000b3e58',
                    }
                })
                .then(response => {
                    this.recipes = response.data;
                    console.log('Recipe:', this.recipes);

                    localStorage.setItem('recipes', JSON.stringify(this.recipes));
                    localStorage.setItem('searchInput', this.searchInput);
                })
                .catch(error => {
                    console.error('Error to search ingredients:', error);
                })
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
                        apiKey: '7bdf08411f7b4f11bd50b890000b3e58',
                    }
                })
                .then(response => {
                    this.selectedRecipe = response.data;
                    this.selectedRecipe.amount = response.data.extendedIngredients[0].amount;
                    this.selectedRecipe.originalName = response.data.extendedIngredients[0].originalName;
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