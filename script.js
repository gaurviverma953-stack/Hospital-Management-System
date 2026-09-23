document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initQR();
});

// 1. Navigation Logic
function showSection(sectionId) {
    // Toggle Sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    // Update Sidebar Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if(link.innerText.toLowerCase().includes(sectionId.split('-')[0])) {
            link.classList.add('active');
        }
    });

    if(sectionId === 'dashboard') initDashboard();
}

// 2. Initialize Calendar
function initDashboard() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        themeSystem: 'standard',
        events: [
            { title: 'Surgery: Rm 402', start: '2026-04-12', color: '#ef4444' },
            { title: 'Dr. Shruti', start: '2026-04-10T14:00:00', color: '#6366f1' }
        ]
    });
    calendar.render();
}

// 3. QR Check-in Generator
function initQR() {
    new QRCode(document.getElementById("qrcode"), {
        text: "HIS-CHECKIN-2026-X99",
        width: 160,
        height: 160,
        colorDark : "#1e1b4b",
        colorLight : "#ffffff"
    });
}

// 4. Advanced AI Symptom Checker Simulation
function runAISearch() {
    const input = document.getElementById('ai-input').value.toLowerCase();
    const output = document.getElementById('ai-output');
    
    output.classList.remove('hidden');
    output.innerHTML = "Processing clinical tokens and cross-referencing database...";

    setTimeout(() => {
        output.classList.remove('animate-pulse');
        if(input.includes('chest') || input.includes('arm')) {
            output.innerHTML = `
                <div class="font-bold text-red-600 flex items-center gap-2">
                    <i class="fas fa-exclamation-triangle"></i> EMERGENCY ALERT
                </div>
                <p>Symptoms suggest <strong>Acute Coronary Syndrome</strong>. Immediate Triage to ER advised. Notify Cardiology Dept.</p>
            `;
            output.className = "mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded";
        } else {
            output.innerHTML = `
                <div class="font-bold text-indigo-700">Clinical Probability: Common Flu / Respiratory</div>
                <p>AI suggests scheduling a standard General Practitioner visit. No immediate emergency detected.</p>
            `;
            output.className = "mt-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded";
        }
    }, 2000);
}
// Data store for patients
let patients = [];

document.addEventListener('DOMContentLoaded', function() {
    // ... previous init codes ...
    handlePatientForm();
});

function handlePatientForm() {
    const form = document.getElementById('patientForm');
    if(!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Collect Data
        const newPatient = {
            id: Date.now(),
            name: document.getElementById('pName').value,
            contact: document.getElementById('pContact').value,
            age: document.getElementById('pAge').value,
            date: document.getElementById('pDate').value,
            status: 'Admitted'
        };

        // 2. Add to Array
        patients.push(newPatient);

        // 3. Update Table
        renderPatientTable();

        // 4. Reset Form
        form.reset();
        alert('Patient Registered Successfully!');
    });
}

function renderPatientTable() {
    const tbody = document.getElementById('patientTableBody');
    // Clear existing (excluding sample)
    tbody.innerHTML = '';

    patients.forEach(p => {
        const row = `
            <tr class="text-slate-600 border-b hover:bg-slate-50 transition animate-fadeIn">
                <td class="p-4 font-medium text-slate-900">${p.name}</td>
                <td class="p-4">${p.contact}</td>
                <td class="p-4">${p.age}</td>
                <td class="p-4">${p.date}</td>
                <td class="p-4">
                    <select onchange="changeStatus(${p.id}, this.value)" class="text-xs border rounded p-1 bg-white">
                        <option value="Admitted" ${p.status === 'Admitted' ? 'selected' : ''}>Admitted</option>
                        <option value="Waiting" ${p.status === 'Waiting' ? 'selected' : ''}>Waiting</option>
                        <option value="Discharged" ${p.status === 'Discharged' ? 'selected' : ''}>Discharged</option>
                    </select>
                </td>
                <td class="p-4">
                    <button onclick="deletePatient(${p.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function changeStatus(id, newStatus) {
    const p = patients.find(p => p.id === id);
    if(p) {
        p.status = newStatus;
        console.log(`Updated ${p.name} to ${newStatus}`);
    }
}

function deletePatient(id) {
    patients = patients.filter(p => p.id !== id);
    renderPatientTable();
}
async function getDoctors() {
    // 1. Point fetch to your Python server's URL
    const response = await fetch("http://127.0.0.1:8000/doctors/");
    
    // 2. Convert the response to JSON
    const data = await response.json();
    
    // 3. Do something with the data in your existing HTML
    console.log(data); 
    // Example: document.getElementById('my-list').innerText = data[0].name;
}
async function createPatient() {
    // 1. Gather data from your existing HTML inputs
    const patientData = {
        name: document.getElementById("nameInput").value,
        age: parseInt(document.getElementById("ageInput").value),
        contact_number: document.getElementById("phoneInput").value
    };

    // 2. Send the data to Python
    const response = await fetch("http://127.0.0.1:8000/patients/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patientData) // Convert JavaScript object to JSON string
    });

    const result = await response.json();
    console.log(result); // Will print: {message: "Patient registered successfully", ...}
}