import React, { useState, useCallback } from 'react';

import { Upload } from 'src/components/upload';

const BusinessImageGallery = () => {
  const [files, setFiles] = useState([]);
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  return (
    <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} thumbnail />
  );
};

export default BusinessImageGallery;
