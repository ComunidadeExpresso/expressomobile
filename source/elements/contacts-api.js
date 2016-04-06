
import Shared from 'shared';

/*

EXEMPLOS DE USO DA CONTACTSAPI

//SEARCH CONTACTS
contactsApi
.init()
.ignoreCache(true)
.contactType(2)
.search('Jair g')
.done(function(data) { })
.fail(function(error) {})
.getContacts();

//GET CONTACT BY ID
contactsApi
.init()
.ignoreCache(true)
.contactType(1)
.contactID(2109764)
.done(function(data) { })
.fail(function(error) { })
.getContacts();

//SAVE CONTACT
contactsApi
.init()
.contactName('Teste')
.addContactEmail('teste@teste.com')
.addContactPhone('41 2413-4212')
.done(function(data) { })
.fail(function(error) { })
.saveContact();




Motivo: Na nova versão do mobile para retornar a foto de um contato tendo apenas o email, ele realiza a requisição para trazer o contactID, e depois realiza uma requisição para trazer a foto do contato, alterando esse recurso, será possível diminuir a quantidade de requisições enviadas para o servidor.
Recurso: /Catalog/ContactPicture
Adicionar os parâmetros:
    - contactMail         Recebe um email, e faz uma busca no catálogo geral e retorna a foto do contato que possui o email. 


Motivo: Hoje o recurso apenas exclui um contato, porém na nova versão será possível excluir mais de um contato simultaneamente. 
É necessário alterar o recurso para que ele possa excluir mais do que um contato, e retornar em uma única informação se a operação foi concluída ou houve algum erro.
Recurso: /Catalog/ContactDelete
Adicionar os parâmetros:
    - contactID         Para receber uma lista de contactID separados por vírgula.


Motivo: Hoje o recurso apenas adiciona contato (insert), é preciso alterá-lo para que ele realize a opção de atualização do contato. 
Quando for informado o campo contactID, o recurso deverá realizar UPDATE, quando não for informado continuará fazendo o INSERT.
Recurso: /Catalog/ContactAdd
Adicionar os parâmetro:
    - contactID           Código do Contato (Informado quando for alterar um contato existente)

*/
var contactsApi = {

    _debug : false,
    _contactID: '',
    _contactType: 1,
    _ignoreCache: false,
    _search: '',
    _contactName: '',
    _contactEmails: [],
    _contactPhones: [],

    init: function() {
        this._contactID = '';
        this._contactType = 1;
        this._ignoreCache = false;
        this._debug =  false;
        this._search =  '';
        this._contactName = '';
        this._contactEmails = [];
        this._contactPhones = [];
        this._done = null;
        this._fail = null;
        return this;
    },

    execute: function() {
        return Shared.api.execute();
    },

    done: function(value) {
        this._done = value;
        return this;
    },

    fail: function(value) {
        this._fail = value;
        return this;
    },

    debug: function(value) {
        this._debug = value;
        return this;
    },

    ignoreCache: function(value) {
        this._ignoreCache = value;
        return this;
    },

    contactID: function(value) {
        this._contactID = value;
        return this;
    },

    contactName: function(value) {
        this._contactName = value;
        return this;
    },

    addContactEmail: function(value) {
        this._contactEmails.push(value);
        return this;
    },

    addContactPhone: function(value) {
        this._contactPhones.push(value);
        return this;
    },

    contactType: function(value) {
        this._contactType = value;
        return this;
    },

    search: function(value) {
        this._search = value;
        return this;
    },

    _getParamsSearch: function() {
        var params = {};

        if (this._contactID != '') {
            params = {
                contactType: this._contactType,
                contactID: this._contactID,
            }
        } else {
            var params = {
                search: this._search,
                contactType: this._contactType
            };
        }

        return params;
    },

    log: function(message) {
        if (this._debug) {
            console.log('contactsAPI: ' + message);
        }
    },

    warn: function(message) {
        if (this._debug) {
            console.warn('contactsAPI (ERROR): ' + message);
        }
    },


    getContacts: function() {

        var that = this;
        var params = this._getParamsSearch();
        Shared.api
        .resource('Catalog/Contacts')
        .params(params);

        var paramsString = JSON.stringify(params);

        Shared.api.ignoreCache(this._ignoreCache);

        Shared.api.done(function(result) {
            that.log('getContacts: ' + paramsString + ' - ' +  JSON.stringify(result));
            if (that._done) {
                that._done(result.contacts);
            } 
        }).fail(function(error) {
            that.warn('getContacts: ' + paramsString + ' - ' + JSON.stringify(error));
            if (that._fail) {
                that._fail(error);
            }  
        }).execute();

        return that;
    },

    saveContact: function(params) {
        var that = this;

        var params = {
            contactAlias: this._contactName,
            contactGivenName: this._contactName,
            contactFamilyName: '',
            contactEmail: this._contactEmails[0],
            contactPhone: this._contactPhones[0],      
        };

        Shared.api.ignoreCache(true);

        var paramsString = JSON.stringify(params);

        Shared.api
        .resource('Catalog/ContactAdd')
        .params(params)
        .done(function(result) {
            that.log('saveContact: ' + paramsString + ' - ' +  JSON.stringify(result));
            if (that._done)
                that._done(result);
        })
        .fail(function(error) {
            that.warn('saveContact: ' + paramsString + ' - ' + JSON.stringify(error));
            if (that._fail)
                that._fail(error);
        })
        .execute();

        return that;
    },

    deleteContact: function() {
        var that = this;

        var params = {
            contactID: this._contactID
        };

        var paramsString = JSON.stringify(params);

        Shared.api
        .resource('Catalog/ContactDelete')
        .params(params)
        .done(function(result) {
            that.log('deleteContact: ' + paramsString + ' - ' +  JSON.stringify(result));
            if (that._done)
                that._done(result);
        })
        .fail(function(error) {
            that.warn('deleteContact: ' + paramsString + JSON.stringify(error));
            if (that._fail)
                that._fail(error);
        })
        .execute();

        return that;
    },

    getContactImagePicture: function() {
        var that = this;

        var params = {
            contactID: that._contactID,
            contactType: '2'
        };
        var paramsString = JSON.stringify(params);

        Shared.api
        .resource('Catalog/ContactPicture')
        .params(params)
        .done(function(result) {
            that.log('getContactImagePicture: ' + paramsString + ' - ' +  JSON.stringify(result));
            if (that._done)
                that._done(result.contacts[0]["contactImagePicture"]);
        })
        .fail(function(error) {
            that.warn('getContactImagePicture: ' + paramsString + JSON.stringify(error));
            if (that._fail)
                that._fail(error);
        })
        .execute();
        return that;
    },

    
};

export default contactsApi;