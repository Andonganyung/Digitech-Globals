/**
 * Course Progress Tracker
 * Automatically tracks student progress when they access course content
 * Include this script on all course pages
 */

const CourseTracker = {
    currentCourseId: null,
    currentUser: null,

    /**
     * Initialize tracker on course page
     * Call this with the course ID when page loads
     */
    async init(courseId) {
        this.currentCourseId = courseId;
        
        // Check if user is logged in
        if (!auth.currentUser) {
            console.log('User not logged in - progress tracking disabled');
            return;
        }

        this.currentUser = auth.currentUser;
        
        // Initialize course progress
        await CourseCompletion.initCourseProgress(this.currentUser.uid, courseId);
        
        console.log(`Tracking enabled for course: ${courseId}`);
    },

    /**
     * Mark a lesson as completed
     * Call this when student finishes a lesson
     */
    async completeLesson(lessonNumber) {
        if (!this.currentUser || !this.currentCourseId) return;

        await CourseCompletion.updateLessonProgress(
            this.currentUser.uid,
            this.currentCourseId,
            lessonNumber
        );

        console.log(`Lesson ${lessonNumber} completed for ${this.currentCourseId}`);
    },

    /**
     * Mark a quiz as completed
     * Call this when student passes a quiz
     */
    async completeQuiz(quizNumber, passed = true) {
        if (!this.currentUser || !this.currentCourseId) return;

        await CourseCompletion.updateQuizProgress(
            this.currentUser.uid,
            this.currentCourseId,
            quizNumber,
            passed
        );

        console.log(`Quiz ${quizNumber} ${passed ? 'passed' : 'failed'} for ${this.currentCourseId}`);
    },

    /**
     * Mark entire course as complete
     * Call this when all requirements are met
     */
    async completeCourse() {
        if (!this.currentUser || !this.currentCourseId) return;

        await CourseCompletion.markCourseComplete(
            this.currentUser.uid,
            this.currentCourseId
        );

        // Show completion message
        alert(`Congratulations! You've completed this course. Visit the Certificates page to generate your certificate.`);
        
        console.log(`Course ${this.currentCourseId} marked as complete`);
    },

    /**
     * Get current progress
     */
    async getProgress() {
        if (!this.currentUser || !this.currentCourseId) return null;

        return await CourseCompletion.getCourseProgress(
            this.currentUser.uid,
            this.currentCourseId
        );
    }
};

// Export for global use
window.CourseTracker = CourseTracker;

/**
 * USAGE EXAMPLES FOR COURSE PAGES:
 * 
 * // In az-900.html:
 * <script src="../js/firebase-config.js"></script>
 * <script src="../js/auth-service.js"></script>
 * <script src="../js/course-completion.js"></script>
 * <script src="../js/course-tracker.js"></script>
 * <script>
 *   document.addEventListener('DOMContentLoaded', () => {
 *     CourseTracker.init('az-900');
 *   });
 * 
 *   // When student completes a lesson:
 *   function onLessonComplete(lessonNumber) {
 *     CourseTracker.completeLesson(lessonNumber);
 *   }
 * 
 *   // When student passes a quiz:
 *   function onQuizComplete(quizNumber, passed) {
 *     CourseTracker.completeQuiz(quizNumber, passed);
 *   }
 * 
 *   // When all lessons complete:
 *   async function checkCompletion() {
 *     const progress = await CourseTracker.getProgress();
 *     if (progress && progress.completedLessons >= progress.totalLessons) {
 *       CourseTracker.completeCourse();
 *     }
 *   }
 * </script>
 */
