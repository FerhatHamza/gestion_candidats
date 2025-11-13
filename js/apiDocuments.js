import { apiRequest } from './api.js';


export async function getDocuments() {
    return await apiRequest("/Documentses", "GET");
}


export async function getDocumentsById(id) {
    return await apiRequest(`/documents/${id}`, "GET");
}


export async function addDocuments(DocumentseData) {
    return await apiRequest("/documents", "POST", {
        firstName: DocumentseData.firstName,
        lastName: DocumentseData.lastName,
        sex: DocumentseData.sex,
        birthDate: DocumentseData.birthDate,
        placeOfBirth: DocumentseData.placeOfBirth,
        addressLine: DocumentseData.addressLine,
        phone: DocumentseData.phone,
        email: DocumentseData.email,
        familySituation: DocumentseData.familySituation,
        numberOfChildren: DocumentseData.numberOfChildren,
    });
}


export async function updateDocuments(id, DocumentseData) {
    return await apiRequest(`/documents/${id}`, "PUT", DocumentseData);
}


export async function deleteDocuments(id) {
    return await apiRequest(`/documents/${id}`, "DELETE");
}
