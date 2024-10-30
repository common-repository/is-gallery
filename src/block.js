/**
 * ImageSnippets Gallery Block App
 *
 * name: block
 *
 *   This handles the backend rendering of the imagesnippets gallery
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
 *
 * @param {*} isSelected
 *   isSelected controls the rendering, do not render when editing the block
 *
 * @returns
 *   html elements
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import isQuery from './query.js';

export default function isGalleryView( { attributes, isSelected } ) {
	const blockProps = useBlockProps();
	const gallery = 'gallery-' + blockProps[ 'data-block' ];

	const element = wp.element.createElement(
		'p',
		{
			id: gallery,
			key: '0',
			className: 'header',
		},
		__( 'Enter an ImageSnippets Gallery name', 'is-gallery' )
	);

	if ( ! isSelected ) {
		isQuery( attributes, gallery );
	}

	return element;
}
