import { apiRequest } from './api.js';


export async function getDocuments() {
    return await apiRequest("/Documentses", "GET");
}


export async function getDocumentsById(id) {
    return await apiRequest(`/documents/${id}`, "GET");
}


export async function addDocuments(DocumentseData) {
    return await apiRequest("/documents", "POST", {
        candidate_id: DocumentseData.candidate_id,
        demande_ecrite: DocumentseData.demande_ecrite,
        copyOfID: DocumentseData.copyOfID,
        diplome: DocumentseData.diplome,
        releve_notes: DocumentseData.releve_notes,
        certificat_service: DocumentseData.certificat_service,
        photos: DocumentseData.photos,
        enveloppes: DocumentseData.enveloppes,
        attestations_travail: DocumentseData.attestations_travail,
        autres_pieces: DocumentseData.autres_pieces
    });
}


export async function updateDocuments(id, DocumentseData) {
    return await apiRequest(`/documents/update`, "PUT", {
        candidate_id: id,
        demande_ecrite: DocumentseData.demande_ecrite,
        copyOfID: DocumentseData.copyOfID,
        diplome: DocumentseData.diplome,
        releve_notes: DocumentseData.releve_notes,
        certificat_service: DocumentseData.certificat_service,
        photos: DocumentseData.photos,
        enveloppes: DocumentseData.enveloppes,
        attestations_travail: DocumentseData.attestations_travail,
        autres_pieces: DocumentseData.autres_pieces
    });
}


export async function deleteDocuments(id) {
    return await apiRequest(`/documents/${id}`, "DELETE");
}
