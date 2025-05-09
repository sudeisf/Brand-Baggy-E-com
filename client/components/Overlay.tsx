import React from 'react';

interface OverlayProps {
    children: React.ReactNode;
    className?: string;
}

const Overlay: React.FC<OverlayProps> = ({ children, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 bg-[#ddd9cd] opacity-50"></div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Overlay; 