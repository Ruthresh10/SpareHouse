// This file contains JavaScript code specific to the login page, managing form validation and submission.

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        errorMessage.textContent = '';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!validateEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address.';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long.';
            return;
        }

        // Simulate a login request
        console.log('Logging in with:', { email, password });
        // Here you would typically send a request to your server for authentication
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});

// Function to toggle between Login and Sign Up forms
function showForm(formId) {
    const forms = document.querySelectorAll('.form');
    const tabs = document.querySelectorAll('.tabs button');

    forms.forEach(form => form.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));

    document.getElementById(`${formId}-form`).classList.add('active');
    document.getElementById(`${formId}-tab`).classList.add('active');
}

let currentUser = null; // Simulated user data

// Function to handle login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('https://your-server-url/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Login successful!');
            window.location.href = './home.html'; // Redirect to home page
        } else {
            const error = await response.json();
            alert(error.message || 'Invalid username or password. Please try again.');
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert('An error occurred. Please try again later.');
    }
});

// Function to handle sign-up
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('https://your-server-url/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, username, password })
        });

        if (response.ok) {
            alert('Account created successfully! You can now log in.');
            window.location.href = './login.html'; 
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to create account. Please try again.');
        }
    } catch (err) {
        console.error('Error during registration:', err);
        alert('An error occurred. Please try again later.');
    }
});


function showAccount() {
    if (currentUser) {
        document.getElementById('account-name').textContent = currentUser.name;
        document.getElementById('account-email').value = currentUser.email;
        document.getElementById('account-password').value = currentUser.password;
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('account').classList.remove('hidden');
    }
}

document.getElementById('logout-btn').addEventListener('click', function() {
    currentUser = null;
    alert('You have been logged out.');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('account').classList.add('hidden');
});
document.getElementById('edit-account-btn').addEventListener('click', function() {
    const emailInput = document.getElementById('account-email');
    const passwordInput = document.getElementById('account-password');

    if (emailInput.disabled) {
        emailInput.disabled = false;
        passwordInput.disabled = false;
        alert('You can now edit your account details.');
    } else {
        emailInput.disabled = true;
        passwordInput.disabled = true;
        alert('Account details saved.');
    }
});
