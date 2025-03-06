// UI resizing functionality
const Resizers = {
  setup: function() {
    this.setupSidebarResizer();
    this.setupVersionHistoryResizer();
  },
  
  // Setup sidebar resizing
  setupSidebarResizer: function() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    const sidebar = document.getElementById('sidebar');
    const sidebarResizer = document.getElementById('sidebarResizer');
    let isDraggingSidebar = false;
    
    sidebarResizer.addEventListener('mousedown', (e) => {
      isDraggingSidebar = true;
      document.body.style.userSelect = 'none';
    });
    
    window.addEventListener('mousemove', (e) => {
      if (!isDraggingSidebar) return;
      
      const offsetLeft = sidebarContainer.getBoundingClientRect().left;
      const newWidth = e.clientX - offsetLeft;
      
      if (newWidth > 150 && newWidth < window.innerWidth * 0.5) {
        sidebar.style.width = newWidth + 'px';
      }
    });
    
    window.addEventListener('mouseup', () => {
      isDraggingSidebar = false;
      document.body.style.userSelect = 'auto';
    });
  },
  
  // Setup version history panel resizing
  setupVersionHistoryResizer: function() {
    const editorContainer = document.getElementById('editorContainer');
    const versionHistoryDiv = document.getElementById('versionHistory');
    const versionHistoryResizer = document.getElementById('versionHistoryResizer');
    let isDraggingVH = false;
    
    versionHistoryResizer.addEventListener('mousedown', (e) => {
      isDraggingVH = true;
      document.body.style.userSelect = 'none';
    });
    
    window.addEventListener('mousemove', (e) => {
      if (!isDraggingVH) return;
      
      const editorContainerRect = editorContainer.getBoundingClientRect();
      const bottom = editorContainerRect.bottom;
      const newHeight = bottom - e.clientY;
      
      if (newHeight > 50 && newHeight < window.innerHeight * 0.5) {
        versionHistoryDiv.style.height = newHeight + 'px';
      }
    });
    
    window.addEventListener('mouseup', () => {
      isDraggingVH = false;
      document.body.style.userSelect = 'auto';
    });
  }
};