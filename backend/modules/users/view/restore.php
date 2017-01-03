
<script src="<?php echo CONTACT_LIB_PATH; ?>jquery.validate.min.js"></script>
<script src="<?php echo CONTACT_LIB_PATH; ?>jquery.validate.extended.js"></script>
<script src="<?php echo USERS_JS_PATH; ?>restore.js"></script>

<div class="contact">
    <form id="restore_form" name="restore_form" class="details-holder">
        
        <div class="modal-header"><h2>¿Has olvidado la contraseña?</h2></div>
        <div class="modal-body">
        <p class="subject">Por favor introduce tu email. En breve recibirás un correo con un enlace para cambiar tu contraseña.</p>
        <div >
            <input type="text" id="inputEmail" name="inputEmail" placeholder="Email" class="text" >
        </div>    
        <input type="hidden" name="token" value="restore_form" />
        <input class="btn-read-more" type="submit" name="submit" id="restoreBtn" disabled="disabled" value="Send" />

        <img src="<?php echo CONTACT_IMG_PATH; ?>ajax-loader.gif" alt="ajax loader icon" class="ajaxLoader" />
        <div id="resultMessage" style="display: none;"></div>
        </div>
    </form>
</div> <!-- /container -->

