/**
 * @module @aeos/v4
 * Aeos v4 static distribution and single-file launcher.
 */

export const name: string = "@aeos/v4";
export const version: string = "0.1.0";
export const repo: string = "aeosntw/v4";

export interface AeosInfo {
  name: string;
  version: string;
  repo: string;
  description: string;
}

/**
 * Returns metadata about the Aeos v4 distribution.
 */
export function getInfo(): AeosInfo {
  return {
    name,
    version,
    repo,
    description: "Aeos v4 static distribution and single-file launcher",
  };
}

export default getInfo;
