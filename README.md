# SmartSheet – NEB Compliant Grade Sheet Generator

SmartSheet is a fully functional, client-side web application that allows schools and educators to generate accurate grade sheets for students from **Grade 1 to Grade 10**, in accordance with the **NEB (National Examination Board)** letter grading system of Nepal.

## 📌 Features

- ✅ Grade Sheet generation for all NEB grade groups: **1–3**, **4–8**, and **9–10**
- ✅ Real-time **percentage, grade, and GPA** calculation
- ✅ Supports **subject-wise internal and theoretical assessment**
- ✅ Clean, responsive, and user-friendly UI
- ✅ Fully compliant with **NEB letter grading policy**
- ✅ Ability to **generate and download** official-style printable report cards (PDF-ready)
- ✅ Works completely offline using **LocalStorage**
- ✅ No backend required

---

## 🛠️ Technologies Used

| Technology    | Purpose                                 |
|---------------|-----------------------------------------|
| **HTML5**     | Markup for form layout and grade sheet  |
| **CSS3**      | Styling and responsiveness              |
| **JavaScript (ES6)** | Logic for grade calculation, GPA, and DOM updates |
| **LocalStorage API** | Store school and student data locally |
| **Font Awesome**     | Icons used in navbar and footer  |
| **AOS Library** *(optional)* | Scroll animations (if included) |

---

## 🎯 Grading Criteria (NEB Letter Grading System)

The system calculates:

- Subject-wise **percentage**, **grade**, and **GPA**
- Uses **credit hours** to determine Weighted Grade Points (WGP)
- Final GPA calculated using total WGP / Total Credit Hours

Each grade group follows a different approach:
- **Grade 1–3**: Thematic Learning Achievement-Based Evaluation
- **Grade 4–8**: Theoretical + Internal (50+50) Marks Split
- **Grade 9–10**: Similar to Grade 4–8 with separate GPA calculation

---

## 🧑‍💻 How to Use

1. Open `create.html` in a browser.
2. Enter **school details**.
3. Select the **student grade category**.
4. Fill in **marks and assessments** per subject.
5. Click **"Generate Grade Sheet"** to view results.
6. Use the **"Save Result"** button to store results in local storage.
7. Download or print the final report card.

> See `use.html` for step-by-step instructions with visuals.

---

## 👨‍👩‍👧‍👦 Contributors

| Name               | Role                    |
|--------------------|-------------------------|
| **Sugam Ghale**     | Team Lead & Developer    |
| **Anuja Bhattarai** | Data Analyst & Tester    |
| **Saubhagya Koirala** | UI Designer & Documentation |

---

## ✅ Project Status

✔️ 100% Complete  
✔️ Fully functional and NEB compliant  
✔️ Final Submission Done  

---

## 📘 License

This project is released under the **MIT License**.

---

## 📞 Contact

For queries or contributions:

📧 Email: `info@sugamghale.com.np`  
📍 Project developed as part of academic coursework – *Shubhashree College of Management*
