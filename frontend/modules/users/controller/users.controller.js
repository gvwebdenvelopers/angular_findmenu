
app.controller('menuCtrl', function ($scope, $uibModal, UsersService, $rootScope, $anchorScroll) {
    UsersService.login();
    $rootScope.bannerV = false;
    $rootScope.bannerText = "";

//Cuando llamamos a esta función cargamos la vista y también el controlador modalWindowCtrl
    $scope.open = function () {
        var modalInstance = $uibModal.open({
            animation: 'true',
            templateUrl: 'frontend/modules/users/view/modal.view.html',
            controller: 'modalWindowCtrl',
            size: "lg"
        });
    };

    $scope.logout = function () {
        UsersService.logout();
    };
    
    //scrollup está en footer.php
    //en arriba.js visualiza scrollup
    //redirigir scrollup al top de la pagina
    $scope.toTheTop = function () {
        $anchorScroll();
    };

});

//Controlador del modal
app.controller('modalWindowCtrl', function ($scope, $uibModalInstance, services,
        CommonService, $location, UsersService,  $timeout, cookiesService, facebookService, twitterService) {
    $scope.form = {
        profile: "",
        pass: ""
    };
        
    //inicializamos el servicio para saber si estamos autorizados
    twitterService.initialize();
    
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.login = function () {
        var data = {"email": $scope.form.profile, "pass": $scope.form.pass};
        data = JSON.stringify(data);
        
        services.post("users", "login", data).then(function (response) {
            //console.log(response);
            //console.log(response[0]);
            if (!response.error) {
                cookiesService.SetCredentials(response[0]);
                $scope.close();
                //utilizamos el servicio de login si todo ha funcionado bien
                UsersService.login();
            } else {
                if (response.datos == 503)
                    CommonService.banner("Error, intentelo mas tarde", "Err");
                else if (response.datos == 404){
                    $location.path("/");
                    CommonService.banner("Error, intentelo mas tarde", "Err");
                }else {
                    $scope.err = true;
                    $scope.errorpass = response.datos;
                    $timeout(function () {
                        $scope.err = false;
                        $scope.errorpass = "";
                    }, 2000);
                }
            }
        });
    };

    $scope.loginTw = function () {
        twitterService.connectTwitter().then(function () {
           // console.log(twitterService.isReady());
            if (twitterService.isReady()) {
                twitterService.getUserInfo().then(function (data) {
                    //console.log(data);
                    services.post("users", 'social_signin', {id: data.id, name: data.name, avatar: data.profile_image_url_https, twitter: true, social:'twitter'})
                    .then(function (response) {
                        //console.log(response[0]);
                        if (!response.error) {
                            cookiesService.SetCredentials(response[0]);
                            $scope.close();
                            UsersService.login();
                        } else {
                            if (response.datos == 503)
                                CommonService.banner("Error server, intentelo mas tarde", "Err");
                        }
                    });
                });
            }
        });
    };
    $scope.loginFb = function () {
        facebookService.login().then(function () {
            facebookService.me().then(function (user) {
                //console.log(user);
                if (user.error){
                    $scope.close();
                }else{
                    services.post("users", 'social_signin', {id: user.id, name: user.first_name, lastname: user.last_name, email: user.email, social:'facebook' })
                    .then(function (response) {
                        //console.log(response);
                        //console.log(response[0]);
                        if (!response.error) {
                            cookiesService.SetCredentials(response[0]);
                            $scope.close();
                            UsersService.login();
                        } else {
                            if (response.datos == 503)
                                CommonService.banner("Error server, intentelo mas tarde", "Err");
                        }
                    });
                }
            });
        });
    };
});

