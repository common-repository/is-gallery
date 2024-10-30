/**
 * ImageSnippets Gallery Block App
 *
 * name: query
 *
 *   Creates a sparql query string to retrieve the ImageSnippets gallery details
 *   then builds the gallery html elements to dynamically render the gallery.
 *   This script is used for frontend and backend rendering.
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
 * @param {*} gallery
 *   gallery is a gallery object or a gallery id string
 */

/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';

export default function isQuery( attributes, gallery ) {
	const {
		isGallery, // Gallery Entity Label
		isUserid, // ImageSnippets UserID
		displayCaption, // Display image caption
		displayTitle, // Display gallery name
		alignment, // Text alignment
		order, // Query sort order
		orderBy, // Query orderBy field
		limit, // Number of images to display
	} = attributes;

	const d3 = require( 'd3-sparql' );
	// const fetch = require('isomorphic-fetch');

	const dataUrl = 'https://imagesnippets.com/sparql/dbpedia';
	let creator = '';

	if ( isUserid ) {
		creator =
			`  ?graph dcterms:creator <https://imagesnippets.com/imgtag/users/` +
			isUserid +
			`>.`;
	}

	const sparqlQuery =
		`
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX lio: <https://w3id.org/lio/v1#>
    PREFIX schema: <http://schema.org/>
    PREFIX photoshop: <http://ns.adobe.com/photoshop/1.0/>
    PREFIX Iptc4xmpCore: <http://www.iptc.org/std/Iptc4xmpCore/1.0/xmlns/>
	PREFIX plus: <http://ns.useplus.org/ldf/xmp/1.0/>
	PREFIX xmpRights: <http://ns.adobe.com/xap/1.0/rights/>

    SELECT * where { graph ?page {
      ?image lio:isIn <https://imagesnippets.com/imgtag/datasets/Imagesnippets/` +
		isGallery +
		`>.
      ?image schema:thumbnail ?thumb.
      optional { ?image dc:title ?title. }
      optional { ?image dc:creator ?creator. }
      optional { ?image dc:rights ?rights. }
      optional { ?image photoshop:DateCreated ?date. }
      optional { ?image Iptc4xmpCore:AltTextAccessibility ?alt. }
      optional { ?image plus:LicensorURL ?url. }
      optional { ?image xmpRights:WebStatement ?web. }
    ` +
		creator +
		` }} order by ` +
		order +
		`(?` +
		orderBy +
		`) limit ` +
		limit;

	// console.log(sparqlQuery);

	let key = 0; // the element key value
	const elements = [];

	d3.sparql( dataUrl, sparqlQuery ).then( function ( data ) {
		const images = [];
		let blockid = gallery;

		if ( typeof gallery === 'string' ) {
			blockid = document.getElementById( gallery );
		}

		// console.log(displayTitle);
		if ( displayTitle == 1 ) {
			elements.push(
				wp.element.createElement(
					'p',
					{
						className: 'title',
						key: key++,
						style: { textAlign: alignment },
					},
					isGallery
				)
			);
		}

		data.forEach( ( row ) => {
			images.push( displayImage( row, displayCaption, key++ ) );
		} );

		if ( data.length ) {
			elements.push(
				wp.element.createElement(
					'div',
					{ id: isGallery, className: 'flex-container', key: key++ },
					images
				)
			);
		} else {
			const msg = isGallery
				? isGallery + __( ' - No Images Available -', 'is-gallery' )
				: __( 'Enter a Gallery Name', 'is-gallery' );

			elements.push(
				wp.element.createElement(
					'p',
					{
						className: 'header',
						key: key++,
						style: { textAlign: alignment },
					},
					msg
				)
			);
		}

		const msg =
			isUserid && data.length > 0
				? __( 'Images ', 'is-gallery' ) + data[ 0 ].rights
				: null;

		elements.push(
			wp.element.createElement(
				'p',
				{
					className: 'footer',
					key: key++,
					style: { textAlign: alignment },
				},
				msg
			)
		);

		wp.element.render( elements, blockid );
	} );
}
// end of isQuery function

/**
 * Parse ImageSnippets query results
 *
 * @param {*} row
 * @param {*} displayCaption
 * @param {*} key
 * @returns
 *
 * imageObject = <div vocab="https://schema.org/" typeof="ImageObject">{figure}</div>
 *   figure = (<figure className="gallery">{href} {caption}</figure>
 *     href = <a href={row.page}>{image}</a>;
 *     image = <img src={row.thumb} alt={row.title} />;
 *     <span property="license"> {row.web} </span>
 *     <span property="acquireLicensePage"> {row.url} </span>
 *   caption = <figcaption className="desc" property="name"> {row.title} </figcaption>;
 *
 * row is the query results
 * key is a unique identifier for each element
 * displayCaption includes the image title as a caption (optional)
 */

function displayImage( row, displayCaption, key ) {
	const figElements = [];

	let src = row.thumb;
	let page = row.page;
	let cap = row.title;
	let text = row.alt;
	let web = row.web;
	let url = row.url;

	let img = wp.element.createElement( 'img', {
		key: key++,
		src: src,
		alt: text,
		property: 'contentUrl',
	} );

	figElements.push(
		wp.element.createElement( 'a', { key: key++, href: page }, img )
	);
	figElements.push(
		wp.element.createElement(
			'span',
			{ key: key++, property: 'license', hidden: 'hidden' },
			web
		)
	);
	figElements.push(
		wp.element.createElement(
			'span',
			{ key: key++, property: 'acquireLicensePage', hidden: 'hidden' },
			url
		)
	);

	if ( displayCaption == 1 ) {
		figElements.push(
			wp.element.createElement(
				'figcaption',
				{ key: key++, className: 'desc', property: 'name' },
				cap
			)
		);
	}

	let figure = wp.element.createElement(
		'figure',
		{ key: key++, className: 'gallery' },
		figElements
	);

	let imageObject = wp.element.createElement(
		'div',
		{ key: key++, vocab: 'https://schema.org/', typeof: 'ImageObject' },
		figure
	);

	return [ imageObject ];
} // end of displayImage
