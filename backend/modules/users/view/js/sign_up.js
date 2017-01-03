$(document).ready(function () {

    $('#submit_signup').click(function () {
        validate_user();
    });

    $("#user_email, #password, #conf_password").keyup(function () {
        if ($(this).val() !== "") {
            $(".error").fadeOut();
            return false;
        }
    });

    $("#user_email").keyup(function () {
        var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
        if ($(this).val() !== "" && emailreg.test($(this).val())) {
            $(".error").fadeOut();
            return false;
        }
    });

    $("#password").keyup(function () {
        if ($(this).val().length >= 6) {
            $(".error").fadeOut();
            return false;
        }
    });
    $("#conf_password").keyup(function () {
        if ($(this).val().length >= 6) {
            $(".error").fadeOut();
            return false;
        }
    });
}); //ready

function validate_user() {

    var result = true;
    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    var email = $("#user_email").val();
    var password = $("#password").val();
    var password2 = $("#conf_password").val();

    $(".error").remove();

     if (!emailreg.test($("#user_email").val()) || $("#user_email").val() === "") {
        $("#user_email").focus().after("<span class='msg_error'>Ingrese un email correcto</span>");
        result = false;
    }  else if ($("#password").val() === "") {
        $("#password").focus().after("<span class='msg_error'>Ingrese su contraseña</span>");
        result = false;
    } else if ($("#password").val().length < 6) {
        $("#password").focus().after("<span class='msg_error'>Mínimo 6 carácteres para la contraseña</span>");
        result = false;
    } else if ($("#conf_password").val() !== $("#password").val()) {
        $("#conf_password").focus().after("<span class='msg_error'>Las contraseñas no coinciden</span>");
        result = false;

    }
    if (result) {
        var data = {"user_email": email, "password": password, "password2": password2  };
        var data_users_JSON = JSON.stringify(data);

        $.post(amigable("?module=users&function=signup_user"), {signup_user_json: data_users_JSON},
        //$.post("../../users/sign_up/", {signup_user_json: data_users_JSON},
        function (response) {
            //console.log(response);
            if (response.success) {
                window.location.href = response.redirect;
            } else {
                if (response.typeErr === "Email") {
                    $("#inputEmail").focus().after("<span class='error'>" + response.error + "</span>");
                }else if (response.typeErr === "Name") {
                    $("#inputEmail").focus().after("<span class='error'>" + response.error + "</span>");
                }else {
                    console.log(response);
                    if (response["data"]["email"] !== undefined && response["data"]["email"] !== null) {
                        $("#inputEmail").focus().after("<span class='error'>" + response["data"]["email"] + response.error.email + "</span>");
                    }

                    if (response["data"]["password"] !== undefined && response["data"]["password"] !== null) {
                        $("#password").focus().after("<span class='error'>" + response.error.password + "</span>");
                    }

                    if (response["data"]["password"] !== response["data"]["password2"] ) {
                        $("#password").focus().after("<span class='error'>" + response.error.password + "</span>");
                        $("#password2").focus().after("<span class='error'>" + response.error.password + "</span>");
                    }
                }
            }
        }, "json").fail(function (xhr, textStatus, errorThrown) {
            //console.log(xhr);
            //console.log(xhr.responseJSON);
            //console.log(xhr.responseText);
            if( (xhr.responseJSON === undefined) || (xhr.responseJSON === null) )
                xhr.responseJSON = JSON.parse(xhr.responseText);
                console.log(xhr.responseJSON);
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