app.controller('signupCtrl', function ($scope, services, $location, $timeout, CommonService) {
    $scope.signup = {
        
        inputEmail: "",
        inputPass: "",
        inputPass2: "",  
        inputType: "client"
        
    };
    
    $scope.error = function() {
        
        $scope.signup.email_error = "";           
        $scope.signup.pass_error = "";
        
    };
    
    $scope.change_signup = function () {
       
        $scope.signup.email_error = "";           
        $scope.signup.pass_error = "";
        
    };
    
    $('.modal').remove();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");

    $scope.SubmitSignUp = function () {
        var data = { "user_email": $scope.signup.inputEmail,
            "password": $scope.signup.inputPass, "password2": $scope.signup.inputPass2,"usertype": $scope.signup.inputType}; 
        var data_users_JSON = JSON.stringify(data);
        services.post('users', 'alta', data_users_JSON).then(function (response) {
            //console.log(response);
            if (response.success) {
                $timeout(function () {
                    $location.path('/');
                    CommonService.banner("El usuario se ha dado de alta correctamente, revisa su correo para activarlo", "");
                }, 2000);
            } else {
                if (response.typeErr === "Name") {
                    $scope.err = true;
                    $scope.error = response.message;
                    $timeout(function () {
                        $scope.err = false;
                        $scope.errorpass = "";
                    }, 3000);
                    
                  
                } else if (response.typeErr === "error_server"){
                    CommonService.banner("Error en el servidor", "Err");
                }
            }
        });
    };
});

app.controller('verifyCtrl', function (UsersService, $location, CommonService, $route, services, cookiesService) {
    var token = $route.current.params.token;
    if (token.substring(0, 3) !== 'Ver') {
        CommonService.banner("Ha habido algún tipo de error con la dirección", "Err");
        $location.path('/');
    }
    services.get("users", "activar", token).then(function (response) {
        console.log(response);
        console.log(response.user[0].usuario);
        if (response.success) {
            CommonService.banner("Su cuenta ha sido satisfactoriamente verificada", "");
            cookiesService.SetCredentials(response.user[0]);
            
            UsersService.login();
            $location.path('/');
        } else {
            if (response.datos == 503){
                CommonService.banner("Error, intentelo mas tarde", "Err");
                $location.path("/");
            }else if (response.error == 404){
                CommonService.banner("Error, intentelo mas tarde", "Err");
                $location.path("/");
            }
        }
    });
});

app.controller('restoreCtrl', function ($scope, services, $timeout, $location, CommonService) {
    $scope.restore = {
        inputEmail: ""
    };

    $('.modal').remove();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    
    $scope.SubmitRestore = function () {
        
        var data = {"inputEmail": $scope.restore.inputEmail, "token": 'restore_form'};
        var restore_form = JSON.stringify(data);
        
        services.post('users', 'recuperar', restore_form).then(function (response) {
            console.log(response);
            response = response.split("|");
            $scope.message = response[1];
            if (response[0] == 'true') {
                $scope.class = 'alert alert-success';
                $timeout(function () {
                    $location.path('/');
                    CommonService.banner("Revisa la bandeja de tu correo debes haber recibido un mail para el cambio de contraseña", "");
                }, 3000);
            } else {
                $scope.class = 'alert alert-error';
                $timeout(function () {
                    $location.path('/');
                    CommonService.banner("Intentelo mas tarde...", "");
                }, 3000);
            }
        });
    };
});

app.controller('changepassCtrl', function ($route, $scope, services, $location, CommonService) {
    $scope.token = $route.current.params.token;
    $scope.changepass = {
        inputPassword: ""
    };

    $scope.SubmitChangePass = function () {
        var data = {"password": $scope.changepass.inputPassword, "token": $scope.token};
        var passw = JSON.stringify(data);
        
        services.put('users', 'update_pass', passw).then(function (response) {
            //console.log(response);
            if (response.success) {
                $location.path('/');
                CommonService.banner("Tu contraseña se ha cambiado correctamente", "");
            } else {
                CommonService.banner("Error en el servidor", "Err");
            }
        });
    };
});

