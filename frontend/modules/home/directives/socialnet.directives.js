app.directive([
    'socialnet',
    function(){
        return{
            restrict: 'E';
            template:
              '<h2>Contacta con nosotros en redes sociales' +
              '<section id="socialNetwork" class="responsive-container">' +
              '<img src="" class="icon-socialnet">' +
              '<img src="" class="icon-socialnet">' +
              '<img src="" class="icon-socialnet">' +
              '</section>';
        }
    }
]);
