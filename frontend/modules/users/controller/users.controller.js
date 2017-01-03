
app.controller('menuCtrl', function ($scope, $uibModal, UsersService, $rootScope, $anchorScroll) {
    UsersService.login();
    $rootScope.bannerV = false;
    $rootScope.bannerText = "";

//Cunado llamamos a esta función cargamos la vista y también el controlador modalWindowCtrl
    $scope.open = function () {
        var modalInstance = $uibModal.open({
            animation: 'true',
            templateUrl: 'frontend/modules/users/view/modal.view.html',
            controller: 'modalWindowCtrl',
            size: "lg"
        });
    };

    $scope.logout = function () {
        //UsersService.logout();
    };
    
    //scrollup está en footer.php
    //en arriba.js visualiza scrollup
    //redirigir scrollup al top de la pagina
    $scope.toTheTop = function () {
        $anchorScroll();
    };

});

app.controller('modalWindowCtrl', function ($scope, $uibModalInstance, services,
    //CommonService, $location, UsersService, twitterService, facebookService, $timeout, cookiesService) {
        CommonService, $location, UsersService,  $timeout) {
    $scope.form = {
        email: "",
        pass: ""
    };
        
    //twitterService.initialize();
    
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.login = function () {
        var data = {"email": $scope.form.email, "pass": $scope.form.pass};
        data = JSON.stringify(data);
        
        services.post("users", "login", data).then(function (response) {
            console.log(response);
            console.log(response[0].usuario);
            if (!response.error) {
                cookiesService.SetCredentials(response[0]);
                $scope.close();
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

   /* $scope.loginTw = function () {
        twitterService.connectTwitter().then(function () {
            //console.log(twitterService.isReady());
            if (twitterService.isReady()) {
                twitterService.getUserInfo().then(function (data) {
                    //console.log(data);
                    services.post("user", 'social_signin', {id: data.id, nombre: data.name, avatar: data.profile_image_url_https, twitter: true})
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
                    services.post("user", 'social_signin', {id: user.id, nombre: user.first_name, apellidos: user.last_name, email: user.email})
                    .then(function (response) {
                        //console.log(response);
                        //console.log(response[0]['usuario']);
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
    };*/
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
            console.log(response);
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


