import { apiRequest } from './api.js';


export async function getCandidats() {
    return await apiRequest("/allCandidatesWithDocs", "GET");
}


export async function getCandidatById(id) {
    return await apiRequest(`/candidates/${id}`, "GET");
}


export async function addCandidat(candidateData) {
    return await apiRequest("/candidates", "POST", {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        sex: candidateData.sex,
        birthDate: candidateData.birthDate,
        placeOfBirth: candidateData.placeOfBirth,
        addressLine: candidateData.addressLine,
        phone: candidateData.phone,
        email: candidateData.email,
        familySituation: candidateData.familySituation,
        numberOfChildren: candidateData.numberOfChildren,
    });
}

export async function candidateWithDocs(id) {
    return await apiRequest(`/candidateWithDocs/${id}`, "GET");
}


export async function updateCandidat(id, candidateData) {
    return await apiRequest(`/candidates/${id}`, "PUT", {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        sex: candidateData.sex,
        birthDate: candidateData.birthDate,
        placeOfBirth: candidateData.placeOfBirth,
        addressLine: candidateData.addressLine,
        phone: candidateData.phone,
        email: candidateData.email,
        familySituation: candidateData.familySituation,
        numberOfChildren: candidateData.numberOfChildren,
    });

}


export async function deleteCandidat(id) {
    return await apiRequest(`/candidates/${id}`, "DELETE");
}
