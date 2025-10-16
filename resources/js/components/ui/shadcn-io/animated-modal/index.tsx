import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../button';

interface ModalContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const memoizedValue = useMemo(() => ({ open, setOpen }), [open]);
    return <ModalContext.Provider value={memoizedValue}>{children}</ModalContext.Provider>;
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export function Modal({ children }: Readonly<{ children: ReactNode }>) {
    return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({ children, className }: { children: ReactNode; className?: string }) => {
    const { setOpen } = useModal();
    return (
        <button
            type="button"
            className={cn('relative cursor-pointer overflow-hidden', className)}
            onClick={() => setOpen(true)}
        >
            {children}
        </button>
    );
};

export const ModalBody = ({ children, className }: { children: ReactNode; className?: string }) => {
    const { open } = useModal();

    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [open]);

    const modalRef = useRef<HTMLDivElement>(null);
    const { setOpen } = useModal();
    useOnClickOutside(modalRef as React.RefObject<HTMLElement>, () => setOpen(false));

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    className="fixed inset-0 z-50 flex h-full w-full items-center justify-center [perspective:800px] [transform-style:preserve-3d]"
                >
                    <Overlay />

                    <motion.div
                        ref={modalRef}
                        className={cn(
                            'relative z-50 flex max-h-[90%] min-h-[50%] flex-1 flex-col overflow-hidden border border-transparent bg-white md:max-w-[40%] md:rounded-2xl dark:border-neutral-800 dark:bg-neutral-950',
                            className,
                        )}
                        initial={{
                            opacity: 0,
                            scale: 0.5,
                            rotateX: 40,
                            y: 40,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotateX: 0,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            rotateX: 10,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 15,
                        }}
                    >
                        <CloseIcon />
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const ModalContent = ({ children, className }: { children: ReactNode; className?: string }) => {
    return <div className={cn('flex flex-1 flex-col p-8 md:p-10', className)}>{children}</div>;
};

export const ModalFooter = ({
    children,
    className,
    buttonTitle = 'Close',
}: {
    children: ReactNode;
    className?: string;
    buttonTitle?: string;
}) => {
    return (
        <div className={cn('flex justify-end bg-gray-100 p-4 dark:bg-neutral-900', className)}>
            {children}
            <CancelButton>{buttonTitle}</CancelButton>
        </div>
    );
};

const Overlay = ({ className }: { className?: string }) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
                backdropFilter: 'blur(10px)',
            }}
            exit={{
                opacity: 0,
                backdropFilter: 'blur(0px)',
            }}
            className={`bg-opacity-50 fixed inset-0 z-50 h-full w-full bg-black ${className}`}
        ></motion.div>
    );
};

const CloseIcon = () => {
    const { setOpen } = useModal();
    return (
        <button type="button" onClick={() => setOpen(false)} className="group absolute top-4 right-4">
            <XIcon
                aria-hidden
                size={16}
                className="cursor-pointer text-black transition duration-200 group-hover:scale-125 group-hover:rotate-3 dark:text-white"
            />
        </button>
    );
};

const CancelButton = ({ children, className }: { children: ReactNode; className?: string }) => {
    const { setOpen } = useModal();
    return (
        <Button type="button" onClick={() => setOpen(false)} variant="outline" className={className}>
            {children}
        </Button>
    );
};
