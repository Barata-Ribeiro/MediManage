<div align="center">
    <img alt="The main logo of MediManage" width="400" src="public/images/medimanage-logo.svg" title="MediManage Logo"/>
</div>

**MediManage** is a full-stack application designed to streamline the management of small clinics. It provides an intuitive interface for handling patient records, scheduling appointments, and overseeing other essential administrative tasks. With its robust features and user-friendly design, MediManage ensures efficient and organized clinic operations.

## 📚 Features

- Multi-role medical management system with support for patients, doctors, attendants and admins.
- Appointment scheduling and management (create, update, cancel, list).
- Medical records and prescription management with versioned entries.
- Articles, notices and category management for clinic communications.
- Built-in user authentication and role/permission management (Spatie Permission, Fortify).
- Server-side rendering support via Inertia and optional SSR flows.
- Auditing and activity logging for sensitive operations.

## 🚀 Built with

- PHP 8.4+ and Laravel 12
- Inertia.js + React (frontend views)
- TailwindCSS for styling
- SQLite / MySQL (configurable) for database
- Spatie Laravel Permission for roles & permissions
- Barryvdh DOMPDF for PDF generation
- Pest / PHPUnit for tests

## 🛠️ Project setup

This section explains how to set up the project on a development machine (Windows/XAMPP example). If you're on macOS or Linux, the same steps apply but replace XAMPP with your preferred PHP stack and adapt shell commands accordingly.

Requirements

- PHP 8.4 or later
- Composer
- Node.js (LTS recommended) and npm
- XAMPP (or another local PHP/MySQL stack) for Windows
- Git

Initial setup (Windows + XAMPP + PowerShell)

1. Clone the repository:

```powershell
git clone https://github.com/Barata-Ribeiro/MediManage.git
cd MediManage
```

2. Install PHP dependencies with Composer:

```powershell
composer install
```

3. Install Node dependencies and build assets:

```powershell
npm install
npm run dev
```

4. Environment file

- Copy `.env.example` to `.env` and update values (DB settings, mailer, app key, etc.). On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

- Generate the application key:

```powershell
php artisan key:generate
```

- If you're using the default sqlite in `.env` (DB_CONNECTION=sqlite), create the database file:

```powershell
New-Item -Path database\database.sqlite -ItemType File -Force
```

5. Database migrations & seeders

```powershell
php artisan migrate --seed
```

6. Start the local server (Laravel development server):

```powershell
composer run dev
#SSR:
composer run dev:ssr
```

Notes about XAMPP

- If you prefer to use Apache from XAMPP, point your virtual host or DocumentRoot to the project `public` folder.
- Ensure the PHP version bundled with XAMPP meets the project's PHP requirement (8.4+). If not, use a more recent PHP installation or update XAMPP.

Common environment variables you should set in `.env`

- APP_URL — base URL for the application
- DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD — database connection
- MAIL\_\* — mailer settings
- APP_ADMIN_EMAIL, APP_ADMIN_PASSWORD — initial administrator credentials used by seeders (check `.env.example`)

Troubleshooting tips

- If you see permission errors writing to `storage` or `bootstrap/cache`, ensure Windows user has write access to those folders.
- If assets don't load, ensure you ran `npm install` and `npm run dev` (or `npm run build` for production) and that `public/build` exists.

## 🗂️ Folder structure

High-level overview of important folders and files in this repository:

- `app/` — Laravel application source (Models, Controllers, Services, Providers, etc.).
- `bootstrap/` — Framework bootstrap files and cache.
- `config/` — Configuration files for Laravel and packages.
- `database/` — Migrations, factories and seeders.
- `public/` — Document root; compiled assets and `index.php`.
- `resources/` — Frontend assets, views, Inertia React components, styles and JS entry points.
- `routes/` — Route definitions split by responsibility (web, api, admin, appointments, etc.).
- `storage/` — Logs, compiled Blade views, file uploads and cache.
- `tests/` — Pest/PHPUnit tests (Feature & Unit).
- `vendor/` — Composer dependencies (do not edit).

Important files

- `.env.example` — Example env, copy to `.env` and edit for local environment.
- `artisan` — Laravel CLI.
- `composer.json` & `package.json` — PHP and Node package manifests.
- `vite.config.ts` — Frontend bundler config.

Try it (quick start)

1. Copy `.env` and set DB to sqlite (or configure MySQL). Create sqlite file if needed:

```powershell
Copy-Item .env.example .env
php artisan key:generate
New-Item -Path database\database.sqlite -ItemType File -Force
php artisan migrate --seed
npm install
npm run dev
php artisan serve
```

2. Open http://127.0.0.1:8000 in your browser.

## 🪲 Bugs / ToDo

There are bugs and/or implementations that require some attention.

- Send email to patient with account details.
- Implement permissions field validation.
- Fix UI for link insertion; it should never default to an invalid URL.
- Adjust some form submissions to work with Inertia correctly and update URL parameters accordingly.
- Check for the patient's ID in the sidebar, and allow users to register their patient info conditionally.
- Implement status update functionality for doctors and attendants.
- Implement a better empty state for the medical record.
- Implement a proper regular user dashboard.
- Create about page.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Barata-Ribeiro/MediManage/issues) if you want to contribute.

## 📜 License

This project is free software available under the [GPLv3](LICENSE) license.
