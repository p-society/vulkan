export const INVALID_CONFIG = (errorMessage) => `${errorMessage}
        
    Details:
    - The configuration file could not be loaded or parsed.
    - Possible causes:
      1. The file may not exist at the provided path.
      2. The file may be empty, incomplete, or malformed.
      3. There may be syntax errors in the YAML file (e.g., incorrect indentation, invalid characters).
      
    Suggested Actions:
    - Please ensure that the file exists at the path: ${process.cwd() + HOST_TARGET_PATH}.
    - Verify the file is properly formatted by using a YAML linter or validator.
    - Check for any unexpected content or missing key-value pairs.
    
    If the problem persists, refer to the application documentation or contact the support team with the error details.
    `;