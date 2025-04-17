// This file contains JavaScript functionality for the SPARE House website, including handling user interactions and dynamic content updates.

document.addEventListener("DOMContentLoaded", () => {
    const brandFilter = document.getElementById("brandFilter");
    const modelFilter = document.getElementById("modelFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const productsContainer = document.getElementById("productsContainer");

    let products = [];

    async function loadProducts() {
        try {
            const response = await fetch("../assets/data/product.json");
            const data = await response.json();
            products = data.flatMap(brand => 
                brand.models.flatMap(model => 
                    model.spareParts.map(part => ({
                        brand: brand.brand.toLowerCase(),
                        model: model.model.toLowerCase(),
                        category: part.category.toLowerCase(),
                        name: part.name,
                        description: part.description,
                        price: part.price,
                        image: part.image
                    }))
                )
            );
            populateBrandFilter(data);
            populateCategoryFilter(); // Populate categories dynamically
            displayProducts(products);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }

    function populateBrandFilter(data) {
        const brands = data.map(brand => brand.brand.toLowerCase());
        brandFilter.innerHTML = `<option value="all">All Brands</option>` +
            brands.map(brand => `<option value="${brand}">${brand}</option>`).join("");
    }

    function populateCategoryFilter() {
        const categories = products
            .map(product => product.category)
            .filter((value, index, self) => self.indexOf(value) === index);

        categoryFilter.innerHTML = `<option value="all">All Categories</option>` +
            categories.map(category => `<option value="${category}">${category}</option>`).join("");
    }

    function filterProducts() {
        const selectedBrand = brandFilter.value;
        const selectedModel = modelFilter.value;
        const selectedCategory = categoryFilter.value;
        const searchQuery = searchInput.value.toLowerCase();

        const filteredProducts = products.filter(product => {
            return (
                (selectedBrand === "all" || product.brand === selectedBrand) &&
                (selectedModel === "all" || product.model === selectedModel) &&
                (selectedCategory === "all" || product.category === selectedCategory) &&
                (searchQuery === "" || product.name.toLowerCase().includes(searchQuery))
            );
        });

        displayProducts(filteredProducts);
    }

    function displayProducts(products) {
        productsContainer.innerHTML = "";
        if (products.length === 0) {
            productsContainer.innerHTML = "<p>No products found.</p>";
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.className = "product-item";
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Brand: ${product.brand}</p>
                <p>Model: ${product.model}</p>
                <p>Category: ${product.category}</p>
                <p>Price: ₹${product.price}</p>
                <p>${product.description}</p>
                <img src="${product.image}" alt="${product.name}" />
            `;
            productsContainer.appendChild(productElement);
        });
    }

    brandFilter.addEventListener("change", () => {
        const selectedBrand = brandFilter.value;
        const models = selectedBrand === "all" 
            ? [] 
            : products
                .filter(product => product.brand === selectedBrand)
                .map(product => product.model)
                .filter((value, index, self) => self.indexOf(value) === index);

        modelFilter.innerHTML = `<option value="all">All Models</option>` +
            models.map(model => `<option value="${model}">${model}</option>`).join("");
        filterProducts();
    });

    modelFilter.addEventListener("change", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);
    searchBtn.addEventListener("click", filterProducts);

    loadProducts();
});

