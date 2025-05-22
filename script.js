// School Related Data Storing

const schoolForm = document.getElementById('schoolForm');
const schoolFormSection = document.getElementById('schoolFormSection');
const gradeSection = document.getElementById('gradeSection');

schoolForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Store form data in local storage
    const schoolDetails = {
        name: document.getElementById('schoolName').value.trim(),
        address: document.getElementById('schoolAddress').value.trim(),
        email: document.getElementById('schoolEmail').value.trim(),
        academicYear: document.getElementById('academicYear').value.trim()
    };

    localStorage.setItem('schoolDetails', JSON.stringify(schoolDetails));

    // Hide school form, show grade options
    schoolFormSection.style.display = 'none';
    gradeSection.style.display = 'block';
});


//Grade Selection Part

function selectGrade(group) {
    localStorage.setItem('gradeGroup', group);

    // Hide other grade sections
    document.getElementById('grade1to3Section').style.display = 'none';
    // document.getElementById('grade4to8Section').style.display = 'none';
    // document.getElementById('grade9to10Section').style.display = 'none';

    // Show selected section
    if (group === '1-3') {
        gradeSection.style.display = 'none';
        document.getElementById('grade1to3Section').style.display = 'block';
    } else if (group === '4-8') {
        gradeSection.style.display = 'none';
        document.getElementById('grade4to8Section').style.display = 'block';
    } else if (group === '9-10') {
        gradeSection.style.display = 'none';
        document.getElementById('grade9to10Section').style.display = 'block';
    }
    else {
        alert("Error occurred.");
    }
}


//Grade 1-3's Student Details and Marks of Subjects

document.getElementById('g1to3Form').addEventListener('submit', function (e) {
    e.preventDefault();

    const studentData = {
        stdName: document.getElementById('studentName').value.trim(),
        roll: document.getElementById('rollNumber').value.trim(),
        gradeLvl: document.getElementById('gradeLevel').value,
        teacher: document.getElementById('classTeacher').value.trim(),
        marks: {
            Nepali: +document.getElementById('nepali').value,
            English: +document.getElementById('english').value,
            Mathematics: +document.getElementById('math').value,
            OurSurrounding: +document.getElementById('ourSurrounding').value,
            LocalSubject: +document.getElementById('localSubject').value
        }
    };

    localStorage.setItem('studentData', JSON.stringify(studentData));
    alert("Student data saved.");
});


const gradeScale = [
    { min: 90, grade: "A+", gp: 4.0 },
    { min: 80, grade: "A", gp: 3.6 },
    { min: 70, grade: "B+", gp: 3.2 },
    { min: 60, grade: "B", gp: 2.8 },
    { min: 50, grade: "C+", gp: 2.4 },
    { min: 40, grade: "C", gp: 2.0 },
    { min: 35, grade: "D", gp: 1.6 },
    { min: 0, grade: "NG", gp: 0.8 }
];


