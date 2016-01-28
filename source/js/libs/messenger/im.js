import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import jquery_xmpp from 'jquery_xmpp';
import jquery_migrate from 'jquery_migrate';
import jqueryui from 'jqueryui';
import wijmo from 'wijmo';
import tinysort_charorder from 'tinysort_charorder';
import tinysort from 'tinysort';
import tinysort_open from 'tinysort_open';
import contextmenu from 'contextmenu';
import linkify from 'linkify';
import jquery_linkify from 'jquery_linkify';
import wijdialog from 'wijdialog';
import jquery_autogrow from 'jquery_autogrow';
import Material from 'material';
import TweenMax from 'tweenmax';


	/**
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 **/

var MD5 = (function () {
    /**
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     **/
    var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase */
    var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance */
    var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode */

    /**
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     **/
    var safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /**
     * Bitwise rotate a 32-bit number to the left.
     **/
    var bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };

    /**
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     **/
    var str2binl = function (str) {
        var bin = [];
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz)
        {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
        }
        return bin;
    };

    /**
     * Convert an array of little-endian words to a string
     **/
    var binl2str = function (bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < bin.length * 32; i += chrsz)
        {
            str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
        }
        return str;
    };

    /**
     * Convert an array of little-endian words to a hex string.
     **/
    var binl2hex = function (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++)
        {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
        }
        return str;
    };

    /**
     * Convert an array of little-endian words to a base-64 string
     **/
    var binl2b64 = function (binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        var triplet, j;
        for(var i = 0; i < binarray.length * 4; i += 3)
        {
            triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16) |
                (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 ) |
                ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
            for(j = 0; j < 4; j++)
            {
                if(i * 8 + j * 6 > binarray.length * 32) { str += b64pad; }
                else { str += tab.charAt((triplet >> 6*(3-j)) & 0x3F); }
            }
        }
        return str;
    };

    /**
     * These functions implement the four basic operations the algorithm uses.
     **/
    var md5_cmn = function (q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q),safe_add(x, t)), s),b);
    };

    var md5_ff = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };

    var md5_gg = function (a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };

    var md5_hh = function (a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };

    var md5_ii = function (a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };

    /**
     * Calculate the MD5 of an array of little-endian words, and a bit length
     **/
    var core_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;

        var olda, oldb, oldc, oldd;
        for (var i = 0; i < x.length; i += 16)
        {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    };


    /**
     * Calculate the HMAC-MD5, of a key and some data
     **/
    var core_hmac_md5 = function (key, data) {
        var bkey = str2binl(key);
        if(bkey.length > 16) { bkey = core_md5(bkey, key.length * chrsz); }

        var ipad = new Array(16), opad = new Array(16);
        for(var i = 0; i < 16; i++)
        {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
        return core_md5(opad.concat(hash), 512 + 128);
    };

    var obj = {
        /**
         * These are the functions you'll usually want to call.
         * They take string arguments and return either hex or base-64 encoded
         * strings.
         **/
        hexdigest: function (s) {
            return binl2hex(core_md5(str2binl(s), s.length * chrsz));
        },

        b64digest: function (s) {
            return binl2b64(core_md5(str2binl(s), s.length * chrsz));
        },

        hash: function (s) {
            return binl2str(core_md5(str2binl(s), s.length * chrsz));
        },

        hmac_hexdigest: function (key, data) {
            return binl2hex(core_hmac_md5(key, data));
        },

        hmac_b64digest: function (key, data) {
            return binl2b64(core_hmac_md5(key, data));
        },

        hmac_hash: function (key, data) {
            return binl2str(core_hmac_md5(key, data));
        },

        /**
         * Perform a simple self-test to see if the VM is working
         **/
        test: function () {
            return MD5.hexdigest("abc") === "900150983cd24fb0d6963f7d28e17f72";
        }
    };

    return obj;
})();




	var messages = 
{
	'pt_br' : 
	{
		'ADD'						: "Adicionar",
		'ADD_CONTACT'				: "Adicionar contato",
		'AN_ERROR_HAS_OCURRED'		: "Ocorreu um erro",
		'AUTHORIZE'					: "Autorizar",
		'AWAY'						: "Ausente",
		'BLOCK'						: "Bloquear",
		'BUSY'						: "Ocupado",
		'CANCEL'					: "Cancelar",
		'CLICK_TO_START_A_CONVERSATION_WITH' : "Clique para iniciar uma conversa com",
		'CHANGE_YOUR_STATUS' 		: "Mude seu status",
		'CONTACT_LIST'				: "Lista de contatos",
		'DELETE'					: "Excluir",
		'DOUBLE_CLICK_TO_EDIT' 		: "Duplo clique para editar",
		'EDIT_CONTACT'				: "Editar Contato",
		'EDIT'						: "Editar",
		'ENTER_A_JID'				: "Digite um JID (Jabber ID)",
		'ENTER_A_NAME'				: "Digite um nome",
		'GONE'						: "saiu",
		'IS_TYPING'					: "est&aacute digitando",
		'JID'						: "JID",
		'ME'						: "Eu",
		'NAME'						: "Nome",
		'NEW_MESSAGE'				: "Nova Mensagem",
		'QUIT'						: "Sair",
		'ONLINE'					: "Dispon&iacute;vel",
		'OFFLINE'					: "Indispon&iacute;vel",
		'SEEN'						: "Ativo",
		'STOPPED_TYPING'			: "parou a digita&ccedil;&atilde;o",
		'UPDATE'					: "Atualizar",
		'WRITE_YOUR_MESSAGE_HERE'	: "Escreva sua mensagem aqui",
		'YOUR_MESSAGE_TODAY' 		: "Sua mensagem de hoje"
	}
};


	$.fn.im = function( options ) {

	    var defaults = {
	    	contactClass: "chat-contact",
		    onlineClass : "online",
		    awayClass : "away",
		    offlineClass : "offline",
		    busyClass : "busy",
		    overColor: "#DEE8F0",
		    /* if div is hidden will show after load */
		    jid: "",
		    password: "",
		    url:"localhost",
		    resource:"Chat",
		    beforeConnect : undefined,
		    afterConnect: undefined,
		    errorFunction: undefined,
		    chatClass: "chat-container",
		    chatListClass: "chat-list",
		    loadClass : "loading-chatss",
            loadArea: "<div id='chat-loading-area' class='expresso-loading-spacer'><div class='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active'></div></div>",
		    defaultStatus: null,
		    /* helps to debug some error's */
		    debug: false,
		    contactList: [],
		    contactNameIndex: "from",
		    title: "## NOVA MENSAGEM ##",
		    defaultTitle: document.title,
		    /* save the messages sent and received */
		    afterMessage : undefined,
		    afterIq : undefined,
		    soundPath: "/js/libs/messenger/",
		    soundName: "pop",
		    minimizeZone: undefined,
		    autoStatusTime: ( 60000 * 2 ),
		    autoStatusMessenger: null,
		    emotions: [
		    	{
		    		emotion: /:\)/g,
		    		emotionClass: "smile"
		    	},
		    	{
		    		emotion: /:D/ig,
		    		emotionClass: "happy"
		    	},
		    	{
		    		emotion: /:p/ig,
		    		emotionClass: "tongue"
		    	},
		    	{
		    		emotion: /:\(/g,
		    		emotionClass: "sad"
		    	},
		    	{
		    		emotion: /:o/ig,
		    		emotionClass: "surprised"
		    	},
				{
		    		emotion: /\(l\)/ig,
		    		emotionClass: "heart"
		    	},	    			    
		    	{
		    		emotion: /\(y\)/ig,
		    		emotionClass: "thumb_up"
		    	},
		    	{
		    		emotion: /;\)/g,
		    		emotionClass: "wink"
		    	},
		    	{
		    		emotion: /\(n\)/ig,
		    		emotionClass: "thumb_down"
		    	}
		    ],
		    addContact : true
	  	};

  		var settings = {},
		connection_options = {};

	  	settings = $.extend( {}, defaults, options );	  	

	  	var $container = this,
  		$parent = $(this).parent(),
  		$container_body = $("<div/>"),
  		statusClasses = settings.onlineClass + " " + settings.awayClass + " " + settings.busyClass + " " + settings.offlineClass,
		t = null,
		user = settings.username;//settings.jid.split("@")[0],
		var contacts = [];
		
  		prepare($container, user);

		var $container_list = $container.find("ul:first").addClass(settings.chatListClass);
		var alfabetic = function(){};

		if( settings.height && settings.height > 0 )
		{
			$container_list.css("height", settings.height )
			.css("overflow-x","hidden")
			.css("overflow-y","scroll");
		}

		generateContacts($container_list);

		$.contextMenu({
	        selector: '.chat-title.chat-me .chat-status.'+settings.onlineClass+
	        ",.chat-title.chat-me .chat-status."+settings.busyClass+
	        ",.chat-title.chat-me .chat-status."+settings.awayClass+
	        ",.chat-title.chat-me .chat-status."+settings.offlineClass,
	        className	: 'chat-status-context-menu',
	        trigger		: 'left',
	        autoHide	: true,
	        events		: 
	        {
	        	show : function(opt)
	        	{
	        		$('.chat-status-context-menu').css({'list-style': 'none', 'list-style-image':'none' });
	        	}
	        },
	        items: {
	            "online": { name: messages.pt_br.ONLINE , icon: settings.onlineClass, callback: function(key, opt){ 
	            	$.xmpp.setPresence({show:null}); 
	            	$(opt.selector).removeClass(statusClasses).addClass(settings.onlineClass); 
	            }},
	            "busy": { name: messages.pt_br.BUSY , icon: settings.busyClass, callback: function(key, opt){ 
	            	$.xmpp.setPresence({show:"dnd"}); 
	            	$(opt.selector).removeClass(statusClasses).addClass(settings.busyClass); 
	            }},
	            "away": { name: messages.pt_br.AWAY , icon: settings.awayClass, callback: function(key, opt){
	            	$.xmpp.setPresence({show: "away"}); 
	            	$(opt.selector).removeClass(statusClasses).addClass(settings.awayClass); 
	            }},
	            /*"offline": { name: messages.pt_br.OFFLINE , icon: settings.offlineClass, callback: function(key, opt){
	            	$.xmpp.disconnect();
	            	//$.xmpp.setPresence({show:"unavailable"}); 
	            	$(opt.selector).removeClass(statusClasses).addClass(settings.offlineClass); 
	            }}*/
	            "sep1": "---------",
	            "quit": {name: messages.pt_br.QUIT , icon: "quit", callback: function(key, opt){
	            	$.xmpp.disconnect();
	            }}
	        }
	    });


		$.contextMenu({
	        selector: '.'+settings.chatListClass+' .'+settings.contactClass,
	        className	: 'chat-contact-context-menu',
	        autoHide	: true,
	        events		:
	        {
	        	show : function(opt)
	        	{
	        		$('.chat-contact-context-menu').css({'list-style': 'none', 'list-style-image':'none' });
	        	}
	        },
	        items: {
	            "authorize": {name: messages.pt_br.AUTHORIZE , icon: "question", callback: function(key, opt){ 
	            	//contacts[$(this).attr('id')] = user data
	            	authorize(contacts[$(this).attr('id')], null);
	            }},
	            "block": {name: messages.pt_br.BLOCK , icon: "block", callback: function(key, opt){ 
	            	//contacts[$(this).attr('id')] = user data
	            	authorize(contacts[$(this).attr('id')], "unavailable");	            	
	            }},
	            "update": {name: messages.pt_br.UPDATE, icon: "edit", callback: function(key, opt){ 
	            	//contacts[$(this).attr('id')] = user data
	            	addContact(null, contacts[$(this).attr('id')],$(this));
	            }},
	            "delete": {name: messages.pt_br.DELETE , icon: "delete", callback: function(key, opt){ 
	            	$.xmpp.deleteContact({to:contacts[$(this).attr('id')]['jid']});
	            	$(this).remove();
	            }}
	        }
	    });

		if(settings.debug)
			debug("Executing beforeConnect()");
		/* if need to do something before connect */
		if(typeof(settings.beforeConnect) === "function")
			settings.beforeConnect();

		if(settings.debug)
			debug("Executed beforeConnect()");

		/* Conection with xmpp */
		if($.xmpp){
            
			if(settings.debug)
				debug("Connecting to xmpp");



			connection_options = {
				"resource":settings.resource, "username":settings.username, "password":settings.password, "url":settings.url, "domain" : settings.domain,				
				onDisconnect:function(){
					// Destroy List
					destroy($container_list,$container);
				},
				onConnect: function(eas){
					if(settings.debug)
						debug("Connected to xmpp");

					$.xmpp.getRoster();
					$.xmpp.setPresence(settings.defaultStatus);
                    $("#chat-loading-area").remove();
					// $container.find("."+settings.loadClass).removeClass(settings.loadClass);					

					var statusClass = 
						settings.defaultStatus ? 
							( settings.defaultStatus === "offline" ? 
								settings.offlineClass : (settings.defaultStatus === "dnd" ? 
									settings.busyClass : settings.awayClass)) 
						: settings.onlineClass;

					$(".chat-conversation-dialog textarea").removeAttr("disabled");
					$container.find(".chat-status").addClass(statusClass);

					// settings.debug = true;

					/* if need to do something after connect */ 
					if(settings.debug)
						debug("Executing afterConnect()");
					if(typeof(settings.afterConnect) === "function")
						settings.afterConnect();
					if(settings.debug)
						debug("Executed afterConnect()");

					// Auto Status Way
					settings.autoStatusMessenger = setTimeout( function(){ autoStatus(); }, settings.autoStatusTime );

					$(document).on('mousemove', function()
					{
						if( $.xmpp.getMyPresence() == "away" )
						{
							$.xmpp.setPresence( { show: "null" } ); 

							$("span.chat-status").removeClass(statusClasses).addClass(settings.onlineClass); 
				        }
					});
					
					$(document).on('keypress', function()
					{ 
						if( $.xmpp.getMyPresence() == "away" )
						{
							$.xmpp.setPresence( { show: "null" } ); 

							$("span.chat-status").removeClass(statusClasses).addClass(settings.onlineClass); 
				        }
					});
				},
				onIq: function(iq){
					if(settings.debug)
						debug("onIQ : " + iq);
					var from = $(iq).find("own-message").attr("to");
					from = from.match(/^[\w\W][^\/]+[^\/]/g)[0];
					var id = MD5.hexdigest(from);
					var conversation = $("#"+id+"_chat");
					if(conversation.length == 0){
						conversation = openChat({title: contacts[id]['from'], from:from, id: id+"_chat", md5_id:id});
						conversation.parent().find(".ui-dialog-titlebar").prepend($("#"+id).find(".chat-status").clone().removeClass("chatting"));
					}else{
						conversation.wijdialog("open");
					}
					var conversation_box = conversation.find(".chat-conversation-box");
					var date = "<span style='font-size:9px;'>("+(new Date().toString("HH:mm"))+")</span>";

					$("<div/>")
					.addClass("chat-conversation-box-me")
					.html(date+"<strong> Me: </strong>"+formatters($(iq).find("div").html()))
					.appendTo(conversation_box);
					conversation_box.scrollTo("div:last");
					conversation_box.next().html("");
				},
				onMessage: function(message){
					if(settings.debug)
						debug("onMessage : " + message);
					message.from = message.from.match(/^[\w\W][^\/]+[^\/]/g)[0];
					var jid = message.from.split("/");
					debug(jid);
					var id = MD5.hexdigest(message.from);
					debug(id);



					var conversation = $("#"+id+"_chat");

					debug(conversation);
					debug(message.body);
					if(message.body){
						console.log("hasBody");
						if(conversation.length == 0){
							console.log("openChat:" + message.from);
							conversation = openChat({title: (contacts[id] ? contacts[id]['from']:message.from) , from:message.from, id: id+"_chat", md5_id:id, message: message.body});

							// var status = $("#"+id).find(".chat-status").clone().removeClass("chatting");

							// if(!status.length){
							// 	status = $("<div/>")
							// 	.addClass("chat-status")
							// 	.addClass(settings.offlineClass);
							// }

							//conversation.parent().find(".ui-dialog-titlebar").prepend(status);
						}else{
							console.log("openWijDialog");
							conversation.wijdialog("open");
						}
					}
					var conversation_box = conversation.find(".chat-conversation-box");
					var date = "<span style='font-size:9px;'>("+(new Date().toString("HH:mm"))+")</span>";
					date = "";

					if( message.body )
					{	

                        receiveMessage(id,formatters(message.body));


						// $("<div/>")
						// .addClass("chat-conversation-box-you")
						// .html(date+"<strong> "+(contacts[id] ? contacts[id]['from']:message.from)+": </strong>"+formatters(message.body))
						// .appendTo(conversation_box);

						//var element = document.getElementById('msgs_content_' + this.chatID);
        				//var maxScrollPosition = conversation_box.scrollHeight - conversation_box.clientHeight;
        				//conversation_box.animate({ scrollTop: maxScrollPosition }, 200);

						conversation_box.scrollTo("div:last").next().html("");
						conversation.parent().find(".ui-dialog-titlebar").css({"background":"rgb(68, 138, 255) none repeat scroll 0 0","border-color":"rgb(68, 138, 255) none repeat scroll 0 0"});
						document.title = settings.title;
						document.getElementById("new_message_sound").play();

						noty({
							text: '<strong>'+contacts[id]['from']+' say:</strong><br/>'+(message.body.length > 20 ? message.body.substr(0,17)+"..." : message.body), 
							type: 'warning',
							timeout: 3000,
							layout: 'bottomRight',
							callback: {
								onCloseClick: function(e) {
									$("#"+id).click();
								}
							}
						});
					}
					if(settings.afterMessage)
						afterMessage(message);		
				},
				onPresence: function(presence){
					if(settings.debug)
						debug("onPresence : " + presence);

					presence.from = presence.from.match(/^[\w\W][^\/]+[^\/]/g)[0];
					var md5_contact = MD5.hexdigest(presence.from);
					var select = $("#"+md5_contact);
					var statusClass = 
						presence['show'] !== "available" ? 
							( presence['show'] === "unavailable" ? 
								settings.offlineClass : (presence['show'] === "dnd" ? 
									settings.busyClass : (presence['show'] === "away"?
									settings.awayClass : settings.onlineClass))) 
						: settings.onlineClass;
					var from = presence.from.split("@")[0];
					var dialogs = $("#"+md5_contact+"_chat");
					if(select.length){
						select.find('.chat-contact-description')
						.html(presence['status'] ? " (...) " : "")
						.attr("title", presence['status'] )
						.attr("alt", presence['status']);

						select.find("div.chat-status")
						.removeClass(statusClasses)
						.addClass(statusClass);
						if(dialogs.length){
							$("#"+md5_contact).addClass("chatting");
							dialogs.parent().find("div.chat-status")
							.removeClass(statusClasses)
							.addClass(statusClass);
						}
					}
					if(statusClass == settings.onlineClass){
						noty({
							text: '<strong>'+contacts[md5_contact]['from']+'</strong><br/>is online now', 
							type: 'success',
							timeout: 3000,
							layout: 'bottomRight',
							callback: {
								onCloseClick: function(e) {
									console.log(e);
									$(select).click();
								}
							}
						});
					}
					clearTimeout(alfabetic);
					alfabetic = setTimeout(function(){
                        
						var resultA1 = $container_list.find("li").tsort("."+settings.onlineClass);
						var resultA2 = $container_list.find("li").tsort("."+settings.busyClass);
						var resultA3 = $container_list.find("li").tsort("."+settings.awayClass);
						var resultA4 = $container_list.find("li").tsort("."+settings.offlineClass);

                        if (resultA1.length != 0) {
                            resultA1.tsort("span.chat-contact-name",{charOrder:"abcdefghijklmnopqrstuvxyz1234567890"});
                        }
                        if (resultA2.length != 0) {
                            resultA2.tsort("span.chat-contact-name",{charOrder:"abcdefghijklmnopqrstuvxyz1234567890"});
                        }
                        if (resultA3.length != 0) {
                            resultA3.tsort("span.chat-contact-name",{charOrder:"abcdefghijklmnopqrstuvxyz1234567890"});
                        }
                        if (resultA4.length != 0) {
                            resultA4.tsort("span.chat-contact-name",{charOrder:"abcdefghijklmnopqrstuvxyz1234567890"});
                        }

					},1000);
				},
				onError: function(error){
					if(settings.debug)
						debug("onError :" + error);
					if(settings.errorFunction)
						settings.errorFunction(error);

					destroy($container_list,$container);
				},
   				onComposing: function(message)
   				{

                    var isFriendTyping = false;

                    var friendIsTyping = function(chat_id){

                        console.log("friendIsTyping");
                         if(isFriendTyping) return;

                        isFriendTyping=true;

                        var infoContainer = $("#chat-info-container-"  + chat_id);
                        var effectContainer = $("#chat-effect-container-" + chat_id);

                        var bleeding = 100;

                        var $dots=$("<div/>")
                            .addClass('chat-effect-dots')
                            .css({
                                top:-30+bleeding,
                                left:10
                            })
                            .appendTo(effectContainer)
                        ;
                        for (var i = 0; i < 3; i++) {
                            var $dot=$("<div/>")
                                .addClass("chat-effect-dot")
                                .css({
                                    left:i*20
                                })
                                .appendTo($dots)
                            ;
                            window.TweenMax.to($dot,0.3,{
                                delay:-i*0.1,
                                y:30,
                                yoyo:true,
                                repeat:-1,
                                ease:Quad.easeInOut
                            })
                        };

                        var $info=$("<div/>")
                            .addClass("chat-info-typing")
                            .text("Seu amigo está digitando...")
                            .css({
                                transform:"translate3d(0,30px,0)"
                            })
                            .appendTo(infoContainer)

                        window.TweenMax.to($info, 0.3,{
                            y:0,
                            force3D:true
                        });

                        gooOn(chat_id);
                    }

                    var gooOn = function(chat_id){
                        setFilter('url(#goo)',chat_id);
                    }
                    var gooOff = function(chat_id){
                        setFilter('none',chat_id);
                    }
                    var setFilter = function(value,chat_id){
                        $("#chat-effect-container-" + chat_id).css({
                            webkitFilter:value,
                            mozFilter:value,
                            filter:value,
                        });
                    }

                    var friendStoppedTyping = function(chat_id){

                        var infoContainer = $("#chat-info-container-"  + chat_id);
                        var effectContainer = $("#chat-effect-container-" + chat_id);
                        isFriendTyping = false;

                        var bleeding = 100;

                        var dots=effectContainer.find(".chat-effect-dots");
                        window.TweenMax.to(dots,0.3,{
                            y:40,
                            force3D:true,
                            ease:Quad.easeIn,
                        });

                        var info=infoContainer.find(".chat-info-typing");
                        window.TweenMax.to(info,0.3,{
                            y:30,
                            force3D:true,
                            ease:Quad.easeIn,
                            onComplete:function(){
                                dots.remove();
                                info.remove();

                                gooOff(chat_id);
                            }
                        });
                    }

   					message.from = message.from.match(/^[\w\W][^\/]+[^\/]/g)[0];
					var id = MD5.hexdigest(message.from);
					// var conversation = $("#"+id+"_chat");
					// if(conversation.length){
						//var conversation_box = conversation.find(".chat-conversation-box").next();
						var date = (new Date().toString("HH:mm"));

						switch(message.state){
							case 'active':
                                //friendStoppedTyping(id);
                                //friendIsTyping(id);
								//conversation_box.html("").html("<span class='read-icon'></span> "+messages.pt_br.SEEN+" "+date);
                                friendStoppedTyping(id);
								break;
							case 'composing':
                                
                                friendIsTyping(id);
								//conversation_box.html("").html("<span class='composing'></span> "+contacts[id]['from']+" "+messages.pt_br.IS_TYPING+"...");
								break;
							case 'gone':
                                friendStoppedTyping(id);
								//conversation_box.html("").html("<span class='active'></span> "+messages.pt_br.GONE+" "+date);
								break;
							case 'paused':
                                friendStoppedTyping(id);
								//conversation_box.html("").html("<span class='paused'></span> "+contacts[id]['from']+" "+messages.pt_br.STOPPED_TYPING+"...");
								break;
							default:
                                friendStoppedTyping(id);
                                //friendStoppedTyping(id);
								//conversation_box.html("");
						}
					// }
   					if(settings.debug)
						debug("onComposing : " + message);
   				},
   				onRoster: function( roster)
   				{  			
   					if(settings.debug)
						debug("onRoster : " + roster);		

					var _rosterJid = roster.jid;
					_rosterJid = _rosterJid.match(/^[\w\W][^\/]+[^\/]/g)[0]; 
   					
   					var md5_contact = MD5.hexdigest(_rosterJid);
					var select = $("#"+md5_contact);
					var from = roster['name'] ? roster['name'] : _rosterJid;

					contacts[md5_contact] = roster;
					contacts[md5_contact]['from'] = from;

					if(!select.length){
						//select.find(".chat-contact-name").html(from);
	   					var contact = $("<li/>")
						.attr("title", messages.pt_br.CLICK_TO_START_A_CONVERSATION_WITH + " " + from )
						.attr("id", md5_contact)
						.addClass(settings.contactClass);
						
						var status = $("<div/>")
						.addClass("chat-status")
						.addClass(settings.offlineClass)
						.appendTo(contact);

						$("<span/>")
						.addClass("chat-contact-name")
						.html(from)
						.appendTo(contact);

						$("<span/>")
						.addClass("chat-contact-description")
						//.html(from)
						.appendTo(contact);

						contact.click(function(){
							var id = md5_contact+"_chat";
							var conversation = $("#"+id);
                            var conversationDialog;
							if(conversation.length == 0){
								conversationDialog = openChat({"title":from, "from": _rosterJid, "id": id, "md5_id":md5_contact});
								conversationDialog.parent().find(".ui-dialog-titlebar").prepend(status.clone().removeClass("chatting"));
							}
							else{
								conversation.wijdialog("restore");
								conversation.wijdialog("open");
							}
						});
						$container_list.append(contact);	

						// Presence automatic
						if( $.trim(roster.subscription) == "from" ){
							authorize(contacts[md5_contact], null);
						}

					}else{
						select.find(".chat-contact-name").html(from);
					}
   				}
		    };

		  	$.xmpp.connect(connection_options);
		}else{
			if(settings.debug)
				debug("xmpp plugin not found");
		}

		/* Auto Status */
		function autoStatus()
		{
			if( settings.autoStatusMessenger )
			{
				clearTimeout( settings.autoStatusMessenger );
			}

			if( $.xmpp.getMyPresence() == "available" || $.xmpp.getMyPresence() == "null" )
			{
				$.xmpp.setPresence( { show: "away" } ); 
				
				$("span.chat-status").removeClass(statusClasses).addClass(settings.awayClass);
	        }

			settings.autoStatusMessenger = setTimeout( function(){ autoStatus();}, settings.autoStatusTime );
		}

		/* if the list of the users are pre-defined */
	  	function prepare(container, user){
	  		if( settings.debug )
				debug("Preparing");

			var div = $("<div/>")
			.addClass("chat-title chat-me")
			.appendTo(container);

			// First Div - status, name
			var _divFirst = $("<div/>")


			.css({"margin-top":"4px", "position":"absolute", "margin-left":"200px"})
			.appendTo(div);

			$("<span/>")
			.addClass("chat-status")
			.attr("title", messages.pt_br.CHANGE_YOUR_STATUS )
			.attr("alt", messages.pt_br.CHANGE_YOUR_STATUS )
			.addClass(settings.loadClass)
			.appendTo(_divFirst);

			// $("<span/>")
			// .addClass("chat-name")
			// .css({"padding-left":"10px","vertical-align":"top"})
			// .html("")
			// .appendTo(_divFirst);

			// Second Div - Msg status, addContact
			// var _divSecond = $("<div/>")
			// .css({"vertical-align":"top","height":"20px !important"})			
			// .appendTo(div);

			// Add Button Contact
			if( settings.addContact )
			{
				// $("<span>")
				// .addClass("ui-icon ui-icon-circle-plus")
				// .attr("title", messages.pt_br.ADD_CONTACT )
				// .css({"float":"right"})
				// .attr("alt", messages.pt_br.ADD_CONTACT )
				// .appendTo(_divSecond)
				// .button()
				// .click(addContact);
			}			

			var text = "";
			$("<input/>")
			.addClass('chat-description-input')
			.attr({type: 'text', /*placeholder*/value: messages.pt_br.YOUR_MESSAGE_TODAY , readonly: "readonly", title: messages.pt_br.DOUBLE_CLICK_TO_EDIT, alt: messages.pt_br.DOUBLE_CLICK_TO_EDIT })
			.dblclick(function(){
				if( $.xmpp.isConnected() ){
					text = $(this).val();
					$(this).removeAttr("readonly");
				}
			})
			.keydown(function(e){
				if(e.which == $.ui.keyCode.ENTER && !e.shiftKey)
				{
					if($.trim($(this).val()) != "")
					{
						$.xmpp.setPresence({status: $(this).val()});
						text = $(this).val();
					}
					$(this).attr("readonly", "readonly");
				}else if(e.which == $.ui.keyCode.ESCAPE){
					$(this).val(text);					
					$(this).attr("readonly", "readonly");
				}
			})
			.focusout(function(){
				$(this).focus();
				$(this).val(text);
				$(this).attr("readonly", "readonly");		
			});
			//.appendTo(_divSecond);

			$("<div/>")
			.addClass("chat-list-title")
			.html( messages.pt_br.CONTACT_LIST )
			.appendTo(container);

			var search_box = $("<input/>")
			.addClass("chat-search-input")
			.attr("placeholder", "Type your search")
			.keydown(function(e){
				if(e.which == $.ui.keyCode.ENTER && !e.shiftKey){
					$(this).parent().find("ul").toggle();
				}
			});

			$("<div/>")
			.addClass("chat-list")
			.addClass(settings.chatClass)
            .append(settings.loadArea)
			.append()
			.append("<ul/>")
			.append("<ul class='chat-search-result' style='display:none;'/>")
			.appendTo(container);


            var svgGoo = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='800' style='display: none;'><defs><filter id='goo'><feGaussianBlur in='SourceGraphic' stdDeviation='10' result='blur' /><feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9' result='goo' /><feComposite in='SourceGraphic' in2='goo' /></filter></defs></svg>";

            container.prepend(svgGoo);

            window.componentHandler.upgradeDom();


			if (!settings.minimizeZone){
				$("<div/>")
				.addClass("footer-conversation-bar")
				.attr("id", "conversation-bar-container")
				//.appendTo("body");
				.appendTo("#messenger-conversation-bar-container");
			}
			
	  		if( settings.debug )
				debug("Prepared");
	  	}

	  	function addContact(e, data, select){
	  		if(!$.xmpp.isConnected())
	  			return false;
	  		//MD5.hexdigest
	  		var offset;
	  		if(!select){
	  			offset = $(this).offset();
	  		}else{
	  			offset = $(select).offset()
	  		}
	  		
			var div = $("<div/>")
			.addClass("chat-add-contact");

			$("<span>")
			.html( messages.pt_br.NAME + ": " )
			.appendTo(div);

			$("<input type='text'>")
			.attr({name: 'name', placeholder: messages.pt_br.ENTER_A_NAME })
			.appendTo(div)
			.val(data ? data.name : "");

			$("<br/>")
			.appendTo(div);

			$("<span>")
			.html( messages.pt_br.JID + ": ")
			.appendTo(div);

			var emailAttrs = { name: 'to', placeholder: messages.pt_br.ENTER_A_JID };
			if(data){
				emailAttrs['disabled'] = "disabled";
			}

			$("<input type='text'>")
			.attr(emailAttrs)
			.appendTo(div)
			.val(data ? data.jid : "");

			//$(div).find("input").wijtextbox();

			var _data = data;
			div.wijdialog({
				autoOpen: true,
				title: data ? messages.pt_br.EDIT_CONTACT : messages.pt_br.ADD_CONTACT,
				draggable: true,
				dialogClass: "add-contact-dialog",
				captionButtons: {
	                pin: { visible: false },
	                refresh: { visible: false },
	                toggle: { visible: false },
	                minimize: { visible: false },
	                maximize: { visible: false }
			    },
			    resizable: false,
				position: [offset.left,offset.top],
				buttons: [
					{
						text: data ? messages.pt_br.EDIT : messages.pt_br.ADD , 
						click: function(){
							if(!_data){
								var data = {};
								$.each($(this).find("input"), function(e, q){
									data[$(q).attr("name")] = $(q).val();
								});
								data['type'] = "subscribe";
								$.xmpp.addContact(data);
								$.xmpp.subscription(data);
							}else{
								_data = $.extend( {}, _data, {name: $(this).find("input:first").val()} );
								$.xmpp.updateContact(_data);
							}
							$(this).wijdialog("destroy");	
						}
					},
					{
						text: messages.pt_br.CANCEL, 
						click: function(){
							$(this).wijdialog("destroy");
						}	
					}
				],
				close: function(){
					$(this).wijdialog ("destroy");
				}
			});
			//.appendTo("body");	
	  	}

		function authorize(data, subscription){
	  		var _subscription = ""
	  		
	  		if( subscription == "unavailable"){
	  			_subscription = subscription;
	  		}else{
		  		if( data.subscription = "none" ){
		  			_subscription = "subscribe";
		  		}
		
		  		if( data.subscription == "from" ){
		  			_subscription = "subscribe";
		  		}
	  		}
	  		$.xmpp.subscription({"to":data.jid, "type":_subscription});
	  	}

	  	function generateContacts(container_list){
	  		if(settings.contactList.length){
	  			for(var contact in settings.contactList)
					contactListChanges(contact,container_list);
	  		}
	  	}

	  	function contactListChanges(presence, selector){

	  		if(settings.debug)
				debug("Generating contact in the list");
			var md5_contact = MD5.hexdigest(presence[settings.contactNameIndex]);
			var select = $("#"+md5_contact);
			var statusClass = settings.offlineClass;
			var from = presence[settings.contactNameIndex].split("@")[0];

			if(!select.length){
				var contact = $("<li/>")
				.attr("title", messages.pt_br.CLICK_TO_START_A_CONVERSATION_WITH + " " + from)
				.attr("id", md5_contact)
				.addClass(settings.contactClass)
				
				$("<div/>")
				.addClass("chat-status")
				.addClass(statusClass).appendTo(contact);

				$("<span/>")
				.addClass("chat-contact-name")
				.html(from)
				.appendTo(contact);

				contact.click(function(){
					var id = md5_contact+"_chat";
					var conversation = $("#"+id);
                    var conversationDialog;
					if(conversation.length == 0){
						conversationDialog = openChat({title:from, from: presence[settings.contactNameIndex], id: id, md5_id:md5_contact});
						conversationDialog.parent().find(".ui-dialog-titlebar").prepend(status.clone().removeClass("chatting"));
					}
					else{
						conversation.wijdialog("restore");
						conversation.wijdialog("show");
					}
				});
				selector.append(contact);
			}
			if(settings.debug)
				debug("Generated contact in the list");
	  	}

        

        function getFriendMessageTemplate(message) {
            var friendMessageTemplate = "<li class='chat-message chat-message-friend'><div class='chat-message-bubble'>" + message + "</div></li>";

            return friendMessageTemplate;
        }

        function getInputBarTemplate(chat_id) {

            var chatInputBarTemplate = "<div id='chat-input-bar-"+ chat_id + "' class='chat-input-bar'><div id='chat-info-container-" + chat_id + "' class='chat-info-container'></div><div id='chat-effect-container-"+ chat_id + "' class='chat-effect-container'><div id='chat-effect-bar-"+ chat_id + "' class='chat-effect-bar'></div></div><div id='chat-input-wrapper-"+ chat_id + "' class='chat-input-wrapper'><div id='chat-input-"+ chat_id + "' class='chat-input' contenteditable></div><button id='chat-send-"+ chat_id + "' class='chat-send'><i class='material-icons'>send</i></button></div></div>";
           
            return chatInputBarTemplate;
        }

        function getChatWindow(chat_id,withMessage) {

            var friendMessage = "";
            if (withMessage != undefined) {
                friendMessage = getFriendMessageTemplate(withMessage);
            }

            var chatWindowTemplate = "<div id='chat-messages-" + chat_id +  "' class='chat-messages'><div class='chat-messages-list-margin'><ol id='chat-messages-list-" + chat_id +  "' class='chat-messages-list'>" + friendMessage + "</ol></div></div>" + getInputBarTemplate(chat_id);

            var div = document.getElementById("chat-window-" + chat_id);

            if ((div == undefined) || (div == null)) {
                div = $("<div/>",{ id: "chat-window-" + chat_id}).addClass("chat-window").append(chatWindowTemplate);
            } else {
                div = $("#chat-window-" + chat_id);
            }
            

            return div;
        }

        function addMessage(chat_id,message,self){

            var $messagesList = $("#chat-messages-list-" + chat_id);
            var $messagesContainer = $("#chat-messages-" + chat_id);

            var $messageContainer=$("<li/>")
                .addClass('chat-message '+(self?'chat-message-self':'chat-message-friend'))
                .appendTo($messagesList)
            ;
            var $messageBubble=$("<div/>")
                .addClass('chat-message-bubble')
                .appendTo($messageContainer)
            ;
            $messageBubble.text(message);

            $messageBubble.linkify();

            var oldScroll=$messagesContainer.scrollTop();
            $messagesContainer.scrollTop(9999999);
            var newScroll=$messagesContainer.scrollTop();
            var scrollDiff=newScroll-oldScroll;
            window.TweenMax.fromTo(
                $messagesList,0.4,{
                    y:scrollDiff
                },{
                    y:0,
                    ease:Quint.easeOut
                }
            );

            return {
                $container:$messageContainer,
                $bubble:$messageBubble
            };
        }

        function receiveMessage(chat_id,message){

            var $messagesContainer = $("#chat-messages-" + chat_id);

            var messageElements=addMessage(chat_id,message,false)
                ,$messageContainer=messageElements.$container
                ,$messageBubble=messageElements.$bubble
            ;

            window.TweenMax.set($messageBubble,{
                transformOrigin:"60px 50%"
            })
            window.TweenMax.from($messageBubble,0.4,{
                scale:0,
                force3D:true,
                ease:Back.easeOut
            })
            window.TweenMax.from($messageBubble,0.4,{
                x:-100,
                force3D:true,
                ease:Quint.easeOut
            })
        }

        function gooOn(chat_id){
            setFilter('url(#goo)',chat_id);
        }
        function gooOff(chat_id){
            setFilter('none',chat_id);
        }
        function setFilter(value,chat_id){
            $("#chat-effect-container-" + chat_id).css({
                webkitFilter:value,
                mozFilter:value,
                filter:value,
            });
        }

        function sendMessage(chat_id,options){

            var $input = $("#chat-input-" + chat_id);
            var message=$input.text();

            message = formatters(message);

            // if(settings.debug)
            //     debug("Sending message: "+message+"\nfrom: "+options.from);

            $.xmpp.sendMessage({body: message, to:options.from, resource:"Chat", otherAttr:"value"},"<error>Ocorreu um erro</error>");

            var $messagesList = $("#chat-messages-list-" + chat_id);
            var $messagesContainer = $("#chat-messages-" + chat_id);
            var $effectContainer = $("#chat-effect-container-" + chat_id);
            var $sendButton = $("#chat-send-"+ chat_id);
            var bleeding=100;



            if(message=="") return;
            
            lastMessage=message;

            var messageElements=addMessage(chat_id,message,true)
                ,$messageContainer=messageElements.$container
                ,$messageBubble=messageElements.$bubble
            ;

            var oldInputHeight=$(".chat-input-bar").height();
            $input.text('');
            updateChatHeight(chat_id);
            var newInputHeight=$(".chat-input-bar").height();
            var inputHeightDiff=newInputHeight-oldInputHeight

            var $messageEffect=$("<div/>")
                .addClass('chat-message-effect')
                .append($messageBubble.clone())
                .appendTo($effectContainer)
                .css({
                    left:$input.position().left-12,
                    top:$input.position().top+bleeding+inputHeightDiff
                })
            ;


            var messagePos=$messageBubble.offset();
            var effectPos=$messageEffect.offset();
            var pos={
                x:messagePos.left-effectPos.left,
                y:messagePos.top-effectPos.top
            }

            var $sendIcon=$sendButton.children("i");
            window.TweenMax.to(
                $sendIcon,0.15,{
                    x:30,
                    y:-30,
                    force3D:true,
                    ease:Quad.easeOut,
                    onComplete:function(){
                        window.TweenMax.fromTo(
                            $sendIcon,0.15,{
                                x:-30,
                                y:30
                            },
                            {
                                x:0,
                                y:0,
                                force3D:true,
                                ease:Quad.easeOut
                            }
                        );
                    }
                }
            );

            gooOn();

            
            window.TweenMax.from(
                $messageBubble,0.8,{
                    y:-pos.y,
                    ease:Sine.easeInOut,
                    force3D:true
                }
            );

            var startingScroll=$messagesContainer.scrollTop();
            var curScrollDiff=0;
            var effectYTransition;
            var setEffectYTransition=function(dest,dur,ease){
                return window.TweenMax.to(
                    $messageEffect,dur,{
                        y:dest,
                        ease:ease,
                        force3D:true,
                        onUpdate:function(){
                            var curScroll=$messagesContainer.scrollTop();
                            var scrollDiff=curScroll-startingScroll;
                            if(scrollDiff>0){
                                curScrollDiff+=scrollDiff;
                                startingScroll=curScroll;

                                var time=effectYTransition.time();
                                effectYTransition.kill();
                                effectYTransition=setEffectYTransition(pos.y-curScrollDiff,0.8-time,Sine.easeOut);
                            }
                        }
                    }
                );
            }

            effectYTransition=setEffectYTransition(pos.y,0.8,Sine.easeInOut);
            
            // effectYTransition.updateTo({y:800});

            window.TweenMax.from(
                $messageBubble,0.6,{
                    delay:0.2,
                    x:-pos.x,
                    ease:Quad.easeInOut,
                    force3D:true
                }
            );
            window.TweenMax.to(
                $messageEffect,0.6,{
                    delay:0.2,
                    x:pos.x,
                    ease:Quad.easeInOut,
                    force3D:true
                }
            );

            window.TweenMax.from(
                $messageBubble,0.2,{
                    delay:0.65,
                    opacity:0,
                    ease:Quad.easeInOut,
                    onComplete:function(){
                        window.TweenMax.killTweensOf($messageEffect);
                        $messageEffect.remove();
                        // if(!isFriendTyping)
                        //     gooOff();
                    }
                }
            );

            messages++;

            // if(Math.random()<0.65 || lastMessage.indexOf("?")>-1 || messages==1) getReply();
        }

        function updateChatHeight(chat_id){
            $("#chat-messages-" + chat_id).css({
                height:280-$(".chat-input-bar").height()
            });
        }

        
	  	function openChat(options){
	  		if($.fn.wijdialog){
	  			if(settings.debug)
					debug("Generating Dialog to "+ options.title);

                var chat_id = options.md5_id;

                var div = getChatWindow(chat_id,options.message);

                div.attr({title: options.title});

	  	 		div.append('<audio controls id="new_message_sound" style="display:none;"><source src="/js/libs/messenger/'+settings.soundName+'.mp3" type="audio/mpeg"/><source src="/js/libs/messenger/'+settings.soundName+'.ogg" type="audio/ogg"/></audio>');
	  	 		var status = $(div).find(".chat-status");

                var pauseTimeOut;
                var composingTimeOut = true;

	  			if(settings.debug)
					debug("Generated Dialog to "+ options.title);

	  			var retVal = div.wijdialog({ 
	                autoOpen: true, 
	                captionButtons: { 
	                    pin: { visible: false },
                        refresh: { visible: false },
                        toggle: { visible: false },
                        minimize: { visible: true },
                        maximize: { visible: false }
	                },
	                dialogClass: "chat-conversation-dialog",
	                resizable:false,
	                minimizeZoneElementId: (!settings.minimizeZone ? "conversation-bar-container" : settings.minimizeZone),
	                open: function (e) {
	                 	status.addClass("chatting");

                        
                        

	                	$(this).parent().find(".ui-dialog-titlebar").off("click").on("click", function()
	                	{
							$(this).parent().find(".ui-dialog-titlebar").css({"background":"rgb(68, 138, 255) none repeat scroll 0 0","border":"0px","box-shadow":"0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)"});
							document.title = settings.defaultTitle;
						});
	                },
	                close: function (e) {
	                	 status.removeClass("chatting");
	                	 $.xmpp.isWriting({isWriting : 'gone', to:options.from});
	                },
	                focus: function(e){
	                	//$(this).find("textarea").focus().click();
	                	document.title = settings.defaultTitle;
						$(this).parent().find(".ui-dialog-titlebar").css({"background":"rgb(68, 138, 255) none repeat scroll 0 0","border":"0px","box-shadow":"0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)"});
						document.title = settings.defaultTitle;
						clearTimeout(pauseTimeOut);
		  				$.xmpp.isWriting({isWriting : 'active', to:options.from});
	                },
	                blur: function(e){
	                	pauseTimeOut = setTimeout(function(){
		  					$.xmpp.isWriting({isWriting : 'inactive', to:options.from});
	  					},3000);
	                }
	            }); 

                

                var KEY_ENTER = 13;
                $("#chat-input-" + chat_id).keydown(function(event) {
                    if(event.keyCode==KEY_ENTER){
                        event.preventDefault();

                        if(composingTimeOut){
                            $.xmpp.isWriting({isWriting : 'composing', to:options.from});
                            composingTimeOut = false;
                        }

                        sendMessage(chat_id,options);

                        composingTimeOut = true;
                        clearTimeout(pauseTimeOut);
                        return; 

                    }
                    clearTimeout(pauseTimeOut);
                    pauseTimeOut = setTimeout(function(){
                        if($("#chat-input-" + chat_id).text() != "")
                            $.xmpp.isWriting({isWriting : 'paused', to:options.from});
                        else
                            $.xmpp.isWriting({isWriting : 'inactive', to:options.from});
                        composingTimeOut = true;
                    },5000); 
                });
        
                var $sendButton = $("#chat-send-" + chat_id);
                $sendButton.click(function(event){
                    event.preventDefault();
                    sendMessage(chat_id,options);
                    // $input.focus();
                });
                $sendButton.on("touchstart",function(event){
                    event.preventDefault();
                    sendMessage(chat_id,options);
                    // $input.focus();
                });

                $("#chat-input-" + chat_id).on("input",function(){
                    updateChatHeight(chat_id);
                });

                return retVal;

	  		}else{
	  			if(settings.debug)
	  				debug("wijmo not found");
	  		}

	  	}

	  	function destroy(containerList, container){
	  		var reconnectButton = container.find(".chat-status");
	  		statusClasses = settings.onlineClass + " " + settings.awayClass + " " + settings.busyClass + " " + settings.offlineClass;
	  		containerList.empty();
	  		var reconnect = function(e){
	  			reconnectButton.unbind('click', reconnect).addClass("chat-status loading-chat");
	  			e.preventDefault();
	  			$.xmpp.connect(connection_options);
	  		}
	  		reconnectButton.removeClass(statusClasses).removeClass("chat-status loading-chat").addClass("retry").click(reconnect);
	  		$(".chat-conversation-dialog textarea").attr("disabled", "disabled");

			// Destroy lista
			$("#messenger").html("");					

			// Refresh
			//window.location.href = unescape(window.location.pathname);
	  	}

		function debug( $obj ) {
		    if ( window.console && window.console.log ) {
		      window.console.log( $obj );
		    }
	  	};

	  	function formatters(text){
	  		var copy=text;

            if(settings.emotions){
                for(var i in settings.emotions){
                    copy = copy.replace(settings.emotions[i].emotion, "<span class='emotion "+settings.emotions[i].emotionClass+"'/>"); 
                }
            }
            	  		
	  		return copy;
	  	}

	  	return this.each(function() {
			if(settings.debug)
				debug(this);
	  	});
  	};




