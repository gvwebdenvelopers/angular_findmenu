<?php

class controller_users {

    function __construct() {
        require_once(UTILS_USERS . "functions_profile.inc.php");
        include (LIBS . 'password_compat-master/lib/password.php');
        include (UTILS . 'upload.inc.php');
        $_SESSION['module'] = "users";
    }

    ////////////////////////////////////////////////////begin signup///////////////////////////////////////////

    public function signup_user() {
        $jsondata = array();
        $userJSON = $_POST;
        $result = validate_user($userJSON);


        if ($result['resultado']) {

            $avatar = get_gravatar($result['data']['user_email'], $s = 400, $d = 'identicon', $r = 'g', $img = false, $atts = array());
            $userName = explode('@', $result['data']['user_email']);

            $arrArgument = array(
                'avatar' => $avatar,
                'email' => $result['data']['user_email'],
                'name' => "",
                'lastname' => "",
                'password' => password_hash($result['data']['password'], PASSWORD_BCRYPT),
                'tipo' => "client",
                'token' => "",
                'user' => $userName[0],
                'active' => 0
            );
            /* Control de registro */
            set_error_handler('ErrorHandler');
            try {

                //loadModel
                $arrValue = loadModel(MODEL_USER, "users_model", "count", array('column' => array('user'), 'like' => array($arrArgument['user'])));
                
                if ($arrValue[0]['total'] == 1) {
                        $arrValue = false;      
                        $jsondata["success"] = false;
                        $jsondata['typeErr'] = "Name";
                        $jsondata['message'] = "Ya existe un usuario con esta cuenta: " . $arrArgument['email'];
                        echo json_encode($jsondata);
                        exit;
                } else {
                    //loadModel
                    $arrArgument['token'] = "Ver" . md5(uniqid(rand(), true));

                    $arrValue = loadModel(MODEL_USER, "users_model", "create_user", $arrArgument);

                    if ($arrValue) {
                        sendtoken($arrArgument, "alta");
                        $jsondata["success"] = true;
                        echo json_encode($jsondata);
                        exit;
                    } else {
                        $jsondata["success"] = false;
                        $jsondata['typeErr'] = "error_server";
                        echo json_encode($jsondata);
                        exit;
                    }
                }
            } catch (Exception $e) {

                $arrValue = false;
            }
            restore_error_handler();
        } else {
            $jsondata["success"] = false;
            $jsondata['data'] = $result;
            echo json_encode($jsondata);
        }
    }

    ////////////////////////////////////////////////////begin signin///////////////////////////////////////////
    public function login() {
        $user = $_POST;

        $column = array('user');
        $userName = explode('@', $user['email']);
        $like = array($userName[0]);

        $arrArgument = array(
            'column' => $column,
            'like' => $like,
            'field' => array('password')
        );

        set_error_handler('ErrorHandler');
        try {
            //loadModel
            $arrValue = loadModel(MODEL_USER, "users_model", "select", $arrArgument);

            $arrValue = password_verify($user['pass'], $arrValue[0]['password']);
        } catch (Exception $e) {
            $arrValue = "error";
        }
        restore_error_handler();

        if ($arrValue !== "error") {
            if ($arrValue) { //OK
                set_error_handler('ErrorHandler');
                try {
                    $arrArgument = array(
                        'column' => array("user", "active"),
                        'like' => array($userName[0], "1")
                    );
                    $arrValue = loadModel(MODEL_USER, "users_model", "count", $arrArgument);

                    if ($arrValue[0]["total"] == 1) {
                        $arrArgument = array(
                            'column' => array("user"),
                            'like' => array($userName[0]),
                            'field' => array('*')
                        );
                        $user = loadModel(MODEL_USER, "users_model", "select", $arrArgument);
                        echo json_encode($user);
                        exit();
                    } else {
                        $value = array(
                            "error" => true,
                            "datos" => "El usuario no ha sido activado, revise su correo"
                        );
                        echo json_encode($value);
                        exit();
                    }
                } catch (Exception $e) {
                    $value = array(
                        "error" => true,
                        "datos" => 503
                    );
                    echo json_encode($value);
                    exit();
                }
            } else {
                $value = array(
                    "error" => true,
                    "datos" => "El usuario y la contraseña no coinciden"
                );
                echo json_encode($value);
                exit();
            }
        } else {
            $value = array(
                "error" => true,
                "datos" => 503
            );
            echo json_encode($value);
            exit();
        }
    }

    ////////////////////////////////////////////////////end signin///////////////////////////////////////////

    function verify() {

        //a esta función se llega cuando el usuario verifica su alta
        if (substr($_GET['param'], 0, 3) == "Ver") {
            $arrArgument = array(
                'column' => array('token'),
                'like' => array($_GET['param']),
                'field' => array('active'),
                'new' => array('1')
            );
            set_error_handler('ErrorHandler');
            try {
                //consulta de sql que modificará el estado activado a 1 si es igual el token
                //la consulta esta preparada para actualizar mas cosas, se usa en mas lugares.
                $value = loadModel(MODEL_USER, "users_model", "update_one", $arrArgument);
            } catch (Exception $e) {
                $value['success'] = false;
            }
            if ($value) {
                $arrArgument = array(
                    'column' => array("token"),
                    'like' => array($_GET['param']),
                    'field' => array('*')
                );
                $user = loadModel(MODEL_USER, "users_model", "select", $arrArgument);
                $json['user'] = $user;
                $json['success'] = true;
                echo json_encode($json);
                exit();
            }
            restore_error_handler();
            echo json_encode($value);
        }
    }

