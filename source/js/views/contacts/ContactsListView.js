define([
	'jquery',
	'underscore',
	'backbone',
	'shared',
	'text!templates/master/primaryContentTemplate.html',
	'text!templates/master/detailContentTemplate.html',
	'text!templates/contacts/generalContactsListTemplate.html',
	'text!templates/contacts/personalContactsListTemplate.html',
	'collections/home/ContextMenuCollection',
	'views/contacts/PictureImageContactView',
	'views/home/LoadingView',
	'views/home/HomeView',
	'collections/contacts/ContactsListCollection',
	'material',
], function($, _, Backbone, Shared, primaryContentTemplate, detailContentTemplate, GeneralContactsListTemplate, PersonalContactsListTemplate, ContextMenuCollection, PictureImageContactView, LoadingView, HomeView, ContactsListCollection,Material)
{
	var ContactsListView = Backbone.View.extend(
	{
		searchLength: 0,
		secondViewName: '',
		status: null,
		currentView: null,
		arrayContacts: {},

		events: 
		{
			"keyup .personalContacts .searchField": "searchPersonalContacts",
			"keypress .generalContacts .searchField": "searchGeneralContacts" 
			//"click #contactsList a": "viewContact"
		},

		render: function()
		{
			this.$el.html(_.template(primaryContentTemplate));
			$('#content').empty().append(this.$el);

			Shared.setDefaultIMListeners();

			if (!Shared.isSmartPhoneResolution())
			{
				$('#contentDetail').html(_.template(detailContentTemplate));
				$('#contentDetail .searchArea').remove();
				// $('#contentDetailTitle').text('Exibir contato');
			}

			var loadingView = new LoadingView({el: $('#scroller')});	
				loadingView.render();

			if (this.secondViewName == 'General')
				this.listGeneralContacts('',false);
			else 
				this.listPersonalContacts('',false);
		},

		initialize: function() { },

		loaded: function () 
		{

			Material.upgradeDom();

			// var top = $('.topHeader').outerHeight(true);
			// var search = $('.searchArea').outerHeight(true) == null ? 0 : $('.searchArea').outerHeight(true);

			// $('#wrapper').css('top', top + search);

			// if (Shared.scroll != null) 
			// {
			// 	Shared.scroll.destroy();
			// 	Shared.scroll = null;
			// }

			// var that = this;

			// pullDownEl = document.getElementById('pullDown');
   //    		pullDownOffset = pullDownEl.offsetHeight;

			// Shared.scroll = new iScroll('wrapper',
		 //      {
		 //        useTransition: true,
		 //        topOffset: pullDownOffset,
		 //        onRefresh: function () 
		 //        {
		 //          if (pullDownEl.className.match('loading')) 
		 //          {
		 //            pullDownEl.className = '';
		 //            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Puxe para baixo para atualizar...';
		 //          }
		 //        },
		 //        onScrollMove: function () 
		 //        {
		 //          if (this.y > 5 && !pullDownEl.className.match('flip')) 
		 //          {
		 //            pullDownEl.className = 'flip';
		 //            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Solte para atualizar...';
		 //            this.minScrollY = 0;
		 //          } 
		 //          else if (this.y < 5 && pullDownEl.className.match('flip')) 
		 //          {
		 //            pullDownEl.className = '';
		 //            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Puxe para baixo para atualizar...';
		 //            this.minScrollY = -pullDownOffset;
		 //          } 
		 //        },
		 //        onScrollEnd: function () 
		 //        {
		 //          if (pullDownEl.className.match('flip')) 
		 //          {
		 //            pullDownEl.className = 'loading';
		 //            //pullDownEl.querySelector('.pullDownIcon').style = 'width: 0px; height; 0px;';
		 //            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Carregando...';
		 //            that.pullDownAction(); 
		 //          }
		 //        } 
		 //      });

			// Shared.scrollerRefresh();

			// if (this.secondViewName == 'General')
			// 	Shared.menuView.renderContextMenu('generalContacts', {});
			// else
			// 	Shared.menuView.renderContextMenu('personalContacts', {});
		},

		pullDownAction: function() 
		{
			//alert("loadContacts");
			// var loadingView = new LoadingView({el: $('#scroller')});	
			// 	loadingView.render();

			if (this.secondViewName == 'General')
				this.listGeneralContacts($('.searchField').val(),true);
			else 
				this.listPersonalContacts($('.searchField').val(),true);
		},

		searchPersonalContacts: function (e)
		{
			this.searchContacts(e, $('.searchField').val(), '1');
		},

		searchGeneralContacts: function (e)
		{
			if (e.keyCode == 13)
				this.searchContacts(e, $('.searchField').val(), '2');
		},

		searchContacts: function (e, pSearch, pContactType)
		{
			var search = $('.searchField').val();
			var pSearch = '';

			// Define o parâmetro da busca
			if (search.length >= 3)
				pSearch  = search;
			else
				pSearch = '';
			
			// Define se precisa fazer a busca ou não
			if (pSearch.length >= 3 || this.searchLength >=3)
			{
				var loadingView = new LoadingView({el: $('#scroller')});
				loadingView.render();

				if (pContactType == '1')
					this.listPersonalContacts(pSearch,true);
				else
					this.listGeneralContacts(this.removeAccents(pSearch),true);
			}

			this.searchLength = search.length
		},

		listPersonalContacts: function (pSearch,ignoreCache)
		{
			var self = this;

			Shared.setCurrentPageTitle('Contatos Pessoais');
			$('#contentTitle').text('Contatos Pessoais');
			$('#contentTitle').addClass("icon-contacts");
			$('.searchArea').removeClass('generalContacts');
			$('.searchArea').addClass('personalContacts');
			
			var donePersonalContacts = function (data)
			{
		        Shared.menuView.renderContextMenu(0,[]); 
				if (self.secondViewName == 'General')
					Shared.menuView.renderContextMenu('generalContacts', {});
				else
					Shared.menuView.renderContextMenu('personalContacts', {});

				if (data.error == undefined) 
				{
					if (data.contacts.length > 0) 
					{
						$('#message').empty();
						$('#scroller').empty().append(_.template(PersonalContactsListTemplate, data));

						

						self.openFirstContact(data.contacts[0].get('contactID'), data.contacts[0].get('contactID'), 'Personal');
					} 
					else 
					{
						Shared.showMessage({
				            type: "error",
				            icon: 'icon-contacts',
				            title: "Nenhum Resultado Encontrado.",
				            route: "",
				            description: "",
				            timeout: 0,
				            animate: false,
				            elementID: "#message",
				        });

				        $('#scroller').empty()
					}
				} 
				else 
				{
					$('#scroller').empty()
					Shared.handleErrors(data.error);					
				}

				self.setElement(self.$el);
				self.loaded();



				var pictureImageContactView = new PictureImageContactView({el: $('.picture_image')});
				pictureImageContactView.render(data);
			};

			this.listContacts(pSearch, '1', ignoreCache, donePersonalContacts, donePersonalContacts);
		},

		listGeneralContacts: function (pSearch,ignoreCache)
		{
			var self = this;

			this.personalContact = false;

			Shared.setCurrentPageTitle('Catálogo Geral');
			
			$('#contentTitle').text('Catálogo Geral');
			$('#contentTitle').addClass("icon-contacts");
			$('.searchArea').removeClass('personalContacts');
			$('.searchArea').addClass('generalContacts');

			var doneGeneralContacts = function (data)
			{
				if (self.secondViewName == 'General')
					Shared.menuView.renderContextMenu('generalContacts', {});
				else
					Shared.menuView.renderContextMenu('personalContacts', {});
				
				if (data.error == undefined) 
				{
					$('#message').empty();
					$('#scroller').empty().append(_.template(GeneralContactsListTemplate, data));

					if (data.contacts.length > 0) 
						self.openFirstContact(data.contacts[0].get('contactUIDNumber'), data.contacts[0].get('contactID'), 'General');
				} 
				else 
				{
					if (data.error.code == "1001") 
					{
						Shared.showMessage({
							type: "chat-message",
							icon: 'icon-contacts',
							title: "Sua busca deve ser específica.",
							route: "",
							description: "Procure pelo nome e sobrenome.<br>Nenhum resultado será exibido caso a sua busca retorne mais do que 200 contatos.",
							timeout: 0,
							animate: false,
							elementID: "#message",
						});
			        }

			        if (data.error.code == "1019") 
			        {
						Shared.showMessage({
							type: "error",
							icon: 'icon-contacts',
							title: "Nenhum Resultado Encontrado.",
							route: "",
							description: "Procure pelo nome e sobrenome.<br>Nenhum resultado será exibido caso a sua busca retorne mais do que 200 contatos.",
							timeout: 0,
							animate: false,
							elementID: "#message",
						});
			        }

			        $('#scroller').empty();

			        $("#scroller").append('<div id="pullDown"><span class="pullDownIcon"></span><span class="pullDownLabel"></span></div>');
				}

				self.setElement(self.$el);
				self.loaded();

				var pictureImageContactView = new PictureImageContactView({el: $('.picture_image')});
				pictureImageContactView.render(data);
			};

			this.listContacts(pSearch, '2', ignoreCache, doneGeneralContacts, doneGeneralContacts);
		},

		listContacts: function (pSearch, ptype, ignoreCache, callbackSuccess, callbackFail)
		{
			var contactsData = new ContactsListCollection();
				contactsData.done(function (data) 
				{
					this.arrayContacts = { contacts: data.models, search: pSearch, _: _ };

					callbackSuccess(this.arrayContacts);
				})
				.fail(function (data) 
				{
					callbackFail({ error: data.error, _: _ });
				}).getContacts(pSearch, ptype,ignoreCache);
		},

		viewContact: function(e)
		{
			e.preventDefault();

			$('#contactsList ul li').removeAttr('class');
			$(e.target).parents('li').addClass('selected');

			Shared.router.navigate(e.currentTarget.getAttribute("href"),{trigger: true});
		},

		openFirstContact: function (contactUIDNumber, contactID, contactType)
		{
			if (!Shared.isSmartPhoneResolution())
			{
				if (parseInt(contactID) != NaN && parseInt(contactID) % 1 == 0)
					id = contactID;
				else
				{
					// id = contactID;
					contactID = decodeURIComponent(contactID);
					var queryUID = contactID.split(",")[0]; 
					var uid = queryUID.split("=");
					id = uid[1].replace(".", "___");
				}

				$('#contactsList ul li').removeAttr('class');
				$('#contact_row_' + id).addClass('selected');

				if (this.status != null)
					Shared.router.navigate('/Contacts/' + contactType + '/' + contactUIDNumber + '/OK', {trigger: true});
				else
					Shared.router.navigate('/Contacts/' + contactType + '/' + contactUIDNumber, {trigger: true});
			}
		},

		removeAccents: function(strAccents) 
		{
			var strAccents = strAccents.split('');
			var strAccentsOut = new Array();
			var strAccentsLen = strAccents.length;
			var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
			var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";

			for (var y = 0; y < strAccentsLen; y++) 
			{
				if (accents.indexOf(strAccents[y]) != -1) 
					strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
				else
					strAccentsOut[y] = strAccents[y];
			}

			strAccentsOut = strAccentsOut.join('');

			return strAccentsOut;
        },
	});

	return ContactsListView;
});