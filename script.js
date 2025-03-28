document.addEventListener('DOMContentLoaded', function() {
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Image generation functionality
    const generateBtn = document.getElementById('generate-btn');
    const promptInput = document.getElementById('prompt-input');
    const styleSelect = document.getElementById('style-select');
    const sizeSelect = document.getElementById('size-select');
    const imageResult = document.getElementById('image-result');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);
    shareBtn.addEventListener('click', shareImage);

    // For demonstration purposes, we'll use a placeholder service
    // In a real implementation, you would connect to a free AI API like:
    // - Stable Diffusion API (https://stablediffusionapi.com/)
    // - DeepAI (https://deepai.org/machine-learning-model/text2img)
    // - OpenAI DALL-E (if you have access)
    
    async function generateImage() {
        const prompt = promptInput.value.trim();
        const style = styleSelect.value;
        const size = sizeSelect.value;
        
        if (!prompt) {
            alert('Please enter a description for your image');
            return;
        }
        
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        imageResult.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Creating your image...</p>';
        
        try {
            // In a real implementation, you would call an actual API here
            // This is a mock implementation for demonstration
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // For demo purposes, we'll use a placeholder service
            // Note: This is just for testing - in production, use a real API
            const [width, height] = size.split('x').map(Number);
            const placeholderUrl = `https://placehold.co/${width}x${height}/6c5ce7/white?text=${encodeURIComponent(prompt)}`;
            
            // Display the "generated" image
            imageResult.innerHTML = `<img src="${placeholderUrl}" alt="Generated image from prompt: ${prompt}">`;
            
            // Enable download and share buttons
            downloadBtn.disabled = false;
            shareBtn.disabled = false;
            
            // Store the image URL for download/share
            imageResult.dataset.imageUrl = placeholderUrl;
            
        } catch (error) {
            console.error('Error generating image:', error);
            imageResult.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Error generating image. Please try again.</p>';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Image';
        }
    }
    
    function downloadImage() {
        const imageUrl = imageResult.dataset.imageUrl;
        if (!imageUrl) return;
        
        // Create a temporary anchor element to trigger download
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `imagigenie-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    function shareImage() {
        const imageUrl = imageResult.dataset.imageUrl;
        if (!imageUrl) return;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out this AI-generated image from ImagiGenie',
                text: 'I created this image using ImagiGenie - a free AI image generator!',
                url: imageUrl,
            })
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            alert('Web Share API not supported in your browser. You can copy the image URL manually.');
        }
    }
});
