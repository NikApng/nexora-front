"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface PhotoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoSelect: (file: File | null) => void;
  currentPhoto?: string | null;
}

function PhotoUploadModal({
  open,
  onOpenChange,
  onPhotoSelect,
  currentPhoto,
}: PhotoUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(
    currentPhoto || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPreview(currentPhoto || null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, currentPhoto]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {

    if (!preview) {
      onPhotoSelect(null);
    } else if (selectedFile) {
      onPhotoSelect(selectedFile);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    setPreview(currentPhoto || null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Выберите фото профиля</DialogTitle>
          <DialogDescription>
            Загрузите новое фото или выберите из существующих
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={handleRemove}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition hover:bg-red-600"
                  aria-label="Удалить фото"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="h-12 w-12" />
                <span className="text-sm">Нет фото</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />

          <label htmlFor="photo-upload">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
            >
              <Upload className="mr-2 h-4 w-4" />
              {preview ? "Изменить фото" : "Выбрать фото"}
            </Button>
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PhotoUploadModal;

