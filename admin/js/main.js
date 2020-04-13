"use strict";
var additional_fields = new Object();
var this_path= window.location.href.split('#').join(''); // Путь для аякс
var root_path_url= '/';


$(document).ready(function() {
	$('.cl-link').click(function(){ // Журнал, кнопка закрыть
		$('.core-messages').hide();
	});
	$('.ol-link').click(function(){ // Журнал, кнопка показать
		$('.core-messages').show();
	});
		
	$('.core-messages').show();

});


function logger(message, css_class= false){ // Логи операций в модальном окне
// 	active, primary, success, info, warning, danger
	var d = new Date();
	
	if(css_class) $('#logger').append('<tr class="' + css_class + '"><td>' + d.toLocaleString() + ' ' + message + '</td></tr>');
	else $('#logger').append('<tr class="active"><td>' + d.toLocaleString() + message + ' ' + '</td></tr>');
	
	$('.core-messages .box-content').stop().clearQueue().slideDown(500).animate({ scrollTop: $('.core-messages .box-content').prop('scrollHeight') }).delay(3000).slideUp(500);
}




//
//  Dynamically load jQuery Select2 plugin
//  homepage: https://github.com/select2/select2
//
function LoadSelect2_4Script(callback){
	if (!$.fn.select2){
		$.getScript('plugins/select2_4/select2.min.js', callback);
	}
	else {
		if (callback && typeof(callback) === "function") {
			callback();
		}
	}
}




