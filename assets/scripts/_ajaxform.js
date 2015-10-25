;( function( $ ) {
	"use strict";

	var body = $('body'), that;

	$.app.ajaxForm = {

		config: {
			error_class: "error",
			error_message: "form__error-message",
			form_label: ".form__wrapper",
			checkbox_label: "checkbox__label"
		},

		callback_stack: {},

		default_handler: function(form, response)
		{
			that = this;

		    if (response.status)
		    {
		        if (response.hasOwnProperty('redirect_url'))
		        {
		            window.location.href = response.redirect_url;
		        }
		    }
		    else if (response.errors)
		    {
		        that.validation(form, response.errors);
		    }
		    
		    if (response.hasOwnProperty('message'))
		    {
		        $.popup.message(response.title, response.message);
		    }

		},

		validation: function(form, errors)
		{
			that = this;

		    form.find('.' + that.config.error_class).removeClass(that.config.error_class);
		    form.find('.' + that.config.error_message).remove();
		    
		    var fieldName, field;

		    setTimeout(function() {
			    if (errors)
			    {
			       	for(fieldName in errors)
			        {
			        	if (form.find('input[name="'+fieldName+'"]').length > 0)
			            {
			                field = form.find('input[name="'+fieldName+'"]');
			            }

			            if (form.find('select[name="'+fieldName+'"]').length > 0)
			            {
			                field = form.find('select[name="'+fieldName+'"]');
			            }

			            if (form.find('textarea[name="'+fieldName+'"]').length > 0)
			            {
			                field = form.find('textarea[name="'+fieldName+'"]');
			            }

			            if (field.closest('.' + that.config.checkbox_label).length > 0)
			            {
			                field = field.closest('.' + that.config.checkbox_label);
			            }

			            if (typeof field !== 'undefined')
			            {
		                	field.addClass(that.config.error_class);
		                	field.closest(that.config.form_label).append('<div class="' + that.config.error_message + '">' + errors[fieldName] + '</div>');
		                }
			        }
			    }
		    }, 10);
		},

		upload: function()
		{
			that = this;

		    body.on('submit', '.form-file-upload', function(e) {
		        return AIM.submit(this, {
		            onStart: function()
		            {

		            },
		            onComplete: function(result)
		            {
		                if (typeof result === 'object' && result.status === true && result.hasOwnProperty('photo_url'))
		                {

		                }
		            }
		        });
		    });
		    
		    $(document).on('change', '.upload_button_onchange', function(){
		        if ($(this).closest('.upload_button').find('.upload_button_field').length > 0)
		        {
		            $(this).closest('.upload_button').find('.upload_button_field').html($(this).val());
		        }
		    });
		},

		send: function(action, method, data, cb, err)
		{
			if (typeof cb !== 'function')
			{
				cb = function() {};
			}

			if (typeof err !== 'function')
			{
				err = function() {};
			}

			try {
		        
		        $.ajax({
		            url: action,
		            type: method,
		            data: data,
		            success: cb,
		            error: err,
		            dataType: 'JSON'
				});

		    } catch(e){}
		},

		init: function()
		{
			that = this;

			body.on('submit', '.form-ajax', function(e) {
		        e.preventDefault();

		        var form 	= $(this),
		        	action	= form.attr('action'),
	            	method	= (form.attr('method') || 'get'),
	            	data 	= form.serialize();

		        that.send(
	        		action,
	        		method,
	        		data,
		        	function(response) {
		            	if (form.data('callback') && that.callback_stack.hasOwnProperty(form.data('callback')))
		                {
		                    that.callback_stack[form.data('callback')](form, response);
		                }
		                else
		                {
		                    that.default_handler(form, response);
		                }

		                if (response.status === true)
		                {
							
		                }
		            },
		            function(response)
		            {
		                that.default_handler(form, response);
		            }
	            );
		    });

		}

	};

})( jQuery );