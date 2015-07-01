define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'text!templates/home/windowTemplate.html',
  'wijmo',
  'wijdialog'
], function($, _, Backbone, Shared, windowTemplate,wijmo, wijdialog){

	var Popup = Backbone.View.extend({
		tagName: 'div',
		render: function () {
			var view = this;
			var template = _.template(windowTemplate, {});
			this.$el.html(template);
			$('body').append(this.el);
			var title = 'janela';

			var col = Shared.Popups.create({handle:this.$el,title:title});

			this.$el.wijdialog({
				autoOpen: true,
				title: "janela 1",
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
				position: [100,100],
				buttons: [
					{
						text: "editar" , 
						click: function(){
							
							$(this).wijdialog("destroy");	
						}
					},
					{
						text: "cancelar", 
						click: function(){
							$(this).wijdialog("destroy");
						}	
					}
				],
				close: function(){
					$(this).wijdialog ("destroy");
				}
			});

			
			// this.$el.dialog({
			// 	autoOpen: true,
			// 	title: title,
	  //     		position: { my: ("center+"+(Shared.Popups.length*10) + " top+"+(Shared.Popups.length*10)), at: "center top" },
			// 	close: function (event, ui) {
			// 		$(this).dialog('destroy').remove();
			// 		view.remove();
			// 		col.destroy();
			// 	}
			// });
		}
	});


  return Popup;
  
});

