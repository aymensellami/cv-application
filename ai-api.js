// Module IA pour la génération automatique de CV
// Simule une IA ou appelle une API d'IA réelle

class AIModule {
    constructor(dataService) {
        this.dataService = dataService;
        this.init();
    }

    init() {
        this.setupEvents();
        this.setupAIApi(); // CORRECTION: Appel de la fonction correctement
    }

    setupEvents() {
        // Options de génération de CV
        document.getElementById('generateSimpleCV').addEventListener('click', () => {
            this.generateCV('simple');
        });
        
        document.getElementById('generateModernCV').addEventListener('click', () => {
            this.generateCV('modern');
        });
        
        document.getElementById('generateTechCV').addEventListener('click', () => {
            this.generateCV('tech');
        });
        
        // Utiliser les données existantes
        document.getElementById('useExistingData').addEventListener('click', () => {
            this.useExistingData();
        });
        
        // Simuler des données IA
        document.getElementById('simulateAIData').addEventListener('click', () => {
            this.simulateAIData();
        });
        
        // Appeler une IA réelle (simulation)
        document.getElementById('callRealAI').addEventListener('click', () => {
            this.callRealAI();
        });
        
        // Écouter les mises à jour des données
        document.addEventListener('cvDataUpdated', (event) => {
            this.showAIStatus('Données mises à jour depuis le module classique', 'info');
        });
    }

    setupAIApi() {
        // Configuration simplifiée - pas besoin de chemin vers dossier
        this.isAIAvailable = true;
        
        // Vérifier si l'API existe (si vous utilisez ai-api.js)
        if (typeof window.MockAIApi !== 'undefined') {
            console.log('API IA disponible');
        } else {
            console.log('Mode simulation IA activé');
        }
    }

    async generateCV(type) {
        // Vérifier s'il y a des données
        const currentData = this.dataService.getCurrentData();
        
        if (Object.keys(currentData).length === 0) {
            if (!confirm('Aucune donnée n\'a été trouvée. Voulez-vous que l\'IA simule des données de démonstration ?')) {
                this.showAIStatus('Génération annulée. Veuillez d\'abord saisir des données dans le module classique.', 'error');
                return;
            }
            this.simulateAIData();
            // Recharger les données après simulation
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Afficher l'animation de traitement
        this.showProcessing(true);
        
        try {
            // Simuler un appel API (dans la réalité, ce serait une vraie API)
            const cvHTML = await this.callMockAIApi(type);
            
            // Afficher le résultat
            this.displayCVResult(cvHTML);
            
            this.showAIStatus(`CV ${type} généré avec succès par l'IA !`, 'success');
            
        } catch (error) {
            console.error('Erreur lors de la génération du CV:', error);
            this.showAIStatus('Erreur lors de la génération du CV. Utilisation du générateur local.', 'error');
            
            // En cas d'erreur, utiliser le générateur local
            const cvHTML = this.generateCVLocally(type);
            this.displayCVResult(cvHTML);
        } finally {
            this.showProcessing(false);
        }
    }

    async callMockAIApi(type) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Récupérer les données actuelles
        const data = this.dataService.getCurrentData();
        
        // Vérifier si on a une API externe
        if (typeof window.MockAIApi !== 'undefined' && window.MockAIApi.generateCV) {
            // Utiliser l'API externe si disponible
            const result = await window.MockAIApi.generateCV(data, type);
            return result.cv || result;
        } else {
            // Sinon, générer localement
            return this.generateCVLocally(type, data);
        }
    }

    generateCVLocally(type, customData = null) {
        const data = customData || this.dataService.getCurrentData();
        
        switch(type) {
            case 'simple':
                return this.generateSimpleCV(data);
            case 'modern':
                return this.generateModernCV(data);
            case 'tech':
                return this.generateTechCV(data);
            default:
                return this.generateSimpleCV(data);
        }
    }

