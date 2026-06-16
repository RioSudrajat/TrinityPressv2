import React, { useState, useRef } from "react";
import { UploadCloud, FileImage, AlertTriangle } from "lucide-react";
import { validateFile } from "../../utils/validators";

export default function DropZone({ onFilesSelected, onError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFiles = (filesList) => {
    const validFiles = [];
    const errors = [];

    // Limit to 10 files maximum
    const filesArray = Array.from(filesList).slice(0, 10);

    filesArray.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(validation.error);
      }
    });

    if (errors.length > 0) {
      onError(errors[0]); // Report the first error to the user
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`glass-panel rounded-xl p-8 md:p-12 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
        isDragActive
          ? "border-accentPrimary bg-accentPrimary/10 scale-[1.01]"
          : "border-borderHalus hover:border-textSec hover:bg-surfaceElevated/40"
      }`}
      onClick={onButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".png,.jpg,.jpeg,.webp,.bmp"
        onChange={handleFileChange}
      />

      <div className={`p-4 rounded-full bg-surfaceElevated mb-4 border border-borderHalus transition-transform duration-300 ${isDragActive ? "scale-110 text-accentPrimary" : "text-textSec"}`}>
        <UploadCloud size={32} />
      </div>

      <h3 className="font-display text-lg md:text-xl font-semibold mb-2 text-textMain">
        Seret & letakkan gambar Anda di sini
      </h3>
      <p className="text-sm text-textSec mb-6 max-w-sm">
        atau klik untuk mencari dari komputer Anda. Bisa memilih hingga 10 file sekaligus.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-textLabel bg-background/50 py-2 px-4 rounded-full border border-borderHalus/40">
        <span className="flex items-center gap-1"><FileImage size={12} /> PNG</span>
        <span className="h-3 w-px bg-borderHalus" />
        <span className="flex items-center gap-1"><FileImage size={12} /> JPEG</span>
        <span className="h-3 w-px bg-borderHalus" />
        <span className="flex items-center gap-1"><FileImage size={12} /> WEBP</span>
        <span className="h-3 w-px bg-borderHalus" />
        <span className="flex items-center gap-1"><FileImage size={12} /> BMP</span>
        <span className="h-3 w-px bg-borderHalus" />
        <span className="font-mono">Maks 10 MB</span>
      </div>
    </div>
  );
}
