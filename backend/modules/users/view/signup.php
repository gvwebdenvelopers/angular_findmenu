<section id="form_users" class="section-padding">
    <div class="container">
        <h1 class="header-h"> Registrarse</h1>
        <form autocomplete="on">
            <input id="user_email" type="email" placeholder="Escribe tu email" name="user_email" autofocus="autofocus" required>
           
            <div id="email_error" class='error' ng-show="err"> {{error}}</div>
            <input id="password" type="password" placeholder="Escribe tu contraseña" name="password" required>
            <span id="password_error" class="msg_error"></span>
            <input id="conf_password" type="password" placeholder="Confirma tu contraseña" name="conf_password" required>
            <span id="conf_password_error" class="msg_error"></span>
            <div id="email_error" class='error' ng-show="err"> {{error}}</div>
            <div class="submit_signup">
              <input id="submit_signup"  class="btn btn-primary" type="button" name="submit" value="Enviar registro" />
            </div>
            <div  class='error' ng-show="err"> {{error}}</div>
        </form>
    </div>
</section>
<!-- / create users -->
