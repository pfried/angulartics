describe('Module: angulartics.google.analytics', function() {

    beforeEach(module('angulartics.google.analytics'));

    describe('Angulartics Google Analytics: ecommerce', function() {

        var angulartics;

        beforeEach(inject(function(_$analytics_) {
            angulartics = _$analytics_;
            window.ga = jasmine.createSpy();
        }));

        it('should track pagetracks', function() {
            angulartics.pageTrack('/my/url');
            expect(window.ga).toHaveBeenCalledWith('send', 'pageview', '/my/url');
        });

        it('should track "legacy" events', function() {
            angulartics.eventTrack('eventName', {
                category : 'category',
                label    : 'label',
                value    : 'value'
            });
            expect(window.ga).toHaveBeenCalledWith('send', 'event', 'category', 'eventName', 'label', 'value');
        });

        describe('Part: Ecommerce', function() {
            
            // it('should require the ecommerce.js extension', function () {
                // expect(window.ga).toHaveBeenCalledWith('require', 'ecommerce', 'ecommerce.js');
            // });

            it('should track adding transactions', function() {
                angulartics.eventTrack('ecommerce:addTransaction', {
                    id          : '1234',
                    affiliation : 'affiliation',
                    revenue     : '123.45',
                    shipping    : '6.7',
                    tax         : '19.00',
                    currency    : 'EUR'
                });
                expect(window.ga).toHaveBeenCalledWith('ecommerce:addTransaction', {
                    id : '1234',
                    affiliation : 'affiliation',
                    revenue     : '123.45',
                    shipping    : '6.7',
                    tax         : '19.00',
                    currency    : 'EUR'
                });
            });
            
            it('should track adding items', function () {
                angulartics.eventTrack('ecommerce:addItem', {
                    id       : '123',
                    name     : 'myproduct',
                    sku      : 'sku',
                    category : 'category',
                    price    : '456.78',
                    quantity : '500'
                });
                expect(window.ga).toHaveBeenCalledWith('ecommerce:addItem', {
                    id       : '123',
                    name     : 'myproduct',
                    sku      : 'sku',
                    category : 'category',
                    price    : '456.78',
                    quantity : '500',
                    currency : 'EUR'
                });
            });
            
            it('should send ecommerce tracks', function () {
                angulartics.eventTrack('ecommerce:send');
                expect(window.ga).toHaveBeenCalledWith('ecommerce:send');
            });
            
            it('should clear ecommerce tracks', function () {
                angulartics.eventTrack('ecommerce:clear');
                expect(window.ga).toHaveBeenCalledWith('ecommerce:clear');
            });
            
            it('should prefix actions with tracker id if given and require the needed ecommerce.js once', function() {
                angulartics.eventTrack('TrackerID:ecommerce:clear');
                
                expect(window.ga).toHaveBeenCalledWith('TrackerID.require', 'ecommerce', 'ecommerce.js');
                expect(window.ga).toHaveBeenCalledWith('TrackerID.ecommerce:clear');
                
                angulartics.eventTrack('TrackerID:ecommerce:clear');
                expect(window.ga.callCount).toBe(3);
            });
            
        });
    });
}); 