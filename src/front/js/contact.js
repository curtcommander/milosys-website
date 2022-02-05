'use strict';

const minCharLength = 20;

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

$(document).ready(function() {

    $("#contact-form [type='submit']").click(async function(e) {
        e.preventDefault();

        let output;
        
        // get input field values
        const input = {
            name: $('input[name=name]').val(),
            email: $('input[name=email-address]').val(),
            subject: $('input[name=subject]').val(),
            message: $('textarea[name=message]').val()
        }

        // validate input field values
        let errorMessage;

        // missing values
        if (Object.values(input).reduce((agg, value) => agg + Number(!value), 0)) {
            errorMessage = 'Input fields are empty!';
        }

        // valid email
        else if (!validateEmail(input.email)) {
            errorMessage = 'Please enter a valid email address.';
        }

        // min character length for message
        else if (input.message.length < minCharLength) {
            errorMessage = `Message too short! Must be a minimum of ${minCharLength} characters.`;
        }

        // invalid: display error
        if (errorMessage) {
            output = `<i class="fas fa-times"></i> ${errorMessage}`;
        
        // valid: send email
        } else {
            await new Promise( resolve => {
                $.post('/sendEmail', input, function(res) {    
                    if (res.type === 'error') {
                        output = '<div class="error-message"><p>'+res.text+'</p></div>';
                    } else {
                        output = '<div class="success-message"><p>'+res.text+'</p></div>';
                        // reset fields
                        $('#contact-form input').val('');
                        $('#contact-form textarea').val('');
                    }
                    resolve();   
                }, 'json');
            })
        }
        
        // display output
        $("#answer").hide().html(output).fadeIn();
    })

    // reset and hide all messages on .keyup()
    $("#contact-form input, #contact-form textarea").keyup(function() {
        $("#answer").fadeOut();
    });

})
