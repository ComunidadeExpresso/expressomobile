define([
  'jquery',
  'underscore',
  'backbone',
  'shared',
  'templates/settings/settingsSupportListTemplate.html!text'
], function($, _, Backbone, Shared, settingsSupportListTemplate){

  var SettingsSupportListView = Backbone.View.extend({

    el: $("#content"),

    render: function(){

      var newData = {
        _: _ 
      };

      var htmlTemplate = _.template(settingsSupportListTemplate);
      var compiledTemplate = htmlTemplate(newData);

      this.$el.html( compiledTemplate ); 


      //Shared.setCurrentPageTitle("Suporte / Sugestões");

      Shared.menuView.renderContextMenu('support',{saveCallBack: this.SendSupportFeedback, parentCallback: this});

    },

    SendSupportFeedback: function()
    {

      var sugestao = $("#sugestao").val();

      if (sugestao == "") { 

        Shared.showMessage({
          type: "error",
          icon: 'icon-settings',
          title: "Por favor, escreva sua sugestão!",
          description: "",
          elementID: "#pageMessage",
        });

      } else {

        var headerString = "Mensagem enviada pelo Expresso Mobile: ";

        var deviceString = "";
        var resolutionString = "";

        if (Shared.isPhonegap()) {
          deviceString = deviceString + "Phonegap,";
        }
        if (Shared.isAndroid()) {
          deviceString = deviceString + "Android";
        }
        if (Shared.isIDevice()) {
          deviceString = deviceString + "iOS";
        }

        if (Shared.isDesktop()) {
          resolutionString = resolutionString + "Desktop,";
        }
        if (Shared.isTabletResolution()) {
          resolutionString = resolutionString + "Tablet";
        } else {
          if (Shared.isSmartPhoneResolution()) {
            resolutionString = resolutionString + "SmartPhone";
          }
        }

        headerString = headerString + resolutionString + " - "+ deviceString + "<br><br>";

        sugestao = headerString + sugestao;

        Shared.api
        .resource('Mail/SendSupportFeedback')
        .params({message: sugestao})
        .done(function(result){

          Shared.showMessage({
            type: "success",
            icon: 'icon-settings',
            title: "Sua Sugestão foi enviada com sucesso!",
            description: "",
            elementID: "#pageMessage",
          });

          Shared.router.navigate("/Settings",{trigger: true});
          
        })
        .fail(function(error){

          Shared.handleErrors(error);
          
          return false;
        })
        .execute();

      }
      
    }

  });

  return SettingsSupportListView;
  
});
