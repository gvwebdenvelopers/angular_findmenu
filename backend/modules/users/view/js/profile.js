$(document).ready(function () {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);

    $("#birth_date").datepicker({
        maxDate: '0',
        changeMonth: true,
        changeYear: true,
        yearRange: "1930:2006"
    });

    $('#submitBtn').click(function () {
        validate_user();
    });

    $("#input_name, #birth_date, #last_name , #user_email, #user,#password, #conf_password").keyup(function () {
        if ($(this).val() !== "") {
            $(".error").fadeOut();
            return false;
        }
    });

    $("#input_name,").keyup(function () {
        if ($(this).val().length >= 2) {
            $(".error").fadeOut();
            return false;
        }
    });
    $("#last_name").keyup(function () {
        if ($(this).val().length >= 3) {
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

    $("#user").keyup(function () {
        if ($(this).val().length >= 3) {
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
    var nomreg = /^\D{3,30}$/;
    var apelreg = /^(\D{3,30})+$/;
    var name = $("#input_name").val();
    var apellidos = $("#last_name").val();
    var date_birthday = $("#birth_date").val();
    var email = $("#user_email").val();
    var usuario = $("#user").val();
    var password = $("#password").val();
    var password2 = $("#conf_password").val();
    var tipo = $("#inputType").val();


    $(".error").remove();

    if ($("#input_name").val() === "" || !nomreg.test($("#input_name").val())) {
        $("#input_name").focus().after("<span class='error'>Introduzca su nombre</span>");
        result = false;
    } else if ($("#input_name").val().length < 2) {
        $("#input_name").focus().after("<span class='error'>Mínimo 2 carácteres para el nombre</span>");
        result = false;
    }else if ($("#last_name").val() === "" || !apelreg.test($("#last_name").val())) {
        $("#last_name").focus().after("<span class='error'>Ingrese sus apellidos</span>");
        result = false;
    } else if ($("#last_name").val().length < 3) {
        $("#last_name").focus().after("<span class='error'>Mínimo 3 carácteres para los apellidos</span>");
        result = false;
    } else if (!emailreg.test($("#user_email").val()) || $("#user_email").val() === "") {
        $("#user_email").focus().after("<span class='error'>Ingrese un email correcto</span>");
        result = false;
    } else if ($("#user").val() === "" || !nomreg.test($("#user").val())) {
        $("#user").focus().after("<span class='error'>Usuario no válido</span>");
        result = false;
    } else if ($("#user").val().length < 3) {
        $("#user").focus().after("<span class='error'>Mínimo 3 carácteres para el usuario</span>");
        result = false;
    } else if ($("#password").val() === "") {
        $("#password").focus().after("<span class='error'>Ingrese su contraseña</span>");
        result = false;
    } else if ($("#password").val().length < 6) {
        $("#password").focus().after("<span class='error'>Mínimo 6 carácteres para la contraseña</span>");
        result = false;
    } else if ($("#conf_password").val() !== $("#conf_password").val()) {
        $("#conf_password").focus().after("<span class='error'>Debe coincidir con la contraseña</span>");
        result = false;

    if (result) {
        var data = {"name": name, "last_name": lastname, "date_birthday": date_birthday, "user_email": email,
            "user": usuario, "password": password, "password2": password2, "tipo": tipo};
        var data_users_JSON = JSON.stringify(data);
        $.post(friendly("?module=user&function=signup_user"), {signup_user_json: data_users_JSON},
        function (response) {
            if (response.success) {
                window.location.href = response.redirect;
            } else {
                if (response.typeErr === "Name") {
                    $("#inputUser").focus().after("<span class='error'>" + response.error + "</span>");
                } else if (response.typeErr === "Email") {
                    $("#inputEmail").focus().after("<span class='error'>" + response.error + "</span>");
                } else {
                    if (response["data"]["name"] !== undefined && response["data"]["name"] !== null) {
                        $("#input_name").focus().after("<span class='error'>" + response["data"]["name"] + "</span>");
                    }
                    if (response["data"]["last_name"] !== undefined && response["data"]["last_name"] !== null) {
                        $("#inputSurn").focus().after("<span class='error'>" + response["data"]["last_name"] + "</span>");
                    }
                    if (response["data"]["date_birthday"] !== undefined && response["data"]["date_birthday"] !== null) {
                        $("#inputBirth").focus().after("<span class='error'>" + response["data"]["date_birthday"] + "</span>");
                    }
                    if (response["data"]["user_email"] !== undefined && response["data"]["user_email"] !== null) {
                        $("#inputEmail").focus().after("<span class='error'>" + response["data"]["user_email"] + "</span>");
                    }
                    if (response["data"]["user"] !== undefined && response["data"]["user"] !== null) {
                        $("#user").focus().after("<span class='error'>" + response["data"]["user"] + "</span>");
                    }

                    if (response["data"]["password"] !== undefined && response["data"]["password"] !== null) {
                        $("#password").focus().after("<span class='error'>" + response.error.password + "</span>");
                    }
                }
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
}
