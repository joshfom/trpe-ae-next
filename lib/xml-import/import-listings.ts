/**
 * importListings function
 *
 * This function fetches data from an API endpoint, parses the JSON response, and maps through the list of properties.
 * For each property, it creates a new object (newProperty) and flattens the nested 'agents' and 'photo' objects.
 *
 * The 'agents' object is flattened by creating a new object where the keys are the same but the values are the first element of the original arrays.
 * The 'photo' object is flattened by mapping through the 'url' array and returning the '_' property of each object.
 *
 * The function then returns an array of objects, where each object contains the flattened 'newProperty', 'agents', and 'photos'.
 *
 * @returns {Promise<Array<{newProperty: any, agents: any, photos: string[]}>>} An array of objects containing the flattened properties.
 *
 * @throws {Error} If the fetch request fails, an error is thrown.
 */


interface PhotoUrl {
    _: string;
    $: {
        last_updated: string;
    };
}

interface Photo {
    url: PhotoUrl[];
}

interface Agent {
    id: string[];
    name: string[];
    email: string[];
    phone: string[];
}

interface Property {
    [key: string]: string[] | Agent[] | Photo[];
}

interface Data {
    list: {
        property: Property[];
    };
}


export async function importListings() {
    // Fetch data from API
    console.log('fetching data')
    const res = await fetch('/api/xml');
    console.log('fetched data')

    const data: Data = await res.json();

    // Map through the list of properties
    return data.list.property.map((property: Property) => {
        const newProperty: any = {};
        let agent: any = {};
        let photos: string[] = [];

        // Iterate over each property
        Object.entries(property).forEach(([key, value]) => {
            // If the key is 'agents' and value is an object, flatten the agents object
            if (key === 'agent' && Array.isArray(value) && typeof value[0] === 'object') {
                agent = Object.fromEntries(Object.entries(value[0]).map(([k, v]) => [k, v[0]]));
            }
            // If the key is 'photo', value is an object, and 'url' exists in value[0], flatten the photo object
            else if (key === 'photo' && Array.isArray(value) && typeof value[0] === 'object' && 'url' in value[0]) {
                photos = value[0].url.map((photo: PhotoUrl) => photo._);
            }
            // If value is an array, assign the first element to newProperty
            else if (Array.isArray(value)) {
                newProperty[key] = value[0];
            }
            // Otherwise, assign the value to newProperty
            else {
                newProperty[key] = value;
            }
        });

        // Return the newProperty, agents, and photos
        return { newProperty, agent, photos };
    });
}
