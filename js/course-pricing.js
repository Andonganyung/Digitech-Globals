// Course pricing data - Online Self-Study vs Class-Based Instructor-Led
const coursePricing = {
    'enterprise-desktop-engineer': { selfStudy: 199, instructorLed: 2495 },
    'sccm-intune-endpoint': { selfStudy: 249, instructorLed: 2795 },
    'az-104': { selfStudy: 149, instructorLed: 2495 },
    'security-plus': { selfStudy: 179, instructorLed: 2295 },
    'ccna-prep': { selfStudy: 199, instructorLed: 2695 },
    'ai-for-it-engineers': { selfStudy: 199, instructorLed: 2195 },
    'intune-endpoint': { selfStudy: 139, instructorLed: 1995 },
    'python-it': { selfStudy: 119, instructorLed: 1895 },
    'powershell-it': { selfStudy: 119, instructorLed: 1995 },
    // Other courses - reasonable instructor-led pricing
    'az-900': { selfStudy: 79, instructorLed: 895 },
    'ms-900': { selfStudy: 79, instructorLed: 895 },
    'cybersec-essentials': { selfStudy: 99, instructorLed: 1195 },
    'networking-fundamentals': { selfStudy: 89, instructorLed: 1095 },
    'computer-basics': { selfStudy: 29, instructorLed: 495 },
    'windows-basics': { selfStudy: 49, instructorLed: 695 },
    'it-support-fundamentals': { selfStudy: 79, instructorLed: 995 },
    'helpdesk-pro': { selfStudy: 99, instructorLed: 1195 },
    'internet-safety': { selfStudy: 39, instructorLed: 495 },
    'ms-excel': { selfStudy: 59, instructorLed: 695 },
    'ms-word': { selfStudy: 49, instructorLed: 595 },
    'ms-powerpoint': { selfStudy: 49, instructorLed: 595 },
    'ms-outlook': { selfStudy: 49, instructorLed: 595 },
    'windows-power': { selfStudy: 99, instructorLed: 1195 },
    'digital-marketing': { selfStudy: 119, instructorLed: 1495 },
    'entrepreneurship': { selfStudy: 129, instructorLed: 1595 },
    'leadership': { selfStudy: 119, instructorLed: 1495 },
    'email-social': { selfStudy: 89, instructorLed: 1095 }
};

function getCoursePricing(courseId) {
    return coursePricing[courseId] || { selfStudy: 99, instructorLed: 1195 };
}
