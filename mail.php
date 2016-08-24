<?php

if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {

    header('Content-Type: text/html; charset=utf-8');
    die('Dostęp zabroniony');

}

if(isset($_POST['your-name']) && isset($_POST['your-email']) && isset($_POST['your-message'])) {

    $errors = array();

    if(empty($_POST['your-name'])) {
        array_push($errors, 'Podaj swoje imię');
    }

    if(!filter_var($_POST['your-email'], FILTER_VALIDATE_EMAIL)) {
        array_push($errors, 'Podaj poprawny adres e-mail');
    }

    if(empty($_POST['your-message'])) {
        array_push($errors, 'Napisz wiadomość');
    }

    if(count($errors) > 0) {

        echo json_encode($errors);

    } else {

        $to = 'adm.kowal@gmail.com';
        $subject = 'Wiadomość z formularza';
        $message = $_POST['your-message'];
        $headers = 'From: ' . $_POST['your-email'] . "\r\n" .
            'Reply-To: ' . $_POST['your-email'] . "\r\n" .
            'Content-Type: text/plain;charset=utf-8\r\n' .
            'X-Mailer: PHP/' . phpversion();

        $mail_sent = mail($to, $subject, $message, $headers);

        if($mail_sent) {
            echo json_encode(array(
                'success' => 'Wiadomość została wysłana poprawnie'
            ));
        } else {
            echo json_encode(array(
                'error' => 'Wystąpił błąd podczas wysyłania wiadomości'
            ));
        }

    }

} else {

    echo json_encode(array(
        'error' => 'Przesłano niepoprawne pola formularza'
    ));

}