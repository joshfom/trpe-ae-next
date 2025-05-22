import he from 'he';

export function prepareExcerpt(input: string | undefined, length: number = 300, defaultText: string = "Real estate property for rent and for sale in Dubai"): string {
    // If no text is passed, use the default text
    if (!input) {
        input = defaultText;
    }

    // Find the first occurrence of "this" and remove everything before it
    const indexOfThis = input.toLowerCase().indexOf("this");
    if (indexOfThis !== -1) {
        input = input.substring(indexOfThis);
    }

    // Capitalize the first character
    input = input.charAt(0).toUpperCase() + input.slice(1);

    // Decode HTML entities
    const decodedInput = he.decode(input);

    // Strip HTML tags
    const strippedInput = decodedInput.replace(/(<([^>]+)>)/gi, "");

    // Truncate text at the last full word
    if (strippedInput.length > length) {
        const lastSpaceBeforeLength = strippedInput.lastIndexOf(' ', length);
        return strippedInput.substring(0, lastSpaceBeforeLength) + " ...";
    } else {
        return strippedInput;
    }
}