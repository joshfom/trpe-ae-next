"use client"
    import React, { useEffect, useRef, ReactNode, useCallback } from 'react';

    interface ClickAwayListenerProps {
        children: ReactNode;
        onClickAway: () => void;
    }

    const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({ children, onClickAway }) => {
        const node = useRef<HTMLDivElement>(null);

        const handleClick = useCallback((e: MouseEvent) => {
            if ((e.target as Element).closest('.select-component')) {
                return;
            }
            if (node.current?.contains(e.target as Node)) {
                return;
            }
            onClickAway();
        }, [onClickAway]);

        useEffect(() => {
            document.addEventListener("mousedown", handleClick);
            return () => {
                document.removeEventListener("mousedown", handleClick);
            };
        }, [handleClick]);

        return <div ref={node}>{children}</div>;
    }

    export default ClickAwayListener;