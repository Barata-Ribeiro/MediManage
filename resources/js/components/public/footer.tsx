import AppLogo from '@/components/app-logo';
import TextLink from '@/components/text-link';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { FolderIcon } from 'lucide-react';

export default function Footer() {
    return (
        <footer>
            <div className="container mx-auto flex flex-col items-center py-8 sm:flex-row">
                <Link href={home()} className="w-max">
                    <AppLogo />
                </Link>
                <p className="mt-4 text-sm text-gray-500 sm:mt-0 sm:ml-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:pl-4">
                    &copy; {new Date().getFullYear()} MediManage —{' '}
                    <TextLink href="https://barataribeiro.com/" rel="noopener noreferrer" target="_blank">
                        Barata-Ribeiro
                    </TextLink>
                </p>

                <span className="mt-4 inline-flex justify-center gap-x-1 sm:mt-0 sm:ml-auto sm:justify-start">
                    <a
                        href="https://github.com/Barata-Ribeiro/MediManage"
                        className="text-gray-500"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Repository"
                    >
                        <FolderIcon aria-hidden size={20} />
                    </a>
                </span>
            </div>
        </footer>
    );
}
