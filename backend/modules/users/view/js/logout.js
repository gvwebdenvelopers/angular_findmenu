$(document).ready(function () {
    $("#logout").click(function () {
        logout();
    });
});

function logout(){
    Tools.eraseCookie("user");
    Tools.eraseCookie("tw"); //no recordaria que l'usuari ha entrat en Twitter, tindria que entrar en Twitter novament
    window.location.href = amigable("?module=home&fn=init");
}
