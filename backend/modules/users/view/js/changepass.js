$(document).ready(function () {
    $("#changeBtn").click(function () {
        changepass();
    });
    $("#inputPassword").keyup(function () {
        if ($(this).val().length != "") {
            $(".msg_error").fadeOut();
            return false;
        }
    });
    $("#inputPassword2").keyup(function () {
        if ($(this).val().length != "") {
            $(".msg_error").fadeOut();
            return false;
        }
    });
});

function changepass() {
    var password = $("#inputPassword").val();
    var password2 = $("#inputPassword2").val();
    var value = false;

    if (password == '') {
        $("#error").append('<span class="msg_error">Introduzca un password</span>');
        value = false;
    } else if (password2 == '') {
        $("#error_2").append('<span class="msg_error">Por favor vuelve a introducir el password</span>');
        value = false;
    } else if (password != password2) {
        $("#error_2").append('<span class="msg_error">Las passwords no coiciden</span>');
        value = false;
    } else if (password === password2) {
        value = true;
        var token = window.location.href;
        token = token.split("/");
        //console.log("este es el token: "+token[5]);
        
        var data = {"password": password, "token": token[5]};
        var change_JSON = JSON.stringify(data);
            $.post(amigable("?module=users&function=update_pass"), {passw: change_JSON},
            function (response) {
                if (response.success) {
                    window.location.href = response.redirect;
                }
            }, "json").fail(function (xhr, textStatus, errorThrown) {
                //console.log(xhr);
                //console.log(xhr.responseJSON);
                //console.log(xhr.responseText);
                if( (xhr.responseJSON === undefined) || (xhr.responseJSON === null) )
                    xhr.responseJSON = JSON.parse(xhr.responseText);
                if (xhr.status === 0) {
                    alert('Not connect: Verify Network.');
                } else if (xhr.status === 404) {
                    alert('Requested page not found [404]');
                } else if (xhr.status === 500) {
                    alert('Internal Server Error [500].');
                } else if (textStatus === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if (textStatus === 'timeout') {
                    alert('Time out error.');
                } else if (textStatus === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error: ' + xhr.responseText);
                }
            });
    }
}