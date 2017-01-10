
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
        email: "",
        pass: ""
    };
        
    //inicializamos el servicio para saber si estamos autorizados
    twitterService.initialize();
    
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.login = function () {
        var data = {"email": $scope.form.email, "pass": $scope.form.pass};
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
                    }, 1500);
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
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 5000);
                    $scope.signup.user_error = response.error;
                    
                } else if (response.typeErr === "Email") {
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 5000);
                    $scope.signup.email_error = response.error;
                    
                } else if (response.typeErr === "error") {
                    //console.log(response.error);
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 5000);
                    
                    $scope.signup.email_error = response.error.email;
                    $scope.signup.pass_error = response.error.password;
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




