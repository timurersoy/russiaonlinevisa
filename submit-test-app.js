// Use native fetch (Node 18+)
async function submitApp() {
    try {
        const payload = {
            personalDetails: {
                givenNames: "James",
                surname: "Bond", // Should be encrypted
                nationality: "UK",
                gender: "male",
                maritalStatus: "single"
            },
            passportDetails: {
                passportNumber: "SECRET_AGENT_007", // Should be encrypted
                expiryDate: "2030-01-01",
                passportCoverImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg=="
            },
            travelDetails: {
                entryDate: "2026-05-01",
                visitType: "tourism",
                firstCity: "Moscow",
                accommodationType: "hotel"
            },
            contactDetails: {
                phone: "+441234567890", // Should be encrypted
                email: "007@mi6.gov.uk", // Should be encrypted
                address: "London",
                occupancy: "working"
            },
            images: {
                photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg=="
            }
        };

        const res = await fetch('http://localhost:3000/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log('Submission Response:', res.status, data);
    } catch (e) {
        console.error('Submission failed:', e);
    }
}

submitApp();
