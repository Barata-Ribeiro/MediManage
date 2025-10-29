<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public $password;

    public $appName;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
        $this->appName = config('app.name');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->appName.' - Your new account',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.new_account',
            with: [
                'user' => $this->user,
                'password' => $this->password,
                'appName' => $this->appName,
            ],
        );
    }
}
