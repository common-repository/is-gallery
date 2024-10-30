/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */

import {
	InspectorControls,
	InspectorAdvancedControls,
	useBlockProps,
	AlignmentToolbar,
	BlockControls,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	PanelBody,
	QueryControls,
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * load the backend gallery rendering script
 * The frontend rendering script is registered in the php file
 */
import isGalleryView from './block';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

export default function Edit( { attributes, isSelected, setAttributes } ) {
	const {
		isGallery, // Gallery Entity Label
		isUserid, // ImageSnippets UserID
		displayCaption, // Display image name
		displayTitle, // Display gallery name
		alignment, // Text alignment
		order, // Query sort order
		orderBy, // Query orderby field
		limit, // Number of images to display
	} = attributes;

	const regex = /[^\w^@^-^.]|[\^]/g; // limit the values for user input
	const blockProps = useBlockProps();
	setAttributes( { style: blockProps[ 'className' ] } );
	// console.log(attributes);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<TextControl
						label="Gallery Name"
						help="ImageSnippets entity label"
						value={ isGallery }
						onChange={ ( newValue ) =>
							setAttributes( {
								isGallery: newValue.replace( regex, '' ),
							} )
						}
					/>
					<ToggleControl
						label="Display Caption"
						checked={ displayCaption }
						onChange={ ( newValue ) =>
							setAttributes( { displayCaption: newValue } )
						}
					/>
					<ToggleControl
						label="Display Title"
						checked={ displayTitle }
						onChange={ ( newValue ) =>
							setAttributes( { displayTitle: newValue } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label="User ID"
					help="ImageSnippets user ID"
					value={ isUserid }
					onChange={ ( newValue ) =>
						setAttributes( {
							isUserid: newValue.replace( regex, '' ),
						} )
					}
				/>
				<QueryControls
					{ ...{ order, orderBy } }
					numberOfItems={ limit }
					onOrderChange={ ( newValue ) =>
						setAttributes( { order: newValue } )
					}
					onOrderByChange={ ( newValue ) =>
						setAttributes( { orderBy: newValue } )
					}
					onNumberOfItemsChange={ ( newValue ) =>
						setAttributes( { limit: newValue } )
					}
				/>
			</InspectorAdvancedControls>

			<BlockControls>
				<AlignmentToolbar
					value={ alignment }
					onChange={ ( newValue ) =>
						setAttributes( {
							alignment:
								newValue === undefined ? 'none' : newValue,
						} )
					}
				/>
			</BlockControls>

			<div { ...blockProps }>
				{ isGalleryView( { attributes, isSelected } ) }
			</div>
		</>
	);
}
