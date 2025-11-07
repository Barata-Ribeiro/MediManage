<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Employee Registration</title>
        <style type="text/css">
        /* Simple CSS2 */
        body { background: #f8fafc; color: #1f2937; font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 20px; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e6e9ee; padding: 18px; }
        h1 { color: #3b82f6; font-size: 18px; margin: 0 0 12px 0; }
        p { font-size: 14px; line-height: 1.4; margin: 8px 0; }
        .credentials { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 10px; display: block; margin: 10px 0; }
        strong { color: #0f172a; }
    </style>
    </head>

    <body>
        <div class="container">
            <h1>Welcome to the Company</h1>

            <p>Hi {{ $employee->full_name ?? 'Employee' }},</p>

            <p>Your employee account has been created successfully. All necessary information can be viewed once you log
                in to {{ $appName }}.</p>

            <span class="credentials">
                Email: {{ $employee->user->email }}<br>
                Password: <strong>{{ $password }}</strong>
            </span>

            <p>Please log in and change your password as soon as possible.</p>

            <p>Thanks,<br>
                {{ $appName }}</p>
        </div>
    </body>

</html>
