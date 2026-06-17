"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type ReactQuillComponent from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import LinkModal from "./LinkModal";

// Dynamically import QuillWrapper to avoid Next.js Server-Side Rendering (SSR) issues
const ReactQuill = dynamic(
  async () => {
    const { default: QW } = await import("./QuillWrapper");
    return QW;
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white/40 h-[200px] flex flex-col items-center justify-center font-mono gap-3">
        <svg className="animate-spin h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-[10px] uppercase tracking-widest animate-pulse">Memuat Editor Teks...</span>
      </div>
    ),
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "blockquote",
  "list",
  "link",
];

const toolbarTooltips: Record<string, string> = {
  ".ql-header": "Pilih gaya heading",
  ".ql-bold": "Tebalkan teks",
  ".ql-italic": "Miringkan teks",
  ".ql-underline": "Garis bawah teks",
  ".ql-blockquote": "Buat kutipan",
  ".ql-list[value='ordered']": "Buat daftar bernomor",
  ".ql-list[value='bullet']": "Buat daftar poin",
  ".ql-link": "Tambahkan tautan",
  ".ql-clean": "Hapus format teks",
};

type QuillRange = {
  index: number;
  length: number;
};

type QuillToolbar = {
  addHandler: (name: string, handler: () => void) => void;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis artikel lengkap di sini...",
}: RichTextEditorProps) {
  const rawId = useId();
  const editorId = `editor-${rawId.replace(/:/g, "")}`;
  const reactQuillRef = useRef<ReactQuillComponent | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [savedRange, setSavedRange] = useState<QuillRange | null>(null);

  useEffect(() => {
    const editor = document.getElementById(editorId);
    if (!editor) return;

    const applyTooltips = () => {
      const toolbar = editor.querySelector(".ql-toolbar");
      if (!toolbar) return;

      Object.entries(toolbarTooltips).forEach(([selector, label]) => {
        toolbar.querySelectorAll<HTMLElement>(selector).forEach((element) => {
          element.setAttribute("data-tooltip", label);
          element.setAttribute("aria-label", label);
        });
      });
    };

    applyTooltips();

    const observer = new MutationObserver(applyTooltips);
    observer.observe(editor, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [editorId]);

  const handleInsertLink = (text: string, url: string) => {
    setIsLinkModalOpen(false);
    if (!reactQuillRef.current) return;
    const quill = reactQuillRef.current.getEditor();

    // Standardize URL protocol
    let formattedUrl = url;
    if (url && !/^https?:\/\//i.test(url) && !/^mailto:/i.test(url) && !/^tel:/i.test(url)) {
      formattedUrl = `https://${url}`;
    }

    const range = savedRange;
    if (range) {
      // Focus back on the editor
      quill.focus();
      if (range.length > 0) {
        // Restore selection range
        quill.setSelection(range.index, range.length);
        // Apply link format to current selection
        quill.format("link", formattedUrl);
      } else {
        // Insert new link text
        const insertText = text || formattedUrl;
        quill.insertText(range.index, insertText);
        quill.formatText(range.index, insertText.length, "link", formattedUrl);
        // Position cursor after the inserted link
        quill.setSelection(range.index + insertText.length);
      }
    }
    setSavedRange(null);
  };

  return (
    <div id={editorId} className="rich-text-editor w-full">
      <ReactQuill
        ref={(el: ReactQuillComponent | null) => {
          if (el) {
            reactQuillRef.current = el;
            try {
              const quill = el.getEditor();
              const toolbar = quill.getModule("toolbar") as QuillToolbar;
              // Overwrite default link handler
              toolbar.addHandler("link", () => {
                let range = quill.getSelection();
                if (!range) {
                  quill.focus();
                  range = quill.getSelection() || { index: quill.getLength() - 1, length: 0 };
                }
                setSavedRange(range);
                const selectedText = quill.getText(range.index, range.length);
                setLinkText(selectedText);
                setIsLinkModalOpen(true);
              });

              // Overwrite default clean handler to ensure it works properly
              toolbar.addHandler("clean", () => {
                let range = quill.getSelection();
                if (!range) {
                  quill.focus();
                  range = quill.getSelection();
                }
                if (range) {
                  if (range.length === 0) {
                    const formats = quill.getFormat(range.index, range.length);
                    Object.keys(formats).forEach((format) => {
                      quill.format(format, false);
                    });
                  } else {
                    quill.removeFormat(range.index, range.length);
                  }
                }
              });
            } catch (err) {
              console.error("Error setting custom link handler:", err);
            }
          }
        }}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        bounds={`#${editorId}`}
      />

      {isLinkModalOpen && (
        <LinkModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          onSave={handleInsertLink}
          initialText={linkText}
        />
      )}
    </div>
  );
}
