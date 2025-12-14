// pdf-service.js - Service d'export PDF

class PDFService {
    constructor() {
        // Vérifier si jsPDF est disponible
        if (typeof window.jspdf !== 'undefined') {
            this.jsPDF = window.jspdf.jsPDF;
            this.isAvailable = true;
        } else {
            console.warn('jsPDF non chargé. L\'export PDF ne fonctionnera pas.');
            this.isAvailable = false;
        }
    }

    // Exporter le CV en PDF
    async exportCVToPDF(elementId, fileName = 'mon-cv.pdf') {
        if (!this.isAvailable) {
            this.showError('Bibliothèque PDF non chargée. Vérifiez votre connexion.');
            return false;
        }

        try {
            // Afficher un message de chargement
            this.showLoading(true);
            
            // Récupérer l'élément à exporter
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error('Élément non trouvé pour l\'export PDF');
            }

            // Créer le PDF
            const pdf = await this.generatePDF(element, fileName);
            
            // Sauvegarder le PDF
            pdf.save(fileName);
            
            this.showLoading(false);
            this.showSuccess('CV exporté en PDF avec succès !');
            return true;
            
        } catch (error) {
            console.error('Erreur lors de l\'export PDF:', error);
            this.showLoading(false);
            this.showError('Erreur lors de l\'export PDF: ' + error.message);
            return false;
        }
    }

    // Générer le PDF
    async generatePDF(element, fileName) {
        return new Promise((resolve, reject) => {
            // Options pour html2canvas
            const options = {
                scale: 2, // Meilleure qualité
                useCORS: true, // Permettre les images externes
                logging: false, // Désactiver les logs
                backgroundColor: '#ffffff'
            };

            // Convertir HTML en canvas
            html2canvas(element, options).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new this.jsPDF('p', 'mm', 'a4');
                
                // Dimensions de la page A4
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                
                // Dimensions de l'image
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                
                // Calculer les proportions
                const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                const finalWidth = imgWidth * ratio;
                const finalHeight = imgHeight * ratio;
                
                // Positionner au centre
                const marginX = (pageWidth - finalWidth) / 2;
                const marginY = (pageHeight - finalHeight) / 2;
                
                // Ajouter l'image au PDF
                pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);
                
                // Ajouter un pied de page
                this.addFooter(pdf, fileName);
                
                resolve(pdf);
            }).catch(reject);
        });
    }

    // Ajouter un pied de page au PDF
    addFooter(pdf, fileName) {
        const pageCount = pdf.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            
            // Pied de page avec date et numéro de page
            const footerText = `CV généré le ${new Date().toLocaleDateString('fr-FR')} - Page ${i}/${pageCount}`;
            
            pdf.setFontSize(8);
            pdf.setTextColor(128, 128, 128);
            pdf.text(footerText, pdf.internal.pageSize.getWidth() / 2, 
                    pdf.internal.pageSize.getHeight() - 10, 
                    { align: 'center' });
        }
    }

    // Générer un PDF stylisé (meilleure qualité)
    async exportStyledCV(data, fileName = 'cv-professionnel.pdf') {
        if (!this.isAvailable) {
            this.showError('Bibliothèque PDF non chargée');
            return false;
        }

        try {
            this.showLoading(true);
            
            // Créer un PDF avec mise en page
            const pdf = new this.jsPDF('p', 'mm', 'a4');
            
            // Configuration
            const pageWidth = pdf.internal.pageSize.getWidth();
            let yPosition = 20;
            
            // Couleurs
            const primaryColor = [52, 152, 219]; // #3498db
            const darkColor = [44, 62, 80]; // #2c3e50
            
            // En-tête avec fond coloré
            pdf.setFillColor(...primaryColor);
            pdf.rect(0, 0, pageWidth, 40, 'F');
            
            // Nom
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text(data.fullName || 'Nom Prénom', pageWidth / 2, 25, { align: 'center' });
            
            // Titre
            pdf.setFontSize(14);
            pdf.setTextColor(236, 240, 241); // #ecf0f1
            pdf.text(data.jobTitle || 'Poste recherché', pageWidth / 2, 35, { align: 'center' });
            
            // Réinitialiser la position Y
            yPosition = 50;
            
            // Informations de contact
            pdf.setFontSize(10);
            pdf.setTextColor(...darkColor);
            
            if (data.email) {
                pdf.text(`📧 ${data.email}`, 20, yPosition);
                yPosition += 7;
            }
            
            if (data.phone) {
                pdf.text(`📱 ${data.phone}`, 20, yPosition);
                yPosition += 7;
            }
            
            if (data.address) {
                pdf.text(`📍 ${data.address}`, 20, yPosition);
                yPosition += 10;
            }
            
            // Ligne séparatrice
            pdf.setDrawColor(...primaryColor);
            pdf.setLineWidth(0.5);
            pdf.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 15;
            
            // Profil professionnel
            if (data.summary) {
                this.addSectionTitle(pdf, 'PROFIL PROFESSIONNEL', 20, yPosition);
                yPosition += 10;
                
                pdf.setFontSize(11);
                pdf.setTextColor(0, 0, 0);
                const splitText = pdf.splitTextToSize(data.summary, pageWidth - 40);
                pdf.text(splitText, 20, yPosition);
                yPosition += splitText.length * 5 + 10;
            }
            
            // Expériences professionnelles
            if (data.experiences && data.experiences.length > 0) {
                this.addSectionTitle(pdf, 'EXPÉRIENCE PROFESSIONNELLE', 20, yPosition);
                yPosition += 10;
                
                data.experiences.forEach(exp => {
                    // Vérifier si on a besoin d'une nouvelle page
                    if (yPosition > 250) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                    
                    // Titre du poste
                    pdf.setFontSize(12);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(...darkColor);
                    pdf.text(exp.title, 20, yPosition);
                    
                    // Entreprise et période
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(...primaryColor);
                    pdf.text(exp.company, 20, yPosition + 5);
                    pdf.text(exp.period, pageWidth - 20, yPosition + 5, { align: 'right' });
                    
                    // Description
                    if (exp.description) {
                        pdf.setFontSize(10);
                        pdf.setTextColor(0, 0, 0);
                        const descLines = pdf.splitTextToSize(exp.description, pageWidth - 40);
                        pdf.text(descLines, 20, yPosition + 12);
                        yPosition += 12 + (descLines.length * 5);
                    }
                    
                    yPosition += 15;
                });
            }
            
            // Formation
            if (data.educations && data.educations.length > 0) {
                this.addSectionTitle(pdf, 'FORMATION', 20, yPosition);
                yPosition += 10;
                
                data.educations.forEach(edu => {
                    if (yPosition > 250) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                    
                    pdf.setFontSize(12);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(...darkColor);
                    pdf.text(edu.degree, 20, yPosition);
                    
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(...primaryColor);
                    pdf.text(edu.institution, 20, yPosition + 5);
                    pdf.text(edu.year, pageWidth - 20, yPosition + 5, { align: 'right' });
                    
                    yPosition += 15;
                });
            }
            
            // Compétences
            if (data.skills && data.skills.length > 0) {
                if (yPosition > 220) {
                    pdf.addPage();
                    yPosition = 20;
                }
                
                this.addSectionTitle(pdf, 'COMPÉTENCES', 20, yPosition);
                yPosition += 10;
                
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                
                let xPos = 20;
                data.skills.forEach((skill, index) => {
                    const skillWidth = pdf.getStringUnitWidth(skill) * 10 + 10;
                    
                    // Nouvelle ligne si nécessaire
                    if (xPos + skillWidth > pageWidth - 20) {
                        xPos = 20;
                        yPosition += 10;
                    }
                    
                    // Style du badge
                    pdf.setFillColor(236, 240, 241); // #ecf0f1
                    pdf.roundedRect(xPos, yPosition, skillWidth, 7, 3.5, 3.5, 'F');
                    
                    // Texte du badge
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(skill, xPos + 5, yPosition + 5);
                    
                    xPos += skillWidth + 5;
                });
                
                yPosition += 20;
            }
            
            // Pied de page
            this.addFooter(pdf, fileName);
            
            // Sauvegarder
            pdf.save(fileName);
            
            this.showLoading(false);
            this.showSuccess('CV stylisé exporté en PDF avec succès !');
            return true;
            
        } catch (error) {
            console.error('Erreur:', error);
            this.showLoading(false);
            this.showError('Erreur lors de la génération du PDF');
            return false;
        }
    }

    // Ajouter un titre de section
    addSectionTitle(pdf, title, x, y) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(44, 62, 80); // #2c3e50
        pdf.text(title, x, y);
        
        // Ligne sous le titre
        pdf.setDrawColor(52, 152, 219); // #3498db
        pdf.setLineWidth(1);
        pdf.line(x, y + 2, x + 50, y + 2);
    }

    // Afficher un message de chargement
    showLoading(show) {
        const loadingElement = document.getElementById('pdfLoading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        } else if (show) {
            // Créer un élément de chargement si nécessaire
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'pdfLoading';
            loadingDiv.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.2);
                    z-index: 1000;
                    text-align: center;
                ">
                    <div class="spinner"></div>
                    <p>Génération du PDF en cours...</p>
                </div>
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                "></div>
            `;
            document.body.appendChild(loadingDiv);
        }
    }

    // Afficher un message de succès
    showSuccess(message) {
        alert('✅ ' + message);
    }

    // Afficher une erreur
    showError(message) {
        alert('❌ ' + message);
    }
}

// Créer une instance globale
const pdfService = new PDFService();