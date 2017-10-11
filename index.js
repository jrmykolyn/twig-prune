// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node

// Vendor

// Project
const { init } = require( './lib/main' );

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
/// TEMP - START
init( {
	entryDir: `${__dirname}/demo/public_html`,
	viewsDir: `${__dirname}/demo/public_html/views`,
} )
.then( ( data ) => {
	console.log( data );  /// TEMP
} )
.catch( ( err ) => {
	console.log( err ); /// TEMP
} );
/// TEMP - END

/// TODO[@jrmykolyn]: Expose module `init()` function.
