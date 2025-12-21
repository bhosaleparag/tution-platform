import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

// Fetch all subjects
export async function fetchSubjects() {
  const subjectsRef = collection(db, 'subjects');
  const snapshot = await getDocs(subjectsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch subjects by institute (null for global)
// lib/firebase/subjects.js (add this function)

export async function fetchSubjectsByInstitute(instituteId) {
  const subjectsRef = collection(db, 'subjects');
  
  // Get both global subjects and institute-specific
  const globalQuery = query(subjectsRef, where('instituteId', '==', null), where('isActive', '==', true));
  const instituteQuery = query(subjectsRef, where('instituteId', '==', instituteId), where('isActive', '==', true));
  
  const [globalSnapshot, instituteSnapshot] = await Promise.all([
    getDocs(globalQuery),
    getDocs(instituteQuery)
  ]);
  
  const globalSubjects = globalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const instituteSubjects = instituteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return [...globalSubjects, ...instituteSubjects];
}

// Add new subject
export async function addSubject(data, createdBy) {
  const subjectsRef = collection(db, 'subjects');
  const docRef = await addDoc(subjectsRef, {
    name: data.name,
    instituteId: data.instituteId || null,
    createdBy: createdBy,
    isActive: data.isActive,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Update subject
export async function updateSubject(subjectId, data) {
  const subjectRef = doc(db, 'subjects', subjectId);
  await updateDoc(subjectRef, {
    name: data.name,
    instituteId: data.instituteId || null,
    isActive: data.isActive
  });
}

// Delete subject
export async function deleteSubject(subjectId) {
  const subjectRef = doc(db, 'subjects', subjectId);
  await deleteDoc(subjectRef);
}

// Fetch global subjects only
export async function fetchGlobalSubjects() {
  return fetchSubjectsByInstitute(null);
}