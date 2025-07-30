"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4 border-gray-200 mb-4"></div>
        <div className="text-white text-lg font-semibold">Analyzing vibe...</div>
      </div>
    </div>
  );
}


function Modal({ result, onClose, image }) {
  if (!result) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <motion.div
        initial={{ opacity: 0, transform: "translateY(40px)" }}
        animate={{ opacity: 1, transform: "translateY(0)" }}
        transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99] }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative flex flex-col items-center"
      >
        <motion.button
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99], delay: 0.05 }}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </motion.button>
        {image && (
          <motion.div
            initial={{ opacity: 0, transform: "translateY(40px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99], delay: 0.1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(243,244,246,0.7)",
              borderRadius: "1.25rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 24px 0 rgba(59,130,246,0.10), 0 1.5px 8px 0 rgba(0,0,0,0.06)",
              backdropFilter: "blur(2px)",
              border: "1.5px solid #e0e7ef",
              maxWidth: 220,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <img
              src={image}
              alt="Uploaded"
              style={{
                borderRadius: "0.85rem",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
                maxWidth: "180px",
                width: "100%",
                objectFit: "cover",
                background: "#fff",
              }}
            />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99], delay: 0.2 }}
          className="text-5xl mb-2"
        >
          {result.emoji}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99], delay: 0.3 }}
          className="text-2xl font-bold mb-1 capitalize"
        >
          {result.mainVibe}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99], delay: 0.4 }}
          className="text-gray-600 mb-2"
        >
          {result.breakdown}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99], delay: 0.5 }}
          className="italic text-pink-500 mb-4"
        >
          {result.caption}
        </motion.div>
        <motion.button
          initial={{ opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99], delay: 0.6 }}
         className="model-close"
          onClick={onClose}
        >
          Close
        </motion.button>
      </motion.div>
    </div>
  );
}



async function analyzeVibeWithGemini(file, apiKey) {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const base64Image = await toBase64(file);

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze the emotional tone of this social media screenshot.

Respond ONLY with a valid JSON object, nothing else. Do not include any explanation, markdown, or text before or after the JSON.

Return a JSON object with:
- mainVibe: a single word (e.g. "chaotic", "wholesome", "toxic")
- breakdown: a percentage breakdown of sub-vibes (e.g. "70% passive-aggressive, 30% confused")
- caption: a funny caption for the vibe
- emoji: a single emoji that matches the vibe
`,
              },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await res.json();
  let content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let result = {};
  try {
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      result = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    } else {
      // fallback: try to extract fields manually
      const mainVibe = content.match(/mainVibe["']?\s*:\s*["']?([^,"'\n]+)/i)?.[1];
      const breakdown = content.match(/breakdown["']?\s*:\s*["']?([^,"'\n]+)/i)?.[1];
      const caption = content.match(/caption["']?\s*:\s*["']?([^,"'\n]+)/i)?.[1];
      const emoji = content.match(/emoji["']?\s*:\s*["']?([^,"'\n]+)/i)?.[1];
      if (mainVibe || breakdown || caption || emoji) {
        result = { mainVibe, breakdown, caption, emoji };
      } else {
        result = { error: "No JSON found in Gemini response.", raw: content };
      }
    }
  } catch {
    result = { error: "Could not parse Gemini JSON output.", raw: content };
  }
  return result;
}

export default function Home() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDivClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setLoading(true);
    setResult(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const vibeResult = await analyzeVibeWithGemini(file, apiKey);
      setResult(vibeResult);
    } catch (err) {
      setResult({ error: "Failed to analyze image." });
    }
    setLoading(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div>
      <h1 onClick={() => window.location.reload()} className="viboscope">
        viboscope
      </h1>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
   <motion.div
  initial={{ opacity: 0, transform: "translate(-50%, 0%)" }}
  animate={{ opacity: 1,  transform: "translate(-50%, -50%)" }}
  transition={{
    duration: 0.8,
    ease: [0.6, 0.05, 0.01, 0.99],

  }}
  onClick={handleDivClick}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className={`upload-container${dragActive ? " drag-active" : ""} font-semibold whitespace-nowrap text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]`}
  style={{
    cursor: "pointer",
    transition: "box-shadow 0.2s, background 0.2s",
  }}
>
  {dragActive
    ? "Drop your image here"
    : image
    ? "Change image"
    : "Upload the image"}
</motion.div>


      {loading && <Loader />}

      {result && (
        <Modal
          result={result}
          onClose={() => setResult(null)}
          image={image}
        />
      )}

    
      <style jsx global>{`
        .upload-container.drag-active {
          box-shadow: 0 0 0 6px #60a5fa, 0 0 24px 6px #3b82f6aa;
          transition: box-shadow 0.2s, background 0.2s;
        }
      
      `}</style>
    </div>
  );
}