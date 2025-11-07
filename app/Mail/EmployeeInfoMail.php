<?php

namespace App\Mail;

use App\Models\EmployeeInfo;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmployeeInfoMail extends Mailable
{
    use Queueable, SerializesModels;

    public EmployeeInfo $employee;

    public string $password;

    public string $appName;

    /**
     * Create a new message instance.
     */
    public function __construct(EmployeeInfo $employee, string $password)
    {
        $this->employee = $employee;
        $this->password = $password;
        $this->appName = config('app.name');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->appName.' - Registered as Employee',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.employee_registration',
            with: [
                'employee' => $this->employee,
                'password' => $this->password,
                'appName' => $this->appName,
            ],
        );
    }
}