    ////////////////////////////////////////////////////end signup///////////////////////////////////////////

    public function social_signin() { //utilitzada per Facebook i Twitter
        $user = $_POST;

        set_error_handler('ErrorHandler');
        try {

            $arrValue = loadModel(MODEL_USER, "users_model", "count", array('column' => array('user'), 'like' => array($user['id'])));
        } catch (Exception $e) {
            $arrValue = false;
        }
        restore_error_handler();

        if (!$arrValue[0]["total"]) {


            if ($user['social']=='facebook') {
                $user['avatar'] = 'https://graph.facebook.com/' . ($user['id']) . '/picture';
            }
            
            if ($user['social']=='twitter') {
                $user['email'] = '';
                $user['lastname']='';
            }
            $arrArgument = array(
                'active' => "1",
                'avatar' => $user['avatar'],
                'email' => $user['email'],
                'lastname' => $user['lastname'],
                'name' => $user['name'],
                'password' => "",
                'tipo' => "client",
                'token' => "",
                'user' => $user['id']
            );
            set_error_handler('ErrorHandler');
            try {
                $value = loadModel(MODEL_USER, "users_model", "create_user", $arrArgument);
            } catch (Exception $e) {
                $value = false;
            }
            restore_error_handler();
        } else{
            $value = true;
        }

        if ($value) {

            set_error_handler('ErrorHandler');
            $arrArgument = array(
                'column' => array("user"),
                'like' => array($user['id']),
                'field' => array('*')
            );
            $user = loadModel(MODEL_USER, "users_model", "select", $arrArgument);
            restore_error_handler();
            echo json_encode($user);
        } else {
            echo json_encode(array('error' => true, 'datos' => 503));
        }
    }

    ////////////////////////////////////////////////////begin restore///////////////////////////////////////////


    public function process_restore() {
        //2- La función process_restore cambia el token si existe el correo
        //introducido y envia un correo con el token
        $result = array();
        if (isset($_POST['inputEmail'])) {
            $result = valida_email($_POST['inputEmail']);
            if ($result) {
                $column = array(
                    'email'
                );
                $like = array(
                    $_POST['inputEmail']
                );
                $field = array(
                    'token'
                );

                $token = "Cha" . md5(uniqid(rand(), true));
                $new = array(
                    $token
                );

                $arrArgument = array(
                    'column' => $column,
                    'like' => $like,
                    'field' => $field,
                    'new' => $new
                );
                $arrValue = loadModel(MODEL_USER, "users_model", "count", $arrArgument);
                if ($arrValue[0]['total'] == 1) {
                    //Esta consulta meda error de variables no definidas change y sql3 pero realiza
                    //realiza la consulta igual aunque al fallar no redirecciona
                    $arrValue = loadModel(MODEL_USER, "users_model", "update_one", $arrArgument);
                    if ($arrValue) {
                        //////////////// Envio del correo al usuario
                        $arrArgument = array(
                            'token' => $token,
                            'email' => $_POST['inputEmail']
                        );

                        if (sendtoken($arrArgument, "modificacion")) {

                            echo "true|Tu petición de cambio de contraseña ha sido enviado correctamente ";
                        } else {

                            echo "false|Error en el servidor. Intentelo más tarde...";
                        }
                    }
                } else {
                    echo "false|El email introducido no existe ";
                }
            } else {
                echo "false|El email no es válido";
            }
        }
    }

    function update_pass() {
        //4-cuando ya hemos validado el password con js utilizamos esta función
        //para actualizar el password en la base de datos
        $arrArgument = array(
            'column' => array('token'),
            'like' => array($_POST['token']),
            'field' => array('password'),
            'new' => array(password_hash($_POST['password'], PASSWORD_BCRYPT))
        );

        set_error_handler('ErrorHandler');
        try {
            $value = loadModel(MODEL_USER, "users_model", "update_one", $arrArgument);
        } catch (Exception $e) {
            $value = false;
        }
        restore_error_handler();

        if ($value) {
            $jsondata["success"] = true;
            echo json_encode($jsondata);
            exit;
        } else {
            $jsondata["success"] = false;
            echo json_encode($jsondata);
            exit;
        }
    }

    ////////////////////////////////////////////////////end restore///////////////////////////////////////////
    ////////////////////////////////////////////////////begin profile/////////////////////////////////////////
    //function profile() {
       // loadView('modules/users/view/', 'profile.php');
    //}

    function upload_avatar() {
        $result_avatar = upload_files();
        $_SESSION['avatar'] = $result_avatar;
        echo json_encode($result_avatar);
    }

