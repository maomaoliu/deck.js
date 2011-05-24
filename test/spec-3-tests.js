//SETTINGS, VARS, UTILITY FUNCTIONS
jasmine.getFixtures().fixturesPath = 'fixtures';
var defaults = $.pitchdeck.defaults;

// Go tests, go
describe('PitchDeck', function() {
	beforeEach(function() {
		loadFixtures('standard.html');
	});
	
	describe('init(selector)', function() {
		it('should create slides', function() {
			$.pitchdeck('.slide');
			expect($.pitchdeck('getSlides').length).toEqual($('.slide').length);
		});
	});
	
	describe('init([selectors])', function() {
		it('should create slides', function() {
			$.pitchdeck([
				'.slide1',
				'.slide2',
				'.slide3',
				'.slide4',
				'.slide5'
			]);
			expect($.pitchdeck('getSlides').length).toEqual($('.slide').length);
		});
	});
	
	describe('navigation functions', function() {
		beforeEach(function() {
			$.pitchdeck('.slide');
		});
		
		describe('go(i)', function() {
			it('should go to the i slide (0 based index)', function() {
				$.pitchdeck('go', 3);
				expect($.pitchdeck('getSlide')).toHaveClass('slide4');
			});
			
			it('should go nowhere if i is NaN', function() {
				$.pitchdeck('go', 'foobar');
				expect($.pitchdeck('getSlide')).toHaveClass('slide1');
			});
			
			it('should throw a range error if i is out of bounds', function() {
				$.pitchdeck('go', 5);
				expect($.pitchdeck('getSlide')).toHaveClass('slide1');
			});
		});

		describe('next()', function() {
			it('should go to the next slide', function() {
				$.pitchdeck('next');
				expect($.pitchdeck('getSlide')).toHaveClass('slide2');
			});
			
			it('should go nowhere if on the last slide', function() {
				$.pitchdeck('go', 4);
				$.pitchdeck('next');
				expect($.pitchdeck('getSlide')).toHaveClass('slide5');
			});
		});

		describe('prev()', function() {
			it('should go to the previous slide', function() {
				$.pitchdeck('go', 2);
				$.pitchdeck('prev');
				expect($.pitchdeck('getSlide')).toHaveClass('slide2');
			});
			
			it('should go nowhere if on the first slide', function() {
				$.pitchdeck('prev');
				expect($.pitchdeck('getSlide')).toHaveClass('slide1');
			});
		});
	});
	
	describe('getters', function() {
		beforeEach(function() {
			$.pitchdeck('.slide');
		});
		
		describe('getSlide()', function() {
			it('should get the current slide', function() {
				expect($.pitchdeck('getSlide')).toHaveClass('slide1');
				$.pitchdeck('go', 2);
				expect($.pitchdeck('getSlide')).toHaveClass('slide3');
			});
		});

		describe('getSlide(i)', function() {
			it('should get slide number i (0 based index)', function() {
				expect($.pitchdeck('getSlide', 1)).toHaveClass('slide2');
				expect($.pitchdeck('getSlide', 3)).toHaveClass('slide4');
			});
			
			it('should return null if i is NaN', function() {
				expect($.pitchdeck('getSlide', 'barfoo')).toBeNull();
			});
			
			it('should return null if i is out of bounds', function() {
				expect($.pitchdeck('getSlide', 6)).toBeNull();
			});
		});

		describe('getSlides()', function() {
			it('should return an array of jQuery objects for each slide', function() {
				var expectation = [
					$('.slide1'),
					$('.slide2'),
					$('.slide3'),
					$('.slide4'),
					$('.slide5')
				],
				slides = $.pitchdeck('getSlides');
				expect(slides).toEqual(expectation);
			});
		});
	});
	
	describe('menu functions', function() {
		beforeEach(function() {
			$.pitchdeck('.slide');
			$.pitchdeck('showMenu');
		});
		
		describe('showMenu()', function() {
			it('should remove the hidden class from the slide menu', function() {
				expect($(defaults.classes.menu)).not.toHaveClass(defaults.classes.hidden);
			});
		});

		describe('hideMenu()', function() {
			it('should add the hidden class to the slide menu', function() {
				$.pitchdeck('hideMenu');
				expect($(defaults.classes.menu)).toHaveClass(defaults.classes.hidden);
			});
		});
		
		describe('toggleMenu()', function() {
			it('should toggle the hidden class on the slide menu', function() {
				$.pitchdeck('toggleMenu');
				expect($(defaults.classes.menu)).toHaveClass(defaults.classes.hidden);
				$.pitchdeck('toggleMenu');
				expect($(defaults.classes.menu)).not.toHaveClass(defaults.classes.hidden);
			});
		});
	});

	describe('options object', function() {
		beforeEach(function() {
			$.pitchdeck('.slide', {
				classes: {
					after: 'alt-after',
					before: 'alt-before',
					container: 'alt-container',
					current: 'alt-current',
					hidden: 'alt-hidden',
					menu: 'alt-menu',
					next: 'alt-next',
					previous: 'alt-prev'
				},
				
				keys: {
					menu: 81,
					next: 87,
					previous: 69
				}
			});
		});
		
		describe('classes', function() {
			it('should use the specified after class', function() {
				expect($('.slide3, .slide4, .slide5')).toHaveClass('alt-after');
			});
			
			it('should use the specified before class', function() {
				$.pitchdeck('go', 4);
				expect($('.slide1, .slide2, .slide3')).toHaveClass('alt-before');
			});
			
			it('should use the specified current class', function() {
				expect($.pitchdeck('getSlide')).toHaveClass('alt-current');
			});
			
			it('should use the specified hidden class', function() {
				$.pitchdeck('showMenu');
				$.pitchdeck('hideMenu');
				expect($('.alt-menu')).toHaveClass('alt-hidden');
			});
			
			it('should use the specified menu class', function() {
				$.pitchdeck('showMenu');
				expect($('.alt-menu')).not.toHaveClass('alt-hidden');
			});
			
			it('should use the specified next class', function() {
				expect($('.slide2')).toHaveClass('alt-next');
			});
			
			it('should use the specified previous class', function() {
				$.pitchdeck('next');
				expect($('.slide1')).toHaveClass('alt-prev');
			});
		});
		
		describe('key bindings', function() {
			var e;
			
			beforeEach(function() {
				e = jQuery.Event('keydown');
			});
			
			it('should toggle the slide menu using the specified key', function() {
				e.which = 81; // 'q'
				$(document).trigger(e);
				expect($('.alt-menu')).not.toHaveClass('alt-hidden');
			});
			
			it('should go to the next slide using the specified key', function() {
				e.which = 87; // 'w'
				$(document).trigger(e);
				expect($.pitchdeck('getSlide')).toHaveClass('slide2');
			});
			
			it('should go to the previous slide using the specified key', function() {
				$.pitchdeck('next');
				e.which = 69; // 'e'
				$(document).trigger(e);
				expect($.pitchdeck('getSlide')).toHaveClass('slide1');
			});
		});
	});
	
	describe('events', function() {
		var $c = $('.pitchdeck-container');
		
		beforeEach(function() {
			$.pitchdeck('.slide');
			$.pitchdeck('go', 1);
			spyOnEvent($c, 'pitchdeck.change');
		});
		
		describe('pitchdeck.change', function() {
			it('should fire on go(i)', function() {
				$.pitchdeck('go', 3);
				expect('pitchdeck.change').toHaveBeenTriggeredOn($c);
			});
			
			it('should fire on next()', function() {
				$.pitchdeck('next');
				expect('pitchdeck.change').toHaveBeenTriggeredOn($c);
			});
			
			it('should fire on prev()', function() {
				$.pitchdeck('prev');
				expect('pitchdeck.change').toHaveBeenTriggeredOn($c);
			});
			
			it('should pass parameters with from and to indices', function() {
				$c.bind('pitchdeck.change', function(e, from, to) {
					expect(from).toEqual(1);
					expect(to).toEqual(3);
				});
				$.pitchdeck('go', 3);
			});
		});
	});
});