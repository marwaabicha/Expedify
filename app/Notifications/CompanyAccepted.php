<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class CompanyAccepted extends Notification
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // email + base (notifications table)
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre demande a été acceptée')
            ->line('Félicitations, votre société a été acceptée sur notre plateforme.')
            ->action('Accéder à votre espace', url('/login'))  // ou url spécifique
            ->line('Vous pouvez désormais recevoir les demandes des utilisateurs.');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Votre demande a été acceptée. Vous pouvez maintenant recevoir des demandes.'
        ];
    }
}
