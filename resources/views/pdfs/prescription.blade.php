@php
    use Carbon\Carbon;
@endphp

    <!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{ $prescription->patientInfo->full_name }} - Prescription</title>
    <style>
        /* Basic print/page setup */
        @page {
            margin: 18mm 16mm;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #ffffff;
            /* avoid resetting to 0 to prevent content overflow in dompdf */
            margin: 8mm;
            -webkit-font-smoothing: antialiased;
        }

        /* Wrapper that holds the whole prescription card */
        .wrapper {
            border: 1px solid #e5e7eb;
            border-top: 8px solid #124fc9; /* primary top border */
            padding: 14px;
            background: #ffffff;
            border-radius: 0 0 1rem 1rem;
        }

        /* Header styles */
        .header__title {
            font-size: 26px;
            font-weight: bold;
            text-align: center;
            margin: 4px 0 6px 0;
        }

        .header__subtitle {
            text-align: center;
            font-size: 12px;
            color: #6b7280; /* muted color */
            margin-bottom: 10px;
        }

        .separator {
            display: inline-block;
            width: 1px;
            height: 12px;
            background: #d1d5dc;
            vertical-align: middle;
            margin: 0 6px;
        }

        .header__meta {
            font-size: 12px;
            color: #374151;
            margin-top: 6px;
            overflow: visible;
        }

        .header__meta__time {
            display: block;
            width: 48%;
        }

        .header__meta__time:first-child {
            float: left;
            text-align: left;
        }

        .header__meta__time:last-child {
            float: right;
            text-align: right;
        }

        /* Clear floats after header meta */
        .header__meta:after {
            content: "";
            display: block;
            clear: both;
        }

        /* Article area */
        .article {
            margin-top: 18px;
        }

        .article__title {
            display: inline-block;
            background: #124fc9; /* primary */
            color: #ffffff;
            padding: 3px 8px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            border-radius: 0.375rem;
        }

        .article__content {
            margin-top: 8px;
            font-size: 13px;
            line-height: 1.45;
            color: #111827;
        }

        /* Footer layout using floats */
        .footer {
            margin-top: 18px;
            font-size: 12px;
            color: #111827;
            overflow: visible;
        }

        .footer__figure {
            float: left;
            width: 120px;
            text-align: center;
            margin-right: 12px;
        }

        .footer__qrcode {
            display: block;
            width: 120px;
            height: auto;
            border: 8px solid #124fc9;
            border-radius: 0.5rem;
            box-sizing: border-box;
        }

        .footer__caption {
            display: block;
            margin-top: 6px;
            font-weight: 600;
            color: #124fc9;
            font-size: 12px;
        }

        .footer__info {
            margin-top: 100px;
            margin-left: 200px;
        }

        .footer__info__prescriber,
        .footer__info__license {
            margin: 4px 0;
        }

        .footer__info__prescriber--label,
        .footer__info__license--label {
            font-weight: 700;
            display: block;
        }

        .footer__info__prescriber--name {
            display: block;
            margin-top: 2px;
        }

        /* Ensure floats are cleared at the end of the footer */
        .footer:after {
            content: "";
            display: block;
            clear: both;
        }

        /* Basic typography tweaks for printing */
        h2, h3, h4 {
            margin: 0;
            padding: 0;
        }

        p {
            margin: 0 0 8px 0;
        }

        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <section
        aria-label="Prescription Details"
        class="wrapper"
    >
        <header>
            <h3 class="header__title">
                {{ $prescription->patientInfo->full_name }}
            </h3>

            <div class="header__subtitle">
                <span>{{ $prescription->patientInfo->gender }}</span>
                <span class="separator"></span>
                <span>{{ $prescription->patientInfo->age }} years old</span>
            </div>

            <div class="header__meta">
                <time datetime="{{ $prescription->date_issued }}" class="header__meta__time">
                    <span>Issued on:</span>
                    <span>{{ Carbon::parse($prescription->date_issued)->format('F j, Y') }}</span>
                </time>
                <time datetime="{{ $prescription->date_expires }}" class="header__meta__time">
                    <span>Expires on:</span>
                    <span>{{ Carbon::parse($prescription->date_expires)->format('F j, Y') }}</span>
                </time>
            </div>
        </header>

        <article class="article">
            <h2 class="article__title">Prescription Details</h2>

            <div class="article__content">
                {!! $prescription->prescription_details_html !!}
            </div>
        </article>

        <footer class="footer">
            <figure class="footer__figure">
                <img
                    src={{ "data:image/png;base64," . $prescription->qr_code }}
                    alt="Prescription QR Code"
                    class="footer__qrcode"
                />
                <figcaption class="footer__caption">
                    #{{ $prescription->validation_code }}
                </figcaption>
            </figure>

            <div class="footer__info">
                <p class="footer__info__prescriber">
                    <span class="footer__info__prescriber--label">Prescribed by:</span>
                    <span class="footer__info__prescriber--name">
                        {{ $prescription->employeeInfo->full_name }}, {{ $prescription->employeeInfo->specialization }}
                    </span>
                </p>

                <p class="footer__info__license">
                    <span class="footer__info__license--label">License:</span>
                    <span>{{ $prescription->employeeInfo->license_number }}</span>
                </p>
            </div>
        </footer>
    </section>
</body>
</html>
