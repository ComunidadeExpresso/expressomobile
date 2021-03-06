import _ from 'underscore';
import Backbone from 'backbone';
import Shared from 'shared';
import ContextMenuModel from 'ContextMenuModel';

var ContextMenuCollection = Backbone.Collection.extend({

    model: ContextMenuModel,

    initialize: function(models, options) {
        this.api = Shared.api;
        this.model = ContextMenuModel;

    },

    createModelsFromArray: function(arrJson) {
        for (var i in arrJson) {
            var currentModel = new ContextMenuModel(arrJson[i]);
            this.add(currentModel);
        }
    },

    getMessagesListMenu: function(folderID, folderName, folderType, qtdMessages) {

        var menuItems = [];

        var newMessage = {
            route: "/Mail/Message/New",
            id: "1",
            title: "Nova Mensagem",
            iconClass: 'create',
            primary: true
        };
        var addFolder = {
            route: "/Mail/AddFolder/" + folderID + "",
            id: "2",
            iconClass: 'folder',
            title: "Adicionar Pasta"
        };
        var renameFolder = {
            route: "/Mail/RenameFolder/" + folderID + "",
            id: "3",
            iconClass: 'folder',
            title: "Renomear Pasta"
        };
        var deleteFolder = {
            route: "/Mail/DeleteFolder/" + folderID + "",
            id: "4",
            iconClass: 'delete',
            title: "Apagar Pasta"
        };

        var cleanTrash = {
            route: "/Mail/CleanTrash/" + folderID + "",
            id: "5",
            iconClass: 'delete',
            title: "Limpar Lixeira"
        };

        menuItems.push(newMessage);

        //ONLY CAN ADD SUBFOLDERS OR RENAME IF THE FOLDER TYPE IS 5 (PERSONAL FOLDER)
        if (folderType == 5) {
            menuItems.push(addFolder);
            menuItems.push(renameFolder);

            //CAN ONLY DELETE FOLDERS IF THE FOLDER HAS NO MESSAGES
            if (qtdMessages == 0) {
                menuItems.push(deleteFolder);
            }
        }

        if (folderType == 0) {
            menuItems.push(addFolder);
        }

        if (folderType == 3) {
            menuItems.push(cleanTrash);
        }

        this.createModelsFromArray(menuItems);
        return this;
    },

    getMailSignatureMenu: function() {
        var menuItems = [{
            route: "/Settings/SaveMailSignature",
            title: "Salvar",
            iconClass: 'save',
            primary: true
        }];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getChangePasswordMenu: function(params) {
        var menuItems = [{
                route: "#",
                id: "0",
                callBack: params.saveCallBack,
                parentCallBack: params.parentCallBack,
                title: "Salvar",
                primary: true
            }

        ];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getSupportMenu: function(params) {
        var menuItems = [{
            route: "#",
            id: "0",
            callBack: params.saveCallBack,
            parentCallBack: params.parentCallBack,
            title: "Enviar",
            primary: true
        }];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getEditFolderMenu: function(params) {
        var menuItems = [{
            route: "#",
            id: "0",
            callBack: params.saveCallBack,
            parentCallBack: params.parentCallBack,
            title: "Salvar",
            primary: true
        }];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getDetailMessageMenu: function(folderID, msgID, folderType, qtdMessages) {

        var menuItems = [];

        var newMessage = {
            route: "/Mail/Message/New",
            id: "0",
            title: "Nova Mensagem",
            iconClass: 'icons:create',
            primary: true
        };
        var replyMessage = {
            route: "/Mail/Message/ReplyMessage/" + msgID + "/" + folderID,
            id: "1",
            iconClass: 'icons:reply',
            title: "Responder"
        };
        var replyMessageToAll = {
            route: "/Mail/Message/ReplyToAll/" + msgID + "/" + folderID,
            id: "2",
            iconClass: 'icons:reply-all',
            title: "Responder p/ Todos"
        };
        var forwardMessage = {
            route: "/Mail/Message/Forward/" + msgID + "/" + folderID,
            id: "3",
            iconClass: 'icons:forward',
            title: "Encaminhar"
        };
        var deleteMessage = {
            route: "/Mail/Message/DelMessage/" + msgID + "/" + folderID,
            id: "4",
            iconClass: 'icons:delete',
            title: "Apagar Mensagem"
        };
        var addFolder = {
            route: "/Mail/AddFolder/" + folderID + "",
            id: "5",
            iconClass: 'icons:folder',
            title: "Adicionar Pasta"
        };
        var renameFolder = {
            route: "/Mail/RenameFolder/" + folderID + "",
            id: "6",
            iconClass: 'icons:folder-open',
            title: "Renomear Pasta"
        };
        var deleteFolder = {
            route: "/Mail/DeleteFolder/" + folderID + "",
            id: "7",
            iconClass: 'icons:delete',
            title: "Apagar Pasta"
        };
        var cleanTrash = {
            route: "/Mail/CleanTrash/" + folderID + "",
            id: "5",
            iconClass: 'icons:delete',
            title: "Limpar Lixeira"
        };

        menuItems.push(newMessage);

        if (msgID != 0) {
            menuItems.push(replyMessage);
            menuItems.push(replyMessageToAll);
            menuItems.push(forwardMessage);
            menuItems.push(deleteMessage);
        }

        //ONLY CAN ADD SUBFOLDERS OR RENAME IF THE FOLDER TYPE IS 5 (PERSONAL FOLDER)
        if (folderType == 5) {
            menuItems.push(addFolder);
            menuItems.push(renameFolder);

            //CAN ONLY DELETE FOLDERS IF THE FOLDER HAS NO MESSAGES
            if (qtdMessages == 0) {
                menuItems.push(deleteFolder);
            }
        }

        if (folderType == 0) {
            menuItems.push(addFolder);
        }

        if (folderType == 3) {
            menuItems.push(cleanTrash);
        }

        this.createModelsFromArray(menuItems);
        return this;
    },

    getSendMessageMenu: function(params) {
        var menuItems = [{
            route: "#",
            id: "0",
            callBack: params.sendCallBack,
            parentCallBack: params.parentCallBack,
            title: "Enviar",
            iconClass: 'send',
            primary: true
        }, {
            route: "#",
            id: "1",
            callBack: params.addCcBccCallBack,
            parentCallBack: params.parentCallBack,
            title: "Adicionar CC/BCC",
            iconClass: 'add-box',
            primary: false
        }];

        var takePicture = {
            route: "#",
            id: "3",
            callBack: params.takePictureCallBack,
            parentCallBack: params.parentCallBack,
            title: "Tirar Foto",
            iconClass: 'image:photo-camera',
            primary: false
        };
        var selectPicture = {
            route: "#",
            id: "4",
            callBack: params.selectPictureCallBack,
            parentCallBack: params.parentCallBack,
            title: "Escolher Foto",
            iconClass: 'image:photo-album',
            primary: false
        };
        var addAttachment = {
            route: "#",
            id: "5",
            callBack: params.selectAttachmentFileCallBack,
            parentCallBack: params.parentCallBack,
            title: "Adicionar Anexo",
            iconClass: 'image:photo-album',
            primary: false
        };

        if (Shared.isPhonegap()) {
            menuItems.push(takePicture);
            menuItems.push(selectPicture);
        } else {
            //if (!Shared.isDesktop()) {
            menuItems.push(addAttachment);
            //}
        }

        this.createModelsFromArray(menuItems);
        return this;
    },

    getSendMessageMenuWithCC: function(params) {
        var menuItems = [{
            route: "#",
            id: "0",
            callBack: params.sendCallBack,
            parentCallBack: params.parentCallBack,
            title: "Enviar",
            iconClass: 'send',
            primary: true
        }, {
            route: "#",
            id: "2",
            callBack: params.removeCcBccCallBack,
            parentCallBack: params.parentCallBack,
            title: "Remover CC/BCC",
            iconClass: 'clear',
            primary: false
        }];

        var takePicture = {
            route: "#",
            id: "3",
            callBack: params.takePictureCallBack,
            parentCallBack: params.parentCallBack,
            title: "Tirar Foto",
            iconClass: 'image:photo-camera',
            primary: false
        };
        var selectPicture = {
            route: "#",
            id: "4",
            callBack: params.selectPictureCallBack,
            parentCallBack: params.parentCallBack,
            title: "Escolher Foto",
            iconClass: 'image:photo-album',
            primary: false
        };
        var addAttachment = {
            route: "#",
            id: "5",
            callBack: params.selectAttachmentFileCallBack,
            parentCallBack: params.parentCallBack,
            title: "Adicionar Anexo",
            iconClass: 'image:photo-album',
            primary: false
        };

        if (Shared.api.phoneGap()) {
            menuItems.push(takePicture);
            menuItems.push(selectPicture);
        } else {
            menuItems.push(addAttachment);
        }

        this.createModelsFromArray(menuItems);
        return this;
    },

    getPrimaryAction: function() {
        var retVal = false;
        for (var i in this.models) {
            if (this.models[i].get('primary') == true) {
                retVal = this.models[i];
            }
        }
        return retVal;
    },

    getActionById: function(actID) {
        var retVal = false;
        for (var i in this.models) {
            if (this.models[i].get('id') == actID) {
                retVal = this.models[i];
            }
        }
        return retVal;
    },

    getGeneralContactsMenu: function() {
        var menuItems = [{
            route: "/Contacts/Personal",
            iconClass: 'btn-catalogo-pessoal',
            title: "Contatos Pessoais",
            primary: true
        }];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getPersonalContactsMenu: function() {
        var menuItems = [{
            route: "/Contacts/General",
            iconClass: 'btn-catalogo-geral',
            title: "Catálogo Geral",
            primary: true
        }];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getDetailsContactMenu: function(email, contactID, contactType) {

        var newMail = {
            route: "/Mail/Message/New/" + email,
            id: '0',
            title: "Nova Mensagem",
            iconClass: 'btn-compose',
            primary: true
        };
        var personalContacts = {
            route: "/Contacts/Personal",
            iconClass: 'context-catalogo-pessoal',
            id: '1',
            title: "Contatos Pessoais"
        };
        var generalContacts = {
            route: "/Contacts/General",
            iconClass: 'context-catalogo-geral',
            id: '2',
            title: "Catálogo Geral"
        };
        var addContactToPersonal = {
            route: "/Contacts/Add/" + contactID,
            id: "3",
            title: "Adicionar nos contatos pessoais",
            iconClass: 'icon-add-contact-personal'
        };
        var deletePersonalContact = {
            route: "/Contacts/Delete/" + contactID,
            id: "3",
            title: "Remover dos contatos pessoais",
            iconClass: 'icon-delete-contact-personal'
        };

        var menuItems = [];

        if (Shared.userHasModule("mail")) {
            menuItems.push(newMail);
        } else {
            addContactToPersonal.primary = true;
            addContactToPersonal.iconClass = 'btn-add-contact-personal';
            deletePersonalContact.primary = true;
            deletePersonalContact.iconClass = 'btn-delete-contact-personal';
        }

        if (contactType == 'General') {
            menuItems.push(personalContacts);

            menuItems.push(addContactToPersonal);
        } else {
            if (Shared.apiVersion != '1.0') {
                menuItems.push(generalContacts);
                menuItems.push(deletePersonalContact);
            }
        }

        // console.log(menuItems);

        this.createModelsFromArray(menuItems);
        return this;
    },

    getCalendarMenu: function(year, month, day) {

        var today = new Date();
        var pad = "00";

        if (year == '' || year == undefined)
            year = today.getFullYear();

        if (month == '' || month == undefined) {
            month = today.getMonth() + 1; // Months are zero based;
            month = pad.substring(0, pad.length - ("" + month).length) + ("" + month);
        }

        if (day == '' || day == undefined)
            day = today.getDate();

        var menuItems = [{
            route: "/Calendar/Events/Add/" + year + "/" + month + "/" + day,
            title: "Adicionar evento",
            iconClass: 'btn-add-event',
            primary: true
        }];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getCalendarAddEventMenu: function(params) {
        var menuItems = [
            // { route: "/Calendar/Events/Save", title:"Salvar", iconClass : '', primary: true},
            {
                route: "#",
                id: "0",
                callBack: params.saveCallBack,
                parentCallBack: params.parentCallBack,
                title: "Salvar",
                iconClass: 'btn-save-event',
                primary: true
            },
            // { route: "/Calendar/Events/AddParticipants", title:"Adicionar participantes", iconClass : '', primary: false}
            {
                route: "#",
                id: "1",
                callBack: params.addParticipantsCallBack,
                parentCallBack: params.parentCallBack,
                title: "Adicionar participantes",
                iconClass: 'icon-add-contact-agenda',
                primary: false,
                action: 'addParticipants'
            }
        ];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getCalendarDetailsEventMenu: function(isOwner, eventID, year, month, day) {
        var today = new Date();
        var pad = "00";

        if (year == '' || year == undefined)
            year = today.getFullYear();

        if (month == '' || month == undefined) {
            month = today.getMonth() + 1; // Months are zero based;
            month = pad.substring(0, pad.length - ("" + month).length) + ("" + month);
        }

        if (day == '' || day == undefined)
            day = today.getDate();

        var menuItems = [];

        if (isOwner) {
            menuItems.push({
                route: "/Calendar/Events/Edit/" + eventID,
                id: "1",
                title: "Editar evento",
                iconClass: 'btn-edit-event',
                primary: true
            });
            menuItems.push({
                route: "/Calendar/Events/Add/" + year + "/" + month + "/" + day,
                id: "0",
                title: "Adicionar evento",
                iconClass: '',
                primary: false,
                action: 'add',
                iconClass: 'icon-add-event'
            });
            menuItems.push({
                route: "/Calendar/Events/Delete/" + eventID + "/" + year + "/" + month + "/" + day,
                id: "2",
                title: "Excluir evento",
                iconClass: '',
                primary: false,
                action: 'delete',
                iconClass: 'icon-delete-event'
            });
        } else {
            menuItems.push({
                route: "/Calendar/Events/Add/" + year + "/" + month + "/" + day,
                id: "0",
                title: "Adicionar evento",
                iconClass: '',
                primary: true,
                action: 'add',
                iconClass: 'btn-add-event'
            });
        }

        this.createModelsFromArray(menuItems);

        return this;
    },

    getCalendarAddEventParticipantMenu: function(params) {
        var menuItems = [{
            route: "#",
            id: "0",
            callBack: params.saveCallBack,
            parentCallBack: params.parentCallBack,
            title: "Salvar",
            iconClass: 'btn-add-contact-agenda',
            primary: true
        }];

        this.createModelsFromArray(menuItems);
        return this;
    },

    getChatOfflineMenu: function(params) {
        var menuItems = [{
            id: "0",
            route: "/ChatReconnect",
            title: "Reconectar",
            iconClass: '',
            primary: true
        }, {
            id: "1",
            route: "/Settings/Support",
            title: "Suporte / Sugestões",
            iconClass: ''
        }];

        this.createModelsFromArray(menuItems);
        return this;
    }

});

export default ContextMenuCollection;