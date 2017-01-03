var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngCookies']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
                // Home
                .when("/", {templateUrl: "frontend/modules/home/view/home.view.html", controller: "homeCtrl"})

                //cookies
                .when("/cookies", {templateUrl: "frontend/modules/cookies/view/cookies.view.html", controller: "cookiesCtrl"})

                //Modulo de users
                //Signup
                .when("/user/alta/", {
                    templateUrl: "frontend/modules/users/view/signup.view.html",
                    controller: "signupCtrl"
                })




                // else 404
                .otherwise("/", {templateUrl: "frontend/modules/home/view/home.view.html", controller: "homeCtrl"});
    }]);


