
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Content } from '@google/genai';
import { useAuth } from '../contexts/AuthContext';
import { Copy, Check, Search, BrainCircuit, Loader2 } from 'lucide-react';
import { ModelMode } from '../types';

interface ChatAreaProps {
    history: Content[];
    streamingText: string | null;
    isStreaming: boolean;
    currentMode: ModelMode;
    authLoading: boolean;
}

const WelcomeView: React.FC<{ loading: boolean }> = ({ loading }) => {
    const { user, isPremium } = useAuth();
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
                <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full blur-md bg-primary/40 animate-pulse"></div>
                    <img src="logo.png" onError={(e) => e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Mekelle_University_logo.png/220px-Mekelle_University_logo.png"} alt="Mekelle Logo" className="relative rounded-full w-24 h-24 object-cover bg-white animate-spin-slow" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Loading Profile...</h2>
                <p className="text-secondary text-sm">Setting up your personalized assistant.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
             <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-2xl">
                <img src="logo.png" onError={(e) => e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Mekelle_University_logo.png/220px-Mekelle_University_logo.png"} alt="Mekelle Logo" className="rounded-full w-32 h-32 md:w-48 md:h-48 object-cover bg-white" />
            </div>
            
            <h2 className="mt-6 text-3xl md:text-4xl font-extrabold text-white">
                Hi, <span className="inline-block px-3 py-1 border-2 border-[#FFD700] rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 text-white shadow-lg">{user?.name || 'Student'}</span>! {isPremium && '🥇'}
            </h2>
            
            {isPremium && (
                <p className="mt-2 text-yellow-300 font-semibold animate-pulse">Thank you for your support!</p>
            )}
            
            <p className="mt-4 text-lg text-secondary max-w-lg">
                I'm your AI assistant for Mekelle University. Ask me about your studies, campus life, or attach documents for analysis.
            </p>

            <div className="mt-12 space-y-2 text-secondary text-sm glass p-6 rounded-xl max-w-md w-full">
                <div className="flex items-center justify-center mb-4">
                     <img src="myImage.png" onError={(e) => e.currentTarget.src = "https://picsum.photos/200/200"} alt="Amaniel" className="w-16 h-16 rounded-full border-2 border-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Creator Contact:</h3>
                <p>Contact: Amaniel Niguse (Dept. of Economics)</p>
                <p>🗨 Telegram: @Amax_v2</p>
                <p>📧 Email: amanial.v2@gmail.com</p>
                <p>☎️ : +251980337790</p> 
            </div>
        </div>
    );
};

export const ChatArea: React.FC<ChatAreaProps> = ({ history, streamingText, isStreaming, currentMode, authLoading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        // Use a slight timeout to allow DOM to update, especially for images/latex
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth' });
        }, 50);
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, streamingText, isStreaming]);

    if ((history.length === 0 && !streamingText) || authLoading) {
        return <WelcomeView loading={authLoading} />;
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6 pb-24">
                {history.map((msg, idx) => (
                    <MessageBubble key={idx} role={msg.role} parts={msg.parts} />
                ))}
                
                {isStreaming && (
                    <div className="flex justify-start w-full">
                         <div className="p-4 glass model-bubble rounded-br-xl rounded-tr-xl rounded-tl-3xl w-full">
                            <div className="message-content text-white prose prose-invert max-w-none">
                                {(!streamingText || streamingText.length === 0) ? (
                                    <div className="flex items-center space-x-3 py-2">
                                        {currentMode === 'search' ? (
                                            <>
                                                <Search className="w-6 h-6 gemini-spinner" />
                                                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 animate-pulse">
                                                    Searching Google...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <BrainCircuit className="w-6 h-6 gemini-spinner" />
                                                <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse">
                                                    Thinking Deeply...
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto w-full">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkMath, remarkGfm]}
                                                rehypePlugins={[rehypeKatex]}
                                                components={{
                                                    table: ({node, ...props}) => (
                                                        <div className="markdown-table-container">
                                                            <table {...props} />
                                                        </div>
                                                    ),
                                                    pre: ({node, ...props}) => <CodeBlock {...props} />
                                                }}
                                            >
                                                {streamingText}
                                            </ReactMarkdown>
                                        </div>
                                        <span className="blinking-cursor"></span>
                                    </>
                                )}
                            </div>
                         </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

// Custom Code Block Component with Copy Button
const CodeBlock: React.FC<any> = ({ children, ...props }) => {
    const [copied, setCopied] = useState(false);
    
    // Extract text content from the code block
    const getCodeText = () => {
        let text = '';
        React.Children.forEach(children, child => {
            if (typeof child === 'string') {
                text += child;
            } else if (React.isValidElement(child)) {
                 const element = child as React.ReactElement<any>;
                 const props = element.props;
                 if (props && props.children) {
                     if (Array.isArray(props.children)) {
                        text += props.children.join('');
                     } else {
                        text += String(props.children);
                     }
                 }
            }
        });
        return text;
    };

    const handleCopy = () => {
        const text = getCodeText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block-wrapper group">
            <button 
                onClick={handleCopy}
                className="code-copy-btn flex items-center gap-1"
                title="Copy code"
            >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <pre {...props}>{children}</pre>
        </div>
    );
};

const MessageBubble: React.FC<{ role: string, parts: any[] }> = ({ role, parts }) => {
    const isUser = role === 'user';
    const [copied, setCopied] = useState(false);

    const bubbleClass = isUser 
        ? 'rounded-bl-xl rounded-tl-xl rounded-tr-3xl user-bubble user-bubble-effect ml-auto' 
        : 'rounded-br-xl rounded-tr-xl rounded-tl-3xl glass model-bubble';

    const handleCopyMessage = () => {
        const text = parts.map(p => p.text).join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full group/bubble`}>
            {/* Conditional Width: Full width for model, Max width for user */}
            <div className={`p-4 ${bubbleClass} message-content ${isUser ? 'max-w-[90%] md:max-w-[85%]' : 'w-full'} overflow-hidden relative`}>
                {parts.map((part, pIdx) => (
                    <div key={pIdx}>
                        {part.inlineData && (
                            <div className="mb-3">
                                {part.inlineData.mimeType.startsWith('image/') ? (
                                    <img 
                                        src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} 
                                        className="w-full max-h-60 object-contain rounded-xl border border-white/20"
                                        alt="Attached"
                                    />
                                ) : (
                                    <div className="flex items-center space-x-2 p-2 border border-white/20 rounded-lg bg-white/10">
                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        <span className="text-sm font-medium">File Attached ({part.inlineData.mimeType})</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {part.text && (
                            <div className="message-text prose prose-invert max-w-none text-inherit overflow-x-hidden">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkMath, remarkGfm]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        table: ({node, ...props}) => (
                                            <div className="markdown-table-container">
                                                <table {...props} />
                                            </div>
                                        ),
                                        pre: ({node, ...props}) => <CodeBlock {...props} />
                                    }}
                                >
                                    {part.text}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Chat Message Copy Button */}
                {!isUser && (
                    <div className="mt-2 flex justify-end opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200">
                         <button 
                            onClick={handleCopyMessage}
                            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 flex items-center gap-1 text-xs"
                            title="Copy message"
                        >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
