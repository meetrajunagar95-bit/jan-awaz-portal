# 🎓 College Viva Examination Guide: Jan Awaz Portal
### *Sir Bhavsinhji Polytechnic Institute of Technology — Diploma IT (Sem 5)*

This document is prepared to help you confidently answer questions asked by external and internal examiners during your 5th-semester project viva.

---

## 🌟 Top Viva Questions & Professional Answers

### Q1: What is the main objective of the "Jan Awaz Portal"?
> **Answer:**  
> "The Jan Awaz Portal is an end-to-end civic e-governance platform. Its main objective is to provide citizens with a direct, transparent digital channel to lodge public grievances (such as road potholes, water leaks, sanitation lapses, and streetlight failures) with photo evidence, receive an automated unique tracking token (`JA-2026-XXXX`), and monitor the real-time resolution timeline as municipal officers inspect and fix the issue."

---

### Q2: Why did you choose Next.js and Node.js instead of traditional PHP?
> **Answer:**  
> 1. **Unified Full-Stack Architecture:** Next.js App Router allows us to build modern React user interfaces and serverless API backends in a single TypeScript codebase, eliminating the need to maintain separate backend and frontend servers.
> 2. **Server-Side Rendering (SSR) & Server Components:** Next.js pre-renders pages on the server for instant page loads and strong SEO optimization.
> 3. **Serverless Deployment:** It deploys seamlessly onto cloud platforms like Vercel with zero server maintenance, running 24x7 without depending on our personal PC.
> 4. **Modern Industry Standard:** React and Next.js represent modern web development standards compared to legacy PHP architectures.

---

### Q3: Why did you choose MongoDB Atlas (NoSQL) instead of MySQL or PostgreSQL?
> **Answer:**  
> 1. **Flexible Document Model:** Grievances in Jan Awaz include a chronological resolution timeline (`timeline`), which is an array of updates with changing statuses, timestamps, and officer remarks. In MongoDB, this can be embedded directly inside the complaint document as an array of subdocuments, avoiding complex multi-table joins.
> 2. **Cloud-Native 24x7 Free Tier:** MongoDB Atlas provides a managed M0 cluster accessible from anywhere via TLS encryption, eliminating the need to host and maintain a local MySQL database server.
> 3. **Scalability:** JSON/BSON document storage allows flexible schema evolution as new municipal fields (such as GPS coordinates or ward numbers) are added.

---

### Q4: How is security handled in your portal?
> **Answer:**  
> We implemented 5 layers of security:
> 1. **Password Hashing (bcryptjs):** Passwords are never stored in plain text; they are salted and hashed with 10 rounds of bcrypt.
> 2. **JWT in httpOnly Cookies:** Session tokens are stored in `httpOnly`, `sameSite: lax` cookies. This prevents malicious JavaScript from reading the token, protecting the portal against Cross-Site Scripting (XSS) token theft.
> 3. **Server-Side Validation (Zod):** Every API request payload is strictly validated on the server for data types, lengths, and valid email/phone formats before reaching the database.
> 4. **NoSQL Injection & XSS Protection:** Input strings are sanitized by stripping `<script>` and HTML tags, and query parameters are forced to primitive strings to prevent operator injection (e.g. `$gt`).
> 5. **Rate Limiting:** Sliding window in-memory rate limiting stops brute-force login attempts and spam grievance submissions.

---

### Q5: How does the Complaint ID generator work?
> **Answer:**  
> "In `src/models/Complaint.ts`, we implemented a Mongoose `pre('save')` hook. Before a new grievance is committed to MongoDB, it checks if `complaintId` exists. If not, it retrieves the current year (e.g. 2026) and the total count of complaints, padding it with leading zeros to generate a clean, sequential identifier like `JA-2026-0001`. This ID is indexed uniquely for $O(1)$ fast lookups."

---

### Q6: How does the grievance resolution lifecycle work?
> **Answer:**  
> The grievance moves through 4 distinct stages:
> 1. **Pending Review:** Automatically set upon citizen submission.
> 2. **In Progress:** Assigned when the municipal officer inspects the problem and dispatches field squads.
> 3. **Resolved:** Marked when repair work is completed, and completion remarks are added.
> 4. **Rejected:** Used if a complaint is verified to be a duplicate or outside municipal jurisdiction.
> Every status change appends a new entry to the immutable timeline array with an exact timestamp and the signing officer's name.

---

### Q7: How does the system run 24x7 without your computer being turned on?
> **Answer:**  
> "The frontend and serverless API routes are deployed to **Vercel's global edge network**, and the database is hosted on **MongoDB Atlas cloud**. Both run independently in cloud data centers. When an external examiner or citizen opens the website URL, requests are processed by Vercel serverless microservices connected over secure TLS to Atlas. My local laptop is not acting as a server."

---

## 📋 Quick Demo Walkthrough Script for the Viva
1. **Homepage:** Show live statistics counters (Total, Pending, In Progress, Resolved) and explain the 7 civic categories.
2. **Citizen Flow:**
   - Click "Submit Grievance"
   - Fill in a sample grievance (e.g., Road pothole near Sir BPTI campus)
   - Show the generated Complaint ID (e.g. `JA-2026-0007`) and copy it.
   - Go to "Track Status", paste the ID, and demonstrate the initial "Pending" timeline step.
3. **Officer Flow:**
   - Go to "Admin Portal" (`/admin/login`).
   - Log in with `admin@janawaz.gov.in` / `Admin@JanAwaz2026`.
   - Point out the KPI counters and the Department Grievance Distribution Chart on the dashboard.
   - Go to "Manage Complaints", search for the newly created complaint, and click "Manage".
   - Change status to "In Progress" and add the remark: *"PWD repair team dispatched."*
4. **Verification:**
   - Switch back to the public "Track Status" page, reload the Complaint ID, and show the examiner that the timeline instantly updated with the new stage and officer note!
