import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FileAttachment } from '../types';

interface InputAreaProps {
    onSend: (text: string, file: FileAttachment | null) => void;
    isLoading: boolean;
    onShowPremium: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, onShowPremium }) => {
    const { isPremium } = useAuth();
    const [input, setInput] = useState('');
    const [file, setFile] = useState<FileAttachment | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!input.trim() && !file) || isLoading) return;
        
        onSend(input, file);
        setInput('');
        setFile(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isPremium) {
            onShowPremium();
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const selected = e.target.files?.[0];
        if (!selected) return;

        // Check size (10MB limit)
        if (selected.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10MB limit.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            setFile({
                name: selected.name,
                mimeType: selected.type,
                base64: base64
            });
        };
        reader.readAsDataURL(selected);
    };

    const handleFileClick = (e: React.MouseEvent) => {
        if (!isPremium) {
            e.preventDefault();
            onShowPremium();
        }
    };

    return (
        <footer className="glass fixed bottom-0 left-0 right-0 p-2 md:p-3 border-t border-white/20 z-20 md:absolute">
            <div className="max-w-4xl mx-auto flex flex-col gap-2">
                
                {/* File Preview */}
                {file && (
                    <div className="p-2 glass rounded-xl border-white/20 relative flex items-center space-x-3 animate-fade-in mx-2">
                         {file.mimeType.startsWith('image/') ? (
                             <img src={`data:${file.mimeType};base64,${file.base64}`} className="h-12 w-12 object-cover rounded-lg" alt="preview" />
                         ) : (
                             <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
                                 <Paperclip size={20} className="text-primary" />
                             </div>
                         )}
                         <span className="text-xs md:text-sm font-medium text-secondary truncate flex-1">{file.name}</span>
                         <button 
                            onClick={() => { setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                <div className="flex gap-2 items-center">
                    {/* Input Form */}
                    <form onSubmit={handleSend} className="flex-1 flex items-center space-x-2 rounded-2xl p-1.5 input-opaque w-full">
                        <label 
                            className={`cursor-pointer p-2 rounded-xl text-secondary hover:text-primary transition duration-150 shrink-0 ${!isPremium ? 'opacity-50' : ''}`}
                            onClick={handleFileClick}
                        >
                            <Paperclip size={20} />
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                className="hidden" 
                                onChange={handleFileSelect}
                                accept="image/*,application/pdf,text/plain"
                                disabled={!isPremium && false} 
                            />
                        </label>

                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..." 
                            className="flex-1 bg-transparent outline-none px-2 py-1 text-white placeholder-gray-400 text-base min-w-0"
                            disabled={isLoading}
                        />

                        <button 
                            type="submit" 
                            disabled={(!input.trim() && !file) || isLoading}
                            className="text-white rounded-full p-1.5 w-9 h-9 flex items-center justify-center transition duration-150 disabled:opacity-50 bg-primary hover:opacity-90 shrink-0"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    );
};