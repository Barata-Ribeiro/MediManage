<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountAssociationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public $patientInfo;

    public $appName;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $patientInfo)
    {
        $this->user = $user;
        $this->patientInfo = $patientInfo;
        $this->appName = config('app.name');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->appName.' - Your account has been associated with a patient',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.account_association',
            with: [
                'user' => $this->user,
                'patient' => $this->patientInfo,
                'appName' => $this->appName,
            ],
        );
    }
}