    function delete_avatar() {
        $_SESSION['avatar'] = array();
        $result = remove_files();
        if ($result === true) {
            echo json_encode(array("res" => true));
        } else {
            echo json_encode(array("res" => false));
        }
    }

    function profile_filler() {
        if (isset($_GET['param'])) {
            set_error_handler('ErrorHandler');
            try {
                $arrValue = loadModel(MODEL_USER, "users_model", "select", array(column => array('user'), like => array($_GET['param']), field => array('*')));
            } catch (Exception $e) {
               
                $arrValue = false;
            }

            restore_error_handler();

            if ($arrValue) {
                $jsondata["success"] = true;
               
                  if ($_GET['param'] != '%%')
                    $jsondata['user'] = $arrValue[0];
                else
                    $jsondata['user'] = $arrValue;
                echo json_encode($jsondata);
                exit();
            } else {
               $jsondata["success"] = false;
                echo json_encode($jsondata);
                exit();
            }
        } else {
            $jsondata["success"] = false;
            echo json_encode($jsondata);
            exit();
        }
    }

    function load_country_user() {
      if ((isset($_GET["param"])) && ($_GET["param"] == true)) {
          $json = array();
          $url = 'http://www.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/ListOfCountryNamesByName/JSON';
          set_error_handler('ErrorHandler');
          try {
              $json = loadModel(MODEL_USER, "users_model", "obtain_countries", $url);
          } catch (Exception $e) {
              $json = false;
          }
          restore_error_handler();

          if ($json) {
              echo $json;
              exit;
          } else {
              $json = "error";
              echo $json;
              exit;
          }
      }
    }

    function load_province_user() {
      if ((isset($_GET["param"])) && ($_GET["param"] == true)) {
          $jsondata = array();
          $json = array();

          set_error_handler('ErrorHandler');
          try {
              $json = loadModel(MODEL_USER, "users_model", "obtain_provinces");
          } catch (Exception $e) {
              $json = false;
          }
          restore_error_handler();

          if ($json) {
              $jsondata["provinces"] = $json;
              echo json_encode($jsondata);
              exit;
          } else {
              $jsondata["provinces"] = "error";
              echo json_encode($jsondata);
              exit;
          }
      }
    }

    function load_cities_user() {
      if (isset($_POST['idCity'])) {
          $jsondata = array();
          $json = array();

          set_error_handler('ErrorHandler');
          try {
              $json = loadModel(MODEL_USER, "users_model", "obtain_towns", $_POST['idCity']);
          } catch (Exception $e) {
              $json = false;
          }
          restore_error_handler();

          if ($json) {
              $jsondata["cities"] = $json;
              echo json_encode($jsondata);
              exit;
          } else {
              $jsondata["cities"] = "error";
              echo json_encode($jsondata);
              exit;
          }
      }
    }

    function modify() {
      $jsondata = array();
      $userJSON = $_POST;
      $userJSON['password2'] = $userJSON['password'];
      /*if(isset($_SESSION['avatar']['data'])){
            $userJSON['avatar'] = $_SESSION['avatar']['data'];
      }*/

      $result = validate_profile($userJSON);
      //$result['resultado']=true;

      if ($result['resultado']) {
          $arrArgument = array(
              'user' => $_POST['user'],
              'avatar' => $userJSON['avatar'],
              'birthdate' => strtoupper($result['data']['date_birthday']),
              'email' => $result['data']['user_email'],
              'name' => $result['data']['name'],
              'lastname' => $result['data']['last_name'],
              'password' => password_hash($result['data']['password'], PASSWORD_BCRYPT),
              'country' => $_POST['country'],
              'province' => $_POST['province'],
              'city' => $_POST['city'],
              
          );
          $arrayDatos = array( 'column' => array('user'), 'like' => array( $userJSON['user'] ) );
          $j = 0;
          foreach ($arrArgument as $clave => $valor) {
              if ($valor != "") {
                  $arrayDatos['field'][$j] = $clave;
                  $arrayDatos['new'][$j] = $valor;
                  $j++;
              }
          }

          set_error_handler('ErrorHandler');
          try {
              $arrValue = loadModel(MODEL_USER, "users_model", "update", $arrayDatos);
          } catch (Exception $e) {
              $arrValue = false;
          }
          restore_error_handler();
           if ($arrValue) {
                //$jsondata["success"] = true;
                //echo json_encode($jsondata);
                //exit;
                
                set_error_handler('ErrorHandler');
                $arrArgument = array(
                    'column' => array("user"),
                    'like' => array($arrArgument['user']),
                    'field' => array('*')
                );
                $user = loadModel(MODEL_USER, "users_model", "select", $arrArgument);
                restore_error_handler();
                $jsondata["success"] = true;
                $jsondata['user'] = $user;
                echo json_encode($jsondata);
                exit();
            } else {
                $jsondata["success"] = false;
                echo json_encode($jsondata);
            }
        } else {
            $jsondata["success"] = false;
            $jsondata['datos'] = $result;
            echo json_encode($jsondata);
        }
    }
    ////////////////////////////////////////////////////end profile///////////////////////////////////////////
}
