// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const fs = require( 'fs' );

// Vendor
const { ncp } = require( 'ncp' );
const del = require( 'del' );

// Project
const twigPrune = require( '../' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------

// --------------------------------------------------
// INIT
// --------------------------------------------------
/// TODO[@jrmykolyn]: Refactor into Promise chain if possible.
ncp( './bak/public_html/', './public_html/', ( err ) => {
	if ( err ) {
		return console.error( err );
	}

	twigPrune( {
		entryDir: `${__dirname}/public_html`,
		viewsDir: `${__dirname}/public_html/views`,
		force: true,
	} )
	.then( ( data ) => {
		del( `${__dirname}/public_html` );
	} )
	.catch( ( err ) => {
		del( `${__dirname}/public_html` );
	} );
} );
