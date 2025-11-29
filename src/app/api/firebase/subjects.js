import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

// Fetch all subjects
export async function fetchSubjects() {
  const subjectsRef = collection(db, 'subjects');
  const snapshot = await getDocs(subjectsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch subjects by institute (null for global)
export async function fetchSubjectsByInstitute(instituteId) {
  const subjectsRef = collection(db, 'subjects');
  const q = query(
    subjectsRef, 
    where('instituteId', '==', instituteId || null)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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