import Link from "next/link"

export default function Footer() {
    return (
        <footer className="container font-body sm:px-6 lg:px-8">
            <div className="border-t border-neutral-300 py-12 text-center text-neutral-500">
                <p>
                    Copyright &copy; {new Date().getFullYear()}. Some rights reserved -{" "}
                    <Link
                        href="https://barataribeiro.com/"
                        className="ml-1 text-neutral-500 hover:text-neutral-600 active:text-neutral-700"
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
