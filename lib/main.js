// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const fs = require( 'fs' );

// Vendor
const del = require( 'del' );
const recursive = require( 'recursive-readdir' );

// Project

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
let allTemplates = {};
let referencedTemplates = {};
let unreferencedTemplates = {};

let twigPattern = /[\/\\.a-z0-9\-]*\.twig/gmi; /// TODO[@jrmykolyn]: Ensure that pattern includes all valid file name chars.

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * Entrypoint into 'twig prune' functionality.
 *
 * @param {Object} args.
 * @return {Promise}
 */
async function init( args ) {
	return new Promise( async ( resolve, reject ) => {
		try {
			// Scan 'entry' directory for PHP files.
			var rootDirFiles = fs.readdirSync( args.entryDir )
				.filter( ( file ) => {
					return file.includes( '.php' );
				} );

			// Check each 'entry' file for Twig refs.
			// NOTE:
			// - Process adds any Twig files to 'referencedTemplates' object.
			rootDirFiles.forEach( ( file ) => {
				let filePath = `${args.entryDir}/${file}`;

				checkTwigFile( filePath, args.viewsDir );
			} );

			// Return list of all Twig files within 'entry' dir.
			// NOTE:
			// - Function recursively scans child dirs.
			let filesArr = await scanEntryDir( args );

			// Loop over ALL Twig files.
			// If a given file has not been referenced, add it to the 'unreferencedTemplates' object.
			filesArr.forEach( ( file ) => {
				if ( !referencedTemplates[ file ] ) {
					unreferencedTemplates[ file ] = `${args.viewsDir}/${file}`;
				}

				allTemplates[ file ] = true;
			} );

			// Delete files or prompt user to reinvoke with `force` arg.
			if ( args.f === true  || args.force === true ) {
				del.sync( Object.keys( unreferencedTemplates ).map( ( key ) => { return unreferencedTemplates[ key ] } ) );
				console.log( 'The following Twig files have been removed.' );
				console.log( Object.keys( unreferencedTemplates ).join( '\n' ) );
			} else {
				console.log( 'To remove the following Twig files, invoke `twigPrune()` with the `force` argument set to `true`.' );
				console.log( Object.keys( unreferencedTemplates ).join( '\n' ) );
			}

			resolve( { allTemplates, referencedTemplates, unreferencedTemplates } );
		} catch ( err ) {
			reject( err );
		}
	} );
}

/**
 * Function performs a recursive scan on a given directory, returns a list of all Twig files within it.
 *
 * @param {Object} args
 * @return {Promise}
 */
function scanEntryDir( args ) {
	return new Promise( ( resolve, reject ) => {
		recursive( args.entryDir, ( err, files ) => {
			if ( err ) {
				reject( [] );
			}

			files = files.filter( ( file ) => {
				return file.match( twigPattern );
			} )
			.map( ( file ) => {
				// If present, remove 'views directory' portion of file path.
				// eg. `/path/to/views/path/to/file` becomes `/path/to/file`.
				return ( file.includes( args.viewsDir ) ) ? file.substring( args.viewsDir.length ) : file;
			} )
			.map( ( file ) => {
				// Remove leading '/' chars.
				return ( file.substring( 0, 1 ) === '/' )  ? file.substring( 1 ) : file;
			} )

			resolve( files );
		} );
	} );
}

/**
 * Function checks a given Twig file for references to additional Twig files.
 *
 * For each matched reference, function updates the 'referencedTemplates' object and invokes itself with the new ref.
 *
 * @param {string} filePath
 * @param {string} viewsDir
 */
function checkTwigFile( filePath, viewsDir ) {
	fileContents = fs.readFileSync( filePath, 'utf8' );

	let matches = fileContents.match( twigPattern );

	if ( !matches || !matches.length ) {
		return;
	}

	matches.forEach( ( match ) => {
		referencedTemplates[ match ] = true;

		let matchFilePath = `${viewsDir}/${match}`;

		checkTwigFile( matchFilePath, viewsDir );
	} );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = {
	init,
};
