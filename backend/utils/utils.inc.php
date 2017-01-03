<?php
    function debugPHP($array){
        echo "<pre>";
        print_r($array);
        echo "</pre><br>";
    }

    function debugChrome($array){
        include 'libs/chromephp-master/ChromePhp.php';
        ChromePhp::warm($array);
    }

    function redirect($url){
        die('<script>top.location.href="'.$url .'";</script>');
    }

    function friendly($url, $return = false) {
        $amigableson = URL_FRIENDLY;
        $link = "";
        if ($amigableson) {
            $url = explode("&", str_replace("?", "", $url));
            foreach ($url as $key => $value) {
                $aux = explode("=", $value);
                $link .=  $aux[1]."/";
            }
        } else {
            $link = "index.php" . $url;
        }
        if ($return) {
            return SITE_PATH . $link;
        }
        echo SITE_PATH . $link;
    }
