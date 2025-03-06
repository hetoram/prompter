// Data model and storage operations
const PromptData = {
  // Model: Each prompt has content and versions array
  prompts: {},
  currentPrompt: null,
  
  // Save current content to the current prompt
  saveCurrentContent: function() {
    if (this.currentPrompt) {
      this.prompts[this.currentPrompt].content = editor.innerHTML;
    }
  },
  
  // Create a new prompt
  createPrompt: function(name) {
    if (!name || !name.trim()) return false;
    
    const trimmed = name.trim();
    if (this.prompts[trimmed]) return false;
    
    this.prompts[trimmed] = { content: '', versions: [] };
    this.currentPrompt = trimmed;
    return true;
  },
  
  // Delete a prompt
  deletePrompt: function(name) {
    if (!this.prompts[name]) return false;
    
    delete this.prompts[name];
    if (this.currentPrompt === name) {
      this.currentPrompt = null;
    }
    return true;
  },
  
  // Save a version of the current prompt
  saveVersion: function() {
    if (!this.currentPrompt) return false;
    
    const content = editor.innerHTML;
    const timestamp = new Date().toLocaleString();
    const versionName = "Version " + (this.prompts[this.currentPrompt].versions.length + 1);
    
    this.prompts[this.currentPrompt].versions.push({ content, timestamp, name: versionName });
    this.prompts[this.currentPrompt].content = content;
    return true;
  },
  
  // Delete a version from the current prompt
  deleteVersion: function(index) {
    if (!this.currentPrompt) return false;
    
    const versions = this.prompts[this.currentPrompt].versions;
    if (index < 0 || index >= versions.length) return false;
    
    versions.splice(index, 1);
    return true;
  }
};