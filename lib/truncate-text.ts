import he from 'he';

export function truncateText(input: string | undefined, length: number = 300): string {
    // If no text is passed, use the default text
    if (!input) {
        return ""
    }

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