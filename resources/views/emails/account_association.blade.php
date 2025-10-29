<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account Associated</title>
    <style type="text/css">
        /* Simple CSS2 */
        body { background: #f8fafc; color: #1f2937; font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 20px; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e6e9ee; padding: 18px; }
        h1 { color: #3b82f6; font-size: 18px; margin: 0 0 12px 0; }
        p { font-size: 14px; line-height: 1.4; margin: 8px 0; }
        ul { margin: 8px 0 12px 18px; }
        li { margin: 4px 0; }
        .note { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Account associated with patient</h1>

        <p>Hi {{ $user->name ?? 'User' }},</p>

        <p>Your user account has been associated with the following patient record:</p>

        <div class="note">
            <ul>
                <li><strong>Patient:</strong> {{ $patient->first_name ?? '' }} {{ $patient->last_name ?? '' }}</li>
                <li><strong>Patient ID:</strong> {{ $patient->id ?? '' }}</li>
            </ul>
        </div>

        <p>If this was not expected, please contact support.</p>

        <p>Thanks,<br>
        {{ $appName }}</p>
    </div>
</body>
</html>
