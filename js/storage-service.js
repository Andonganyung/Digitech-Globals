// ============================================
// STORAGE SERVICE (FIREBASE STORAGE)
// ============================================
// Handles file uploads for candidate documents

const StorageService = {

    /**
     * Upload candidate document to Firebase Storage
     * @param {File} file - File object from file input
     * @param {string} userId - Firebase Auth user ID
     * @returns {Promise<Object>} - Object with download URL and file name
     */
    async uploadDocument(file, userId) {
        try {
            // Validate file
            if (!file) {
                throw new Error('No file selected');
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('File size must be less than 5MB');
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Only PDF, JPG, and PNG files are allowed');
            }

            // Create unique filename
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${userId}_${timestamp}_${safeName}`;
            const filePath = `documents/${userId}/${fileName}`;

            // Upload file to Firebase Storage
            const storageRef = firebaseStorage.ref(filePath);
            const uploadTask = storageRef.put(file);

            // Return promise that resolves with download URL
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Progress monitoring
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload progress:', progress.toFixed(2) + '%');
                    },
                    (error) => {
                        // Handle upload errors
                        console.error('Upload error:', error);
                        reject(new Error('Failed to upload document. Please try again.'));
                    },
                    async () => {
                        // Upload completed successfully
                        try {
                            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            console.log('File uploaded successfully:', downloadURL);
                            resolve({
                                url: downloadURL,
                                name: file.name,
                                path: filePath,
                                size: file.size,
                                type: file.type
                            });
                        } catch (error) {
                            console.error('Error getting download URL:', error);
                            reject(new Error('Failed to get file URL'));
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Document upload error:', error);
            throw error;
        }
    },

    /**
     * Delete document from Firebase Storage
     * @param {string} filePath - Path to file in storage
     * @returns {Promise<void>}
     */
    async deleteDocument(filePath) {
        try {
            const storageRef = firebaseStorage.ref(filePath);
            await storageRef.delete();
            console.log('Document deleted:', filePath);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw new Error('Failed to delete document');
        }
    },

    /**
     * Get download URL for a document
     * @param {string} filePath - Path to file in storage
     * @returns {Promise<string>} - Download URL
     */
    async getDocumentURL(filePath) {
        try {
            const storageRef = firebaseStorage.ref(filePath);
            const url = await storageRef.getDownloadURL();
            return url;
        } catch (error) {
            console.error('Error getting document URL:', error);
            throw new Error('Failed to get document URL');
        }
    },

    /**
     * List all documents for a user
     * @param {string} userId - Firebase Auth user ID
     * @returns {Promise<Array>} - Array of file metadata
     */
    async listUserDocuments(userId) {
        try {
            const storageRef = firebaseStorage.ref(`documents/${userId}`);
            const result = await storageRef.listAll();
            
            const documents = [];
            for (const itemRef of result.items) {
                const metadata = await itemRef.getMetadata();
                const url = await itemRef.getDownloadURL();
                documents.push({
                    name: metadata.name,
                    url: url,
                    size: metadata.size,
                    contentType: metadata.contentType,
                    created: metadata.timeCreated
                });
            }
            
            return documents;
        } catch (error) {
            console.error('Error listing documents:', error);
            throw new Error('Failed to list documents');
        }
    }
};

// Export for use in other scripts
window.StorageService = StorageService;
