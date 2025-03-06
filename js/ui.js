// UI rendering and updates
const UI = {
  // Update the prompt tabs in sidebar
  updatePromptTabs: function() {
    const promptTabs = document.getElementById('promptTabs');
    promptTabs.innerHTML = '';
    
    Object.keys(PromptData.prompts).forEach(name => {
      const li = document.createElement('li');
      li.className = 'prompt-tab';
      if (name === PromptData.currentPrompt) li.classList.add('active-prompt');

      const nameSpan = document.createElement('span');
      nameSpan.textContent = name;
      li.appendChild(nameSpan);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Del';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const input = prompt('To delete, type the prompt name:');
        if (input === name) {
          PromptData.deletePrompt(name);
          this.resetEditorIfNeeded();
          this.updatePromptTabs();
          this.renderVersionHistory();
        } else {
          alert('Prompt name did not match. Deletion cancelled.');
        }
      });
      li.appendChild(delBtn);

      li.addEventListener('click', () => {
        PromptData.saveCurrentContent();
        this.loadPrompt(name);
      });
      promptTabs.appendChild(li);
    });
  },
  
  // Load a prompt into the editor
  loadPrompt: function(name) {
    PromptData.saveCurrentContent();
    PromptData.currentPrompt = name;
    
    const editor = document.getElementById('editor');
    editor.innerHTML = PromptData.prompts[name].content;
    
    document.getElementById('currentPromptLabel').textContent = 'Current: ' + name;
    
    this.renderVersionHistory();
    this.updatePromptTabs();
  },
  
  // Render the version history panel
  renderVersionHistory: function() {
    const versionHistoryDiv = document.getElementById('versionHistory');
    versionHistoryDiv.innerHTML = '';
    
    if (!PromptData.currentPrompt) return;
    
    const versions = PromptData.prompts[PromptData.currentPrompt].versions;
    if (versions.length === 0) {
      versionHistoryDiv.textContent = 'No versions saved yet.';
      return;
    }
    
    const ul = document.createElement('ul');
    versions.forEach((v, index) => {
      const li = document.createElement('li');
      li.style.cursor = 'pointer';
      li.style.border = '1px solid #ddd';
      li.style.margin = '3px 0';
      li.style.padding = '2px';
      li.innerHTML = `<strong>${v.name}</strong> - ${v.timestamp} `;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit Name';
      editBtn.style.fontSize = '0.8em';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('Enter new version name:', v.name);
        if (newName !== null && newName.trim() !== '') {
          v.name = newName.trim();
          this.renderVersionHistory();
        }
      });
      li.appendChild(editBtn);

      // Delete button
      const deleteVerBtn = document.createElement('button');
      deleteVerBtn.textContent = 'Delete';
      deleteVerBtn.style.fontSize = '0.8em';
      deleteVerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleVersionDelete(index, v.name);
      });
      li.appendChild(deleteVerBtn);

      // Click to load version
      li.addEventListener('click', () => {
        if (confirm(`Load version "${v.name}"? Unsaved changes will be lost.`)) {
          document.getElementById('editor').innerHTML = v.content;
          PromptData.prompts[PromptData.currentPrompt].content = v.content;
        }
      });
      
      ul.appendChild(li);
    });
    versionHistoryDiv.appendChild(ul);
  },
  
  // Handle version deletion
  handleVersionDelete: function(index, versionName) {
    const input = prompt('To delete this version, type its name:');
    if (input !== versionName) {
      alert('Version name did not match. Deletion cancelled.');
      return;
    }
    
    const versions = PromptData.prompts[PromptData.currentPrompt].versions;
    if (versions.length === 1) {
      PromptData.deletePrompt(PromptData.currentPrompt);
      this.resetEditorIfNeeded();
      this.updatePromptTabs();
    } else {
      PromptData.deleteVersion(index);
      this.renderVersionHistory();
    }
  },
  
  // Reset editor when there's no current prompt
  resetEditorIfNeeded: function() {
    if (!PromptData.currentPrompt) {
      document.getElementById('editor').innerHTML = '';
      document.getElementById('currentPromptLabel').textContent = 'No prompt loaded';
      document.getElementById('versionHistory').innerHTML = '';
    }
  },
  
  // Populate instructions content
  setupInstructions: function() {
    document.getElementById('instructionsContent').innerHTML = `
      <p>
        <strong>Instructions:</strong><br>
        - When you type "<", the program will automatically insert a complete tag snippet:<br>
          &nbsp;&nbsp;&lt;<span class="tagName" contenteditable="true"></span>&gt;<br>
          &nbsp;&nbsp;(two line breaks)<br>
          &nbsp;&nbsp;&lt;/<span class="tagNameSync"></span>&gt;<br>
        - The caret is placed inside the opening tag's name so you can immediately type the tag name. As you type, the closing tag updates accordingly.<br>
        - Your work is saved in session when you switch prompts or click other controls.<br>
        - Prompts are managed in the left sidebar. Click a prompt tab to open it.<br>
        - Use the "New (ctrl + P)" button to create a new prompt (you will be asked to type its name).<br>
        - To delete a prompt, click the "Del" button next to it and type its name to confirm deletion.<br>
        - In the version history at the bottom, you can "Edit Name" to rename a version or "Delete" a version (if it's the only version, the whole prompt is deleted).<br>
        - Keyboard shortcuts:<br>
        &nbsp;&nbsp;Ctrl+S: Save Version<br>
        &nbsp;&nbsp;Ctrl+P: New Prompt<br>
        &nbsp;&nbsp;Ctrl+D: Delete Current Prompt
      </p>
    `;
  }
};