<?php
class users_dao {

    static $_instance;

    private function __construct() {

    }

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    public function create_user_DAO($db, $arrArgument) {
        $nombre = $arrArgument['name'];;
        $apellidos = $arrArgument['lastname'];
        $date_birthday = "";
        $today = getdate();
        $sing_in_date = $today['mday'] . "/" . $today['mon'] . "/"  . $today['year'];
        $email = $arrArgument['email'];
        $usuario = $arrArgument['user'];
        $password = $arrArgument['password'];
        $tipo = "client";
        $avatar = $arrArgument['avatar'];
        $pais = " ";
        $provincia = " ";
        $poblacion = " ";
        $favorites = " ";
        $token = $arrArgument['token'];
        //$activado = 0;
        //if ($arrArgument['active'])
            $activado = $arrArgument['active'];
        //else
            //$activado = 0;

        $sql = "INSERT INTO users ( name, lastname, birthdate, singindate, email, user,"
                . " password, usertype, avatar, country, province, city, favorites, active, token"
                . " ) VALUES ('$nombre', '$apellidos','$date_birthday', '$sing_in_date', '$email', '$usuario',"
                . " '$password', '$tipo', '$avatar', '$pais','$provincia','$poblacion', '$favorites', '$activado','$token')";

        //return $sql;
        return $db->ejecutar($sql);
    }

    public function count_DAO($db, $arrArgument) {
        /* $arrArgument is composed by 2 array ("column" and "like"), this iterates
         * the number of positions the array have, this way we get a method that builds a
         * custom sql to select with the needed arguments
         */
        //return "entra al count";
        $i = count($arrArgument['column']);

        $sql = "SELECT COUNT(*) as total FROM users WHERE ";

        for ($j = 0; $j < $i; $j++) {
            if ($i > 1 && $j != 0)
                $sql .= " AND ";
            $sql .= $arrArgument['column'][$j] . " like '" . $arrArgument['like'][$j] . "'";
        }
        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_DAO($db, $arrArgument) {
        $i = count($arrArgument['column']);
        $k = count($arrArgument['field']);
        $sql1 = "SELECT ";
        $sql2 = " FROM users WHERE ";
        $fields = "";
        $sql = "";

        for ($j = 0; $j < $i; $j++) {
            if ($i > 1 && $j != 0)
                $sql.=" AND ";
            $sql .= $arrArgument['column'][$j] . " like '" . $arrArgument['like'][$j] . "'";
        }

        for ($l = 0; $l < $k; $l++) {
            if ($l > 1 && $k != 0)
                $fields.=", ";
            $fields .= $arrArgument['field'][$l];
        }

        $sql = $sql1 . $fields . $sql2 . $sql;
        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }
    
    public function update_DAO($db, $arrArgument) {
        /*
         * @param= $arrArgument( column => array(colum),
         *                          like => array(like),
         *                          field => array(field),
         *                          new => array(new)
         *                      );
         */
        $i = count($arrArgument['field']);
        $k = count($arrArgument['column']);

        $sql1 = "UPDATE users SET ";
        $sql2 = "  WHERE ";

        for ($j = 0; $j < $i; $j++) {
            if ($i > 1 && $j != 0) {
                $change .=", ";
            }
            $change .= $arrArgument['field'][$j] . "='" . $arrArgument['new'][$j] . "'";
            
        }
        for ($l = 0; $l < $k; $l++) {
            if ($k > 1 && $l != 0) {
                $sql .=" AND ";
            }
            $sql .= $arrArgument['column'][$l] . " like '" . $arrArgument['like'][$l] . "'";
            
        }

        $sql = $sql1 . $change . $sql2 . $sql;

        return $db->ejecutar($sql);
    }
    
    public function update_one_DAO($db, $arrArgument) {

        $sql = "UPDATE users SET ". $arrArgument['field'][0]."='". $arrArgument['new'][0]."' WHERE ".$arrArgument['column'][0] ." like '" . $arrArgument['like'][0] . "'"; 

        return $db->ejecutar($sql);
    }

    public function obtain_countries_DAO($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $file_contents = curl_exec($ch);
        curl_close($ch);

        return ($file_contents) ? $file_contents : FALSE;
    }

    public function obtain_provinces_DAO() {
        $json = array();
        $tmp = array();

        $provincias = simplexml_load_file(RESOURCES . "provinciasypoblaciones.xml");
        $result = $provincias->xpath("/lista/provincia/nombre | /lista/provincia/@id");

        for ($i = 0; $i < count($result); $i+=2) {
            $e = $i + 1;
            $provincia = $result[$e];

            $tmp = array(
                'id' => (string) $result[$i], 'nombre' => (string) $provincia
            );
            array_push($json, $tmp);
        }
        return $json;
    }

    public function obtain_towns_DAO($arrArgument) {
        $json = array();
        $tmp = array();

        $filter = (string) $arrArgument;
        $xml = simplexml_load_file(RESOURCES . 'provinciasypoblaciones.xml');
        $result = $xml->xpath("/lista/provincia[@id='$filter']/localidades");

        for ($i = 0; $i < count($result[0]); $i++) {
            $tmp = array(
                'poblacion' => (string) $result[0]->localidad[$i]
            );
            array_push($json, $tmp);
        }
        return $json;
    }
}