function calculateG1to3GPA() {
    // Get all subject blocks
    const subjects = document.querySelectorAll('.subject-block');
    let totalGP = 0;
    let totalCredits = 0;

    // Clear previous GPA result
    document.getElementById('finalGPAResult').style.display = 'none';

    // Calculate each subject
    subjects.forEach(subject => {
        const laInput = subject.querySelector('input[data-subject]');
        const marksInput = subject.querySelector('input[type="number"]:not([data-subject])');

        if (!laInput || !marksInput) return; // Skip if inputs not found

        const la = parseFloat(laInput.value);
        const marks = parseFloat(marksInput.value);
        const credit = parseFloat(laInput.dataset.credit);
        const resultDiv = subject.querySelector('.result-row');

        // Skip if values are invalid
        if (isNaN(la)) return;
        if (isNaN(marks)) return;
        if (isNaN(credit)) return;

        // Calculate percentage
        const maxMarks = la * 4;
        const percent = (marks / maxMarks) * 100;

        // Find matching grade
        let grade, gp;
        if (percent >= 90) { grade = "A+"; gp = 4.0; }
        else if (percent >= 80) { grade = "A"; gp = 3.6; }
        else if (percent >= 70) { grade = "B+"; gp = 3.2; }
        else if (percent >= 60) { grade = "B"; gp = 2.8; }
        else if (percent >= 50) { grade = "C+"; gp = 2.4; }
        else if (percent >= 40) { grade = "C"; gp = 2.0; }
        else if (percent >= 35) { grade = "D"; gp = 1.6; }
        else { grade = "NG"; gp = 0.8; }

        // Show subject result
        if (resultDiv) {
            resultDiv.innerHTML = `
                Grade: ${grade} | 
                GP: ${gp.toFixed(1)} | 
                ${percent.toFixed(1)}%
            `;
        }

        // Add to totals
        totalGP += gp * credit;
        totalCredits += credit;
    });

    // Calculate final GPA if we have credits
    if (totalCredits > 0) {
        const finalGPA = totalGP / totalCredits;
        document.getElementById('finalGPA').textContent = finalGPA.toFixed(2);
        document.getElementById('finalGPAResult').style.display = 'block';
        return finalGPA;
    }

    return 0; // Return 0 if no valid subjects
}


function saveFinalReport() {
    // Get student info
    const name = document.getElementById('studentName').value.trim() || 'Unnamed Student';
    const roll = document.getElementById('rollNumber').value.trim() || 'N/A';
    const grade = document.getElementById('gradeLevel').value || '1';
    const teacher = document.getElementById('classTeacher').value.trim() || 'N/A';

    // Get GPA
    const finalGPA = document.getElementById('finalGPA').textContent || '0.00';

    // Collect subject data
    const subjects = [];
    document.querySelectorAll('.subject-block').forEach(subject => {
        const name = subject.querySelector('h4').textContent.split('(')[0].trim();
        const las = parseFloat(subject.querySelector('.las').value) || 0;
        const marks = parseFloat(subject.querySelector('.marks').value) || 0;
        const resultText = subject.querySelector('.result-row')?.textContent || '';

        subjects.push({
            subject: name,
            la: las,
            marks: marks,
            grade: resultText.includes('Grade:') ? resultText.split('Grade:')[1].split('|')[0].trim() : 'NG',
            gp: resultText.includes('GP:') ? parseFloat(resultText.split('GP:')[1].split('|')[0].trim()) : 0
        });
    });

    // Create report object
    const report = {
        name: name,
        roll: roll,
        grade: grade,
        teacher: teacher,
        finalGPA: finalGPA,
        subjects: subjects,
        savedAt: new Date().toLocaleString()
    };

    // Save to localStorage
    const allReports = JSON.parse(localStorage.getItem('studentReports') || '[]');
    allReports.push(report);
    localStorage.setItem('studentReports', JSON.stringify(allReports));

    alert('Report saved successfully!');
    return report; // Return the saved report if needed
}




function submitStudentDetails() {
    const name = document.getElementById('studentName').value.trim();
    const roll = document.getElementById('rollNumber').value.trim();
    const grade = document.getElementById('gradeLevel').value;
    const teacher = document.getElementById('classTeacher').value.trim();
    const dob = document.getElementById('dob').value;

    if (!name || !roll || !grade || !teacher || !dob) {
        alert("Please complete all student details.");
        return;
    }

    // Save student data temporarily
    const studentData = {
        name,
        roll,
        grade,
        teacher,
        dob,
    };

    localStorage.setItem('currentStudent', JSON.stringify(studentData));

    // Hide student detail, show marks table
    document.getElementById("studentDetailSection").style.display = "none";
    document.getElementById("g1to3Form").style.display = "block";
}


