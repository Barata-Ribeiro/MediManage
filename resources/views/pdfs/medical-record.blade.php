@php
    use Carbon\Carbon;
@endphp


<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ optional($medicalRecord->patientInfo)->first_name ?? '' }} {{ optional($medicalRecord->patientInfo)->last_name ?? '' }}
        - Medical Record</title>
    <style>
        /* Print-friendly styling */
        body {
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            margin: 20px;
            font-size: 12px;
            line-height: 1.4;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .clinic-name {
            font-size: 16px;
            font-weight: 700;
        }

        .meta {
            text-align: right;
            font-size: 11px;
            color: #374151;
        }

        .card {
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 12px;
        }

        .patient-grid {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .patient-field {
            min-width: 200px;
        }

        h2 {
            margin: 8px 0;
            font-size: 14px;
        }

        .notes {
            margin-top: 8px;
        }

        /* prevent splitting important blocks across pages */
        .card,
        .notes,
        .entry {
            page-break-inside: avoid;
        }

        .entries {
            margin-top: 8px;
        }

        .entry {
            border-top: 1px dashed #e5e7eb;
            padding-top: 8px;
            margin-top: 8px;
        }

        .small {
            text-transform: capitalize;
            font-size: 11px;
            color: #6b7280;
        }
    </style>
</head>

<body>
    <header class="header">
        <div class="clinic-name">MediManage — Medical Record</div>
        <div class="meta">
            Record ID: {{ $medicalRecord->id }}<br>
            Created: {{ Carbon::parse($medicalRecord->created_at)->format('F j, Y g:i A') }}<br>
            Last Updated: {{ Carbon::parse($medicalRecord->updated_at)->format('F j, Y g:i A') }}
        </div>
    </header>

    <div class="card">
        <h2>Patient Information</h2>
        <div class="patient-grid">
            <div class="patient-field"><strong>Name:</strong> {{ $medicalRecord->patientInfo->full_name ?? '—' }}</div>
            <div class="patient-field"><strong>Gender:</strong> {{ $medicalRecord->patientInfo->gender ?? '—' }}</div>
            <div class="patient-field">
                <strong>DOB:</strong>
                {{ $medicalRecord->patientInfo->date_of_birth
                    ? Carbon::parse($medicalRecord->patientInfo->date_of_birth)->format('F d, Y')
                    : '—' }}
                ({{ $medicalRecord->patientInfo->age ?? '—' }} years old)
            </div>
            <div class="patient-field"><strong>Phone:</strong> {{ $medicalRecord->patientInfo->phone_number ?? '—' }}</div>
            <div class="patient-field"
                 style="flex:1"><strong>Address:</strong> {{ $medicalRecord->patientInfo->address ?? '—' }}</div>
            <div class="patient-field"><strong>Insurance:</strong> {{ $medicalRecord->patientInfo->insurance_company ?? '—' }}</div>
            <div class="patient-field"><strong>Policy Number:</strong> #{{ $medicalRecord->patientInfo->insurance_policy_number ?? '—' }}</div>
        </div>
    </div>

    <div class="card">
        <h2>Medical Notes</h2>
        <div class="notes">
            {!! $medicalRecord->medical_notes_html ?? '<div class="small">No notes available.</div>' !!}
        </div>
    </div>

    @if(isset($entries) && $entries->isNotEmpty())
        <div class="card">
        <h2>Record Entries</h2>
        <div class="entries">
            @foreach($entries as $entry)
                <div class="entry">
                    <div class="small">
                        {{ Carbon::parse($entry->created_at)->format('F j, Y g:i A') }}
                        — {{ $entry->entry_type ?? 'entry' }}
                    </div>

                    @if(!empty($entry->title))
                        <div><strong>{{ $entry->title }}</strong></div>
                    @endif

                    <div>{!! $entry->content_html ?? '<div class="small">No notes available.</div>' !!}</div>
                </div>
            @endforeach
        </div>
    </div>
    @endif

    <div class="small" style="margin-top:12px; text-align:center;">Printed by MediManage</div>
</body>

</html>
