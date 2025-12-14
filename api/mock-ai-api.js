// API simulée pour le module IA
// Dans une application réelle, ce serait un vrai endpoint API

const MockAIApi = {
    // Simuler une API d'IA pour générer un CV
    async generateCV(data, style = 'simple') {
        // Simuler un délai réseau
        await this.simulateNetworkDelay();
        
        // Valider les données
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Aucune donnée fournie pour la génération du CV');
        }
        
        // Générer le CV selon le style demandé
        let cvContent = '';
        
        switch(style) {
            case 'simple':
                cvContent = this.generateSimpleCV(data);
                break;
            case 'modern':
                cvContent = this.generateModernCV(data);
                break;
            case 'tech':
                cvContent = this.generateTechCV(data);
                break;
            default:
                cvContent = this.generateSimpleCV(data);
        }
        
        // Retourner la réponse formatée comme une API
        return {
            success: true,
            timestamp: new Date().toISOString(),
            style: style,
            cv: cvContent,
            suggestions: this.generateAISuggestions(data),
            metadata: {
                processingTime: '1.5s',
                model: 'cv-generator-v1',
                confidence: 0.85
            }
        };
    },
    
    // Simuler une API d'IA pour analyser et améliorer un CV existant
    async analyzeCV(data) {
        await this.simulateNetworkDelay();
        
        return {
            success: true,
            analysis: {
                completeness: this.calculateCompleteness(data),
                strengths: this.identifyStrengths(data),
                weaknesses: this.identifyWeaknesses(data),
                recommendations: this.generateRecommendations(data),
                score: this.calculateCVScore(data)
            }
        };
    },
    
    // Simuler une API d'IA pour suggérer des améliorations
    async suggestImprovements(data) {
        await this.simulateNetworkDelay();
        
        return {
            success: true,
            suggestions: this.generateAISuggestions(data),
            estimatedImprovement: '40%',
            priorityAreas: this.getPriorityAreas(data)
        };
    },
    
    // Générer un CV simple
    generateSimpleCV(data) {
        return `
            <div class="cv-header">
                <h1 class="cv-name">${data.fullName || ''}</h1>
                <div class="cv-title">${data.jobTitle || ''}</div>
                <div class="cv-contact">
                    ${data.email ? `<div>${data.email}</div>` : ''}
                    ${data.phone ? `<div>${data.phone}</div>` : ''}
                </div>
            </div>
            ${data.summary ? `<div class="cv-section"><h2>Profil</h2><p>${data.summary}</p></div>` : ''}
            ${this.generateExperiencesSection(data)}
            ${this.generateEducationSection(data)}
            ${this.generateSkillsSection(data)}
        `;
    },
    
    // Générer un CV moderne
    generateModernCV(data) {
        return `
            <div style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 30px; border-radius: 8px;">
                <h1 style="margin: 0;">${data.fullName || ''}</h1>
                <h2 style="color: #ecf0f1;">${data.jobTitle || ''}</h2>
            </div>
            <div style="display: flex; gap: 30px; margin-top: 30px;">
                <div style="flex: 2;">
                    ${data.summary ? `<div><h3>Profil</h3><p>${data.summary}</p></div>` : ''}
                    ${this.generateExperiencesSection(data, true)}
                </div>
                <div style="flex: 1;">
                    ${this.generateSkillsSection(data, true)}
                    ${this.generateEducationSection(data)}
                </div>
            </div>
        `;
    },
    
    // Générer un CV technique
    generateTechCV(data) {
        // Enrichir les compétences techniques si nécessaire
        if (data.skills && data.skills.length < 3) {
            data.skills = [...(data.skills || []), 'Git', 'Methodologies Agiles', 'Résolution de problèmes'];
        }
        
        return `
            <div style="background-color: #2c3e50; color: white; padding: 30px; border-radius: 8px;">
                <h1 style="margin: 0;">${data.fullName || ''}</h1>
                <h2 style="color: #3498db;">${data.jobTitle || ''}</h2>
            </div>
            <div style="margin-top: 30px;">
                <h3 style="color: #2c3e50;">Compétences Techniques</h3>
                <div>${this.generateSkillsSection(data, false, true)}</div>
                ${this.generateExperiencesSection(data, false, true)}
                ${data.summary ? `<div><h3>Profil</h3><p>${data.summary}</p></div>` : ''}
                ${this.generateEducationSection(data)}
            </div>
        `;
    },
    
    // Générer la section expériences
    generateExperiencesSection(data, modern = false, tech = false) {
        if (!data.experiences || data.experiences.length === 0) {
            return '<div><h3>Expérience Professionnelle</h3><p>Aucune expérience renseignée</p></div>';
        }
        
        let section = '<div><h3>Expérience Professionnelle</h3>';
        
        data.experiences.forEach(exp => {
            if (modern) {
                section += `
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${exp.title}</strong>
                            <span style="color: #2ecc71;">${exp.period}</span>
                        </div>
                        <div style="color: #3498db; font-weight: 600;">${exp.company}</div>
                        <p>${exp.description}</p>
                    </div>
                `;
            } else if (tech) {
                section += `
                    <div style="margin-bottom: 20px; border-left: 3px solid #3498db; padding-left: 15px;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong style="color: #2c3e50;">${exp.title}</strong>
                            <span style="color: #3498db; font-weight: 600;">${exp.period}</span>
                        </div>
                        <div style="color: #3498db; font-weight: 600;">${exp.company}</div>
                        <p>${exp.description}</p>
                    </div>
                `;
            } else {
                section += `
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${exp.title}</strong>
                            <span>${exp.period}</span>
                        </div>
                        <div style="font-style: italic;">${exp.company}</div>
                        <p>${exp.description}</p>
                    </div>
                `;
            }
        });
        
        section += '</div>';
        return section;
    },
    
    // Générer la section formation
    generateEducationSection(data) {
        if (!data.educations || data.educations.length === 0) {
            return '';
        }
        
        let section = '<div><h3>Formation</h3>';
        
        data.educations.forEach(edu => {
            section += `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>${edu.degree}</strong>
                        <span>${edu.year}</span>
                    </div>
                    <div>${edu.institution}</div>
                </div>
            `;
        });
        
        section += '</div>';
        return section;
    },
    
    // Générer la section compétences
    generateSkillsSection(data, modern = false, tech = false) {
        if (!data.skills || data.skills.length === 0) {
            return '';
        }
        
        let section = '<div><h3>Compétences</h3><div style="display: flex; flex-wrap: wrap; gap: 10px;">';
        
        data.skills.forEach(skill => {
            if (modern) {
                section += `<span style="background-color: #2ecc71; color: white; padding: 8px 15px; border-radius: 20px;">${skill}</span>`;
            } else if (tech) {
                section += `<span style="background-color: #3498db; color: white; padding: 8px 15px; border-radius: 20px; font-weight: 600;">${skill}</span>`;
            } else {
                section += `<span style="background-color: #ecf0f1; padding: 8px 15px; border-radius: 20px;">${skill}</span>`;
            }
        });
        
        section += '</div></div>';
        return section;
    },
    
    // Générer des suggestions d'IA
    generateAISuggestions(data) {
        const suggestions = [];
        
        // Analyser les données et générer des suggestions pertinentes
        if (!data.summary || data.summary.length < 50) {
            suggestions.push("Ajoutez un profil professionnel plus détaillé (minimum 50 caractères)");
        }
        
        if (!data.experiences || data.experiences.length === 0) {
            suggestions.push("Ajoutez au moins une expérience professionnelle");
        } else {
            data.experiences.forEach((exp, index) => {
                if (!exp.description || exp.description.length < 20) {
                    suggestions.push(`Détaillez davantage votre expérience chez ${exp.company || 'cet employeur'}`);
                }
            });
        }
        
        if (!data.skills || data.skills.length < 3) {
            suggestions.push("Ajoutez plus de compétences (minimum 3 recommandé)");
        }
        
        if (data.skills && data.skills.length > 0) {
            // Vérifier si les compétences sont spécifiques
            const specificSkills = data.skills.filter(skill => 
                skill.length > 3 && !['Microsoft Office', 'Travail en équipe', 'Communication'].includes(skill)
            );
            
            if (specificSkills.length < data.skills.length / 2) {
                suggestions.push("Ajoutez des compétences plus spécifiques et techniques");
            }
        }
        
        // Suggestions génériques
        suggestions.push("Utilisez des verbes d'action dans vos descriptions (développé, géré, réalisé, etc.)");
        suggestions.push("Incluez des chiffres pour quantifier vos réalisations");
        
        return suggestions.slice(0, 5); // Limiter à 5 suggestions
    },
    
    // Calculer le score de complétude du CV
    calculateCompleteness(data) {
        let score = 0;
        let total = 0;
        
        if (data.fullName) score += 10; total += 10;
        if (data.email) score += 10; total += 10;
        if (data.jobTitle) score += 10; total += 10;
        if (data.summary && data.summary.length > 30) score += 15; total += 15;
        if (data.experiences && data.experiences.length > 0) score += 20; total += 20;
        if (data.educations && data.educations.length > 0) score += 15; total += 15;
        if (data.skills && data.skills.length > 2) score += 20; total += 20;
        
        return Math.round((score / total) * 100);
    },
    
    // Identifier les points forts
    identifyStrengths(data) {
        const strengths = [];
        
        if (data.summary && data.summary.length > 100) {
            strengths.push("Profil professionnel bien rédigé et détaillé");
        }
        
        if (data.experiences && data.experiences.length >= 2) {
            strengths.push("Expérience professionnelle solide");
        }
        
        if (data.skills && data.skills.length >= 5) {
            strengths.push("Large éventail de compétences");
        }
        
        if (data.educations && data.educations.length >= 2) {
            strengths.push("Formation académique complète");
        }
        
        return strengths.length > 0 ? strengths : ["Bon potentiel, à développer davantage"];
    },
    
    // Identifier les points faibles
    identifyWeaknesses(data) {
        const weaknesses = [];
        
        if (!data.summary || data.summary.length < 30) {
            weaknesses.push("Profil professionnel trop succinct");
        }
        
        if (!data.experiences || data.experiences.length === 0) {
            weaknesses.push("Manque d'expérience professionnelle");
        }
        
        if (!data.skills || data.skills.length < 3) {
            weaknesses.push("Peu de compétences listées");
        }
        
        return weaknesses;
    },
    
    // Générer des recommandations
    generateRecommendations(data) {
        const recommendations = [];
        
        if (this.calculateCompleteness(data) < 70) {
            recommendations.push("Complétez les sections manquantes pour améliorer votre CV");
        }
        
        if (data.experiences) {
            const hasQuantifiableAchievements = data.experiences.some(exp => 
                exp.description && /\d+/.test(exp.description)
            );
            
            if (!hasQuantifiableAchievements) {
                recommendations.push("Ajoutez des réalisations quantifiables dans vos expériences");
            }
        }
        
        recommendations.push("Adaptez votre CV à chaque poste que vous visez");
        recommendations.push("Faites relire votre CV par un professionnel");
        
        return recommendations;
    },
    
    // Calculer un score global pour le CV
    calculateCVScore(data) {
        const completeness = this.calculateCompleteness(data);
        const experienceScore = data.experiences ? Math.min(data.experiences.length * 10, 30) : 0;
        const skillsScore = data.skills ? Math.min(data.skills.length * 3, 30) : 0;
        
        return Math.round((completeness + experienceScore + skillsScore) / 3);
    },
    
    // Obtenir les domaines prioritaires d'amélioration
    getPriorityAreas(data) {
        const areas = [];
        
        if (!data.summary || data.summary.length < 50) {
            areas.push({ area: "Profil professionnel", priority: "Haute" });
        }
        
        if (!data.experiences || data.experiences.length === 0) {
            areas.push({ area: "Expérience professionnelle", priority: "Haute" });
        }
        
        if (data.experiences && data.experiences.length > 0) {
            const hasDetailedDescriptions = data.experiences.every(exp => 
                exp.description && exp.description.length > 30
            );
            
            if (!hasDetailedDescriptions) {
                areas.push({ area: "Descriptions d'expérience", priority: "Moyenne" });
            }
        }
        
        if (!data.skills || data.skills.length < 3) {
            areas.push({ area: "Compétences", priority: "Moyenne" });
        }
        
        return areas;
    },
    
    // Simuler un délai réseau
    simulateNetworkDelay() {
        return new Promise(resolve => {
            setTimeout(resolve, Math.random() * 1000 + 500); // 500-1500ms
        });
    },
    
    // Vérifier la disponibilité de l'API
    async checkAvailability() {
        await this.simulateNetworkDelay();
        
        // Simuler une disponibilité aléatoire pour plus de réalisme
        const isAvailable = Math.random() > 0.1; // 90% de disponibilité
        
        return {
            available: isAvailable,
            responseTime: Math.random() * 200 + 100, // 100-300ms
            message: isAvailable ? "API d'IA disponible" : "API d'IA temporairement indisponible"
        };
    }
};

// Exporter l'API pour une utilisation dans le module IA
// Dans une application réelle avec des modules ES6, on utiliserait:
// export default MockAIApi;

// Pour cette démo, on l'expose globalement
if (typeof window !== 'undefined') {
    window.MockAIApi = MockAIApi;
}