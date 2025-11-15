// js/condidate.js
import {
    getCandidats,
    addCandidat,
    getCandidatById,
    candidateWithDocs,
    deleteCandidat,    // تأكد من وجوده
    updateCandidat     // اختياري لمهمة التعديل
} from './apiCondidates.js';
import {
    addDocuments,
    getDocumentsById,
    updateDocuments,
} from './apiDocuments.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('candidateForm');
    const saveBtn = document.getElementById('saveCandidateBtn');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const sexInput = document.getElementById('sex');
    const birthDateInput = document.getElementById('birthDate');
    const placeOfBirthInput = document.getElementById('placeOfBirth');
    const addressLineInput = document.getElementById('addressLine');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const familySituationInput = document.getElementById('familySituation');
    const numberOfChildrenInput = document.getElementById('numberOfChildren');
    const tableBody = document.getElementById('candidatesTableBody');

    // docs
    const demande_ecrite = document.getElementById('demande_ecrite');
    const copyOfID = document.getElementById('copyOfID');
    const diplome = document.getElementById('diplome');
    const releve_notes = document.getElementById('releve_notes');
    const certificat_service = document.getElementById('certificat_service');
    const photos = document.getElementById('photos');
    const enveloppes = document.getElementById('enveloppes');
    const attestations_travail = document.getElementById('attestations_travail');
    const autres_pieces = document.getElementById('autres_pieces');

    const modelAddEdit = document.getElementById('modelAddEdit');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnAdd = document.getElementById('btnAdd');
    const closeModalBtn = document.getElementById('closeModal');
    const toast = document.getElementById('toast');
    const modelDeleteEdit = document.getElementById('deleteModal');
    const confirmText = document.getElementById('confirmText');
    const deleteBtn = document.getElementById('deleteBtn');
    const closeDeleteModel = document.getElementById('closeDeleteModel');


    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");

    const step1Indicator = document.getElementById("step1Indicator");
    const step2Indicator = document.getElementById("step2Indicator");
    let editingId = null; // إذا كان في تعديل


    init();
    function init() {
        bindUI();
        getAllCandidats();

    }

    function bindUI() {
        if (btnAdd) btnAdd.addEventListener('click', showAddModal);
        if (closeModalBtn) closeModalBtn.addEventListener('click', hideAddModal);
        if (modalOverlay) modalOverlay.addEventListener('click', hideAddModal);

        // if (form) {
        //     form.addEventListener('submit', async (e) => {
        //         e.preventDefault();
        //         await onSaveCandidate();
        //     });
        // }

        saveBtn.addEventListener('click', async (e) => {
            await onSaveCandidate();
        });

        if (tableBody) {
            tableBody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;
                const candidateId = btn.dataset.id;
                if (btn.classList.contains('delete')) {
                    // onDeleteCandidate(candidateId);
                    showDeleteModal(candidateId);
                } else if (btn.classList.contains('edit')) {
                    onEditCandidate(candidateId);
                }
                init();
            });
        }
    }

    initSteps();

    function initSteps() {
        document.getElementById("nextBtn").addEventListener("click", () => {

            if (!firstNameInput.value.trim()) return alert("أدخل الاسم");
            if (!lastNameInput.value.trim()) return alert("أدخل اللقب");
            if (!birthDateInput.value.trim()) return alert("أدخل تاريخ الميلاد");

            step1.classList.add("hidden");
            step2.classList.remove("hidden");

            step1Indicator.classList.remove("bg-blue-600", "text-white");
            step1Indicator.classList.add("bg-gray-300", "text-gray-700");

            step2Indicator.classList.remove("bg-gray-300", "text-gray-700");
            step2Indicator.classList.add("bg-blue-600", "text-white");
        });

        document.getElementById("prevBtn").addEventListener("click", () => {
            step2.classList.add("hidden");
            step1.classList.remove("hidden");

            step2Indicator.classList.remove("bg-blue-600", "text-white");
            step2Indicator.classList.add("bg-gray-300", "text-gray-700");

            step1Indicator.classList.remove("bg-gray-300", "text-gray-700");
            step1Indicator.classList.add("bg-blue-600", "text-white");
        });

    }

    // تحميل الكل
    async function getAllCandidats() {
        try {
            const candidates = await getCandidats();
            console.log('Loaded candidates:', candidates);
            // const doc = await getDocumentsById(candidates.id);
            fillTable(candidates || []);
        } catch (err) {
            console.error('Error fetching candidates:', err);
            showToast('خطأ في تحميل المترشحين');
        }
    }

    // عرض الجدول
    function fillTable(candidates) {

        tableBody.innerHTML = '';
        if (!candidates.length) {
            tableBody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-gray-500">لا توجد بيانات</td></tr>`;
            return;
        }

        candidates.forEach((candidate) => {
            const docsSummary = renderDocsSummary(candidate.documents);
            // console.log('Candidate docs summary:', candidate);
            const sexLabel = candidate.sex === 'man' ? 'ذكر' : candidate.sex === 'woman' ? 'أنثى' : '';
            const row = document.createElement('tr');
            row.classList.add('border-b', 'hover:bg-gray-50');
            row.innerHTML = `
                <td class="px-4 py-3">${escapeHtml(candidate.firstName || '')}</td>
                <td class="px-4 py-3">${escapeHtml(candidate.lastName || '')}</td>
                <td class="px-4 py-3">${sexLabel}</td>
                <td class="px-4 py-3">${escapeHtml(candidate.phone || '')}</td>
                <td class="px-4 py-3 text-sm">${docsSummary}</td>
                <td class="px-4 py-3 text-center space-x-2">
                    <button data-id="${candidate.id}" class="edit inline-block px-3 py-1 rounded hover:bg-gray-100">✏️ تعديل</button>
                    <button data-id="${candidate.id}" class="delete inline-block px-3 py-1 rounded text-red-600 hover:bg-gray-100">🗑️ حذف</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderDocsSummary(docsArray) {
        if (!docsArray || !docsArray.length) return '';

        // Extract the first document object
        const docs = docsArray[0];


        // Pick only value = 0
        const onlyZeros = Object.entries(docs)
            .filter(([key, value]) => value === 0)
            .map(([key]) => key);

        console.log('Docs array for summary:', onlyZeros);

        const labels = {
            attestations_travail: 'شهادة العمل',
            demande_ecrite: 'طلب خطي',
            copyOfID: 'نسخة من بطاقة التعريف',
            diplome: 'الشهادة',
            releve_notes: 'كشف النقاط',
            certificat_service: 'الخدمة الوطنية',
            photos: 'صور',
            enveloppes: 'أضرفة'
        };

        const parts = onlyZeros
            .filter(key => labels[key])
            .map(key => labels[key]);

        return parts.join(' · ');
    }

    // حفظ / إضافة
    async function onSaveCandidate() {
        // تحقق بسيط
        if (!firstNameInput.value.trim() || !lastNameInput.value.trim()) {
            showToast('الرجاء تعبئة الاسم واللقب');
            return;
        }

        const payload = {
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            sex: sexInput.value || null,
            birthDate: birthDateInput.value || null,
            placeOfBirth: placeOfBirthInput.value.trim() || null,
            addressLine: addressLineInput.value.trim() || null,
            phone: phoneInput.value.trim() || null,
            email: emailInput.value.trim() || null,
            familySituation: familySituationInput.value || null,
            numberOfChildren: numberOfChildrenInput.value ? Number(numberOfChildrenInput.value) : 0,
        };

        //console.log('Candidate payload:', payload);
        //console.log('editing id:', editingId);
        try {
            showToast('جارٍ الحفظ...');
            let saved;
            if (editingId) {
                // تحديث - إذا كان updateCandidat موجود
                if (typeof updateCandidat === 'function') {
                    saved = await updateCandidat(editingId, payload);
                } else {
                    // fallback: call addCandidat as create then mark as editingId (not ideal)
                    saved = await addCandidat(payload);
                }
            } else {
                saved = await addCandidat(payload);
            }



            // الآن نضيف وثائق إذا وجد التابع addDocuments
            const docsPayload = {
                candidate_id: editingId === null ? saved.id : parseInt(editingId),
                demande_ecrite: demande_ecrite.checked ? 1 : 0,
                copyOfID: copyOfID.checked ? 1 : 0,
                diplome: diplome.checked ? 1 : 0,
                releve_notes: releve_notes.checked ? 1 : 0,
                certificat_service: certificat_service.checked ? 1 : 0,
                photos: photos.checked ? 1 : 0,
                enveloppes: enveloppes.checked ? 1 : 0,
                attestations_travail: attestations_travail.checked ? 1 : 0,
                autres_pieces: autres_pieces.value.trim() || null
            };
            //console.log('Docs payload:', docsPayload);
            if (editingId) {
                console.log('documents payload for update: ', docsPayload);
                saved = await updateDocuments(editingId, docsPayload);
            } else {
                console.log('documents payload for add: ', docsPayload);
                saved = await addDocuments(docsPayload);
            }

            showToast('تم الحفظ بنجاح');
            hideAddModal();
            resetForm();
            await getAllCandidats();
            editingId = null;
        } catch (err) {
            console.error('Erreur lors de l\'ajout/تحديث:', err);
            showToast('حدث خطأ أثناء الحفظ');
        }
    }

    // حذف مترشح (تأكيد)
    async function onDeleteCandidate() {

        if (confirmText.value === 'DELETE') {
            try {
                await deleteCandidat(editingId);
                showToast('تم الحذف');
                hideDeleteModal();
                await getAllCandidats();
            } catch (err) {
                console.error('خطأ عند الحذف:', err);
                showToast('حدث خطأ أثناء الحذف');
            }
        }
        // const ok = confirm('هل أنت متأكد أنك تريد حذف هذا المترشح؟');
        // if (!ok) return;
        // try {
        //     if (typeof deleteCandidat === 'function') {
        //         await deleteCandidat(id);
        //         showToast('تم الحذف');
        //         await getAllCandidats();
        //     } else {
        //         console.warn('deleteCandidat() غير موجود في apiCondidates.js — لا شيء تم حذفه فعليًا');
        //         showToast('وظيفة الحذف غير مفعلة');
        //     }
        // } catch (err) {
        //     console.error('خطأ عند الحذف:', err);
        //     showToast('حدث خطأ أثناء الحذف');
        // }
    }

    // تحرير — يعبئ النموذج بالبيانات ويعرض المودال
    async function onEditCandidate(id) {
        try {
            const candidate = await candidateWithDocs(id);
            //console.log('Candidate for edit:', candidate);
            if (!candidate) {
                showToast('المترشح غير موجود');
                return;
            }
            editingId = id;

            firstNameInput.value = candidate.firstName || '';
            lastNameInput.value = candidate.lastName || '';
            sexInput.value = candidate.sex || '';
            birthDateInput.value = candidate.birthDate || '';
            placeOfBirthInput.value = candidate.placeOfBirth || '';
            addressLineInput.value = candidate.addressLine || '';
            phoneInput.value = candidate.phone || '';
            emailInput.value = candidate.email || '';
            familySituationInput.value = candidate.familySituation || '';
            numberOfChildrenInput.value = candidate.numberOfChildren || '';

            // وثائق (إذا كانت مضمنة في candidate.documents)
            const docs = candidate.documents[0] || {};
            demande_ecrite.checked = !!docs.demande_ecrite == 1 ? true : false;
            copyOfID.checked = !!docs.copyOfID == 1 ? true : false;
            diplome.checked = !!docs.diplome == 1 ? true : false;
            releve_notes.checked = !!docs.releve_notes == 1 ? true : false;
            certificat_service.checked = !!docs.certificat_service == 1 ? true : false;
            photos.checked = !!docs.photos == 1 ? true : false;
            enveloppes.checked = !!docs.enveloppes == 1 ? true : false;
            attestations_travail.checked = !!docs.attestations_travail == 1 ? true : false;
            autres_pieces.value = docs.autres_pieces || '';

            showAddModal();
        } catch (err) {
            console.error('Error loading candidate:', err);
            showToast('خطأ في تحميل بيانات المترشح');
        }
    }

    deleteBtn.addEventListener('click', onDeleteCandidate);
    closeDeleteModel.addEventListener('click', hideDeleteModal);
    confirmText.addEventListener('input', () => {
        if (confirmText.value === 'DELETE') {
            deleteBtn.disabled = false;
            deleteBtn.classList.remove('opacity-50');
        } else {
            deleteBtn.disabled = true;
            deleteBtn.classList.add('opacity-50');
        }
    });
    // عرض / إخفاء modal
    function showAddModal() {
        modelAddEdit.classList.remove('hidden');
        // تمرير التركيز للحقل الأول
        setTimeout(() => firstNameInput.focus(), 120);
    }
    function hideAddModal() {
        resetForm();
        modelAddEdit.classList.add('hidden');
        editingId = null;
    }
    // عرض / إخفاء modal
    function showDeleteModal(id) {
        editingId = id;
        modelDeleteEdit.classList.remove('hidden');
        // تمرير التركيز للحقل الأول
        setTimeout(() => confirmText.focus(), 120);
    }
    function hideDeleteModal() {
        modelDeleteEdit.classList.add('hidden');
        editingId = null;
    }

    // إعادة ضبط النموذج
    function resetForm() {
        form.reset();
        // تأكد أن القيم الافتراضية متوافقة
        sexInput.value = '';
        familySituationInput.value = '';
        numberOfChildrenInput.value = '';
        step2.classList.add("hidden");
        step1.classList.remove("hidden");

        step2Indicator.classList.remove("bg-blue-600", "text-white");
        step2Indicator.classList.add("bg-gray-300", "text-gray-700");

        step1Indicator.classList.remove("bg-gray-300", "text-gray-700");
        step1Indicator.classList.add("bg-blue-600", "text-white");
    }

    // toast صغير
    let toastTimer = null;
    function showToast(msg, ms = 2400) {
        toast.textContent = msg;
        toast.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, ms);
    }

    // مساعدة: هروب نصّي لمنع XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text || '').replace(/[&<>"']/g, function (m) { return map[m]; });
    }




});