    generateSimpleCV(data) {
        return `
            <div class="cv-header">
                <h1 class="cv-name">${data.fullName || 'Nom non spécifié'}</h1>
                <div class="cv-title">${data.jobTitle || 'Poste non spécifié'}</div>
                <div class="cv-contact">
                    ${data.email ? `<div class="cv-contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                    ${data.phone ? `<div class="cv-contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                    ${data.address ? `<div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>` : ''}
                </div>
            </div>
            
            ${data.summary ? `
            <div class="cv-section">
                <h2 class="cv-section-title">Profil</h2>
                <p>${data.summary}</p>
            </div>
            ` : ''}
            
            ${data.experiences && data.experiences.length > 0 ? `
            <div class="cv-section">
                <h2 class="cv-section-title">Expérience professionnelle</h2>
                ${data.experiences.map(exp => `
                    <div class="cv-item">
                        <div class="cv-item-header">
                            <div class="cv-item-title">${exp.title}</div>
                            <div class="cv-item-period">${exp.period}</div>
                        </div>
                        <div class="cv-item-subtitle">${exp.company}</div>
                        <div class="cv-item-details">${exp.description}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.educations && data.educations.length > 0 ? `
            <div class="cv-section">
                <h2 class="cv-section-title">Formation</h2>
                ${data.educations.map(edu => `
                    <div class="cv-item">
                        <div class="cv-item-header">
                            <div class="cv-item-title">${edu.degree}</div>
                            <div class="cv-item-period">${edu.year}</div>
                        </div>
                        <div class="cv-item-subtitle">${edu.institution}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.skills && data.skills.length > 0 ? `
            <div class="cv-section">
                <h2 class="cv-section-title">Compétences</h2>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        `;
    }

    generateModernCV(data) {
        return `
            <div class="cv-header" style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h1 class="cv-name" style="color: white;">${data.fullName || 'Nom non spécifié'}</h1>
                <div class="cv-title" style="color: #ecf0f1; font-size: 1.4rem;">${data.jobTitle || 'Poste non spécifié'}</div>
                <div class="cv-contact" style="margin-top: 20px;">
                    ${data.email ? `<div class="cv-contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                    ${data.phone ? `<div class="cv-contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                    ${data.address ? `<div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>` : ''}
                </div>
            </div>
            
            <div class="form-row" style="display: flex; gap: 30px;">
                <div style="flex: 2;">
                    ${data.summary ? `
                    <div class="cv-section">
                        <h2 class="cv-section-title" style="color: #3498db;">Profil professionnel</h2>
                        <p>${data.summary}</p>
                    </div>
                    ` : ''}
                    
                    ${data.experiences && data.experiences.length > 0 ? `
                    <div class="cv-section">
                        <h2 class="cv-section-title" style="color: #3498db;">Expérience</h2>
                        ${data.experiences.map(exp => `
                            <div class="cv-item">
                                <div class="cv-item-header">
                                    <div class="cv-item-title">${exp.title}</div>
                                    <div class="cv-item-period" style="color: #2ecc71;">${exp.period}</div>
                                </div>
                                <div class="cv-item-subtitle" style="color: #2ecc71; font-weight: 600;">${exp.company}</div>
                                <div class="cv-item-details">${exp.description}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <div style="flex: 1;">
                    ${data.skills && data.skills.length > 0 ? `
                    <div class="cv-section">
                        <h2 class="cv-section-title" style="color: #3498db;">Compétences</h2>
                        <div class="skills-list">
                            ${data.skills.map(skill => `<span class="skill-tag" style="background-color: #2ecc71; color: white;">${skill}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${data.educations && data.educations.length > 0 ? `
                    <div class="cv-section">
                        <h2 class="cv-section-title" style="color: #3498db;">Formation</h2>
                        ${data.educations.map(edu => `
                            <div class="cv-item">
                                <div class="cv-item-title">${edu.degree}</div>
                                <div class="cv-item-subtitle">${edu.institution}</div>
                                <div class="cv-item-details">${edu.year}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    generateTechCV(data) {
        // Ajouter des compétences techniques par défaut si nécessaire
        if (!data.skills || data.skills.length === 0) {
            data.skills = ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Git', 'Agile/Scrum'];
        }
        
        return `
            <div class="cv-header" style="background-color: #2c3e50; color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                <h1 class="cv-name" style="color: white;">${data.fullName || 'Nom non spécifié'}</h1>
                <div class="cv-title" style="color: #3498db; font-size: 1.4rem;">${data.jobTitle || 'Poste non spécifié'}</div>
                <div class="cv-contact" style="margin-top: 20px;">
                    ${data.email ? `<div class="cv-contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                    ${data.phone ? `<div class="cv-contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                    ${data.address ? `<div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>` : ''}
                </div>
            </div>
            
            <div class="cv-section">
                <h2 class="cv-section-title" style="color: #2c3e50; border-bottom: 2px solid #3498db;">Compétences techniques</h2>
                <div class="skills-list">
                    ${data.skills.map(skill => `<span class="skill-tag" style="background-color: #3498db; color: white; font-weight: 600;">${skill}</span>`).join('')}
                </div>
            </div>
            
            ${data.experiences && data.experiences.length > 0 ? `
            <div class="cv-section">
                <h2 class="cv-section-title" style="color: #2c3e50; border-bottom: 2px solid #3498db;">Expérience professionnelle</h2>
                ${data.experiences.map(exp => `
                    <div class="cv-item">
                        <div class="cv-item-header">
                            <div class="cv-item-title" style="color: #2c3e50;">${exp.title}</div>
                            <div class="cv-item-period" style="color: #3498db; font-weight: 600;">${exp.period}</div>
                        </div>
                        <div class="cv-item-subtitle" style="color: #3498db; font-weight: 600;">${exp.company}</div>
                        <div class="cv-item-details">${exp.description}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.summary ? `
            <div class="cv-section">
                <h2 class="cv-section-title" style="color: #2c3e50; border-bottom: 2px solid #3498db;">Profil</h2>
                <p>${data.summary}</p>
            </div>
            ` : ''}
            
            ${data.educations && data.educations.length > 0 ? `
            <div class="cv-section">
                <h2 class="cv-section-title" style="color: #2c3e50; border-bottom: 2px solid #3498db;">Formation</h2>
                ${data.educations.map(edu => `
                    <div class="cv-item">
                        <div class="cv-item-header">
                            <div class="cv-item-title" style="color: #2c3e50;">${edu.degree}</div>
                            <div class="cv-item-period" style="color: #3498db;">${edu.year}</div>
                        </div>
                        <div class="cv-item-subtitle">${edu.institution}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        `;
    }

    displayCVResult(cvHTML) {
        const resultElement = document.getElementById('aiResult');
        resultElement.innerHTML = cvHTML;
        resultElement.style.display = 'block';
    }

    showProcessing(show) {
        const processingElement = document.getElementById('aiProcessing');
        const resultElement = document.getElementById('aiResult');
        
        if (show) {
            processingElement.style.display = 'block';
            resultElement.style.display = 'none';
        } else {
            processingElement.style.display = 'none';
        }
    }

    useExistingData() {
        const data = this.dataService.getCurrentData();
        
        if (Object.keys(data).length === 0) {
            this.showAIStatus('Aucune donnée trouvée. Veuillez d\'abord saisir vos informations dans le module classique.', 'error');
        } else {
            this.showAIStatus('Données chargées depuis le module classique avec succès ! Vous pouvez maintenant générer un CV avec IA.', 'success');
        }
    }

    simulateAIData() {
        const demoData = this.dataService.generateDemoData();
        this.showAIStatus('Données de démonstration générées avec succès par l\'IA ! Vous pouvez maintenant générer un CV.', 'success');
        
        // Déclencher un événement pour informer les autres modules
        const event = new CustomEvent('cvDataUpdated', {
            detail: { data: demoData }
        });
        document.dispatchEvent(event);
    }

    async callRealAI() {
        // Simulation d'un appel à une vraie API d'IA
        this.showAIStatus('Connexion à l\'API d\'IA en cours...', 'info');
        this.showProcessing(true);
        
        try {
            // Simuler un appel réseau
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simuler une réponse de l'IA
            const aiResponse = {
                success: true,
                message: "L'IA a analysé vos données et suggère d'ajouter plus de détails sur vos réalisations professionnelles.",
                suggestions: [
                    "Ajouter des chiffres clés dans vos descriptions d'expérience",
                    "Mettre en avant vos compétences techniques au début du CV",
                    "Ajouter une section 'Projets' pour montrer vos réalisations concrètes"
                ]
            };
            
            this.showAIStatus(aiResponse.message, 'success');
            
            // Afficher les suggestions
            let suggestionsHTML = '<div class="ai-process" style="margin-top: 20px;">';
            suggestionsHTML += '<h3><i class="fas fa-lightbulb"></i> Suggestions de l\'IA</h3>';
            suggestionsHTML += '<ul>';
            aiResponse.suggestions.forEach(suggestion => {
                suggestionsHTML += `<li>${suggestion}</li>`;
            });
            suggestionsHTML += '</ul></div>';
            
            const resultElement = document.getElementById('aiResult');
            if (resultElement.innerHTML) {
                resultElement.innerHTML += suggestionsHTML;
            }
            
        } catch (error) {
            this.showAIStatus('Erreur de connexion à l\'API d\'IA. Utilisation du mode simulation.', 'error');
        } finally {
            this.showProcessing(false);
        }
    }

    showAIStatus(message, type) {
        const statusElement = document.getElementById('aiStatusMessage');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Initialiser le module IA
const aiModule = new AIModule(dataService);