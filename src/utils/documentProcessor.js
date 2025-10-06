// Document Processing Utilities

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve({
        name: file.name,
        content: e.target.result,
        type: file.type,
        size: file.size
      });
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    if (file.type === 'application/pdf') {
      // For PDF files, we'll read as text (in production, you'd use a PDF parser library)
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export const processDocuments = async (files) => {
  const documents = [];
  
  for (const file of files) {
    try {
      const doc = await readFileAsText(file);
      documents.push(doc);
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }
  
  return documents;
};

export const validateFileType = (file) => {
  const allowedTypes = ['text/plain', 'application/pdf'];
  return allowedTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.pdf');
};
