// Module classique de gestion des données du CV
// Gère le formulaire, la validation et l'affichage

class ClassicModule {
    constructor(dataService) {
        this.dataService = dataService;
        this.experienceCount = 1;
        this.educationCount = 1;
        this.init();
    }

    init() {
        // Charger les données au démarrage
        this.loadData();
        
        // Configurer les événements
        this.setupFormEvents();
    }

    setupFormEvents() {
        const form = document.getElementById('cvForm');
        const addExperienceBtn = document.getElementById('addExperience');
        const addEducationBtn = document.getElementById('addEducation');
        const loadDataBtn = document.getElementById('loadData');
        const clearDataBtn = document.getElementById('clearData');

        // Gestion de la soumission du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFormData();
        });

        // Ajouter une expérience
        addExperienceBtn.addEventListener('click', () => {
            this.addExperienceField();
        });

        // Ajouter une formation
        addEducationBtn.addEventListener('click', () => {
            this.addEducationField();
        });

        // Charger les données
        loadDataBtn.addEventListener('click', () => {
            this.loadData();
            this.showStatus('Données chargées depuis le stockage local avec succès !', 'success');
        });

        // Effacer toutes les données
        clearDataBtn.addEventListener('click', () => {
            this.clearAllData();
        });
    }

    addExperienceField() {
        this.experienceCount++;
        const container = document.getElementById('experienceContainer');
        
        const experienceHTML = `
            <div class="experience-item form-row">
                <div class="form-group">
                    <label for="expTitle${this.experienceCount}">Poste</label>
                    <input type="text" id="expTitle${this.experienceCount}" name="expTitle[]">
                </div>
                <div class="form-group">
                    <label for="expCompany${this.experienceCount}">Entreprise</label>
                    <input type="text" id="expCompany${this.experienceCount}" name="expCompany[]">
                </div>
                <div class="form-group">
                    <label for="expPeriod${this.experienceCount}">Période (ex: 2020-2023)</label>
                    <input type="text" id="expPeriod${this.experienceCount}" name="expPeriod[]">
                </div>
            </div>
            <div class="form-group">
                <label for="expDescription${this.experienceCount}">Description</label>
                <textarea id="expDescription${this.experienceCount}" name="expDescription[]" placeholder="Décrivez vos responsabilités et réalisations..."></textarea>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', experienceHTML);
    }

    addEducationField() {
        this.educationCount++;
        const container = document.getElementById('educationContainer');
        
        const educationHTML = `
            <div class="education-item form-row">
                <div class="form-group">
                    <label for="eduDegree${this.educationCount}">Diplôme</label>
                    <input type="text" id="eduDegree${this.educationCount}" name="eduDegree[]">
                </div>
                <div class="form-group">
                    <label for="eduInstitution${this.educationCount}">Établissement</label>
                    <input type="text" id="eduInstitution${this.educationCount}" name="eduInstitution[]">
                </div>
                <div class="form-group">
                    <label for="eduYear${this.educationCount}">Année d'obtention</label>
                    <input type="text" id="eduYear${this.educationCount}" name="eduYear[]">
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', educationHTML);
    }

    saveFormData() {
        // Récupérer les données de base
        const formData = {
            fullName: document.getElementById('fullName').value,
            jobTitle: document.getElementById('jobTitle').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            summary: document.getElementById('summary').value,
            skills: this.dataService.formatSkills(document.getElementById('skills').value)
        };

        // Récupérer les expériences
        formData.experiences = [];
        const expTitles = document.getElementsByName('expTitle[]');
        const expCompanies = document.getElementsByName('expCompany[]');
        const expPeriods = document.getElementsByName('expPeriod[]');
        const expDescriptions = document.getElementsByName('expDescription[]');
        
        for (let i = 0; i < expTitles.length; i++) {
            if (expTitles[i].value.trim() !== '') {
                formData.experiences.push({
                    title: expTitles[i].value,
                    company: expCompanies[i].value,
                    period: expPeriods[i].value,
                    description: expDescriptions[i].value
                });
            }
        }

        // Récupérer les formations
        formData.educations = [];
        const eduDegrees = document.getElementsByName('eduDegree[]');
        const eduInstitutions = document.getElementsByName('eduInstitution[]');
        const eduYears = document.getElementsByName('eduYear[]');
        
        for (let i = 0; i < eduDegrees.length; i++) {
            if (eduDegrees[i].value.trim() !== '') {
                formData.educations.push({
                    degree: eduDegrees[i].value,
                    institution: eduInstitutions[i].value,
                    year: eduYears[i].value
                });
            }
        }

        // Valider les données
        const validation = this.dataService.validateData(formData);
        
        if (!validation.isValid) {
            this.showStatus(`Erreurs de validation: ${validation.errors.join(', ')}`, 'error');
            return;
        }

        // Sauvegarder les données
        this.dataService.saveFormData(formData);
        
        // Afficher un message de confirmation
        this.showStatus('Données enregistrées avec succès dans le module classique !', 'success');
        
        // Déclencher un événement pour informer les autres modules
        this.triggerDataUpdatedEvent();
    }

    loadData() {
        const data = this.dataService.loadFromLocalStorage();
        
        if (data) {
            // Remplir les champs du formulaire
            document.getElementById('fullName').value = data.fullName || '';
            document.getElementById('jobTitle').value = data.jobTitle || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('address').value = data.address || '';
            document.getElementById('summary').value = data.summary || '';
            document.getElementById('skills').value = data.skills ? data.skills.join(', ') : '';
            
            // Remplir les expériences
            this.loadExperiences(data.experiences || []);
            
            // Remplir les formations
            this.loadEducations(data.educations || []);
            
            return true;
        }
        
        return false;
    }

    loadExperiences(experiences) {
        const container = document.getElementById('experienceContainer');
        container.innerHTML = '';
        
        if (experiences.length > 0) {
            experiences.forEach((exp, index) => {
                this.experienceCount = index + 1;
                
                const experienceHTML = `
                    <div class="experience-item form-row">
                        <div class="form-group">
                            <label for="expTitle${this.experienceCount}">Poste ${this.experienceCount > 1 ? '' : '*'}</label>
                            <input type="text" id="expTitle${this.experienceCount}" name="expTitle[]" ${this.experienceCount === 1 ? 'required' : ''} value="${exp.title || ''}">
                        </div>
                        <div class="form-group">
                            <label for="expCompany${this.experienceCount}">Entreprise ${this.experienceCount > 1 ? '' : '*'}</label>
                            <input type="text" id="expCompany${this.experienceCount}" name="expCompany[]" ${this.experienceCount === 1 ? 'required' : ''} value="${exp.company || ''}">
                        </div>
                        <div class="form-group">
                            <label for="expPeriod${this.experienceCount}">Période (ex: 2020-2023) ${this.experienceCount > 1 ? '' : '*'}</label>
                            <input type="text" id="expPeriod${this.experienceCount}" name="expPeriod[]" ${this.experienceCount === 1 ? 'required' : ''} value="${exp.period || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="expDescription${this.experienceCount}">Description</label>
                        <textarea id="expDescription${this.experienceCount}" name="expDescription[]" placeholder="Décrivez vos responsabilités et réalisations...">${exp.description || ''}</textarea>
                    </div>
                `;
                
                container.insertAdjacentHTML('beforeend', experienceHTML);
            });
        } else {
            this.addDefaultExperienceField();
        }
    }

    loadEducations(educations) {
        const container = document.getElementById('educationContainer');
        container.innerHTML = '';
        
        if (educations.length > 0) {
            educations.forEach((edu, index) => {
                this.educationCount = index + 1;
                
                const educationHTML = `
                    <div class="education-item form-row">
                        <div class="form-group">
                            <label for="eduDegree${this.educationCount}">Diplôme ${this.educationCount > 1 ? '' : '*'}</label>
                            <input type="text" id="eduDegree${this.educationCount}" name="eduDegree[]" ${this.educationCount === 1 ? 'required' : ''} value="${edu.degree || ''}">
                        </div>
                        <div class="form-group">
                            <label for="eduInstitution${this.educationCount}">Établissement ${this.educationCount > 1 ? '' : '*'}</label>
                            <input type="text" id="eduInstitution${this.educationCount}" name="eduInstitution[]" ${this.educationCount === 1 ? 'required' : ''} value="${edu.institution || ''}">
                        </div>
                        <div class="form-group">
                            <label for="eduYear${this.educationCount}">Année d'obtention ${this.educationCount > 1 ? '' : '*'}</label>
                            <input type="text" id="eduYear${this.educationCount}" name="eduYear[]" ${this.educationCount === 1 ? 'required' : ''} value="${edu.year || ''}">
                        </div>
                    </div>
                `;
                
                container.insertAdjacentHTML('beforeend', educationHTML);
            });
        } else {
            this.addDefaultEducationField();
        }
    }

    addDefaultExperienceField() {
        this.experienceCount = 1;
        const container = document.getElementById('experienceContainer');
        
        container.innerHTML = `
            <div class="experience-item form-row">
                <div class="form-group">
                    <label for="expTitle1">Poste *</label>
                    <input type="text" id="expTitle1" name="expTitle[]" required>
                </div>
                <div class="form-group">
                    <label for="expCompany1">Entreprise *</label>
                    <input type="text" id="expCompany1" name="expCompany[]" required>
                </div>
                <div class="form-group">
                    <label for="expPeriod1">Période (ex: 2020-2023) *</label>
                    <input type="text" id="expPeriod1" name="expPeriod[]" required>
                </div>
            </div>
            <div class="form-group">
                <label for="expDescription1">Description</label>
                <textarea id="expDescription1" name="expDescription[]" placeholder="Décrivez vos responsabilités et réalisations..."></textarea>
            </div>
        `;
    }

    addDefaultEducationField() {
        this.educationCount = 1;
        const container = document.getElementById('educationContainer');
        
        container.innerHTML = `
            <div class="education-item form-row">
                <div class="form-group">
                    <label for="eduDegree1">Diplôme *</label>
                    <input type="text" id="eduDegree1" name="eduDegree[]" required>
                </div>
                <div class="form-group">
                    <label for="eduInstitution1">Établissement *</label>
                    <input type="text" id="eduInstitution1" name="eduInstitution[]" required>
                </div>
                <div class="form-group">
                    <label for="eduYear1">Année d'obtention *</label>
                    <input type="text" id="eduYear1" name="eduYear[]" required>
                </div>
            </div>
        `;
    }

    clearAllData() {
        if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
            this.dataService.clearAllData();
            document.getElementById('cvForm').reset();
            this.experienceCount = 1;
            this.educationCount = 1;
            
            this.addDefaultExperienceField();
            this.addDefaultEducationField();
            
            this.showStatus('Toutes les données ont été effacées avec succès.', 'success');
            
            // Déclencher un événement pour informer les autres modules
            this.triggerDataUpdatedEvent();
        }
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }

    triggerDataUpdatedEvent() {
        // Créer et déclencher un événement personnalisé
        const event = new CustomEvent('cvDataUpdated', {
            detail: { data: this.dataService.getCurrentData() }
        });
        document.dispatchEvent(event);
    }

    // Méthode pour obtenir les données actuelles
    getCurrentData() {
        return this.dataService.getCurrentData();
    }
}

// Initialiser le module classique
const classicModule = new ClassicModule(dataService);