// Grade Sheet Generator Function for Grade 1-3
function generateGrade1to3Sheet() {
    // Always recalculate GPA before generating
    calculateG1to3GPA();

    const student = JSON.parse(localStorage.getItem('currentStudent')) || {};
    const school = JSON.parse(localStorage.getItem('schoolDetails')) || {};
    const subjectForms = document.querySelectorAll("#g1to3Form .subject-block");


    const subjectNames = {
        nepali: "NEPALI",
        english: "ENGLISH",
        math: "MATHS",
        ourSurrounding: "MERO SEROFERO",
        local: "LOCAL SUBJECT"
    };

    let rows = [];
    let totalWeightedGP = 0;
    let totalCredit = 0;


    subjectForms.forEach((form, index) => {
        const laInput = form.querySelector(".las");
        const marksInput = form.querySelector(".marks");
        const subject = laInput.dataset.subject;
        const credit = parseFloat(laInput.dataset.credit);
        const la = parseFloat(laInput.value);
        const marks = parseFloat(marksInput.value);

        if (!isNaN(la) && !isNaN(marks) && la > 0 && credit > 0) {
            const percent = (marks / (la * 4)) * 100;
            let grade = "NG", gp = 0.8;

            if (percent >= 90) { grade = "A+"; gp = 4.0; }
            else if (percent >= 80) { grade = "A"; gp = 3.6; }
            else if (percent >= 70) { grade = "B+"; gp = 3.2; }
            else if (percent >= 60) { grade = "B"; gp = 2.8; }
            else if (percent >= 50) { grade = "C+"; gp = 2.4; }
            else if (percent >= 40) { grade = "C"; gp = 2.0; }
            else if (percent >= 35) { grade = "D"; gp = 1.6; }

            const wgp = gp * credit;
            totalWeightedGP += wgp;
            totalCredit += credit;

            rows.push(`
            <tr>
                <td>${index + 1}</td>
                <td>${subjectNames[subject]}</td>
                <td>${credit}</td>
                <td>${grade}</td>
                <td>${gp}</td>
            </tr>
        `);
        }
    });


    const finalGPA = totalCredit > 0 ? (totalWeightedGP / totalCredit).toFixed(2) : "0.00";
    const today = new Date().toLocaleDateString('en-NP');

    const gradeSheetHtml = `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f9f9f9; padding: 20px; box-sizing: border-box;">
        <div class="gradesheet-wrapper" style="
            width: 210mm;
            min-height: 297mm;
            background: white;
            padding: 20mm;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            font-family: sans-serif;
            box-sizing: border-box;
        ">
            <div class="header" style="text-align: center; margin-bottom: 15px;">
                <h2>${school.name || "Your School Name"}</h2>
                <p>${school.address || "School Address"}</p>
                <p>Academic Year: ${school.academicYear || "----"}</p>
                <h3>PROGRESS REPORT CARD</h3>
            </div>
            <div class="student-info" style="font-size: 0.95em; margin-bottom: 20px;">
                <p><strong>Name:</strong> ${student.name || "N/A"} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Roll No:</strong> ${student.roll || "N/A"}</p>
                <p><strong>Grade:</strong> ${student.grade || "N/A"} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Date of Birth:</strong> ${student.dob || "N/A"}</p>
                <p><strong>Teacher:</strong> ${student.teacher || "N/A"}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #eee;">
                        <th style="border: 1px solid #ccc; padding: 6px;">S.N.</th>
                        <th style="border: 1px solid #ccc; padding: 6px;">Subject</th>
                        <th style="border: 1px solid #ccc; padding: 6px;">Credit Hour</th>
                        <th style="border: 1px solid #ccc; padding: 6px;">Grade</th>
                        <th style="border: 1px solid #ccc; padding: 6px;">Grade Point</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.join('')}
                </tbody>
            </table>
            <div style="margin-top: 15px; text-align: right;"><strong>Final GPA:</strong> ${finalGPA}</div>
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <div>Checked By<br>${student.teacher}<br>Date: ${today}</div>
                <div>Head Teacher<br>....................</div>
            </div>
            <p style="margin-top: 10px; font-size: 0.8em;">Note: One credit hour equals 32 working hours.</p>
        </div>
    </div>
`;
    // Display grade sheet in same page
    const containerId = "gradeSheetContainer";
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        document.getElementById("grade1to3Section").appendChild(container);
    }

    container.innerHTML = gradeSheetHtml;
    container.scrollIntoView({ behavior: "smooth" });
    document.getElementById('downloadPDFBtn').style.display = 'inline-block';
}

