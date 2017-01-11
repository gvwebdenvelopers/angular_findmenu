app.directive( 'socialnet', socialNetworkTemplate );

function socialNetworkTemplate () {
    return {
      restrict: 'E',

      //scope:{ message='@' },

      template: '<section id="socialNetwork" class="responsive-container">' +
                    '<h2>Para contactar con nosotros: </h2>' +
                    '<div class="icon-socialnet facebook-button"/>' +
                    '<div class="icon-socialnet twitter-button"/>' +
                    '<div class="icon-socialnet google-button"/>' +
                '</section>'
    }
}
