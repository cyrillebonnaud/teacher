"use client";

import { useState, useRef } from "react";
import { uploadDocument } from "@/actions/documents";

interface Props {
  sequenceId: string;
}

export default function UploadForm({ sequenceId }: Props) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) {
      setError("Format non supporté. Utilisez PDF, JPEG ou PNG.");
      return;
    }
    setError(null);
    setFile(f);
  }

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadDocument(sequenceId, formData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'upload");
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-blue-400"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {file ? (
          <div>
            <p className="text-3xl mb-2">
              {file.type === "application/pdf" ? "📄" : "📷"}
            </p>
            <p className="font-semibold text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-400 mt-1">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">📎</p>
            <p className="font-semibold text-gray-700">
              Glisse un fichier ici ou clique pour choisir
            </p>
            <p className="text-sm text-gray-400 mt-1">PDF, JPEG, PNG — max 20 MB</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* Info box */}
      <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700">
        <p className="font-medium mb-1">💡 Extraction automatique du texte</p>
        <p>Le contenu sera extrait automatiquement. Tu pourras le corriger ensuite.</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file || uploading}
        className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-lg disabled:opacity-40"
      >
        {uploading ? "Analyse en cours… ⏳" : "Uploader et extraire le texte"}
      </button>

      {uploading && (
        <p className="text-center text-sm text-gray-500 animate-pulse">
          Claude analyse le document, cela peut prendre quelques secondes…
        </p>
      )}
    </div>
  );
}
