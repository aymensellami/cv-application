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
        
        // Configurer l'export PDF
        this.setupPDFExport();
        
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
        
        // Note: exportPDF est maintenant géré par setupPDFExport()
        document.getElementById('printCV').addEventListener('click', () => {
            this.printCV();
        });
    }

    setupPDFExport() {
        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportCVToPDF();
        });
        
        // Optionnel : bouton pour export stylisé
        this.addPDFButtons();
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

    // Méthode pour exporter en PDF
    async exportCVToPDF() {
        // Vérifier si le service PDF existe
        if (typeof pdfService === 'undefined') {
            this.showPreviewStatus('Service PDF non chargé. Vérifiez que pdf-service.js est inclus.', 'error');
            return;
        }
        
        const data = this.dataService.getCurrentData();
        
        if (Object.keys(data).length === 0) {
            this.showPreviewStatus('❌ Aucune donnée de CV disponible. Veuillez d\'abord saisir vos informations.', 'error');
            return;
        }
        
        // Demander le nom du fichier
        const fileName = prompt('Nom du fichier PDF:', `CV_${data.fullName || 'mon-cv'}.pdf`) || 'mon-cv.pdf';
        
        // Options d'export
        const exportType = confirm('Voulez-vous un export stylisé (recommandé) ou une capture de l\'aperçu ?\n\nOK = Export stylisé\nAnnuler = Capture de l\'aperçu');
        
        try {
            if (exportType) {
                // Export stylisé
                await pdfService.exportStyledCV(data, fileName);
                this.showPreviewStatus('✅ CV exporté en PDF stylisé avec succès !', 'success');
            } else {
                // Capture de l'aperçu
                await pdfService.exportCVToPDF('cvPreview', fileName);
                this.showPreviewStatus('✅ Aperçu exporté en PDF avec succès !', 'success');
            }
        } catch (error) {
            console.error('Erreur export PDF:', error);
            this.showPreviewStatus('❌ Erreur lors de l\'export PDF: ' + error.message, 'error');
        }
    }

    // Optionnel : Ajouter des boutons PDF supplémentaires
    addPDFButtons() {
        const buttonGroup = document.querySelector('.button-group');
        if (buttonGroup && typeof pdfService !== 'undefined') {
            // Vérifier si les boutons n'existent pas déjà
            if (!document.getElementById('exportPreviewPDF')) {
                // Bouton pour exporter l'aperçu
                const exportPreviewBtn = document.createElement('button');
                exportPreviewBtn.id = 'exportPreviewPDF';
                exportPreviewBtn.className = 'btn btn-pdf';
                exportPreviewBtn.innerHTML = '<i class="fas fa-file-image"></i> Exporter aperçu PDF';
                exportPreviewBtn.addEventListener('click', () => {
                    const data = this.dataService.getCurrentData();
                    const fileName = `CV_Aperçu_${data.fullName || 'mon-cv'}.pdf`;
                    pdfService.exportCVToPDF('cvPreview', fileName);
                });
                
                // Bouton pour exporter stylisé
                const exportStyledBtn = document.createElement('button');
                exportStyledBtn.id = 'exportStyledPDF';
                exportStyledBtn.className = 'btn btn-secondary';
                exportStyledBtn.innerHTML = '<i class="fas fa-file-pdf"></i> PDF Stylisé';
                exportStyledBtn.addEventListener('click', () => {
                    const data = this.dataService.getCurrentData();
                    const fileName = prompt('Nom du fichier:', `CV_${data.fullName || 'professionnel'}.pdf`);
                    if (fileName) {
                        pdfService.exportStyledCV(data, fileName);
                    }
                });
                
                buttonGroup.appendChild(exportPreviewBtn);
                buttonGroup.appendChild(exportStyledBtn);
            }
        }
    }

    printCV() {
        window.print();
    }

    showPreviewStatus(message, type) {
        const statusElement = document.getElementById('previewStatusMessage');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-message ${type}`;
            
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        } else {
            // Créer un élément temporaire si nécessaire
            alert(message);
        }
    }
}

// Initialiser l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const app = new CVApp(classicModule, aiModule, dataService);
});