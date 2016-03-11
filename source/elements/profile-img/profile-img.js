
import Shared from 'shared';
import expressoAPI from 'expressoAPI';
import ContactsListCollection from 'ContactsListCollection';

Polymer({
    is: 'profile-img',

    properties: {
      selected: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      src: {
        type: String,
        value: null
      },

      autoLoad: {
        type: Boolean,
        value: false,
      },

      email: {
        type: String,
        value: '',
        notify: true,
        reflectToAttribute: true
      },

      letter: {
        type: String,
        value: ""
      }
    },

    attributeChanged: function(name, type) {

      if (this.autoLoad) {


        if (name == 'email') {
          //console.log(this.localName + '#' + this.id + ' attribute ' + name + ' was changed to ' + this.getAttribute(name));
          this.src = null;
          var currentEmail = this.getAttribute(name);
          var that = this;
          that.contactListCollection = new ContactsListCollection();

          var gShared = Shared;
          var hasPicture = Shared.getUserPicture(currentEmail);


          if (hasPicture == false) {

            that.whenDone = function(result) {
              var picSource = null;
              if (result != '') {
                picSource = 'data:image/gif;base64,' + result;
              }

              that.src = picSource;
              gShared.addUserPicture(currentEmail,picSource);
            }
            
            if (that.email != '') {
              that.src = null;
              that.contactListCollection.getContactImagePictureByEmail(currentEmail,that.whenDone);
            }

          } else {

            this.src = hasPicture;

          }
            
        }

      }
      
    },

 });