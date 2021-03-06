'use strict';
/*global jQuery, BMBF*/
(function($, document, window, undefined) {
	var _private;
	var movie = $('section#movie');
	var gwiid = movie.data('gwi-id');
	var gowatchit = $('.gowatchit');
	var movieTitle = movie.data('title');
	var amazonId = 'bemobyfa09-20';
	var services = {};
	var serviceNames = [];
	var preferredServices = ['netflix', 'youtube', 'redbox', 'googleplay', 'itunes', 'amazon', 'hulu'];
	var numServicesToShow = 3;

	_private = {
		bind: function() {
			$(document).on('click', '.gw-service', function() {
				var service = $(this).data('service');
				BMBF.libs.tracking.track('link', 'click', 'GoWatchIt-' + service);
			});
		},

		setupGoWatchIt: function() {
			if(movie.length === 0) {
				// not on a movie page hack
				return;
			}

			if(movie.length > 0 && gwiid) {
				//var gwiUrl = "https://api.gowatchit.com/api/v2/movies/"+gwiid+"/availabilities?api_key=" + "c053d5c31fcc562e8106f35d&callback=?"
				var gwiUrl = '//bmbf-cms.herokuapp.com/gwi?gwiid=' + gwiid;

				$.get(gwiUrl, function(data) {
					if((typeof data.movie !== 'undefined' || data.movie !== null)) {
						if(!data.movie.available) {
							_private.goWatchItNotFound();
							return;
						}
						
						if(typeof data.movie.onlines !== 'undefined') {
							if(data.movie.onlines !== null) {
								$.each(data.movie.onlines, function(key, value) {
									_private.addService(value);
								});
							}
						}

						if(typeof data.movie.dvds !== 'undefined') {
							if(data.movie.dvds !== null) {
								$.each(data.movie.dvds, function(key, value) {
									_private.addService(value);
								});
							}
						}

						if(!$.isEmptyObject(services)) {
							// render list
							_private.renderMarkup();
						} else {
							// no online or dvd versions available
							_private.goWatchItNotFound();
						}
					} else {
						// no movie available at all
						_private.goWatchItNotFound();
					}
				}).fail(function() {
					// service error
					_private.goWatchItNotFound();
				});
			} else {
				// no gwiid found
				_private.goWatchItNotFound();
			}
		},

		renderMarkup: function() {
			var j = 0;
			var markup = '';
			var moreMarkup = '<li><a class="more-services-trigger" data-dropdown="more-services" aria-controls="more-services" aria-expanded="false">More <i class="bmbf bmbf-caret-down"></i></a>';
			moreMarkup += '<ul id="more-services" data-dropdown-content class="f-dropdown content gowatchit-dd" aria-hidden="true" tabindex="-1">';

			// sort by preferred services first
			serviceNames.sort(function(a, b) {
				var x = $.inArray(b, preferredServices), y = $.inArray(a, preferredServices);
				return x < y ? -1 : x > y ? 1 : 0;
			});

			// build markup
			for(var i=0; i<serviceNames.length; i++) {
				var serviceName = serviceNames[i];
				if(services.hasOwnProperty(serviceName) ) {
					var service = services[serviceName];
					if(j < numServicesToShow) {
						markup += '<li><a href="'+service.watch_now+'" title="'+service.name+'" class="gw-service" data-service="'+serviceName+'"><i class="bmbf bmbf-gw-'+serviceName+' bmbf-4x-half"></i></a></li>';
						j++;
					} else {
						moreMarkup += '<li><a href="'+service.watch_now+'" title="'+service.name+'" class="gw-service" data-service="'+serviceName+'"><i class="bmbf bmbf-gw-'+serviceName+' bmbf-4x-half"></i></a></li>';
					}
				}
			}

			// render it
			gowatchit.html(markup);

			// if we have to show moreMarkup render it
			if(serviceNames.length > numServicesToShow) {
				moreMarkup += '</ul></li>';
				gowatchit.append(moreMarkup);
				$(document).foundation('dropdown', 'reflow');
				moreMarkup = null;
			}
		},

		addService: function(service) {
			var serviceName = service.name.toLowerCase().replace(/\s+/g, '');

			if(services[serviceName] === undefined) {
				services[serviceName] = service;
				serviceNames.push(serviceName);
			}
		},

		goWatchItNotFound: function() {
			BMBF.libs.tracking.track('link', 'click', 'NO GoWatchIt- ' + window.location);

			// at the very least provide a link to an Amazon search result if nothing is found(yes even on amazon from GW)
			var amazonURI = 'http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=dvd&keywords='+encodeURIComponent(movieTitle)+'&linkCode=ur2&tag='+amazonId;//+'&linkId=OPSO2DBSGMFPHDYH';
			var markup = '<li><a href="'+amazonURI+'" title="'+movieTitle+'"><i class="bmbf bmbf-5x bmbf-gw-amazon"></i></a></li>';

			gowatchit.html(markup);
		},

		setupLoggedInDOM: function() {
			if(BMBF.user.isLoggedIn) {
				movie.find('.th-wrap').prepend('<div class="add-watch-overlay-fixed has-tip round" data-tooltip aria-haspopup="true" title="Click to add this movie to your Watch List."><i class="bmbf bmbf-plus bmbf-2x"></i></div>');
				$(document).foundation('tooltip');

				if(BMBF.user.watchList.indexOf(movie.data('id')) > -1) {
					var overlay = movie.find('.add-watch-overlay-fixed');
					overlay.addClass('active').append(' <span>Added to Watch List</span>');
					BMBF.utils.updateTooltip(overlay, 'Click to remove this movie from your Watch List.');
				}
			}
		}
	};

	BMBF.libs.movie = {
		init: function() {
			_private.bind();
			_private.setupLoggedInDOM();
			_private.setupGoWatchIt();
		}
	};

	return BMBF.libs.movie;
})(jQuery, document, window);