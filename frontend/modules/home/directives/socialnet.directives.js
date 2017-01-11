app.directive([
    'socialnet',
    function(){
        return{
            restrict: 'E';
            template:
              '<h2>Contacta con nosotros en redes sociales' +
              '<section id="socialNetwork" class="responsive-container">' +
              '<div class="icon-socialnet facebook-button"/>' +
              '<div class="icon-socialnet facebook-button"/>' +
              '<div class="icon-socialnet facebook-button"/>' +
              '</section>';
        }
    }
]);
