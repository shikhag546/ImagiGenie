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
    const size = sizeSelect.value;
    const [width, height] = size.split("x").map(Number);

    if (!prompt) {
        alert("Please enter a description!");
        return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";
    imageResult.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Creating your image...</p>';

    try {
        const response = await fetch("https://stablediffusionapi.com/api/v3/text2img", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                key: "YOUR_API_KEY_HERE", // Replace with your actual API key
                prompt: prompt,
                width: width,
                height: height,
                samples: 1, // Number of images to generate
                num_inference_steps: 20, // More steps = better quality (but slower)
            }),
        });

        const data = await response.json();

        // Check for API errors
        if (data.status === "error") {
            throw new Error(data.message || "API Error");
        }

        // Display the generated image
        const imageUrl = data.output?.[0]; // Check if output exists
        if (!imageUrl) throw new Error("No image URL in response");

        imageResult.innerHTML = `<img src="${imageUrl}" alt="AI Generated Image">`;
        downloadBtn.disabled = false;
        shareBtn.disabled = false;
        imageResult.dataset.imageUrl = imageUrl;

    } catch (error) {
        console.error("API Error:", error);
        imageResult.innerHTML = `<i class="fas fa-exclamation-triangle"></i><p>Error: ${error.message}</p>`;
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate Image";
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
