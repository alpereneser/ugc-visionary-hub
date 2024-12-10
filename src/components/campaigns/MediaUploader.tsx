import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Video, X } from "lucide-react";

export const MediaUploader = ({ uploadedMedia, setUploadedMedia }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedMedia([...uploadedMedia, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedMedia(uploadedMedia.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaign Media (Optional)
        </label>
        <Input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          multiple
          className="w-full"
        />
      </div>
      
      {uploadedMedia.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedMedia.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <Video className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};