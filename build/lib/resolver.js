/// <reference types="node" />

const fs = require( "fs" );
const path = require( "path" );

/** @param  {Parameters<import("fs").accessSync>} args */
const access = ( ...args ) => {
  try {
    fs.accessSync( ...args );

    return true;
  } catch ( error ) {
    return false;
  }

};

/**
 * @param {string} pathname
 * @param {string} baseURI
 */
const isInside = ( pathname, baseURI ) => {
  const baseURIParts = baseURI.split( path.sep );
  const pathnameParts = pathname.split( path.sep );

  for ( let i = 0, l = Math.min( baseURIParts.length, pathnameParts.length ); i < l; i += 1 ) {
    if ( baseURIParts[ i ] !== pathnameParts[ i ] ) {
      return false;
    }
  }

  return true;
};

/**
 * 对于 Typescript 来说模块的扩展名不是必需的，
 * 因此在 Jest 中我们需要自己解析
 * @type {JestModuleResolver}
 */
module.exports = ( pathname, config ) => {
  if ( path.extname( pathname ) === "" && config.rootDir && isInside( pathname, config.rootDir ) ) {
    const resolvedPathname = path.join( config.basedir, pathname );

    if ( access( resolvedPathname ) ) {
      return resolvedPathname;
    }

    for ( let i = 0; i < config.extensions.length; i += 1 ) {
      const resolvedPathname = path.join( config.basedir, pathname + config.extensions[ i ] );

      if ( access( resolvedPathname ) ) {
        return resolvedPathname;
      }
    }
  }

  return config.defaultResolver( pathname, config );
}

/**
 * @callback JestModuleResolver
 * @param {string} pathname
 * @param {{
 *   basedir?: string,
 *   browser?: boolean,
 *   defaultResolver: JestModuleResolver
 *   extensions?: string[],
 *   moduleDirectory: string[],
 *   paths?: string[],
 *   rootDir?: string
 * }} config
 * @returns string
 */
