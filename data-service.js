// Service de gestion des données pour l'application CV
// Gère le stockage, la récupération et la manipulation des données

class DataService {
    constructor() {
        this.cvData = {};
        this.experienceCount = 1;
        this.educationCount = 1;
    }

    // Sauvegarder les données du formulaire
    saveFormData(formData) {
        this.cvData = {
            fullName: formData.fullName || '',
            jobTitle: formData.jobTitle || '',
            email: formData.email || '',
            phone: formData.phone || '',
            address: formData.address || '',
            summary: formData.summary || '',
            skills: formData.skills || [],
            experiences: formData.experiences || [],
            educations: formData.educations || []
        };

        // Sauvegarder dans localStorage
        localStorage.setItem('cvData', JSON.stringify(this.cvData));
        
        return this.cvData;
    }

    // Charger les données depuis localStorage
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('cvData');
        if (savedData) {
            this.cvData = JSON.parse(savedData);
            return this.cvData;
        }
        return null;
    }

    // Effacer toutes les données
    clearAllData() {
        this.cvData = {};
        this.experienceCount = 1;
        this.educationCount = 1;
        localStorage.removeItem('cvData');
    }

    // Obtenir les données actuelles
    getCurrentData() {
        return this.cvData;
    }

    // Mettre à jour les données
    updateData(newData) {
        this.cvData = { ...this.cvData, ...newData };
        localStorage.setItem('cvData', JSON.stringify(this.cvData));
        return this.cvData;
    }

    // Générer des données de démonstration
    generateDemoData() {
        this.cvData = {
            fullName: "aymen sellami",
            jobTitle: "Développeuse Full Stack",
            email: "aymen.sellami@email.com",
            phone: "+216 000 000",
            address: "ARINA, TUNIS",
            summary: "Développeuse Full Stack avec 5 ans d'expérience dans la création d'applications web modernes. Passionnée par les technologies JavaScript et les architectures cloud. Aime résoudre des problèmes complexes et travailler en équipe agile.",
            skills: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker", "Git", "Agile/Scrum"],
            experiences: [
                {
                    title: "Développeuse Full Stack",
                    company: "TechSolutions SAS",
                    period: "2020 - Présent",
                    description: "Développement d'une plateforme SaaS pour la gestion de projets. Implémentation de nouvelles fonctionnalités frontend avec React et backend avec Node.js. Collaboration avec une équipe de 6 développeurs en méthodologie Agile."
                },
                {
                    title: "Développeuse Frontend",
                    company: "WebInnovation",
                    period: "2018 - 2020",
                    description: "Création d'interfaces utilisateur responsive pour des applications web clients. Optimisation des performances et accessibilité. Participation aux revues de code et à la formation des juniors."
                }
            ],
            educations: [
                {
                    degree: "Ingénieur en Informatique",
                    institution: "ESPRIT",
                    year: "2015"
                },
                {
                    degree: "Licence en Informatique",
                    institution: "ISET",
                    year: "2010"
                }
            ]
        };

        localStorage.setItem('cvData', JSON.stringify(this.cvData));
        return this.cvData;
    }

    // Valider les données
    validateData(data) {
        const errors = [];
        
        if (!data.fullName || data.fullName.trim() === '') {
            errors.push('Le nom complet est requis');
        }
        
        if (!data.email || data.email.trim() === '') {
            errors.push('L\'email est requis');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('L\'email n\'est pas valide');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Vérifier si un email est valide
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Formater les compétences
    formatSkills(skillsString) {
        if (!skillsString) return [];
        return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    }

    // Obtenir des données par défaut
    getDefaultData() {
        return {
            fullName: "aymen sellami",
            jobTitle: "Développeur Web",
            email: "ay@email.com",
            phone: "+216 000 000",
            address: "arina, tunis",
            summary: "Développeur web passionné avec une expérience dans la création d'applications modernes et responsives. Toujours à la recherche de nouveaux défis et technologies à apprendre.",
            skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
            experiences: [
                {
                    title: "Développeur Frontend",
                    company: "Digital Solutions",
                    period: "2021 - Présent",
                    description: "Développement d'interfaces utilisateur pour des applications web clients."
                }
            ],
            educations: [
                {
                    degree: "Licence en Informatique",
                    institution: "ISET",
                    year: "2020"
                }
            ]
        };
    }
}

// Exporter une instance unique du service
const dataService = new DataService();