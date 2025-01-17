// Initialize Google Sheets API
// const SHEET_ID = '18liLfOfEZCvX9Q8DVbCR0emrg_5Fo_b1MAhOe2Os-0M';
// const SHEET_TAB_NAME = 'Sheet1';
// const GOOGLE_CLOUD_API_KEY = 'AIzaSyAyJwD7r66D6Av24bouCrtkwgHuaSjSku0';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('waitlistModal');
    const btn = document.getElementById('joinWaitlist');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('waitlistForm');
    const countElement = document.getElementById('count');

    // Fetch initial count
    fetchCount();

    // Modal controls
    btn.onclick = () => {
        modal.style.display = 'block';
    }

    span.onclick = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Form submission with validation and loading state
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Client-side email validation
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Joining...';

        const timestamp = new Date().toISOString();

        try {
            const response = await addToGoogleSheet(email, timestamp);
            
            if (response.ok) {
                fetchCount();
                showSuccess();
            } else {
                throw new Error(response.message || 'Failed to submit');
            }
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Something went wrong. Please try again.');
        }
    }
});

function fetchCount() {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonpCallback_' + Date.now();
        const script = document.createElement('script');
        const url = 'https://script.google.com/macros/s/AKfycbyVyaRHs1HV9B2OKZiiKDM1noVomD8DHTU_NTg3PUhash4QmT_X9wOuggeJBq-BhB5S/exec';
        
        window[callbackName] = function(response) {
            document.body.removeChild(script);
            delete window[callbackName];
            
            if (response.status === 'success') {
                const countElement = document.getElementById('count');
                countElement.textContent = response.count;
                resolve(response.count);
            } else {
                reject(new Error('Failed to fetch count'));
            }
        };

        script.src = `${url}?callback=${callbackName}`;
        
        script.onerror = () => {
            document.body.removeChild(script);
            delete window[callbackName];
            reject(new Error('Failed to fetch count'));
        };

        document.body.appendChild(script);
    });
}

// Update existing addToGoogleSheet function to handle the count in response
async function addToGoogleSheet(email, timestamp) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonpCallback_' + Date.now();
        const script = document.createElement('script');
        const url = 'https://script.google.com/macros/s/AKfycbyVyaRHs1HV9B2OKZiiKDM1noVomD8DHTU_NTg3PUhash4QmT_X9wOuggeJBq-BhB5S/exec';
        
        window[callbackName] = function(response) {
            document.body.removeChild(script);
            delete window[callbackName];
            
            if (response.status === 'success') {
                resolve({ ok: true, count: response.count });
            } else {
                reject(new Error('Failed to submit'));
            }
        };

        script.src = `${url}?callback=${callbackName}&email=${encodeURIComponent(email)}&timestamp=${encodeURIComponent(timestamp)}`;
        
        script.onerror = () => {
            document.body.removeChild(script);
            delete window[callbackName];
            reject(new Error('Failed to submit'));
        };

        document.body.appendChild(script);
    });
}

function isValidEmail(email) {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    const form = document.getElementById('waitlistForm');
    form.innerHTML = `
        <p style="text-align: center; color: #ff0000">${message}</p>
        <input type="email" placeholder="Enter your email" required>
        <button type="submit">Sign Up</button>
    `;
}

function showSuccess() {
    const form = document.getElementById('waitlistForm');
    const modal = document.getElementById('waitlistModal');
    
    form.innerHTML = '<p style="text-align: center; color: var(--primary-color)">Thanks for joining! We\'ll be in touch soon! 🎉</p>';
    
    setTimeout(() => {
        modal.style.display = 'none';
        form.innerHTML = `
            <input type="email" placeholder="Enter your email" required>
            <button type="submit">Sign Up</button>
        `;
    }, 2000);
} 