function downloadPDF1to3() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // School header
    const school = JSON.parse(localStorage.getItem('schoolDetails')) || {};
    doc.setFontSize(18);
    doc.text(school.name || "Your School Name", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(school.address || "School Address", 105, 28, { align: 'center' });
    doc.text(`Academic Year: ${school.academicYear || "----"}`, 105, 34, { align: 'center' });
    doc.setFontSize(16);
    doc.text("PROGRESS REPORT CARD", 105, 44, { align: 'center' });

    // Student info
    const student = JSON.parse(localStorage.getItem('currentStudent')) || {};
    doc.setFontSize(12);
    doc.text(`Name: ${student.name || "N/A"}`, 20, 60);
    doc.text(`Roll No: ${student.roll || "N/A"}`, 120, 60);
    doc.text(`Grade: ${student.grade || "N/A"}`, 20, 68);
    doc.text(`Date of Birth: ${student.dob || "N/A"}`, 120, 68);
    doc.text(`Teacher: ${student.teacher || "N/A"}`, 20, 76);

    // Table data
    const headers = [["S.N.", "Subject", "Credit Hour", "Grade", "Grade Point"]];
    const subjectForms = document.querySelectorAll("#g1to3Form .subject-block");
    const data = [];

    subjectForms.forEach((form, index) => {
        const subject = form.querySelector('h4').textContent.split('(')[0].trim();
        const credit = form.querySelector('.las').dataset.credit;
        const resultDiv = form.querySelector('.result-row');

        let grade = "NG";
        let gp = "0.00";

        if (resultDiv && resultDiv.textContent) {
            const gradeMatch = resultDiv.textContent.match(/Grade: (\w+)/);
            const gpMatch = resultDiv.textContent.match(/GP: ([\d.]+)/);
            grade = gradeMatch ? gradeMatch[1] : "NG";
            gp = gpMatch ? gpMatch[1] : "0.00";
        }

        data.push([
            index + 1,
            subject,
            credit,
            grade,
            gp
        ]);
    });

    // Add table
    doc.autoTable({
        startY: 85,
        head: headers,
        body: data,
        theme: 'grid',
        headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0]
        }
    });

    // Final GPA
    const finalGPA = document.getElementById('finalGPA').textContent || "0.00";
    doc.text(`Final GPA: ${finalGPA}`, 160, doc.lastAutoTable.finalY + 15);

    // Signatures
    const today = new Date().toLocaleDateString('en-NP');
    doc.text(`Checked By: ${student.teacher || "N/A"}`, 20, doc.lastAutoTable.finalY + 30);
    doc.text(`Date: ${today}`, 20, doc.lastAutoTable.finalY + 38);
    doc.text("Head Teacher: ....................", 120, doc.lastAutoTable.finalY + 30);

    // Footer note
    doc.setFontSize(10);
    doc.text("Note: One credit hour equals 32 working hours.", 105, doc.lastAutoTable.finalY + 45, { align: 'center' });

    // Save PDF
    doc.save('progress-report.pdf');
}



