<?php
//require(BLL_USERS . "users_bll.class.singleton.php");

class users_model {

    private $bll;
    static $_instance;

    private function __construct() {
        $this->bll = users_bll::getInstance();
    }

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    public function create_user($arrArgument) {
        return $this->bll->create_user_BLL($arrArgument);
    }

    public function count($arrArgument) {
        return $this->bll->count_BLL($arrArgument);
    }

     public function select($arrArgument) {
        return $this->bll->select_BLL($arrArgument);
    }
    
    public function update($arrArgument) {
        return $this->bll->update_BLL($arrArgument);
    }
    public function update_one($arrArgument) {
        return $this->bll->update_one_BLL($arrArgument);
    }

    public function obtain_countries($url) {
        return $this->bll->obtain_countries_BLL($url);
    }

    public function obtain_provinces() {
        return $this->bll->obtain_provinces_BLL();
    }

    public function obtain_towns($arrArgument) {
        return $this->bll->obtain_towns_BLL($arrArgument);
    }
}
