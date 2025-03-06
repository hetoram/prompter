// Editor and prompt handling features
const EditorFeatures = {
  // Insert tag snippet on "<" key
  insertTagSnippet: function() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);

    // Create container for the snippet
    const container = document.createElement('span');
    container.className = 'tagSnippet';
    
    // Create the HTML structure
    container.innerHTML = 
      '&lt;<span class="tagName" contenteditable="true"></span>&gt;<br><br>&lt;/<span class="tagNameSync"></span>&gt;';
    
    // Insert at caret position
    range.insertNode(container);
    
    // Get tag name spans for synchronization
    const tagNameSpan = container.querySelector('.tagName');
    const closingTagSpan = container.querySelector('.tagNameSync');
    
    // Place cursor inside opening tag name
    const newRange = document.createRange();
    newRange.selectNodeContents(tagNameSpan);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    
    // Set up synchronization
    tagNameSpan.addEventListener('input', function() {
      closingTagSpan.textContent = tagNameSpan.textContent;
    });
  },
  
  // Copy prompt without comments
  copyPromptWithoutComments: function() {
    if (!PromptData.currentPrompt) {
      alert('No prompt is currently loaded.');
      return;
    }
    
    const editor = document.getElementById('editor');
    let text = editor.innerText;
    const lines = text.split('\n');
    const filtered = lines.filter(line => !line.trim().startsWith('#'));
    const finalText = filtered.join('\n');
    
    navigator.clipboard.writeText(finalText)
      .then(() => alert('Prompt copied to clipboard (without comments).'))
      .catch(err => alert('Error copying prompt: ' + err));
  },
  
  // Export full text including comments
  exportFullText: function() {
    if (!PromptData.currentPrompt) {
      alert('No prompt is currently loaded.');
      return;
    }
    
    const editor = document.getElementById('editor');
    let fullText = editor.innerText;
    
    navigator.clipboard.writeText(fullText)
      .then(() => alert('Full text copied to clipboard (including comments).'))
      .catch(err => alert('Error copying text: ' + err));
  }
};