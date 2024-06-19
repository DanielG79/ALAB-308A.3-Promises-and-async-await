// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.js";

function getUserData(id) {
    const dbs = {
        db1: db1,
        db2: db2,
        db3: db3
    };
}


async function fetchUserData(id) {
    try {
        // Fetch the database identifier from the central database
        const databaseId = await central(id);

        // Fetch the user data from the appropriate databases
        const [userData, addressData, companyData] = await Promise.all([
            dbs[databaseId](id),
            vault(id),
            dbs[databaseId](id, 'company'),
        ]);

        // Combine the data into the required format
        return {
            id,
            name: addressData.name,
            username: userData.username,
            email: addressData.email,
            address: {
                street: addressData.street,
                suite: addressData.suite,
                city: addressData.city,
                zipcode: addressData.zipcode,
                geo: {
                    lat: addressData.lat,
                    lng: addressData.lng,
                },
            },
            phone: addressData.phone,
            website: userData.website,
            company: {
                name: companyData.name,
                catchPhrase: companyData.catchPhrase,
                bs: companyData.bs,
            },
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}