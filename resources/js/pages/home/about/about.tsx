import Layout from '@/layouts/app/app-public-layout';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <Layout>
            <Head title="About MediManage">
                <meta
                    name="description"
                    content="MediManage — clinic management software focused on simplicity, security and productivity."
                />
            </Head>

            <div className="container py-26 md:py-36">
                <article className="prose dark:prose-invert max-w-4xl">
                    <header className="text-center">
                        <h1>MediManage</h1>
                        <p className="lead">Smart, simple clinic management crafted by our product & marketing team.</p>
                    </header>
                    <section>
                        <h2>Product overview</h2>
                        <p>
                            MediManage is a lightweight, full-stack clinic management product built to help small
                            clinics streamline patient care and administrative workflows. It bundles appointment
                            scheduling, patient records, prescriptions and clinic communications into a single,
                            easy-to-use interface so teams can focus on delivering care instead of wrestling with
                            software.
                        </p>
                    </section>
                    <section>
                        <h2>Key features</h2>
                        <ul>
                            <li>Role-based access for Patients, Doctors, Attendants and Admins.</li>
                            <li>Appointment scheduling with create, update and cancel flows.</li>
                            <li>Versioned medical records and prescription management.</li>
                            <li>Content tools for articles and notices to keep patients informed.</li>
                            <li>Activity auditing and secure authentication for sensitive operations.</li>
                        </ul>
                    </section>
                    <section>
                        <h2>Built with modern tools</h2>
                        <p>
                            The product is implemented using a modern web stack to ensure fast development and reliable
                            operation: Laravel on the backend, Inertia + React for smooth server-driven UI, and
                            TailwindCSS for rapid styling. It works with SQLite or MySQL and includes tooling for PDF
                            generation and permissions.
                        </p>
                    </section>
                    <section>
                        <h2>Designed for clinics, made for teams</h2>
                        <p>
                            MediManage was designed with small clinic workflows in mind: quick patient lookups, clear
                            appointment timelines, and a simple interface for medical entries. The product tries to
                            remove friction from daily tasks so staff can spend more time with patients.
                        </p>
                    </section>
                    <section>
                        <h2>Get started</h2>
                        <p>
                            To try MediManage locally, follow the project README for setup steps — it includes a
                            quick-start that works with XAMPP on Windows and a developer toolchain for building assets
                            and running the app.
                        </p>
                        <p className="text-sm">
                            <strong>Tip:</strong> Seeders provide an initial admin account for exploring the app.
                        </p>
                    </section>
                    <section>
                        <h2>A note about this project</h2>
                        <p>
                            While this site reads and behaves like a production product, MediManage is primarily a
                            learning and demonstration project. It was crafted to emulate a polished software product so
                            developers can study a realistic codebase, practice full-stack features, and iterate on
                            real-world concerns like permissions, auditing and server-side rendering.
                        </p>
                    </section>
                    <footer>
                        <h3>Feedback & contributions</h3>
                        <p>
                            The project is open-source and welcomes contributions, bug reports and feature ideas. If you
                            found this useful or have suggestions, please open an issue on the repository.
                        </p>
                    </footer>
                </article>
            </div>
        </Layout>
    );
}
