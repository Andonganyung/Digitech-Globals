/**
 * Course Completion Tracking System
 * Monitors student progress across all Academy courses
 */

const CourseCompletion = {
    // All Academy courses with their requirements
    courses: {
        'it-support-fundamentals': { title: 'IT Support Fundamentals', lessons: 35, quizzes: 5, duration: 15 },
        'helpdesk-pro': { title: 'Help Desk Professional Certification', lessons: 42, quizzes: 6, duration: 20 },
        'enterprise-desktop-engineer': { title: 'Enterprise Desktop Engineer', lessons: 95, quizzes: 12, duration: 50 },
        'az-900': { title: 'Microsoft Azure Fundamentals (AZ-900)', lessons: 45, quizzes: 8, duration: 20 },
        'az-104': { title: 'Azure Administrator (AZ-104)', lessons: 80, quizzes: 10, duration: 40 },
        'cybersec-essentials': { title: 'Cybersecurity Essentials', lessons: 60, quizzes: 10, duration: 30 },
        'security-plus': { title: 'CompTIA Security+ Certification Prep', lessons: 75, quizzes: 12, duration: 35 },
        'ms-900': { title: 'Microsoft 365 Fundamentals (MS-900)', lessons: 38, quizzes: 6, duration: 18 },
        'intune-endpoint': { title: 'Microsoft Intune & Endpoint Management', lessons: 50, quizzes: 8, duration: 25 },
        'sccm-intune-endpoint': { title: 'SCCM & Intune Advanced Endpoint Management', lessons: 65, quizzes: 10, duration: 32 },
        'networking-fundamentals': { title: 'Networking Fundamentals', lessons: 40, quizzes: 8, duration: 22 },
        'ccna-prep': { title: 'CCNA Certification Preparation', lessons: 85, quizzes: 15, duration: 45 },
        'powershell-it': { title: 'PowerShell for IT Professionals', lessons: 48, quizzes: 10, duration: 24 },
        'python-it': { title: 'Python Automation for IT', lessons: 55, quizzes: 12, duration: 28 },
        'ai-for-it-engineers': { title: 'AI & Machine Learning for IT Engineers', lessons: 62, quizzes: 10, duration: 30 },
        'ms-word': { title: 'Microsoft Word Mastery', lessons: 28, quizzes: 4, duration: 12 },
        'ms-excel': { title: 'Excel for Business & Data Analysis', lessons: 45, quizzes: 8, duration: 20 },
        'ms-powerpoint': { title: 'PowerPoint Presentation Design', lessons: 25, quizzes: 3, duration: 10 },
        'ms-outlook': { title: 'Outlook & Email Management', lessons: 20, quizzes: 3, duration: 8 },
        'windows-basics': { title: 'Windows 11 Basics', lessons: 30, quizzes: 5, duration: 14 },
        'windows-power': { title: 'Windows Power User', lessons: 42, quizzes: 7, duration: 18 },
        'computer-basics': { title: 'Computer Basics for Beginners', lessons: 25, quizzes: 4, duration: 12 },
        'internet-safety': { title: 'Internet Safety & Digital Citizenship', lessons: 18, quizzes: 3, duration: 8 },
        'email-social': { title: 'Email & Social Media Essentials', lessons: 22, quizzes: 4, duration: 10 },
        'entrepreneurship': { title: 'Entrepreneurship Fundamentals', lessons: 40, quizzes: 6, duration: 20 },
        'leadership': { title: 'Leadership & Management Skills', lessons: 35, quizzes: 5, duration: 16 },
        'digital-marketing': { title: 'Digital Marketing Essentials', lessons: 38, quizzes: 6, duration: 18 }
    },

    /**
     * Initialize course progress for a user
     * Creates a progress record in Firestore if it doesn't exist
     */
    async initCourseProgress(userId, courseId) {
        if (!this.courses[courseId]) {
            console.error('Invalid course ID:', courseId);
            return null;
        }

        try {
            const progressRef = collection(db, 'courseProgress');
            const q = query(progressRef, 
                where('userId', '==', userId),
                where('courseId', '==', courseId)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            }

            // Create new progress record
            const courseData = this.courses[courseId];
            const newProgress = {
                userId,
                courseId,
                courseTitle: courseData.title,
                totalLessons: courseData.lessons,
                completedLessons: 0,
                totalQuizzes: courseData.quizzes,
                passedQuizzes: 0,
                progress: 0,
                status: 'not-started',
                startedDate: new Date().toISOString(),
                completedDate: null,
                lastAccessedDate: new Date().toISOString()
            };

            const docRef = await addDoc(progressRef, newProgress);
            return { id: docRef.id, ...newProgress };
        } catch (error) {
            console.error('Error initializing course progress:', error);
            return null;
        }
    },

    /**
     * Update lesson completion
     */
    async updateLessonProgress(userId, courseId, lessonNumber) {
        try {
            const progress = await this.getCourseProgress(userId, courseId);
            if (!progress) return false;

            const completedLessons = Math.min(lessonNumber, progress.totalLessons);
            const newProgress = Math.round((completedLessons / progress.totalLessons) * 100);

            const progressRef = doc(db, 'courseProgress', progress.id);
            await updateDoc(progressRef, {
                completedLessons,
                progress: newProgress,
                lastAccessedDate: new Date().toISOString(),
                status: newProgress >= 100 ? 'completed' : 'in-progress'
            });

            // Check if course is now complete
            if (newProgress >= 100 && !progress.completedDate) {
                await this.markCourseComplete(userId, courseId);
            }

            return true;
        } catch (error) {
            console.error('Error updating lesson progress:', error);
            return false;
        }
    },

    /**
     * Update quiz completion
     */
    async updateQuizProgress(userId, courseId, quizNumber, passed) {
        try {
            const progress = await this.getCourseProgress(userId, courseId);
            if (!progress || !passed) return false;

            const passedQuizzes = Math.min(quizNumber, progress.totalQuizzes);
            
            const progressRef = doc(db, 'courseProgress', progress.id);
            await updateDoc(progressRef, {
                passedQuizzes,
                lastAccessedDate: new Date().toISOString()
            });

            return true;
        } catch (error) {
            console.error('Error updating quiz progress:', error);
            return false;
        }
    },

    /**
     * Mark course as complete
     */
    async markCourseComplete(userId, courseId) {
        try {
            const progress = await this.getCourseProgress(userId, courseId);
            if (!progress) return false;

            const progressRef = doc(db, 'courseProgress', progress.id);
            await updateDoc(progressRef, {
                status: 'completed',
                progress: 100,
                completedDate: new Date().toISOString()
            });

            return true;
        } catch (error) {
            console.error('Error marking course complete:', error);
            return false;
        }
    },

    /**
     * Get course progress for a user
     */
    async getCourseProgress(userId, courseId) {
        try {
            const progressRef = collection(db, 'courseProgress');
            const q = query(progressRef, 
                where('userId', '==', userId),
                where('courseId', '==', courseId)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return await this.initCourseProgress(userId, courseId);
            }

            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        } catch (error) {
            console.error('Error getting course progress:', error);
            return null;
        }
    },

    /**
     * Get all course progress for a user
     */
    async getAllUserProgress(userId) {
        try {
            const progressRef = collection(db, 'courseProgress');
            const q = query(progressRef, where('userId', '==', userId));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting all progress:', error);
            return [];
        }
    },

    /**
     * Check if user is eligible for certificate
     */
    async isCertificateEligible(userId, courseId) {
        const progress = await this.getCourseProgress(userId, courseId);
        if (!progress) return false;

        // Requirements for certificate eligibility:
        // 1. 100% lesson completion
        // 2. Course status is 'completed'
        // 3. Has completion date
        return progress.progress >= 100 && 
               progress.status === 'completed' && 
               progress.completedDate !== null;
    },

    /**
     * Get certificate status for a course
     */
    async getCertificateStatus(userId, courseId) {
        const progress = await this.getCourseProgress(userId, courseId);
        if (!progress) return 'not-eligible';

        // Check if certificate already issued
        const certsRef = collection(db, 'certificates');
        const q = query(certsRef, 
            where('userId', '==', userId),
            where('courseId', '==', courseId)
        );
        const certSnapshot = await getDocs(q);
        if (!certSnapshot.empty) return 'issued';

        // Check eligibility
        if (progress.progress >= 100 && progress.completedDate) {
            return 'ready';
        } else if (progress.progress >= 50) {
            return 'in-progress';
        } else {
            return 'not-eligible';
        }
    }
};

// Export for global use
window.CourseCompletion = CourseCompletion;
