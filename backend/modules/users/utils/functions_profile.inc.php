<?php

function validate_profile($value) {
    $error = array();
    $valido = true;
    $filtro = array(
        'name' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^[A-Za-z]{2,30}$/')
        ),
        'last_name' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^[A-Za-z]{2,30}$/')
        ),
        'date_birthday' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d$/')
        ),
        'user' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^[0-9a-zA-Z]{2,20}$/')
        ),
        'password' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^[0-9a-zA-Z]{6,32}$/')
        ),
        'user_email' => array(
            'filter' => FILTER_CALLBACK,
            'options' => 'valida_email'
        ),
        /*
        'country' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^[a-zA-Z_]*$/')
        )
        ,
        'province' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^[a-zA-Z0-9, _]*$/')
        )
        ,
        'town' => array(
            'filter' => FILTER_CALLBACK,
            'options' => 'validate_town'
        )
        */
    );


    $resultado = filter_var_array($value, $filtro);

    if ($resultado['birth_date']) {
        //validate to user's over 16
        $dates = validateAge($resultado['date_birthday']);

        if (!$dates) {
            $error['date_birthday'] = 'User must have more than 16 years';
            $valido = false;
        }
    }

    /*
    if ($resultado['date_birthday'] && $resultado['title_date']) {
        //compare date of birth with title_date
        $dates = valida_dates($resultado['birth_date'], $resultado['title_date']);

        if (!$dates) {
            $error['birth_date'] = 'birth date must be before the date of registration and must have more than 16 years.';
            $valido = false;
        }
    }
    */
    if ($value['password2'] != $resultado['password']) {
        $error['password2'] = "Pass doesn't match";
        $valido = false;
    }

    if ($resultado != null && $resultado) {


        if (!$resultado['name']) {
            $error['name'] = 'Name must be 2 to 30 letters';
            $valido = false;
        }

        if (!$resultado['last_name']) {
            $error['last_name'] = 'Last name must be 2 to 30 letters';
            $valido = false;
        }

        if (!$resultado['user']) {
            $error['user'] = 'User must be 2 to 20 characters';
            $valido = false;
        }

        if (!$resultado['user_email']) {
            $error['user_email'] = 'error format email (example@example.com)';
            $valido = false;
        }


        if (!$resultado['password']) {
            $error['password'] = 'Pass must be 6 to 32 characters';
            $valido = false;
        }

        if (!$resultado['date_birthday']) {
            if ($resultado['date_birthday'] == "") {
                $error['date_birthday'] = "this camp can't empty";
                $valido = false;
            } else {
                $error['date_birthday'] = 'error format date (mm/dd/yyyy)';
                $valido = false;
            }
        }
/*
        if (!$resultado['country']) {
            $error['country'] = 'Select correct country';
            $resultado['country'] = $value['country'];
            $valido = false;
        }
        if (!$resultado['province']) {
            $error['province'] = 'Select correct province';
            $resultado['province'] = $value['province'];
            $valido = false;
        }
        if (!$resultado['town']) {
            $error['town'] = 'Select correct town';
            $resultado['town'] = $value['town'];
            $valido = false;
        }
*/
    } else {
        $valido = false;
    };

    return $return = array('resultado' => $valido, 'error' => $error, 'datos' => $resultado);
}

function valida_dates($start_days, $dayslight) {

    $start_day = date("m/d/Y", strtotime($start_days));
    $daylight = date("m/d/Y", strtotime($dayslight));

    list($mes_one, $dia_one, $anio_one) = split('/', $start_day);
    list($mes_two, $dia_two, $anio_two) = split('/', $daylight);

    $dateOne = new DateTime($anio_one . "-" . $mes_one . "-" . $dia_one);
    $dateTwo = new DateTime($anio_two . "-" . $mes_two . "-" . $dia_two);

    if ($dateOne <= $dateTwo) {
        return true;
    }
    return false;
}

// validate birthday
function validateAge($birthday, $age = 16) {
    // $birthday can be UNIX_TIMESTAMP or just a string-date.
    if (is_string($birthday)) {
        $birthday = strtotime($birthday);
    }

    // check
    // 31536000 is the number of seconds in a 365 days year.
    if (time() - $birthday < $age * 31536000) {
        return false;
    }

    return true;
}

//validate email
function valida_email($email) {
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        if (filter_var($email, FILTER_VALIDATE_REGEXP, array('options' => array('regexp' => '/^.{5,50}$/')))) {
            return $email;
        }
    }
    return false;
}

function validate_town($town) {
    $town = filter_var($town, FILTER_SANITIZE_STRING);
    return $town;
}

function get_gravatar($email, $s = 80, $d = 'wavatar', $r = 'g', $img = false, $atts = array()) {
    $email = trim($email);
    $email = strtolower($email);
    $email_hash = md5($email);

    $url = "https://www.gravatar.com/avatar/" . $email_hash;
    $url .= md5(strtolower(trim($email)));
    $url .= "?s=$s&d=$d&r=$r";
    if ($img) {
        $url = '<img src="' . $url . '"';
        foreach ($atts as $key => $val)
            $url .= ' ' . $key . '="' . $val . '"';
        $url .= ' />';
    }
    return $url;
}

function sendtoken($arrArgument, $type) {
    $mail = array(
        'type' => $type,
        'token' => $arrArgument['token'],
        'inputEmail' => $arrArgument['email']
    );
    set_error_handler('ErrorHandler');
    try {
        //enviar_email($mail);
        return true;
    } catch (Exception $e) {
        return false;
    }
    restore_error_handler();
}
