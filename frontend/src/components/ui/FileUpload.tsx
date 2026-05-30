import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import Button from './Button';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFilesSelected: (files: File[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
}

export default function FileUpload({
  accept,
  multiple = false,
  maxSize = 10,
  onFilesSelected,
  label,
  helperText,
  error,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): { valid: File[]; error?: string } => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    const valid: File[] = [];
    
    for (const file of files) {
      if (file.size > maxSizeBytes) {
        return {
          valid: [],
          error: `파일 크기는 ${maxSize}MB를 초과할 수 없습니다.`,
        };
      }
      valid.push(file);
    }

    return { valid };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const { valid, error: validError } = validateFiles(fileArray);

    if (validError) {
      setValidationError(validError);
      return;
    }

    setValidationError('');
    setSelectedFiles(valid);
    onFilesSelected(valid);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const displayError = error || validationError;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${displayError ? 'border-red-300 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-primary-400 hover:bg-gray-50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            displayError ? 'bg-red-100' : 'bg-primary-100'
          }`}>
            {displayError ? (
              <AlertCircle className="w-8 h-8 text-red-600" />
            ) : (
              <Upload className="w-8 h-8 text-primary-600" />
            )}
          </div>

          <p className="text-base font-medium text-gray-900 mb-1">
            파일을 드래그하거나 클릭하여 선택
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {accept || '모든 파일 형식'} • 최대 {maxSize}MB
          </p>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            파일 선택
          </Button>
        </div>
      </div>

      {displayError && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {displayError}
        </p>
      )}

      {helperText && !displayError && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            선택된 파일 ({selectedFiles.length})
          </p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <File className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                disabled={disabled}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