//controlador del profile
//la variable user la recogemos de la consulta que realizamos en app.js
app.controller('profileCtrl', function ($scope, UsersService, services, user, $location, CommonService, 
load_country_prov_cities, $timeout, cookiesService) {
    console.log(user.user);
    $scope.profile = {
        //cargamos datos en los campos
        name: user.user.name,
        lastname: user.user.lastname,
        date_birthday: user.user.birthdate,
        password: user.user.password,
        email: user.user.email,
        user:user.user.user,
        avatar: user.user.avatar,
        country:user.user.country,
         //country:"user.user.country",
        province:user.user.province,
        city:user.user.city
            
    };
   /* 
    //admin
    $scope.admin = false;
    var user_cookie = cookiesService.GetCredentials();
    if (user_cookie) {
        //controlamos que no sea admin
        if( (user.user.user !== user_cookie.user) && (user_cookie.usertype != 'admin') )
            $location.path("/");
        //caso en que el usuario es admin
        else if (user.user.user !== user_cookie.user)
            $scope.admin = true;
    }else{
        $location.path("/");
    }
    */
   /*
    //llenar los campos del form_profile con scope
    user.user.password = "";
    $scope.user = user.user;
    $scope.drop = {
        msgClass: ''
    };*/
    
    //si el nombre de usuario esta vacio colocamos el nombre
    if (!isNaN(user.user.user))
        $scope.user = user.user.name;
        
    //controlamos campos que no deben cambiar si estan en la bd
    $scope.controlmail = false; //ng-disabled=false 
    if (user.user.email)
        $scope.controlmail = true;
    
    /*
    //errors
    $scope.error = function() {
        $scope.user.nombre_error = ""; 
        $scope.user.surn_error = "";
        $scope.user.birth_error = "";
        $scope.user.pass_error = "";
        $scope.user.bank_error = "";
        $scope.user.email_error = "";  
        $scope.user.dni_error = "";
        $scope.user.pais_error = "";
        $scope.user.prov_error = "";
        $scope.user.pob_error = "";
    };
    $scope.change_profile = function () {
        $scope.user.nombre_error = ""; 
        $scope.user.surn_error = "";
        $scope.user.birth_error = "";
        $scope.user.pass_error = "";
        $scope.user.bank_error = "";
        $scope.user.email_error = "";  
        $scope.user.dni_error = "";
    };
    */
    
    //rellenar pais, provincias y poblaciones
    load_country_prov_cities.loadCountry()
    .then(function (response) {
        //console.log(response.datas);
        if(response.success){
            $scope.country = response.datas;
            
        }else{
            $scope.AlertMessage = true;
            $scope.user.pais_error = "Error al recuperar la informacion de paises";
            $timeout(function () {
                $scope.user.pais_error = "";
                $scope.AlertMessage = false;
            }, 2000);
        }
    });
    //$scope.provincias = null; //en ng-disabled
    //$scope.poblaciones = null; //en ng-disabled

    $scope.resetCountry = function () {
        
        if ($scope.profile.country.sISOCode == 'ES') {
            //console.log($scope.profile.country);
            load_country_prov_cities.loadProvince()
            .then(function (response) {
                //console.log(response.datas);
                if(response.success){
                    $scope.province = response.datas;
                }else{
                    $scope.AlertMessage = true;
                    $scope.user.prov_error = "Error al recuperar la informacion de provincias";
                    $timeout(function () {
                        $scope.user.prov_error = "";
                        $scope.AlertMessage = false;
                    }, 2000);
                }
            });
            $scope.profile.cities = null;
        } //else { //en ng-disabled
           // $scope.provincias = null;
            //$scope.poblaciones = null;
        }
    
    
    $scope.resetValues = function () {
        var datos = {idCity: $scope.profile.province.id};
        //console.log(datos);
        load_country_prov_cities.loadCity(datos)
        .then(function (response) {
            if(response.success){
                $scope.cities = response.datas;
            }else{
                $scope.AlertMessage = true;
                $scope.user.pob_error = "Error al recuperar la informacion de poblaciones";
                $timeout(function () {
                    $scope.user.pob_error = "";
                    $scope.AlertMessage = false;
                }, 2000);
            }
        });
    };
    
    /*
    //dropzone
    $scope.dropzoneConfig = {
        'options': {
            'url': 'backend/index.php?module=user&function=upload_avatar',
            addRemoveLinks: true,
            maxFileSize: 1000,
            dictResponseError: "Ha ocurrido un error en el server",
            acceptedFiles: 'image/*,.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF,.rar,application/pdf,.psd'
        },
        'eventHandlers': {
            'sending': function (file, formData, xhr) {},
            'success': function (file, response) {
                //console.log(response);
                response = JSON.parse(response);
                //console.log(response);
                if (response.resultado) {
                    $(".msg").addClass('msg_ok').removeClass('msg_error').text('Success Upload image!!');
                    $('.msg').animate({'right': '300px'}, 300);
                    
                    //console.log(response.datos);
                    $scope.user.avatar = response.datos;
                
                    var user = {usuario: $scope.user.usuario, avatar: response.datos, 
                    tipo: $scope.user.tipo, nombre: $scope.user.nombre};
                    cookiesService.SetCredentials(user);
                    
                    UserService.login();
                } else {
                    $(".msg").addClass('msg_error').removeClass('msg_ok').text(response['error']);
                    $('.msg').animate({'right': '300px'}, 300);
                }
            },
            'removedfile': function (file, serverFileName) {
                if (file.xhr.response) {
                    $('.msg').text('').removeClass('msg_ok');
                    $('.msg').text('').removeClass('msg_error');
                    var data = jQuery.parseJSON(file.xhr.response);
                    services.post("user", "delete_avatar", JSON.stringify({'filename': data}));
                }
            }
    }};

    $scope.submit = function () {
        var pais, prov, pob, tipo = null;
        if (!$scope.user.pais.sISOCode) { //el usuario no escoge pais
            pais = " ";
        }else{ //el usuario escoge pais
            pais = $scope.user.pais.sISOCode;
            if($scope.user.pais.sISOCode !== "ES"){
                prov = " ";
                pob = " ";
            }
        }
        
        if (!$scope.user.provincia.id) { //el usuario no escoge provincia
            prov = " ";
        }else{ //el usuario escoge provincia
            prov = $scope.user.provincia.id;
        }
        
        if (!$scope.user.poblacion.poblacion) { //el usuario no escoge poblacion
            pob = " ";
        }else{ //el usuario escoge poblacion
            pob = $scope.user.poblacion.poblacion;
        }
        
        if (!$scope.user.tipo) { 
            tipo = "client";
        }else{ 
            tipo = $scope.user.tipo;
        }
        
        //var data = JSON.stringify($scope.user);
        var data = {"usuario": $scope.user.usuario, "email": $scope.user.email, "nombre": $scope.user.nombre, 
        "apellidos": $scope.user.apellidos, "dni": $scope.user.dni, "password": $scope.user.password, 
        "date_birthday": $scope.user.date_birthday, "bank": $scope.user.bank, "pais": pais,
        "provincia": prov,"poblacion": pob, "avatar": $scope.user.avatar, "tipo": tipo};
        var data1 = JSON.stringify(data);
        //console.log(data);
        
        

        services.put("user", "modify", data1).then(function (response) {
            //console.log(response);
            //console.log(response.user[0].usuario);
            
            //limpiar el avatar de :80
            var avatar = response.user[0].avatar;
            var buscar = avatar.indexOf(":80");
            if(buscar !== -1){
                var avatar = avatar.replace(":80", "");
                response.user[0].avatar = avatar;
            }
            console.log(response.user[0].avatar);

            if (response.success) {
                cookiesService.SetCredentials(response.user[0]);
                UserService.login();
                if (tipo === "client") {
                    $timeout(function () {
                        $location.path($location.path());
                        CommonService.banner("Su perfil ha sido modificado satisfactoriamente", "");
                    }, 2000);
                } else if (tipo === "admin"){
                    $timeout(function () {
                        $location.path('/admin/list');
                        CommonService.banner("El usuario se ha modificado correctamente", "");
                    }, 2000);
                }
            } else {
                if (response.datos){
                    //console.log(response.datos);
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 3000);
                    $scope.user.user_error = response.datos.usuario;
                    $scope.user.email_error = response.datos.email;
                    $scope.user.nombre_error = response.datos.nombre;
                    $scope.user.surn_error = response.datos.apellidos;
                    $scope.user.pass_error = response.datos.password;
                    $scope.user.birth_error = response.datos.date_birthday;
                    $scope.user.bank_error = response.datos.bank;
                    $scope.user.dni_error = response.datos.dni;
                }
            }
        });
    };*/
});
