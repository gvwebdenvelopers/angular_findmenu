
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
        user: "",
        pass: ""
    };
        
    //twitterService.initialize();
    
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.login = function () {
        var data = {"usuario": $scope.form.user, "pass": $scope.form.pass};
        data = JSON.stringify(data);
        
        services.post("user", "login", data).then(function (response) {
            //console.log(response);
            //console.log(response[0].usuario);
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



