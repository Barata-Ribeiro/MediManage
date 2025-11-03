@php
    use Carbon\Carbon;
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $invoice->patientInfo->full_name }} - Invoice</title>
    <style>
        /* Print-friendly styling */
        @page {
            margin: 20mm 15mm;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            margin: 0;
            font-size: 12px;
            line-height: 1.4;
            background: #ffffff;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #124fc9;
            padding-bottom: 10px;
        }

        .clinic-name {
            font-size: 18px;
            font-weight: 700;
            color: #124fc9;
        }

        .invoice-meta {
            text-align: right;
            font-size: 11px;
            color: #374151;
        }

        .card {
            border: 1px solid #e5e7eb;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            background: #f9fafb;
        }

        .patient-grid {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }

        .patient-field {
            min-width: 200px;
        }

        h2 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #124fc9;
            font-weight: 600;
        }

        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .detail-label {
            font-weight: 600;
            color: #374151;
        }

        .detail-value {
            color: #111827;
        }

        .amount-total {
            font-size: 16px;
            font-weight: 700;
            color: #124fc9;
            text-align: right;
            margin-top: 10px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }

        /* Prevent page breaks inside important elements */
        .card,
        .detail-row {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="clinic-name">MediManage — Invoice</div>
        <div class="invoice-meta">
            Invoice ID: {{ $invoice->id }}<br>
            Issued: {{ Carbon::parse($invoice->created_at)->format('F j, Y') }}<br>
            Due: {{ Carbon::parse($invoice->due_date)->format('F j, Y') }}
        </div>
    </header>

    <div class="card">
        <h2>Patient Information</h2>
        <div class="patient-grid">
            <div class="patient-field"><strong>Name:</strong> {{ $invoice->patientInfo->full_name }}</div>
            <div class="patient-field"><strong>Phone:</strong> {{ $invoice->patientInfo->phone_number ?? '—' }}</div>
            <div class="patient-field"><strong>Email:</strong> {{ $invoice->patientInfo->email ?? '—' }}</div>
            <div class="patient-field"><strong>Address:</strong> {{ $invoice->patientInfo->address ?? '—' }}</div>
        </div>
    </div>

    <div class="card">
        <h2>Invoice Details</h2>
        <div class="invoice-details">
            <div class="detail-row">
                <span class="detail-label">Consultation Date:</span>
                <span class="detail-value">{{ Carbon::parse($invoice->consultation_date)->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">{{ $invoice->payment_method }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">{{ $invoice->status }}</span>
            </div>
            @if($invoice->notes)
            <div class="detail-row" style="grid-column: 1 / -1; border-bottom: none;">
                <span class="detail-label">Notes:</span>
                <span class="detail-value">{{ $invoice->notes }}</span>
            </div>
            @endif
        </div>
        <div class="amount-total">
            Total Amount: ${{ number_format($invoice->amount, 2) }}
        </div>
    </div>

    <div class="footer">
        Thank you for choosing MediManage. For any questions, please contact our billing department.
    </div>
</body>
</html>
