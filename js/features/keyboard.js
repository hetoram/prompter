// Keyboard shortcuts handling
const KeyboardShortcuts = {
  setup: function() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  
  handleKeyDown: function(e) {
    // Ctrl+S: Save Version
    if (e.ctrlKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      Events.saveVersion();
    }
    
    // Ctrl+P: New Prompt
    else if (e.ctrlKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      Events.newPrompt();
    }
    
    // Ctrl+D: Delete Current Prompt
    else if (e.ctrlKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      Events.deleteCurrentPrompt();
    }
    
    // "<" in editor: Insert tag snippet
    else if (e.key === '<' && document.activeElement === document.getElementById('editor')) {
      e.preventDefault();
      EditorFeatures.insertTagSnippet();
    }
    
    // Tab in editor: Navigate to next control
    else if (e.key === 'Tab' && document.activeElement === document.getElementById('editor')) {
      e.preventDefault();
      const focusable = Array.from(document.querySelectorAll('button, [contenteditable]'));
      const index = focusable.indexOf(document.activeElement);
      const next = focusable[index + 1] || focusable[0];
      next.focus();
    }
  }
};