// Grade 4-8 Functions
function submitStudentDetails4to8() {
    var name = document.getElementById('studentName4to8').value.trim();
    var roll = document.getElementById('rollNumber4to8').value.trim();
    var grade = document.getElementById('gradeLevel4to8').value;
    var teacher = document.getElementById('classTeacher4to8').value.trim();
    var dob = document.getElementById('dob4to8').value;

    if (!name || !roll || !grade || !teacher || !dob) {
        alert("Please complete all student details.");
        return;
    }

    // Save student data
    var studentData = {
        name: name,
        roll: roll,
        grade: grade,
        teacher: teacher,
        dob: dob
    };
    localStorage.setItem('currentStudent4to8', JSON.stringify(studentData));

    // Show marks form
    document.getElementById("studentDetailSection4to8").style.display = "none";
    document.getElementById("g4to8Form").style.display = "block";
}

function calculateGP(marks, maxMarks) {
    var percent = (marks / maxMarks) * 100;

    if (percent >= 90) return 4.0;
    if (percent >= 80) return 3.6;
    if (percent >= 70) return 3.2;
    if (percent >= 60) return 2.8;
    if (percent >= 50) return 2.4;
    if (percent >= 40) return 2.0;
    if (percent >= 35) return 1.6;
    return 0.8;
}

function calculateGrade4to8() {
    var subjects = [
        { id: "nepali", name: "Nepali", credit: 2.5 },
        { id: "english", name: "English", credit: 2.5 },
        { id: "math", name: "Mathematics", credit: 2.5 },
        { id: "science", name: "Science and Technology", credit: 2.5 },
        { id: "social", name: "Social Studies and Human Value Education", credit: 2.5 },
        { id: "health", name: "Health, Physical and Creative Arts", credit: 1.5 },
        { id: "local", name: "Local Subject", credit: 2 }
    ];

    var totalWGP = 0;
    var totalCredit = 0;
    var results = [];

    for (var i = 0; i < subjects.length; i++) {
        var subject = subjects[i];
        var block = document.querySelector('.subject-block[data-subject="' + subject.id + '"]');
        var thMarks = parseFloat(block.querySelector('.marks-th').value);
        var inMarks = parseFloat(block.querySelector('.marks-in').value);
        var resultDiv = block.querySelector('.result-row');

        if (!block) {
            console.error('Subject block not found for:', subject.id);
            continue;
        }

        // Calculate GP and WGP
        var thGP = calculateGP(thMarks, 50);
        var inGP = calculateGP(inMarks, 50);
        var thWGP = subject.credit * thGP;
        var inWGP = subject.credit * inGP;
        var finalGP = (thGP + inGP) / 2;
        var finalGrade = getGradeFromGP(finalGP);

        // Store results
        results.push({
            id: subject.id,
            name: subject.name,
            credit: subject.credit,
            thMarks: thMarks,
            inMarks: inMarks,
            thGP: thGP,
            inGP: inGP,
            thWGP: thWGP,
            inWGP: inWGP,
            finalGrade: finalGrade
        });

        // Update totals
        totalWGP += thWGP + inWGP;
        totalCredit += subject.credit;

        // Display results
        resultDiv.innerHTML = 'Theoretical: ' + thMarks + '/50 (GP: ' + thGP.toFixed(1) + ', WGP: ' + thWGP.toFixed(1) + ') | ' +
            'Internal: ' + inMarks + '/50 (GP: ' + inGP.toFixed(1) + ', WGP: ' + inWGP.toFixed(1) + ') | ' +
            'Final Grade: ' + finalGrade;
    }

    // Calculate GPA
    var gpa = totalWGP / (totalCredit * 2);
    document.getElementById('finalGPA4to8').textContent = gpa.toFixed(2);
    document.getElementById('finalGPAResult4to8').style.display = 'block';

    return {
        gpa: gpa,
        results: results
    };
}

