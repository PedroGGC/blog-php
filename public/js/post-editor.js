document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content');
    if (!contentArea) return;

    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'post-preview card';
    previewContainer.style.marginTop = '1rem';
    previewContainer.style.padding = '1.5rem';
    previewContainer.style.minHeight = '100px';
    previewContainer.innerHTML = '<p class="meta">Visualização em tempo real:</p><div id="preview-body"></div>';
    
    contentArea.parentNode.insertBefore(previewContainer, contentArea.nextSibling);
    const previewBody = document.getElementById('preview-body');

    const updatePreview = () => {
        let text = contentArea.value;

        // Escape HTML
        text = text.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;')
                   .replace(/'/g, '&#039;');

        // Apply React Effect Commands
        // ""text"" -> GradientText
        text = text.replace(/&quot;&quot;(.+?)&quot;&quot;/g, '<span class="rt-gradient" data-text="$1">$1</span>');
        
        // **text** -> ShinyText
        text = text.replace(/\*\*(.+?)\*\*/g, '<span class="rt-shiny" data-text="$1">$1</span>');
        
        // &&text&& -> FuzzyText
        text = text.replace(/&amp;&amp;(.+?)&amp;&amp;/g, '<span class="rt-fuzzy" data-text="$1">$1</span>');

        // New lines
        text = text.replace(/\n/g, '<br>');

        previewBody.innerHTML = text;

        // Trigger React to mount components in the new HTML
        if (window.mountRichTextEffects) {
            window.mountRichTextEffects();
        }
    };

    contentArea.addEventListener('input', updatePreview);
    updatePreview(); // Initial call
});
