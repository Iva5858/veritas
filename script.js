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
    let count = parseInt(countElement.textContent);

    // Animation for count
    function animateCount() {
        const random = Math.floor(Math.random() * 3) + 1;
        count += random;
        countElement.textContent = count;
    }

    setInterval(animateCount, 5000);

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

    // Form submission with Google Sheets integration
    form.onsubmit = async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const timestamp = new Date().toISOString();

        try {
            // Send to Google Sheets
            const response = await addToGoogleSheet(email, timestamp);
            
            if (response.ok) {
                // Show success message
                form.innerHTML = '<p style="text-align: center; color: var(--primary-color)">Thanks for joining! We\'ll be in touch soon! 🎉</p>';
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    modal.style.display = 'none';
                    // Reset form
                    form.innerHTML = `
                        <input type="email" placeholder="Enter your email" required>
                        <button type="submit">Sign Up</button>
                    `;
                }, 2000);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error('Error:', error);
            form.innerHTML = '<p style="text-align: center; color: #ff0000">Oops! Something went wrong. Please try again.</p>';
            
            setTimeout(() => {
                form.innerHTML = `
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit">Sign Up</button>
                `;
            }, 2000);
        }
    }
});

async function addToGoogleSheet(email, timestamp) {
    return new Promise((resolve, reject) => {
        // Create a unique callback name
        const callbackName = 'jsonpCallback_' + Date.now();
        
        // Create script element
        const script = document.createElement('script');
        const url = 'https://script.google.com/macros/s/AKfycby51UXjsRM-8X_qc4MXBTwUJYOPY71qqVaapi2wVzGkjcpJggRW8sMtK0KVZlLSyj6t/exec';
        
        // Add the callback function
        window[callbackName] = function(response) {
            // Clean up
            document.body.removeChild(script);
            delete window[callbackName];
            
            if (response.status === 'success') {
                resolve({ ok: true });
            } else {
                reject(new Error('Failed to submit'));
            }
        };

        // Create URL with parameters
        script.src = `${url}?callback=${callbackName}&email=${encodeURIComponent(email)}&timestamp=${encodeURIComponent(timestamp)}`;
        
        // Handle errors
        script.onerror = () => {
            // Clean up
            document.body.removeChild(script);
            delete window[callbackName];
            reject(new Error('Failed to submit'));
        };

        // Add script to document
        document.body.appendChild(script);
    });
} 