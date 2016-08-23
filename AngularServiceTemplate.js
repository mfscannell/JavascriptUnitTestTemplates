describe('Settings service', function () {
    'use strict';

    var expect = chai.expect;

    beforeEach(module('ngCookies'));
    beforeEach(module('ngRoute'));
    beforeEach(module('evo'));
    beforeEach(module('mobileTicket'));
    beforeEach(module('evo.mocks'));
    beforeEach(module('evo.mobileticket.services'));
    beforeEach(loadSub);
    beforeEach(module('evo.mocks'));
    beforeEach(module('evo.mobileticket.controllers'));

    var srvc, rootScope, scope, sandbox, evoApi, q, databaseViewOptions, evoUser, evoApiSpoof, deferred, http;

    beforeEach(inject(function ($injector, $rootScope, evoAPI, $q, evoUser) {
        http = $injector.get('$httpBackend');
        http.when('GET', 'admin').respond(401, '');
        http.when('GET', 'products').respond(401, '');
        http.when('GET', 'acceptance').respond(401, '');
        http.when('GET', 'comments').respond(401, '');
        http.when('GET', 'tabs').respond(401, '');
        http.when('GET', 'truckCode').respond(401, '');
        http.when('GET', 'information').respond(401, '');
        http.when('GET', 'assignment').respond(401, '');

        rootScope = $rootScope;
        q = $q;
        sandbox = sinon.sandbox.create();
        evoUser.context = {
            company: 'bcs2'
        };

        databaseViewOptions = {
            result: {
                barcode: {
                    show: true
                },
                driverRating: true,
                mixSpec: true,
                returnConcrete: true,
                slump: {
                    show: true
                }
            }
        };

        deferred = q.defer();
        evoApiSpoof = $injector.get('evoAPI');
        evoApiSpoof.callFunction = sandbox.stub().returns(deferred.promise);

        srvc = $injector.get('settingsSrvc');
    }));

    it('should exist', function () {
        expect(srvc).to.not.equal(null);
    });

    describe('allowTicketTimesOverride', function() {
        it('should return true when the database has allowTicketTimesOverride == true', function() {
            rootScope.isTicketAccepted = false;
            deferred.resolve(databaseViewOptions);

            srvc.getViewOptionsSetting('allowTicketTimesOverride').then(function(result) {
                expect(result).to.equal(true);
            });
            
            rootScope.$apply();
        });

        it('should return false when the database has allowTicketTimesOverride == false', function() {
            databaseViewOptions.result.allowTicketTimesOverride = false;
            deferred.resolve(databaseViewOptions);

            srvc.getViewOptionsSetting('allowTicketTimesOverride').then(function(result) {
                expect(result).to.equal(false);
              });
              
              rootScope.$apply();
        });

        it('should return true when the database has allowTicketTimesOverride == undefined', function() {
            databaseViewOptions.result.allowTicketTimesOverride = undefined;
            rootScope.isTicketAccepted = false;
            deferred.resolve(databaseViewOptions);

            srvc.getViewOptionsSetting('allowTicketTimesOverride').then(function(result) {
                expect(result).to.equal(true);
              });
              
              rootScope.$apply();
        });

        it('should return false when the the ticket is accepted', function() {
            databaseViewOptions.result.allowTicketTimesOverride = true;
            rootScope.isTicketAccepted = true;
            deferred.resolve(databaseViewOptions);

            srvc.getViewOptionsSetting('allowTicketTimesOverride').then(function(result) {
                expect(result).to.equal(false);
            });
            
            rootScope.$apply();
        });
    });

    afterEach(function () {
        sandbox.restore();
    });
});
