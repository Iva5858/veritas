// Logo click Easter egg
let logoClickCount = 0;
const logo = document.querySelector('.logo');
const hannahImage = document.querySelector('#hannah-image');

logo.addEventListener('click', () => {
    logoClickCount++;
    
    if (logoClickCount === 10) {
        // Reset counter
        logoClickCount = 0;
        
        // First scroll to the image
        hannahImage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Wait for scroll to complete (approximately 500ms) then change image
        setTimeout(() => {
            // Switch to fun image
            hannahImage.src = 'img/hannah-fun.png';
            
            // Add a fun animation
            hannahImage.style.animation = 'spin 1s ease-out';
            
            // Reset image after 3 seconds
            setTimeout(() => {
                hannahImage.src = 'img/hannah.png';
                hannahImage.style.animation = '';
            }, 10000);
        }, 500);
    }
});

// Add spin animation to your CSS
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`;
document.head.appendChild(style); 
