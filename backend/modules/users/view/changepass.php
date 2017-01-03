
<script src="<?php echo USERS_JS_PATH; ?>changepass.js"></script>

<div class="contact">
    <form id="changepass_form" name="changepass_form" class="details-holder">
        
        <div class="modal-header"><h2 class="form-contact-heading">Cambia tu contraseña</h2></div>
        <p class="subject">Por favor introduce tu nueva contraseña.</p>
        <div class="control-group">
            <input type="password" id="inputPassword" name="inputPassword" placeholder="Password" class="text" >
            <div id="error"></div>
        </div>
        <div class="control-group">
            <input type="password" id="inputPassword2" name="inputPassword2" placeholder="Repite tu Password" class="text" >
            <div id="error_2"></div>
        </div>      
        <input class="btn-read-more" type="button" name="submit" id="changeBtn" value="Enviar"/>

        <img src="<?php echo CONTACT_IMG_PATH; ?>ajax-loader.gif" alt="ajax loader icon" class="ajaxLoader" />

        <div id="resultMessage" style="display: none;"></div>
    </form>
</div> <!-- /container -->

