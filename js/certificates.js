// Certificate Management System
const CertificateManager = {
    currentUser: null,
    courses: [],
    certificates: [],

    async init() {
        // Check authentication
        const user = auth.currentUser;
        if (!user) {
            window.location.href = 'login-firebase.html';
            return;
        }
        this.currentUser = user;
        await this.loadData();
        this.renderDashboard();
    },

    async loadData() {
        try {
            // Load user's enrolled courses
            this.courses = await this.getUserCourses();
            // Load issued certificates
            this.certificates = await this.getUserCertificates();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },

    async getUserCourses() {
        // Mock enrolled courses with progress
        // In production, fetch from Firestore applications collection
        return [
            { id: 'az-900', title: 'Microsoft Azure Fundamentals (AZ-900)', progress: 100, completedDate: '2026-03-15', lessons: 45, completedLessons: 45 },
            { id: 'cybersec', title: 'Cybersecurity Essentials', progress: 100, completedDate: '2026-03-10', lessons: 60, completedLessons: 60 },
            { id: 'intune', title: 'Microsoft Intune & Endpoint Management', progress: 75, completedDate: null, lessons: 50, completedLessons: 38 },
            { id: 'networking', title: 'Networking Fundamentals', progress: 45, completedDate: null, lessons: 40, completedLessons: 18 }
        ];
    },

    async getUserCertificates() {
        // Fetch from Firestore certificates collection
        if (!db) return [];
        const certsRef = collection(db, 'certificates');
        const q = query(certsRef, where('userId', '==', this.currentUser.uid));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getCertStatus(course) {
        // Check if certificate already issued
        const existing = this.certificates.find(c => c.courseId === course.id);
        if (existing) return 'issued';
        
        // Check if eligible (100% complete)
        if (course.progress >= 100 && course.completedDate) return 'ready';
        
        // Check if in progress (50-99%)
        if (course.progress >= 50) return 'in-progress';
        
        // Not eligible
        return 'not-eligible';
    },

    renderDashboard() {
        // Update stats
        document.getElementById('totalCourses').textContent = this.courses.length;
        document.getElementById('certsIssued').textContent = this.certificates.length;
        document.getElementById('certsReady').textContent = this.courses.filter(c => this.getCertStatus(c) === 'ready').length;
        document.getElementById('certsInProgress').textContent = this.courses.filter(c => this.getCertStatus(c) === 'in-progress').length;

        // Render courses
        const container = document.getElementById('coursesContainer');
        container.innerHTML = this.courses.map(course => this.renderCourseCard(course)).join('');

        // Render certificate history
        if (this.certificates.length > 0) {
            document.getElementById('historySection').style.display = 'block';
            document.getElementById('historyContainer').innerHTML = this.certificates.map(cert => this.renderCertHistory(cert)).join('');
        }
    },

    renderCourseCard(course) {
        const status = this.getCertStatus(course);
        const cert = this.certificates.find(c => c.courseId === course.id);
        
        const statusLabels = {
            'not-eligible': 'Not Eligible',
            'in-progress': 'In Progress',
            'ready': 'Ready to Generate',
            'issued': 'Certificate Issued'
        };

        const statusClasses = {
            'not-eligible': 'status-not-eligible',
            'in-progress': 'status-in-progress',
            'ready': 'status-ready',
            'issued': 'status-issued'
        };

        return `
            <div class="course-cert-card">
                <div class="course-cert-header">
                    <div class="course-cert-title">${course.title}</div>
                    <div class="cert-status-badge ${statusClasses[status]}">${statusLabels[status]}</div>
                </div>
                <div class="progress-section">
                    <div class="progress-label">Course Progress: ${course.progress}%</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                    </div>
                </div>
                <div class="cert-meta">
                    <span><i class="fas fa-video"></i> ${course.completedLessons}/${course.lessons} Lessons</span>
                    ${course.completedDate ? `<span><i class="fas fa-calendar-check"></i> Completed: ${new Date(course.completedDate).toLocaleDateString()}</span>` : ''}
                    ${cert ? `<span><i class="fas fa-certificate"></i> Issued: ${new Date(cert.issuedDate).toLocaleDateString()}</span>` : ''}
                </div>
                <div class="cert-actions">
                    ${status === 'ready' ? `<button class="btn-cert primary" onclick="CertificateManager.generateCertificate('${course.id}')"><i class="fas fa-plus-circle"></i> Generate Certificate</button>` : ''}
                    ${status === 'issued' ? `
                        <button class="btn-cert primary" onclick="CertificateManager.previewCertificate('${cert.id}')"><i class="fas fa-eye"></i> Preview</button>
                        <button class="btn-cert secondary" onclick="CertificateManager.downloadCertificate('${cert.id}')"><i class="fas fa-download"></i> Download PDF</button>
                        <button class="btn-cert secondary" onclick="CertificateManager.shareLinkedIn('${cert.id}')"><i class="fab fa-linkedin"></i> Share</button>
                    ` : ''}
                    ${status === 'in-progress' || status === 'not-eligible' ? `<button class="btn-cert secondary" onclick="window.location.href='${course.id}.html'"><i class="fas fa-play"></i> Continue Learning</button>` : ''}
                </div>
            </div>
        `;
    },

    renderCertHistory(cert) {
        return `
            <div class="cert-history-card">
                <div class="cert-id">Certificate ID: ${cert.certificateId}</div>
                <h3 style="color: white; margin-bottom: 10px;">${cert.courseTitle}</h3>
                <div class="cert-meta">
                    <span><i class="fas fa-user"></i> ${cert.studentName}</span>
                    <span><i class="fas fa-calendar"></i> Issued: ${new Date(cert.issuedDate).toLocaleDateString()}</span>
                </div>
                <div class="cert-actions" style="margin-top: 15px;">
                    <button class="btn-cert primary" onclick="CertificateManager.previewCertificate('${cert.id}')"><i class="fas fa-eye"></i> View</button>
                    <button class="btn-cert secondary" onclick="CertificateManager.downloadCertificate('${cert.id}')"><i class="fas fa-download"></i> Download</button>
                    <button class="btn-cert secondary" onclick="CertificateManager.verifyCertificate('${cert.certificateId}')"><i class="fas fa-shield-alt"></i> Verify</button>
                </div>
            </div>
        `;
    },

    async generateCertificate(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course || this.getCertStatus(course) !== 'ready') return;

        try {
            const profile = await getUserProfile(this.currentUser.uid);
            const certificateId = this.generateCertificateId();
            
            const certData = {
                userId: this.currentUser.uid,
                studentName: profile.fullName || this.currentUser.email,
                courseId: course.id,
                courseTitle: course.title,
                completedDate: course.completedDate,
                issuedDate: new Date().toISOString(),
                certificateId: certificateId,
                status: 'active',
                verificationToken: this.generateVerificationToken()
            };

            // Save to Firestore
            const certRef = await addDoc(collection(db, 'certificates'), certData);
            certData.id = certRef.id;
            
            this.certificates.push(certData);
            this.renderDashboard();
            
            alert('Certificate generated successfully!');
            this.previewCertificate(certRef.id);
        } catch (error) {
            console.error('Error generating certificate:', error);
            alert('Failed to generate certificate. Please try again.');
        }
    },

    generateCertificateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `DTG-${timestamp}-${random}`.toUpperCase();
    },

    generateVerificationToken() {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    },

    previewCertificate(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert) return;

        const html = this.generateCertificateHTML(cert);
        document.getElementById('certPreview').innerHTML = html;
        document.getElementById('certModal').style.display = 'flex';
    },

    generateCertificateHTML(cert) {
        return `
            <div class="certificate-template" id="certificateContent">
                <div class="cert-border">
                    <div class="cert-logo">
                        <div class="logo-text"><i class="fas fa-globe"></i> DigiTech Globals Academy</div>
                    </div>
                    <div class="cert-main-title">Certificate of Completion</div>
                    <div class="cert-awarded-to">This certificate is proudly awarded to</div>
                    <div style="text-align: center;">
                        <span class="cert-student-name">${cert.studentName}</span>
                    </div>
                    <div class="cert-course-title">
                        For successfully completing<br>
                        <strong>${cert.courseTitle}</strong>
                    </div>
                    <div class="cert-dates">
                        <div class="cert-date-item">
                            <div class="cert-date-label">Completion Date</div>
                            <div class="cert-date-value">${new Date(cert.completedDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</div>
                        </div>
                        <div class="cert-date-item">
                            <div class="cert-date-label">Issue Date</div>
                            <div class="cert-date-value">${new Date(cert.issuedDate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</div>
                        </div>
                    </div>
                    <div class="cert-signature">
                        <div class="cert-signature-line"></div>
                        <div class="cert-signature-name">Andong Yonas</div>
                        <div class="cert-signature-title">Director, DigiTech Globals Academy</div>
                    </div>
                    <div class="cert-footer">
                        Certificate ID: ${cert.certificateId}<br>
                        Verify at: digitechglobals.com/verify/${cert.verificationToken}
                    </div>
                    <div class="cert-seal"><i class="fas fa-award"></i></div>
                </div>
            </div>
            <div style="padding: 20px; text-align: center; background: #f3f4f6;">
                <button class="btn-cert primary" onclick="CertificateManager.downloadCertificate('${cert.id}')"><i class="fas fa-download"></i> Download PDF</button>
                <button class="btn-cert secondary" onclick="CertificateManager.printCertificate()"><i class="fas fa-print"></i> Print</button>
            </div>
        `;
    },

    async downloadCertificate(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert) return;

        // Generate HTML first
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.generateCertificateHTML(cert);
        const certElement = tempDiv.querySelector('.certificate-template');

        const opt = {
            margin: 0,
            filename: `DigiTech_Certificate_${cert.certificateId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        html2pdf().set(opt).from(certElement).save();
    },

    printCertificate() {
        window.print();
    },

    shareLinkedIn(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert) return;
        
        const url = encodeURIComponent(`https://digitechglobals.com/verify/${cert.verificationToken}`);
        const text = encodeURIComponent(`I just earned a certificate in ${cert.courseTitle} from DigiTech Globals Academy!`);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
    },

    verifyCertificate(certificateId) {
        alert(`Verifying Certificate: ${certificateId}\n\nThis certificate is valid and was issued by DigiTech Globals Academy.`);
    }
};

function closePreview() {
    document.getElementById('certModal').style.display = 'none';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    CertificateManager.init();
});
