<?php

//require (MODEL_PATH . "db.class.singleton.php");
//require(DAO_PRODUCTS_FE . "users_dao.class.singleton.php");

class users_bll {

    private $dao;
    private $db;
    static $_instance;

    private function __construct() {
        $this->dao = users_dao::getInstance();
        $this->db = db::getInstance();
    }

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    public function create_user_BLL($arrArgument) {
        return $this->dao->create_user_DAO($this->db, $arrArgument);
    }

    public function count_BLL($arrArgument) {
        return $this->dao->count_DAO($this->db, $arrArgument);
    }

    public function select_BLL($arrArgument) {
        return $this->dao->select_DAO($this->db, $arrArgument);
    }
    
    public function update_BLL($arrArgument) {
        return $this->dao->update_DAO($this->db, $arrArgument);
    }
    public function update_one_BLL($arrArgument) {
        return $this->dao->update_one_DAO($this->db, $arrArgument);
    }

    public function obtain_countries_BLL($url) {
        return $this->dao->obtain_countries_DAO($url);
    }

    public function obtain_provinces_BLL() {
        return $this->dao->obtain_provinces_DAO();
    }

    public function obtain_towns_BLL($arrArgument) {
        return $this->dao->obtain_towns_DAO($arrArgument);
    }
}
