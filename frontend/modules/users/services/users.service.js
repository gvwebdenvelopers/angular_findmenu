
app.factory("UsersService", ['$location', '$rootScope', 'services', 'cookiesService', 'facebookService','twitterService',
    function ($location, $rootScope, services, cookiesService, facebookService,twitterService) {
        var service = {};
        service.login = login;
        service.logout = logout;
        return service;

        function login() {

            //al cargarse la pagina por primera vez, user es undefined
            var user = cookiesService.GetCredentials();

            if (user) {
                
                //mostramos enlces segun laentrada
                $rootScope.accederV = false;
                $rootScope.profileV = true;
                $rootScope.logoutV = true;

                $rootScope.avatar = user.avatar;    
                //El usuario que se registra por email no suele tener nombre, asi que mostramos su correo
                //Esta funcionalidad no funciona por ahora ya que no reconoce si el nombre esta vacio.
    
                if (user.name.length == 1) {  
                    $rootScope.profile = user.email;
                } else {
                       $rootScope.profile = user.name;     
                }
                
                //redirigimos al home si nos logueamos
                $location.path("/");

                if (user.usertype === "worker") {
                    $rootScope.adminV = false;
                    //$rootScope.misofertasV = true;
                } else if (user.usertype === "admin") {
                    $rootScope.adminV = true;
                    //$rootScope.misofertasV = false;
                } else {
                    $rootScope.adminV = false;
                    //$rootScope.misofertasV = false;
                }
            } else {
                $rootScope.accederV = true;
            }
        }

        function logout() {
            facebookService.logout();
            twitterService.clearCache();
            cookiesService.ClearCredentials();
            
            //habilitamos o deshabilitamos enlaces
            $rootScope.accederV = true;
            $rootScope.profileV = false;
            //limpiamos los valores
            $rootScope.avatar = '';
            $rootScope.email = '';

            //$rootScope.adminV = false;
            //$rootScope.misofertasV = false;

            $rootScope.logoutV = false;
            //redirigimos al home
            $location.path("/");
        }
    }]);

