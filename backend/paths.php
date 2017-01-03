<?php
  //PROYECTO
  define('PROJECT', '/backend/');
  //SITE ROOT
  $path = $_SERVER['DOCUMENT_ROOT']. PROJECT ;
  define('SITE_ROOT', $path);
  //SITE path
  define('SITE_PATH','https://'.$_SERVER['HTTP_HOST'].'/' );
  //production
  define('PRODUCTION',TRUE);
  //amigables
  define('URL_FRIENDLY', TRUE);

  //Includes de 1er nivel
  //libs
  define('LIBS', SITE_ROOT . '/libs/');
  //model
  define('MODEL_PATH', SITE_ROOT . 'model/');
  //media
  define('MEDIA_PATH', SITE_ROOT . 'media/');
  //modules
  define('MODULES_PATH', SITE_ROOT . 'modules/');
  //utils
  define('UTILS', SITE_ROOT . '/utils/');

  //Includes de 2º nivel
  
 
  //log
  define('LOG_DIR', SITE_ROOT . 'classes/log/log.class.singleton.php');
  define('USER_LOG_DIR', SITE_ROOT . 'log/user/Site_User_errors.log');
  define('GENERAL_LOG_DIR', SITE_ROOT . 'log/general/Site_General_errors.log');
  

  //Includes de 3º nivel
  

  //model products
  define('UTILS_PRODUCTS', SITE_ROOT . 'modules/products/utils/');
 

  define('MODEL_PATH_PRODUCTS', SITE_ROOT . 'modules/products/model/');
  

  //model contact
  
  define('CONTACT_LIB_PATH', '/modules/contact/view/lib/');
  

  //model ofertas
 
  define('MODEL_MENUS', SITE_ROOT . 'modules/menus/model/model/');


  //model users

  define('MODEL_USER', SITE_ROOT . '/modules/users/model/model/');
  define('UTILS_USERS', SITE_ROOT . 'modules/users/utils/');
  

