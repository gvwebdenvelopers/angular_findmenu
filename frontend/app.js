var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngCookies', 'facebook']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
                // Home
                .when("/", {templateUrl: "frontend/modules/home/view/home.view.html", controller: "homeCtrl"})

                //cookies
                .when("/cookies", {templateUrl: "frontend/modules/cookies/view/cookies.view.html", controller: "cookiesCtrl"})

                //Contact
                .when("/contact", {
                    templateUrl: "frontend/modules/contact/view/contact.view.html",
                    controller: "contactCtrl",
                })

                //Módulo de users
                //Signup
                .when("/users/alta/", {
                    templateUrl: "frontend/modules/users/view/signup.view.html",
                    controller: "signupCtrl"
                })

                //Activar Usuario
                .when("/users/activar/:token", {
                    templateUrl: "frontend/modules/home/view/home.view.html",
                    controller: "verifyCtrl"
                })

                //Restore
                .when("/users/recuperar", {
                    templateUrl: "frontend/modules/users/view/restore.view.html",
                    controller: "restoreCtrl"
                })

                //ChangePass
                .when("/users/cambiarpassword/:token", {
                    templateUrl: "frontend/modules/users/view/changepass.view.html",
                    controller: "changepassCtrl"
                })

                //Perfil
                .when("/users/profile/", {
                    templateUrl: "frontend/modules/users/view/profile.view.html",
                    controller: "profileCtrl",
                    resolve: {
                        user: function (services, cookiesService) {
                            //si hay un usuario logueado lo buscamos en la base de datos
                            //esta consulta devuelve los datos del user y este será el valor
                            //de user en el controlador
                            var user = cookiesService.GetCredentials();
                            if (user) {                     
                                return services.get('users', 'profile_filler', user.user);
                            }
                            return false;
                        }
                    }
                })




                // else 404
                .otherwise("/", {templateUrl: "frontend/modules/home/view/home.view.html", controller: "homeCtrl"});
    }]);

app.config([
    'FacebookProvider',
    function (FacebookProvider) {
        var myAppId = '1722408528089053';
        FacebookProvider.init(myAppId);
    }
]);
