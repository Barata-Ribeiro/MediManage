import Link from "next/link"

export default function Footer() {
    return (
        <footer className="container font-heading sm:px-6 lg:px-8">
            <div className="border-t border-neutral-300 py-12 text-center text-neutral-600">
                <p>
                    Copyright &copy; {new Date().getFullYear()}. Some rights reserved. — By
                    <Link
                        href="https://barataribeiro.com/"
                        className="ml-1 text-neutral-600 hover:text-neutral-700 active:text-neutral-800"
                        rel="external noopener noreferrer"
                        target="_blank"
                        aria-label="Barata-Ribeiro - Portfolio"
                        title="Barata-Ribeiro - Portfolio">
                        Barata Ribeiro
                    </Link>
                </p>
            </div>
        </footer>
    )
}
