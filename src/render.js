/**
 * ImageSnippets Gallery Block App
 *
 * name: render
 *
 *   This handles the frontend rendering of the imagesnippets galeries
 *
 * @param {*} attributes
 *   isGallery, 	 // Gallery Entity Label
 *   isUserid, 	  	 // ImageSnippets UserID
 * 	 displayCaption, // Display image caption
 * 	 displayTitle, 	 // Display gallery name
 *   alignment, 	 // Text alignment
 * 	 order,          // Query sort order
 *	 orderBy,        // Query orderBy field
 *	 limit, 		 // Number of images to display
 */

import isQuery from './query.js';

const galleryClass = '.wp-block-imagesnippets-is-gallery';
const galleries = document.querySelectorAll( galleryClass );

galleries.forEach( buildGallery );

function buildGallery( gallery ) {
	const attributes = {
		alignment: gallery.dataset.alignment,
		isGallery: gallery.dataset.gallery,
		isUserid: gallery.dataset.userid,
		displayCaption: gallery.dataset.caption,
		displayTitle: gallery.dataset.title,
		order: gallery.dataset.order,
		orderBy: gallery.dataset.orderby,
		limit: gallery.dataset.limit,
	};

	if ( attributes.isGallery.length > 0 ) {
		isQuery( attributes, gallery );
	}
}
