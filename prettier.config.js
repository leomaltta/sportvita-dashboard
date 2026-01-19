/**
 * Prettier Configuration
 * 
 * Defines code formatting rules for consistent style across the project
 * Integrates with Tailwind CSS for automatic class sorting
 */
module.exports = {
    // Tailwind CSS class sorting plugin
    plugins: ['prettier-plugin-tailwindcss'],
    
    // Print width - maximum line length
    printWidth: 80,
    
    // Tab width - spaces per indentation level
    tabWidth: 2,
    
    // Use single quotes instead of double
    singleQuote: true,
    
    // Trailing commas - adds to multiline arrays/objects
    trailingComma: 'all',
    
    // Arrow function parentheses - always include
    arrowParens: 'always',
    
    // Semicolons - disabled for cleaner code
    semi: false,
    
    // End of line - auto detect based on git
    endOfLine: 'auto',
  }