function tinymce_init(selector){
	tinymce.remove(selector);
	
	/*
	for (var i = tinymce.editors.length - 1 ; i > -1 ; i--) {
		var ed_id = tinymce.editors[i].id;
		tinyMCE.execCommand("mceRemoveEditor", true, ed_id);
	}
	*/
	
	tinymce.init({ // https://www.tiny.cloud/docs/demo/full-featured/#
		selector: selector,
		plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
		imagetools_cors_hosts: ['picsum.photos'],
		menubar: 'file edit view insert format tools table help',
		toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
		toolbar_sticky: true,
		autosave_ask_before_unload: true,
		autosave_interval: "30s",
		autosave_prefix: "{path}{query}-{id}-",
		autosave_restore_when_empty: false,
		autosave_retention: "2m",
		image_advtab: true,
		content_css: [
			'//fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i',
			'/admin/css/editor.css'
		],
		link_list: [
			{ title: 'My page 1', value: 'http://www.tinymce.com' },
			{ title: 'My page 2', value: 'http://www.moxiecode.com' }
		],
		image_list: [
			{ title: 'My page 1', value: 'http://www.tinymce.com' },
			{ title: 'My page 2', value: 'http://www.moxiecode.com' }
		],
		image_class_list: [
			{ title: 'None', value: '' },
			{ title: 'Some class', value: 'class-name' }
		],
		importcss_append: true,
		height: 600,
		file_picker_callback: function (callback, value, meta) {
			/* Provide file and text for the link dialog */
			if (meta.filetype === 'file') {
			  callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
			}

			/* Provide image and alt text for the image dialog */
			if (meta.filetype === 'image') {
			  callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
			}

			/* Provide alternative source and posted for the media dialog */
			if (meta.filetype === 'media') {
			  callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
			}
		},
		templates: [
			{ title: 'Новая таблица', description: 'создать таблицу', content: '<div class="mceTmpl"><table width="98%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
			{ title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
			{ title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
		],
		template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
		template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
		height: 600,
		image_caption: true,
		quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
		noneditable_noneditable_class: "mceNonEditable",
		toolbar_drawer: 'sliding',
		contextmenu: "link image imagetools table",
		language: 'ru'
	});	
}


function setUpEditor(data){ // Загрузка в  редактор полей из базы
	$("#tabs").tabs('enable',1);
	$('#tabs').tabs("option", "active", 1);
	$('form[name="friendly_url"]').attr( 'meta_id', data.meta_id );
	$('form[name="friendly_url"] input[name="friendly_url"]').val( data.friendly_url );
	$('form[name="friendly_url"] input[name="meta_h1"]').val( data.meta_h1 );
	$('form[name="friendly_url"] input[name="meta_title"]').val( data.meta_title );
	$('form[name="friendly_url"] input[name="meta_description"]').val( data.meta_description );
	$('form[name="friendly_url"] input[name="meta_keywords"]').val( data.meta_keywords );
	$('form[name="friendly_url"] #meta_text').val( data.meta_text );
	
	$('form[name="friendly_url"] #page_content').val( data.content );
	tinymce_init('#page_content');
	
	$('#images_collection').html('');
	if(data.image != '' && data.image != 'undefined') $('#images_collection').append('<a class="fancybox" rel="gallery1" href="' + data.image + '" title=""><img src="' + data.image + '" width="250px" alt=""></a>');
	
	CKFinder.widget( 'ckfinder1', { // Загрузим фотки филиала в редактор изображений ckfinder
		height: 600,
		chooseFiles: true,
		onInit: function( finder ) {
			finder.on( 'files:choose', function( evt ) {
				var file = evt.data.files.first();
				$('#images_collection').html('');
				$('#images_collection').append('<a class="fancybox" rel="gallery1" href="' + file.getUrl() + '" title=""><img src="' + file.getUrl() + '" width="250px" alt=""></a>');
			});
			finder.on( 'file:choose:resizedImage', function( evt ) {
				//document.getElementById( 'url' ).value = evt.data.resizedUrl;
				console.log( evt.data.resizedUrl );
			});
		}
	});
	
	
	$.each(additional_fields, function (index, value) { // Дополнительные поля
		if(value == 'select'){
			$('form[name="friendly_url"] #' + index + " option[value='" + data[index] + "']").attr("selected", "selected");
			$('form[name="friendly_url"] #' + index).trigger('change');
		}
	});
	
	counter();
	logger(data.status, data.css_class);
}




function edit_url(id, lock){ // Клик из таблицы, редактирование
	var form_data= new FormData();
	form_data.append("oper", 'load_url');
	form_data.append("ajax", true);
	form_data.append("id", id);
	
	if(lock){
		$('form[name="friendly_url"] input[name="friendly_url"]').prop('disabled', true);
		$('form[name="friendly_url"] label a').hide();
	} else {
		$('form[name="friendly_url"] input[name="friendly_url"]').prop('disabled', false);
		$('form[name="friendly_url"] label a').show();
	}

	$.ajax({
		url: this_path,
		dataType: "json",
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		type: "post",
		success:  function (data) {
			setUpEditor(data);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
}

function del_url(id){ // Клик из таблицы, удаление
	var form_data= new FormData();
	form_data.append("oper", 'del_url');
	form_data.append("ajax", true);
	form_data.append("id", id);
	
	$('form[name="friendly_url"]').attr('meta_id',"undefined");

	$.ajax({
		url: this_path,
		dataType: "json",
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		type: "post",
		success:  function (data) {
			logger(data.status, data.css_class);
				
			var table = $('#datatable-main').DataTable(); // Обновить таблицу
			table.draw(); 
			$("#tabs").tabs({disabled:[1]});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
}


function create_url(){ // Добавить url
	var form_data= new FormData();
	form_data.append("oper", 'add_url');
	form_data.append("ajax", true);
	
	$.ajax({
		url: this_path,
		dataType: "json",
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		type: "post",
		success:  function (data) {
			setUpEditor(data);
			
			var table = $('#datatable-main').DataTable(); // Обновить таблицу
			table.draw();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
}


function save_url(oper_name){ // Перехват отправки форм
	$('form[name="'+oper_name+'"]').find('.btn').addClass("btn-danger");
	
	if(oper_name == 'friendly_url'){ // Сохранение из формы редактирование
		var form_data= new FormData();
		form_data.append("oper", 'save_url');
		form_data.append("ajax", true);
		form_data.append("id", $('form[name="'+oper_name+'"]').attr('meta_id'));
		form_data.append("friendly_url", $('input[name="friendly_url"]').val() );
		
		form_data.append("meta_h1", $('input[name="meta_h1"]').val() );
		form_data.append("meta_title", $('input[name="meta_title"]').val() );
		form_data.append("meta_description", $('input[name="meta_description"]').val() );
		form_data.append("meta_keywords", $('input[name="meta_keywords"]').val() );
		form_data.append("meta_text", $('#meta_text').val() );
		form_data.append("content", tinymce.activeEditor.getContent() );
		form_data.append("image", $('#images_collection img').attr('src') );


		$.each(additional_fields, function (index, value) { // Дополнительные поля
			if(value == 'select'){
				form_data.append(index, $('form[name="friendly_url"] #' + index).select2('data')[0].text );
			}
		});


		$.ajax({
			url: this_path,
			dataType: "json",
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: "post",
			success:  function (data) {
				logger(data.status, data.css_class);
				$('form[name="'+oper_name+'"]').find('.btn').removeClass("btn-danger");
				$('form[name="'+oper_name+'"]').find('.btn').prop('disabled',false);

				var table = $('#datatable-main').DataTable(); // Обновить таблицу
				table.draw(); 
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
	}
}




function Select2_4(){ // Run Select2 plugin on elements
	$('.multiple_select').select2({
		placeholder: "Выбор",
		allowClear: true,						
		tags: true,
		tokenSeparators: [',', ' '],
		width: '100%'
		//data: data.clinic_specialism
	});
	
	$('form[name="friendly_url"] select').select2({width: '100%'});
}


function AllTables(){ // Run Datables plugin and create of settings
	$('#datatable-main').dataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": this_path + "?get_table=ajax",
		"aaSorting": [[ 0, "asc" ]],
		"sDom": "<'box-content'<'col-sm-6'f><'col-sm-6 text-right'l><'clearfix'>>rt<'box-content'<'col-sm-6'i><'col-sm-6 text-right'p><'clearfix'>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sSearch": "Поиск по базе: ",
			"sLengthMenu": '_MENU_'
		}
	});
}

function counter(){ // Счетчик количества символов
	$('.counter').on('change keyup paste', function () {
		var element = $(this);
		var maxlength = $(element).attr("maxlength");
		var value= $(element).val();
		$( element ).next( 'span' ).text( maxlength - value.length );
	});

	$('.counter').each(function( index ) {
		var element = $(this);
		var maxlength = $(element).attr("maxlength");
		var value= $(element).val();
		$( element ).next( 'span' ).text( maxlength - value.length );
	});
}




function urlLit(w,v) {
	var tr='a b v g d e ["zh","j"] z i i k l m n o p r s t u f h c ch sh ["shh","shch"] ~ y ~ e yu ya ~ ["jo","e"]'.split(' ');
	var ww=''; w=w.toLowerCase();
	for(var i=0; i<w.length; ++i) {
		var cc=w.charCodeAt(i); var ch=(cc>=1072?tr[cc-1072]:w[i]);
		if(ch.length<3) ww+=ch; else ww+=eval(ch)[v];
	}
	return(ww.replace(/[^a-zA-Z0-9\-]/g,'-').replace(/[-]{2,}/gim, '-').replace( /^\-+/g, '').replace( /\-+$/g, ''));
}

function insert_url(){
	var instr= $('input[name="meta_title"]').val();
	
	if(instr.length < 1) return;
	
	instr= urlLit(instr,1);
	$('input[name="friendly_url"]').val( root_path_url + instr + '.html');
}












//
// Example form validator function
// https://github.com/nghuuphuoc/bootstrapvalidator/blob/master/demo/validators.html
function mainFormValidator(){
	$('.validator').bootstrapValidator({
		message: 'Неверное значение',
		fields: {
			username: {
				message: 'The username is not valid',
				validators: {
					notEmpty: {
						message: 'The username is required and can\'t be empty'
					},
					stringLength: {
						min: 6,
						max: 30,
						message: 'The username must be more than 6 and less than 30 characters long'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_\.]+$/,
						message: 'The username can only consist of alphabetical, number, dot and underscore'
					}
				}
			},
			country: {
				validators: {
					notEmpty: {
						message: 'The country is required and can\'t be empty'
					}
				}
			},
			acceptTerms: {
				validators: {
					notEmpty: {
						message: 'You have to accept the terms and policies'
					}
				}
			},
			email: {
				validators: {
					notEmpty: {
						message: 'The email address is required and can\'t be empty'
					},
					emailAddress: {
						message: 'The input is not a valid email address'
					}
				}
			},
			site: {
				validators: {
					uri: {
						allowLocal: true,
						message: 'URL набран неправильно'
					}
				}
			},
			phoneNumber: {
				validators: {
					digits: {
						message: 'The value can contain only digits'
					}
				}
			},
			color: {
				validators: {
					hexColor: {
						message: 'The input is not a valid hex color'
					}
				}
			},
			zipCode: {
				validators: {
					usZipCode: {
						message: 'The input is not a valid US zip code'
					}
				}
			},
			password: {
				validators: {
					notEmpty: {
						message: 'The password is required and can\'t be empty'
					},
					identical: {
						field: 'confirmPassword',
						message: 'The password and its confirm are not the same'
					}
				}
			},
			confirmPassword: {
				validators: {
					notEmpty: {
						message: 'The confirm password is required and can\'t be empty'
					},
					identical: {
						field: 'password',
						message: 'The password and its confirm are not the same'
					}
				}
			},
			ages: {
				validators: {
					lessThan: {
						value: 100,
						inclusive: true,
						message: 'The ages has to be less than 100'
					},
					greaterThan: {
						value: 10,
						inclusive: false,
						message: 'The ages has to be greater than or equals to 10'
					}
				}
			}
		}
	});
}
