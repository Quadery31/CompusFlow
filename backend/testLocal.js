import http from 'http';

const baseURL = 'http://localhost:5000/api/classrooms';

const testData = {
    roomNumber: "A101-" + Date.now(),
    building: "Block A",
    capacity: 60,
    occupiedSlots: [
        {
            day: "Monday",
            startTime: "09:00",
            endTime: "10:00"
        },
        {
            day: "Monday",
            startTime: "11:00",
            endTime: "12:00"
        }
    ]
};

async function postData(url, data) {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const req = http.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length,
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });
        req.on('error', reject);
        req.write(dataString);
        req.end();
    });
}

async function getData(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function runTests() {
    console.log('--- Seeding Classroom ---');
    const seedRes = await postData(baseURL, testData);
    console.log('Seed response:', seedRes.status, seedRes.body.success);

    const room = seedRes.body.data.roomNumber;

    console.log('\n--- Test 1: Query free slot (Available) ---');
    const res1 = await getData(`${baseURL}/available?day=Monday&startTime=10:00&endTime=11:00`);
    const isAvailable1 = res1.body.data.some(c => c.roomNumber === room);
    console.log(`Test 1 (10:00 - 11:00): ${isAvailable1 ? 'PASSED (Available)' : 'FAILED'}`);

    console.log('\n--- Test 2: Query overlapping slot (Not Available) ---');
    const res2 = await getData(`${baseURL}/available?day=Monday&startTime=09:30&endTime=10:30`);
    const isAvailable2 = res2.body.data.some(c => c.roomNumber === room);
    console.log(`Test 2 (09:30 - 10:30): ${!isAvailable2 ? 'PASSED (Not Available)' : 'FAILED'}`);

    console.log('\n--- Test 3: Query different day (Available) ---');
    const res3 = await getData(`${baseURL}/available?day=Tuesday&startTime=09:00&endTime=10:00`);
    const isAvailable3 = res3.body.data.some(c => c.roomNumber === room);
    console.log(`Test 3 (Tuesday 09:00 - 10:00): ${isAvailable3 ? 'PASSED (Available)' : 'FAILED'}`);

    console.log('\n--- Test 4: Missing parameters ---');
    const res4 = await getData(`${baseURL}/available?day=Monday&startTime=10:00`);
    console.log(`Test 4: ${res4.status === 400 ? 'PASSED (400 returned)' : 'FAILED'}`);

    console.log('\n--- Test 5: Invalid time range (startTime > endTime) ---');
    const res5 = await getData(`${baseURL}/available?day=Monday&startTime=12:00&endTime=11:00`);
    console.log(`Test 5: ${res5.status === 400 ? 'PASSED (400 returned)' : 'FAILED'}`);
}

runTests().catch(console.error);
