'use client';

import React, { useRef } from 'react';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { ImagesInputProps } from '@/utils/types';
import { addImages, clearImages, removeImageByValue } from '@/utils/indexedDB';
import { compressImage, fileToBase64 } from '@/utils/functions';

export default function ImagesInput({ images, setImages }: ImagesInputProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleSort = async () => {
        const updatedImages = [...images];
        const dragged = updatedImages.splice(dragItem.current!, 1)[0];
        updatedImages.splice(dragOverItem.current!, 0, dragged);
        setImages(updatedImages);
        await clearImages()
        await addImages(updatedImages)
    };

    const handleDelete = async (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
        console.log(images[index])
        await removeImageByValue(images[index])
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files) return;

        const newImages = await Promise.all(
            Array.from(files)
                .slice(0, 5 - images.length)
                .map(async (file) => {
                    const compressed = await compressImage(file);
                    const preview = await fileToBase64(compressed);
                    return { file: compressed, preview };
                })
        );

        setImages([...images, ...newImages]);
        await addImages([...images, ...newImages])
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="flex gap-4">
            {images.map((img, index) => (
                <div
                    key={img.preview+index}
                    className="relative w-[150px] h-[150px] rounded-2xl overflow-hidden border"
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                >
                    <Image
                        src={img.preview}
                        alt="preview"
                        fill
                        className="object-contain pointer-events-none"
                    />
                    <button
                        onClick={() => handleDelete(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                        type="button"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}

            {images.length < 5 && (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="w-[150px] h-[150px] border-2 border-dashed border-gray-400 rounded-2xl flex justify-center items-center cursor-pointer"
                >
                    <Plus />
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                        disabled={images.length >= 5}
                    />
                </div>
            )}
        </div>
    );
}