function generateGrade4to8Sheet() {
    var form = document.getElementById('g4to8Form');
    if (!form || window.getComputedStyle(form).display === 'none') {
        alert('Please complete student details first!');
        return;
    }
    var calculation = calculateGrade4to8();
    var gpa = calculation.gpa;
    var results = calculation.results;
    var student = JSON.parse(localStorage.getItem('currentStudent4to8')) || {};
    var school = JSON.parse(localStorage.getItem('schoolDetails')) || {};
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // School header
    doc.setFontSize(18);
    doc.text(school.name || "Your School Name", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(school.address || "School Address", 105, 28, { align: 'center' });
    doc.text('Academic Year: ' + (school.academicYear || "----"), 105, 34, { align: 'center' });
    doc.setFontSize(16);
    doc.text("GRADE 4-8 PROGRESS REPORT", 105, 44, { align: 'center' });

    // Student info
    doc.setFontSize(12);
    doc.text('Name: ' + (student.name || "N/A"), 20, 60);
    doc.text('Roll No: ' + (student.roll || "N/A"), 120, 60);
    doc.text('Grade: ' + (student.grade || "N/A"), 20, 68);
    doc.text('Date of Birth: ' + (student.dob || "N/A"), 120, 68);
    doc.text('Teacher: ' + (student.teacher || "N/A"), 20, 76);

    // Table data
    var headers = [
        ["Subject", "Credit", "Theoretical", "Internal", "Final", "WGP (Th)", "WGP (In)"]
    ];

    var data = [];
    for (var i = 0; i < results.length; i++) {
        var subject = results[i];
        data.push([
            subject.name,
            subject.credit,
            subject.thMarks + '/50 (' + subject.thGP.toFixed(1) + ')',
            subject.inMarks + '/50 (' + subject.inGP.toFixed(1) + ')',
            subject.finalGrade,
            subject.thWGP.toFixed(1),
            subject.inWGP.toFixed(1)
        ]);
    }

    // Add table
    doc.autoTable({
        startY: 85,
        head: headers,
        body: data,
        theme: 'grid',
        tableWidth: 'auto',
        styles: {
            fontSize: 10,
            cellPadding: 2
        }
    });

    // Final GPA
    doc.text('Final GPA: ' + gpa.toFixed(2), 160, doc.lastAutoTable.finalY + 15);

    // Signatures
    var today = new Date().toLocaleDateString('en-NP');
    doc.text('Checked By: ' + (student.teacher || "N/A"), 20, doc.lastAutoTable.finalY + 30);
    doc.text('Date: ' + today, 20, doc.lastAutoTable.finalY + 38);
    doc.text("Head Teacher: ....................", 120, doc.lastAutoTable.finalY + 30);

    // Footer note
    doc.setFontSize(10);
    doc.text("Note: Both theoretical and internal assessments carry the same credit hours",
        105, doc.lastAutoTable.finalY + 45, { align: 'center' });

    doc.save('grade-4-8-report-' + (student.name || "student") + '.pdf');
}

function saveFinalReport4to8() {
    var calculation = calculateGrade4to8();
    var name = document.getElementById('studentName4to8').value.trim() || 'Unnamed Student';
    var roll = document.getElementById('rollNumber4to8').value.trim() || 'N/A';
    var grade = document.getElementById('gradeLevel4to8').value || '4';
    var teacher = document.getElementById('classTeacher4to8').value.trim() || 'N/A';

    // Create report object
    var report = {
        name: name,
        roll: roll,
        grade: grade,
        teacher: teacher,
        finalGPA: calculation.gpa.toFixed(2),
        subjects: calculation.results,
        savedAt: new Date().toLocaleString()
    };

    // Save to localStorage
    var allReports = JSON.parse(localStorage.getItem('studentReports4to8') || '[]');
    allReports.push(report);
    localStorage.setItem('studentReports4to8', JSON.stringify(allReports));

    alert('Report saved successfully!');
    return report;
}

// Helper functions (same for both grade categories)

function getGradeFromGP(gp) {
    if (gp >= 3.6) return "A+";
    if (gp >= 3.2) return "A";
    if (gp >= 2.8) return "B+";
    if (gp >= 2.4) return "B";
    if (gp >= 2.0) return "C+";
    if (gp >= 1.6) return "C";
    if (gp >= 0.8) return "D";
    return "NG";
}