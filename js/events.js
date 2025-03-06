// Event handlers and app operations
const Events = {
  setup: function() {
    this.setupButtons();
    this.setupModalHandlers();
    this.setupEditorEvents();
  },
  
  setupButtons: function() {
    // Add Prompt button
    document.getElementById('addPromptBtn').addEventListener('click', this.newPrompt);
    
    // Save Version button
    document.getElementById('saveVersionBtn').addEventListener('click', this.saveVersion);
    
    // Copy Prompt button
    document.getElementById('copyPromptBtn').addEventListener('click', EditorFeatures.copyPromptWithoutComments);
    
    // Export Full Text button
    document.getElementById('exportFullBtn').addEventListener('click', EditorFeatures.exportFullText);
    
    // Toggle UI elements
    this.setupToggleButtons();
  },
  
  setupToggleButtons: function() {
    let sidebarVisible = true;
    let versionHistoryVisible = true;
    
    document.getElementById('toggleSidebarBtn').addEventListener('click', () => {
      sidebarVisible = !sidebarVisible;
      document.getElementById('sidebarContainer').style.display = sidebarVisible ? 'flex' : 'none';
    });
    
    document.getElementById('toggleVersionHistoryBtn').addEventListener('click', () => {
      versionHistoryVisible = !versionHistoryVisible;
      document.getElementById('versionHistory').style.display = versionHistoryVisible ? 'block' : 'none';
    });
  },
  
  setupModalHandlers: function() {
    const instructionsModal = document.getElementById('instructionsModal');
    
    document.getElementById('instructionsBtn').addEventListener('click', () => {
      instructionsModal.style.display = 'block';
    });
    
    document.getElementById('closeModal').addEventListener('click', () => {
      instructionsModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
      if (event.target === instructionsModal) {
        instructionsModal.style.display = 'none';
      }
    });
  },
  
  setupEditorEvents: function() {
    const editor = document.getElementById('editor');
    
    // Auto-save when editor loses focus
    editor.addEventListener('blur', () => {
      PromptData.saveCurrentContent();
    });
    
    // Auto-save before page unload
    window.addEventListener('beforeunload', () => {
      PromptData.saveCurrentContent();
    });
  },
  
  // Create new prompt
  newPrompt: function() {
    PromptData.saveCurrentContent();
    const name = prompt('Enter a new prompt name:');
    
    if (PromptData.createPrompt(name)) {
      document.getElementById('editor').innerHTML = '';
      document.getElementById('currentPromptLabel').textContent = 'Current: ' + name;
      UI.updatePromptTabs();
      UI.renderVersionHistory();
    } else if (name) {
      alert('A prompt with that name already exists or the name is invalid.');
    }
  },
  
  // Delete current prompt
  deleteCurrentPrompt: function() {
    if (!PromptData.currentPrompt) {
      alert('No prompt is currently loaded.');
      return;
    }
    
    const input = prompt('To delete the current prompt, type its name:');
    if (input === PromptData.currentPrompt) {
      PromptData.deletePrompt(PromptData.currentPrompt);
      UI.resetEditorIfNeeded();
      UI.updatePromptTabs();
    } else if (input) {
      alert('Prompt name did not match. Deletion cancelled.');
    }
  },
  
  // Save version of current prompt
  saveVersion: function() {
    if (!PromptData.currentPrompt) {
      alert('No prompt is currently loaded.');
      return;
    }
    
    if (PromptData.saveVersion()) {
      UI.renderVersionHistory();
      alert('Version saved.');
    }
  }
};