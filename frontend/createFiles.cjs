const fs = require('fs');
const path = require('path');

const structure = {
  components: [
    'LeadManagement.jsx',
    'LeadDetailView.jsx',
    'InteractionHistory.jsx',
    'AnalyticsDashboard.jsx',
    'ReportingTools.jsx'
  ],
  context: ['LeadContext.jsx'],
  App: 'App.jsx'
};

const createFile = (filePath, content = '') => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
};

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};


const generateStructure = (basePath, structure) => {

  const srcPath = path.join(basePath, 'src');
  createDir(srcPath);


  const componentsPath = path.join(srcPath, 'components');
  createDir(componentsPath);
  structure.components.forEach((file) => {
    const filePath = path.join(componentsPath, file);
    createFile(filePath, `// ${file} content here`);
  });


  const contextPath = path.join(srcPath, 'context');
  createDir(contextPath);
  structure.context.forEach((file) => {
    const filePath = path.join(contextPath, file);
    createFile(filePath, `// ${file} content here`);
  });


  const appPath = path.join(srcPath, 'App.jsx');
  createFile(appPath, `// App.jsx content here`);
};


const basePath = __dirname; 
generateStructure(basePath, structure);
