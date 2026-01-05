import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 transition-all group text-center cursor-pointer relative">
      <input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-slate-700 rounded-full group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
          <Upload size={32} className="text-slate-400 group-hover:text-amber-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-200">Upload Notes</h3>
          <p className="text-slate-400 mt-2">Drop your .docx file here or click to browse</p>
          <p className="text-xs text-slate-500 mt-4 uppercase tracking-widest">Supports Standard DOCX</p>
        </div>
      </div>
    </div>
  );
};
