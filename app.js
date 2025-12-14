// Fichier principal de l'application
// Coordonne les différents modules et gère l'interface utilisateur

class CVApp {
    constructor(classicModule, aiModule, dataService) {
        this.classicModule = classicModule;
        this.aiModule = aiModule;
        this.dataService = dataService;
        this.init();
    }

    init() {
        // Configurer les onglets
        this.setupTabs();
        
        // Configurer les événements de l'aperçu
        this.setupPreviewEvents();
        
        // Initialiser l'aperçu
        this.updatePreview();
        
        // Écouter les mises à jour des données
        this.setupDataListeners();
        
        console.log('Application CV avec IA initialisée avec succès');
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Désactiver tous les onglets
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                // Activer l'onglet sélectionné
                tab.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Si on passe à l'onglet aperçu, mettre à jour l'affichage
                if (targetTab === 'preview') {
                    this.updatePreview();
                }
            });
        });
    }

    setupPreviewEvents() {
        document.getElementById('refreshPreview').addEventListener('click', () => {
            this.updatePreview();
            this.showPreviewStatus('Aperçu actualisé avec succès !', 'success');
        });
        
        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportPDF();
        });
        
        document.getElementById('printCV').addEventListener('click', () => {
            this.printCV();
        });
    }

    setupDataListeners() {
        // Écouter les mises à jour des données depuis les autres modules
        document.addEventListener('cvDataUpdated', (event) => {
            this.updatePreview();
        });
    }

    updatePreview() {
        const previewElement = document.getElementById('cvPreview');
        const data = this.dataService.getCurrentData();
        
        if (Object.keys(data).length === 0) {
            previewElement.innerHTML = `
                <p class="text-center">Aucune donnée de CV disponible. Veuillez :</p>
                <ul style="max-width: 500px; margin: 20px auto;">
                    <li>Saisir vos informations dans le <strong>Module Classique</strong></li>
                    <li>Ou générer un CV avec l'<strong>Module IA</strong></li>
                </ul>
            `;
            return;
        }
        
        // Générer un aperçu simple des données
        previewElement.innerHTML = this.generatePreviewCV(data);
    }

    generatePreviewCV(data) {
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
                <h2 class="cv-section-title">Profil professionnel</h2>
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

    exportPDF() {
        // Simulation d'export PDF
        this.showPreviewStatus('Export PDF simulé. Dans une application réelle, cette fonctionnalité générerait un fichier PDF téléchargeable.', 'info');
        
        // Dans une application réelle, on utiliserait une bibliothèque comme jsPDF
        // Exemple: 
        // const doc = new jsPDF();
        // doc.text('CV de ' + this.dataService.getCurrentData().fullName, 10, 10);
        // doc.save('cv.pdf');
    }

    printCV() {
        window.print();
    }

    showPreviewStatus(message, type) {
        const statusElement = document.getElementById('previewStatusMessage');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Initialiser l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const app = new CVApp(classicModule, aiModule, dataService);
});